#!/usr/bin/env node

/**
 * Streamable HTTP entry point for the hosted Hugeicons MCP server.
 *
 * Runs stateless: every POST /mcp gets a fresh server and transport, so any
 * instance can answer any request and there are no sessions to store.
 */

import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { HugeiconsServer } from "./server.js";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";
const MAX_BODY_BYTES = 1024 * 1024;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "Mcp-Session-Id, Mcp-Protocol-Version",
};

function sendJson(res: ServerResponse, status: number, body: unknown, headers: Record<string, string> = {}) {
  res.writeHead(status, { "Content-Type": "application/json", ...headers }).end(JSON.stringify(body));
}

function sendRpcError(res: ServerResponse, status: number, code: number, message: string, headers: Record<string, string> = {}) {
  sendJson(res, status, { jsonrpc: "2.0", error: { code, message }, id: null }, headers);
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error("Request body too large");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function handleMcp(req: IncomingMessage, res: ServerResponse) {
  // Stateless mode has no sessions, so there is no SSE stream to open (GET) or session to end (DELETE)
  if (req.method !== "POST") {
    sendRpcError(res, 405, -32000, "Method not allowed", { Allow: "POST" });
    return;
  }

  let body: unknown;
  try {
    body = await readJsonBody(req);
  } catch {
    sendRpcError(res, 400, -32700, "Parse error");
    return;
  }

  const server = new HugeiconsServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  res.on("close", () => {
    transport.close();
    server.close();
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  } catch (error) {
    console.error("[MCP HTTP Error]", error);
    if (!res.headersSent) sendRpcError(res, 500, -32603, "Internal server error");
  }
}

const httpServer = createServer(async (req, res) => {
  for (const [name, value] of Object.entries(CORS_HEADERS)) res.setHeader(name, value);

  const { pathname } = new URL(req.url ?? "/", "http://localhost");

  if (req.method === "OPTIONS") {
    res.writeHead(204).end();
    return;
  }

  if (pathname === "/health") {
    sendJson(res, 200, { status: "ok" });
    return;
  }

  if (pathname === "/mcp") {
    await handleMcp(req, res);
    return;
  }

  sendJson(res, 404, { error: "Not found. The MCP endpoint is /mcp" });
});

httpServer.listen(PORT, HOST, () => {
  console.error(`hugeicons MCP server listening on http://${HOST}:${PORT}/mcp`);
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    httpServer.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 10_000).unref();
  });
}
