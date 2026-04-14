export const forecastTool = {
  name: "rex25_forecast",
  description: "Linear-trend forecast of a numeric time series. v0.1 simple impl; v0.2 will use TimesFM.",
  inputSchema: {
    type: "object",
    properties: {
      series: { type: "array", items: { type: "number" }, description: "historical values" },
      horizon: { type: "number", default: 8 },
    },
    required: ["series"],
  },
};

export async function forecastHandler(args: Record<string, unknown>): Promise<unknown> {
  const series = (args.series as number[]) ?? [];
  const horizon = Number(args.horizon ?? 8);
  if (series.length < 2) return { error: "series must have >=2 points" };
  // Linear regression
  const n = series.length;
  const xMean = (n - 1) / 2;
  const yMean = series.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xMean) * (series[i] - yMean);
    den += (i - xMean) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = yMean - slope * xMean;
  const forecast = Array.from({ length: horizon }, (_, j) => intercept + slope * (n + j));
  return { history_n: n, slope, intercept, forecast };
}
