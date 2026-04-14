/**
 * Minimal HTTP helpers — no deps beyond Node 18+ (uses global fetch).
 */
export async function httpJson(
  url: string,
  headers: Record<string, string>,
  body: unknown,
  timeoutMs = 30000
): Promise<unknown> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (!r.ok) {
      const text = await r.text();
      return { _http_error: r.status, body: text.slice(0, 500) };
    }
    return await r.json();
  } catch (e) {
    return { _error: String(e) };
  } finally {
    clearTimeout(t);
  }
}

export async function httpGet(url: string, headers: Record<string, string> = {}, timeoutMs = 30000): Promise<{ status: number; text: string; headers: Headers }> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { headers, signal: ctrl.signal });
    return { status: r.status, text: await r.text(), headers: r.headers };
  } finally {
    clearTimeout(t);
  }
}

export async function httpGetJson(url: string, headers: Record<string, string> = {}): Promise<unknown> {
  const r = await fetch(url, { headers });
  if (!r.ok) return { _http_error: r.status };
  return await r.json();
}
