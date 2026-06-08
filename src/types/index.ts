export interface MintTransaction {
  id: string; 
  hash: string;
  blockNumber: number;
  timestamp: number;
  contractAddress: string; 
  to: string; 
  from: string; 
  value: string; 
  functionName: string;
  functionSelector: string;
  mintType: 'public' | 'whitelist' | 'owner' | 'free' | 'paid';
  mintPrice: string; 
  quantity: number;
}

export interface ContractMetadata {
  address: string;
  name: string;
  symbol: string;
  totalSupply: string;
  maxSupply: string;
  mintPrice: string;
  owner: string;
  mintStatus: 'Active' | 'Paused' | 'Ended';
  availableMint: string;
  isOwnable: boolean;
  isPausable: boolean;
  isERC721A: boolean;
  hasMerkleWhitelist: boolean;
}

