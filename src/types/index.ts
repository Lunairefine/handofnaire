export interface MintTransaction {
  id: string; // unique internal id
  hash: string;
  blockNumber: number;
  timestamp: number;
  contractAddress: string; // Token Contract Address
  to: string; // Interacted Contract Address
  from: string; // Sender Address
  value: string; // in ETH
  functionName: string;
  functionSelector: string;
  mintType: 'public' | 'whitelist' | 'owner' | 'free' | 'paid';
  mintPrice: string; // in ETH
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

