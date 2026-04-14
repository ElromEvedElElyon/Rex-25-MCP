#!/usr/bin/env node
/**
 * rex25-mcp — Bitcoin-native AI agent MCP server
 *
 * 12 tools exposed via Model Context Protocol.
 * Compatible with Claude Desktop, Cursor, Cline, and any MCP host.
 *
 * Author: Elrom <inteligenciaartificial.now@gmail.com>
 * License: MIT
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { chatTool, chatHandler } from "./tools/chat.js";
import { distillTool, distillHandler } from "./tools/distill.js";
import { grokipediaTool, grokipediaHandler } from "./tools/grokipedia.js";
import { wikipediaTool, wikipediaHandler } from "./tools/wikipedia.js";
import { commonCrawlTool, commonCrawlHandler } from "./tools/common_crawl.js";
import { classifyFileTool, classifyFileHandler } from "./tools/classify_file.js";
import { toMarkdownTool, toMarkdownHandler } from "./tools/to_markdown.js";
import { forecastTool, forecastHandler } from "./tools/forecast.js";
import { btcPriceTool, btcPriceHandler } from "./tools/btc_price.js";
import { stbtcxInfoTool, stbtcxInfoHandler } from "./tools/stbtcx_info.js";
import { runeInfoTool, runeInfoHandler } from "./tools/rune_info.js";
import { nodeStatusTool, nodeStatusHandler } from "./tools/node_status.js";

const VERSION = "0.1.0";

const TOOLS = [
  { def: chatTool, handler: chatHandler },
  { def: distillTool, handler: distillHandler },
  { def: grokipediaTool, handler: grokipediaHandler },
  { def: wikipediaTool, handler: wikipediaHandler },
  { def: commonCrawlTool, handler: commonCrawlHandler },
  { def: classifyFileTool, handler: classifyFileHandler },
  { def: toMarkdownTool, handler: toMarkdownHandler },
  { def: forecastTool, handler: forecastHandler },
  { def: btcPriceTool, handler: btcPriceHandler },
  { def: stbtcxInfoTool, handler: stbtcxInfoHandler },
  { def: runeInfoTool, handler: runeInfoHandler },
  { def: nodeStatusTool, handler: nodeStatusHandler },
];

const server = new Server(
  { name: "rex25-mcp", version: VERSION },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map((t) => t.def),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const name = request.params.name;
  const args = (request.params.arguments ?? {}) as Record<string, unknown>;
  const tool = TOOLS.find((t) => t.def.name === name);
  if (!tool) {
    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
      isError: true,
    };
  }
  try {
    const result = await tool.handler(args);
    return {
      content: [{ type: "text", text: typeof result === "string" ? result : JSON.stringify(result, null, 2) }],
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      content: [{ type: "text", text: `Error: ${msg}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stdio mode — no stdout banner (would corrupt JSON-RPC). Log to stderr.
  console.error(`rex25-mcp v${VERSION} ready. ${TOOLS.length} tools.`);
}

main().catch((e) => {
  console.error("rex25-mcp fatal:", e);
  process.exit(1);
});
