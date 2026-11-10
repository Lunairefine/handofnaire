import { createPublicClient, http, type Chain } from 'viem'
import { mainnet, optimism, arbitrum, bsc, base as baseChain } from 'viem/chains'
import { NETWORK_CONFIG } from '@/services/networkConfig'

const elysium = {
  id: 99901,
  name: 'Elysium',
  nativeCurrency: { name: 'HYPE', symbol: 'HYPE', decimals: 18 },
  rpcUrls: {
    default: { http: [NETWORK_CONFIG.elysium.rpcUrl] }
  }
} as const

export const CHAINS = {
  eth: {
    name: 'Ethereum',
    rpc: NETWORK_CONFIG.ethereum.rpcUrl,
    chain: mainnet
  },
  op: {
    name: 'Optimism',
    rpc: NETWORK_CONFIG.optimism.rpcUrl,
    chain: optimism
  },
  arbitrum: {
    name: 'Arbitrum One',
    rpc: NETWORK_CONFIG.arbitrum.rpcUrl,
    chain: arbitrum
  },
  elysium: {
    name: 'Elysium',
    rpc: NETWORK_CONFIG.elysium.rpcUrl,
    chain: elysium
  },
  hyperevm: {
    name: 'HyperEVM',
    rpc: NETWORK_CONFIG.hyperevm.rpcUrl,
    chain: {
      id: 999,
      name: 'HyperEVM',
      nativeCurrency: { name: 'HYPE', symbol: 'HYPE', decimals: 18 },
      rpcUrls: { default: { http: [NETWORK_CONFIG.hyperevm.rpcUrl] } }
    } as Chain
  },
  bsc: {
    name: 'BSC',
    rpc: NETWORK_CONFIG.bsc.rpcUrl,
    chain: bsc
  },
  base: {
    name: 'Base',
    rpc: NETWORK_CONFIG.base.rpcUrl,
    chain: baseChain
  }
}

export const clients = {
  eth: createPublicClient({
    chain: mainnet,
    transport: http(NETWORK_CONFIG.ethereum.rpcUrl)
  }),
  op: createPublicClient({
    chain: optimism,
    transport: http(NETWORK_CONFIG.optimism.rpcUrl)
  }),
  arbitrum: createPublicClient({
    chain: arbitrum,
    transport: http(NETWORK_CONFIG.arbitrum.rpcUrl)
  }),
  bsc: createPublicClient({
    chain: bsc,
    transport: http(NETWORK_CONFIG.bsc.rpcUrl)
  }),
  base: createPublicClient({
    chain: baseChain,
    transport: http(NETWORK_CONFIG.base.rpcUrl)
  }),
  elysium: createPublicClient({
    chain: elysium,
    transport: http(NETWORK_CONFIG.elysium.rpcUrl)
  }),
  hyperevm: createPublicClient({
    chain: {
      id: 999,
      name: 'HyperEVM',
      nativeCurrency: { name: 'HYPE', symbol: 'HYPE', decimals: 18 },
      rpcUrls: {
        default: { http: [NETWORK_CONFIG.hyperevm.rpcUrl] }
      }
    } as Chain,
    transport: http(NETWORK_CONFIG.hyperevm.rpcUrl)
  })
}
