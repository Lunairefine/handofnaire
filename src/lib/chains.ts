import { createPublicClient, http, type Chain } from 'viem'
import { mainnet, optimism, bsc, base as baseChain } from 'viem/chains'

export const CHAINS = {
  eth: {
    name: 'Ethereum',
    rpc: 'https://rpc.ankr.com/eth',
    chain: mainnet
  },
  op: {
    name: 'Optimism',
    rpc: 'https://mainnet.optimism.io',
    chain: optimism
  },
  bsc: {
    name: 'BSC',
    rpc: 'https://bsc-dataseed.binance.org',
    chain: bsc
  },
  base: {
    name: 'Base',
    rpc: 'https://mainnet.base.org',
    chain: baseChain
  }
}

export const clients = {
  eth: createPublicClient({
    chain: mainnet,
    transport: http('https://rpc.ankr.com/eth')
  }),
  op: createPublicClient({
    chain: optimism,
    transport: http('https://mainnet.optimism.io')
  }),
  bsc: createPublicClient({
    chain: bsc,
    transport: http('https://rpc.ankr.com/bsc')
  }),
  base: createPublicClient({
    chain: baseChain,
    transport: http('https://mainnet.base.org')
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
