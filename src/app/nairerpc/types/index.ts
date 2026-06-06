export interface ChainData {
  chainId: number;
  name: string;
  symbol: string;
  explorer: string;
  rpcUrls: string[];
}

export type RPCStatus = 'online' | 'offline' | 'checking';

export interface RPCResult {
  url: string;
  latency: number;
  blockNumber: number;
  status: RPCStatus;
}