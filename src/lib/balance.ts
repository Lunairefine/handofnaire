import { formatEther } from 'viem'
import { clients } from './chains'

export type ChainBalance = {
  chain: string
  balance: string
}

export type BalanceResult = {
  address: string
  balances: ChainBalance[]
}

export async function getBalances(address: string): Promise<ChainBalance[]> {
  const entries = Object.entries(clients)

  const results = await Promise.all(
    entries.map(async ([chain, client]) => {
      try {
        const balance = await client.getBalance({ address: address as `0x${string}` })
        return {
          chain,
          balance: formatEther(balance)
        }
      } catch (error) {
        return {
          chain,
          balance: '0'
        }
      }
    })
  )

  return results
}
