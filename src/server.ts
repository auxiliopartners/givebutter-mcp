import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GivebutterClient } from "./http/client.js";
import { registerTools } from "./tools/register.js";
import { allTools } from "./tools/registry.js";

export const SERVER_NAME = "givebutter-mcp";
export const SERVER_VERSION = "2.0.0";

/** Builds a fully-registered server. Side-effect free, so tests can import it freely. */
export function createServer(client: GivebutterClient): McpServer {
  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });
  registerTools(server, allTools, client);
  return server;
}
