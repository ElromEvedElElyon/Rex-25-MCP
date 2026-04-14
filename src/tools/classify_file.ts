export const classifyFileTool = {
  name: "rex25_classify_file",
  description: "Classify file content by magic bytes. Detects html, json, png, jpeg, pdf, gzip, zip, executable, text.",
  inputSchema: {
    type: "object",
    properties: { content_base64: { type: "string", description: "base64-encoded first 64 bytes" } },
    required: ["content_base64"],
  },
};

export async function classifyFileHandler(args: Record<string, unknown>): Promise<unknown> {
  const b64 = String(args.content_base64 ?? "");
  if (!b64) return { error: "content_base64 required" };
  const buf = Buffer.from(b64, "base64");
  if (buf.length < 4) return { type: "unknown", reason: "too short" };
  const head = buf.slice(0, 16);
  const text = buf.toString("utf-8", 0, Math.min(buf.length, 200));
  if (head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e) return { type: "png" };
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return { type: "jpeg" };
  if (head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44 && head[3] === 0x46) return { type: "pdf" };
  if (head[0] === 0x1f && head[1] === 0x8b) return { type: "gzip" };
  if (head[0] === 0x50 && head[1] === 0x4b) return { type: "zip" };
  if (head[0] === 0x4d && head[1] === 0x5a) return { type: "executable_pe" };
  if (head[0] === 0x7f && head[1] === 0x45 && head[2] === 0x4c && head[3] === 0x46) return { type: "executable_elf" };
  if (text.trimStart().startsWith("<!DOCTYPE") || text.trimStart().startsWith("<html")) return { type: "html" };
  if (text.trimStart().startsWith("{") || text.trimStart().startsWith("[")) {
    try {
      JSON.parse(text);
      return { type: "json" };
    } catch {}
  }
  if (/^[\x20-\x7E\s]+$/.test(text.slice(0, 100))) return { type: "text" };
  return { type: "binary_unknown" };
}
