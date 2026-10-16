#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { createClient } from "./http/client.js";
import { createServer, SERVER_NAME } from "./server.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const client = createClient({ apiKey: config.apiKey, baseUrl: config.baseUrl });
  const server = createServer(client);

  await server.connect(new StdioServerTransport());
  console.error(`${SERVER_NAME} running on stdio`);
}

main().catch((error: unknown) => {
  console.error("Fatal error:", error instanceof Error ? error.message : error);
  process.exit(1);
});
