# Hosted (Streamable HTTP) Hugeicons MCP server.
# Build from the repository root so pnpm can use the workspace lockfile:
#   docker build -f tools/mcp-server/Dockerfile -t hugeicons-mcp .

# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /repo
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tools/mcp-server/package.json tools/mcp-server/
RUN pnpm install --frozen-lockfile --filter @hugeicons/mcp-server --ignore-scripts

COPY tools/mcp-server/tsconfig.json tools/mcp-server/README.md tools/mcp-server/
COPY tools/mcp-server/src tools/mcp-server/src
RUN pnpm --filter @hugeicons/mcp-server run build \
  && pnpm --filter @hugeicons/mcp-server deploy --prod --legacy --ignore-scripts /out

# Stage 2: Runtime
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000

COPY --from=builder --chown=node:node /out ./
USER node

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "build/http.js"]
