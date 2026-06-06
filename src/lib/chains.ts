import { createPublicClient, http, type Chain } from 'viem'
import { mainnet, optimism, bsc, base as baseChain } from 'viem/chains'

export const CHAINS = {
  eth: {
    name: 'Ethereum',
    rpc: 'https://ethereum-rpc.publicnode.com',
    chain: mainnet
  },
  op: {
    name: 'Optimism',
    rpc: 'https://optimism-rpc.publicnode.com',
    chain: optimism
  },
  bsc: {
    name: 'BSC',
    rpc: 'https://bsc-rpc.publicnode.com',
    chain: bsc
  },
  base: {
    name: 'Base',
    rpc: 'https://base-rpc.publicnode.com',
    chain: baseChain
  }
}

export const clients = {
  eth: createPublicClient({
    chain: mainnet,
    transport: http('https://ethereum-rpc.publicnode.com')
  }),
  op: createPublicClient({
    chain: optimism,
    transport: http('https://optimism-rpc.publicnode.com')
  }),
  bsc: createPublicClient({
    chain: bsc,
    transport: http('https://bsc-rpc.publicnode.com')
  }),
  base: createPublicClient({
    chain: baseChain,
    transport: http('https://base-rpc.publicnode.com')
  }),
  hyperevm: createPublicClient({
    chain: {
      id: 999,
      name: 'HyperEVM',
      nativeCurrency: { name: 'HYPE', symbol: 'HYPE', decimals: 18 },
      rpcUrls: {
        default: { http: ['https://rpc.hyperliquid.xyz/evm'] }
      }
    } as Chain,
    transport: http('https://rpc.hyperliquid.xyz/evm')
  })
}
