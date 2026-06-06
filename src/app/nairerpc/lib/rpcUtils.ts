export const checkRPC = async (url: string) => {
  const start = performance.now();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: [] }),
      signal: AbortSignal.timeout(5000)
    });
    const data = await res.json();
    if (!data.result) throw new Error("Respons Tidak Valid");
    return {
      url,
      latency: Math.round(performance.now() - start),
      blockNumber: parseInt(data.result, 16),
      status: 'online' as const
    };
  } catch {
    return { url, latency: Infinity, blockNumber: 0, status: 'offline' as const };
  }
};