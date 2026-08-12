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
  imageUrl?: string;
  isOwnable: boolean;
  isPausable: boolean;
  isERC721A: boolean;
  hasMerkleWhitelist: boolean;
}

export interface OpenseaDrop {
  id: string;
  name: string;
  contractAddress: string;
  chain: string;
  dropType: string;
  isMinting: boolean;
  imageUrl: string;
  openseaUrl: string;
  mintPrice: string;
  stageType: string | null;
  stageLabel: string | null;
  startTime: string | null;
  endTime: string | null;
  maxPerWallet: string | null;
  nextStage: any | null;
  description: string | null;
  owner: string | null;
  totalSupply: number | null;
  category: string | null;
  twitterUsername: string | null;
  discordUrl: string | null;
  projectUrl: string | null;
  bannerUrl: string | null;
  floorPrice: number | null;
  floorPriceSymbol: string;
  totalVolume: number | null;
  totalSales: number | null;
  numOwners: number | null;
}
