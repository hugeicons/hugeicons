#!/usr/bin/env node

/**
 * Stdio entry point for the Hugeicons MCP server (used by `npx @hugeicons/mcp-server`)
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { HugeiconsServer } from "./server.js";

const server = new HugeiconsServer();

process.on("SIGINT", async () => {
  await server.close();
  process.exit(0);
});

server.connect(new StdioServerTransport())
  .then(() => console.error("hugeicons MCP server running on stdio"))
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
