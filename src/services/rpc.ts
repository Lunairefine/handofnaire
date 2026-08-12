import { ethers } from 'ethers';
import { ContractMetadata } from '@/types';


const ERC721_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function maxSupply() view returns (uint256)',
  'function MAX_SUPPLY() view returns (uint256)',
  'function owner() view returns (address)',
  'function paused() view returns (bool)',
  'function contractURI() view returns (string)',
];

/**
 * Reads NFT metadata from a contract address using RPC.
 * Returns partial data with 'Unknown' labels if RPC calls fail.
 */
export async function getContractMetadata(
  address: string, 
  mintPrice: string = '0.05',
  rpcUrl?: string
): Promise<ContractMetadata> {
  const finalRpcUrl = rpcUrl || process.env.NEXT_PUBLIC_RPC_URL || 'https://ethereum-rpc.publicnode.com';

  const fallback: ContractMetadata = {
    address,
    name: 'Unknown',
    symbol: '???',
    totalSupply: '0',
    maxSupply: '0',
    mintPrice,
    owner: '0x0000000000000000000000000000000000000000',
    mintStatus: 'Active',
    availableMint: '0',
    imageUrl: `https://effigy.im/a/${address}.svg`,
    isOwnable: false,
    isPausable: false,
    isERC721A: false,
    hasMerkleWhitelist: false,
  };

  try {
    const provider = new ethers.JsonRpcProvider(finalRpcUrl, undefined, { staticNetwork: true });
    
    const contract = new ethers.Contract(address, ERC721_ABI, provider);

    const fetchWithTimeout = async <T>(promise: Promise<T>, defaultValue: T): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<T>((resolve) => setTimeout(() => resolve(defaultValue), 2500))
      ]);
    };

    let name = fallback.name;
    try {
      name = await fetchWithTimeout<string>(contract.name(), fallback.name);
    } catch {}

    let symbol = fallback.symbol;
    try {
      symbol = await fetchWithTimeout<string>(contract.symbol(), fallback.symbol);
    } catch {}
    
    let totalSupply = fallback.totalSupply;
    try {
      const ts = await fetchWithTimeout<bigint | null>(contract.totalSupply(), null);
      if (ts !== null) totalSupply = ts.toString();
    } catch {}

    let maxSupply = fallback.maxSupply;
    try {
      let ms = await fetchWithTimeout<bigint | null>(contract.maxSupply(), null);
      if (ms === null) {
        ms = await fetchWithTimeout<bigint | null>(contract.MAX_SUPPLY(), null);
      }
      if (ms !== null) maxSupply = ms.toString();
    } catch {}

    let owner = fallback.owner;
    try {
      const ow = await fetchWithTimeout<string | null>(contract.owner(), null);
      if (ow) {
        owner = ow;
      }
    } catch {}

    const isOwnable = owner !== fallback.owner;

    let mintStatus: 'Active' | 'Paused' | 'Ended' = 'Active';
    let isPausable = false;
    try {
      const paused = await fetchWithTimeout<boolean | null>(contract.paused(), null);
      if (paused !== null) {
        isPausable = true;
        mintStatus = paused ? 'Paused' : 'Active';
      }
    } catch {}

    let imageUrl = fallback.imageUrl;
    try {
      const uri = await fetchWithTimeout<string | null>(contract.contractURI(), null);
      if (uri) {
        let fetchUrl = uri;
        if (uri.startsWith('ipfs://')) fetchUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
        const metaRes = await fetchWithTimeout(fetch(fetchUrl).then(r => r.json()), null);
        if (metaRes && metaRes.image) {
          imageUrl = metaRes.image.startsWith('ipfs://') ? metaRes.image.replace('ipfs://', 'https://ipfs.io/ipfs/') : metaRes.image;
        }
      }
    } catch {}

    const totalInt = parseInt(totalSupply);
    const maxInt = parseInt(maxSupply);
    if (!isNaN(totalInt) && !isNaN(maxInt) && totalInt >= maxInt && maxInt > 0) {
      mintStatus = 'Ended';
    }

    const availableMint = (!isNaN(maxInt) && !isNaN(totalInt)) && maxInt > totalInt 
      ? (maxInt - totalInt).toString() 
      : '0';

    return {
      address,
      name,
      symbol,
      totalSupply,
      maxSupply,
      mintPrice,
      owner,
      mintStatus,
      availableMint,
      imageUrl,
      isOwnable,
      isPausable,
      isERC721A: false,
      hasMerkleWhitelist: false,
    };
  } catch {
    return fallback;
  }
}
