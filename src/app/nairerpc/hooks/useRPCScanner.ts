import { useState, useEffect, useCallback } from 'react';
import { checkRPC } from '@/app/nairerpc/lib/rpcUtils';
import { RPCResult } from '@/app/nairerpc/types';
export const useRPCScanner = (rpcUrls: string[]) => {
  const [results, setResults] = useState<RPCResult[]>([]);
  const [loading, setLoading] = useState(false);
  const scan = useCallback(async () => {
    setLoading(true);
    setResults(rpcUrls.map(url => ({ url, latency: 0, blockNumber: 0, status: 'checking' })));
    const promises = rpcUrls.map(url => checkRPC(url));
    const scannedResults = await Promise.all(promises);
    scannedResults.sort((a, b) => {
      if (a.status === 'offline') return 1;
      if (b.status === 'offline') return -1;
      return a.latency - b.latency;
    });
    setResults(scannedResults);
    setLoading(false);
  }, [rpcUrls]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    scan();
    const interval = setInterval(scan, 5000);
    return () => clearInterval(interval);
  }, [scan]);
  return { results, loading, scan };
};