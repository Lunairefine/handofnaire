import { useState, useEffect, useCallback } from 'react';
import { OpenseaDrop } from '@/types';

export function useOpenseaDrops() {
  const [drops, setDrops] = useState<OpenseaDrop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const [apiError, setApiError] = useState<string | null>(null);

  const toggleScanning = () => {
    setIsScanning(prev => !prev);
  };

  const clearDrops = () => {
    setDrops([]);
    setApiError(null);
  };

  const fetchLiveDrops = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/opensea/drops');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const parsed: OpenseaDrop[] = (data.drops || []);
      
      setDrops(parsed);
      setApiError(null);
    } catch (error: any) {
      console.error('Failed to fetch OpenSea drops:', error);
      setApiError(error.message);
      setDrops([]);
    } finally {
      setIsLoading(false);
      setLastUpdated(Date.now());
    }
  }, []);

  useEffect(() => {
    fetchLiveDrops();
  }, [fetchLiveDrops]);

  useEffect(() => {
    if (!isScanning) return;
    
    const interval = setInterval(() => {
      fetchLiveDrops();
    }, 15000);

    return () => clearInterval(interval);
  }, [isScanning, fetchLiveDrops]);

  return {
    drops,
    isLoading,
    isScanning,
    toggleScanning,
    clearDrops,
    activeCount: drops.filter(d => d.isMinting).length,
    lastUpdated,
    apiError
  };
}
