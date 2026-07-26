import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GivebutterClient } from "../http/client.js";
import { toolError, toolResult } from "../format.js";
import { buildRequestPlan } from "./plan.js";
import { paginationShape } from "./pagination.js";
import type { ToolDef } from "./types.js";

export function registerTools(
  server: McpServer,
  tools: readonly ToolDef[],
  client: GivebutterClient,
): void {
  const seen = new Set<string>();

  for (const def of tools) {
    if (seen.has(def.name)) throw new Error(`Duplicate tool name: ${def.name}`);
    seen.add(def.name);

    const inputSchema = def.paginated ? { ...def.input, ...paginationShape } : def.input;

    server.registerTool(
      def.name,
      { description: def.description, inputSchema },
      async (args: Record<string, unknown>) => {
        try {
          if (def.execute) return toolResult(await def.execute(args, client));
          const result = await client.request(buildRequestPlan(def, args));
          return toolResult(result, def.paginated);
        } catch (error) {
          return toolError(def.name, error);
        }
      },
    );
  }
}
