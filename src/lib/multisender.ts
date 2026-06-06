import { createWalletClient, http, parseEther, type Chain } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

export type TxData = {
  id: string
  pk: `0x${string}`
  from: string
  to: string
  amount: string
  status: 'pending' | 'success' | 'failed'
  txHash?: string
  error?: string
}

export function getWalletClient(pk: `0x${string}`, chain: Chain, rpc: string) {
  const account = privateKeyToAccount(pk)

  return createWalletClient({
    account,
    chain,
    transport: http(rpc)
  })
}

export async function sendNative({
  pk,
  to,
  amount,
  chain,
  rpc
}: {
  pk: `0x${string}`
  to: `0x${string}`
  amount: string
  chain: Chain
  rpc: string
}) {
  const client = getWalletClient(pk, chain, rpc)
  const value = parseEther(amount)

  return await client.sendTransaction({
    to,
    value,
    chain
  })
}

// Helpers to delay for rate limiting
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
