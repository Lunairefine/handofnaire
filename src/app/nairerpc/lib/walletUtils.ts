import { ChainData } from '@/app/nairerpc/types';

declare global {
  interface Window {
    ethereum?: unknown;
  }
}

export const addNetworkToWallet = async (chain: ChainData, rpcUrl: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eth = window.ethereum as any; 
  if (!eth) return;
  
  try {
    await eth.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: `0x${chain.chainId.toString(16)}`,
        chainName: chain.name,
        nativeCurrency: { name: chain.symbol, symbol: chain.symbol, decimals: 18 },
        rpcUrls: [rpcUrl],
        blockExplorerUrls: [chain.explorer]
      }],
    });
  } catch (error) {
    console.error("User menolak atau terjadi kesalahan", error);
  }
};