import os from "node:os";

export const nodeStatusTool = {
  name: "rex25_node_status",
  description: "Local rex25-mcp node status: uptime, OS, free memory, version.",
  inputSchema: { type: "object", properties: {} },
};

const STARTED_AT = Date.now();

export async function nodeStatusHandler(_args: Record<string, unknown>): Promise<unknown> {
  return {
    name: "rex25-mcp",
    version: "0.1.0",
    uptime_s: Math.floor((Date.now() - STARTED_AT) / 1000),
    os: { platform: process.platform, arch: process.arch, release: os.release() },
    cpu: os.cpus()[0]?.model ?? "unknown",
    cpu_count: os.cpus().length,
    total_mem_gb: +(os.totalmem() / 1024 ** 3).toFixed(2),
    free_mem_gb: +(os.freemem() / 1024 ** 3).toFixed(2),
    node_version: process.version,
    phase: "HIBERNATION (queries free, no mining yet)",
  };
}
