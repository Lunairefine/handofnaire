import { generatePrivateKey, privateKeyToAddress } from 'viem/accounts'

export type WalletData = {
  index: number
  address: string
  privateKey: string
}

export const generateWallet = (index: number): WalletData => {
  const privateKey = generatePrivateKey()
  const address = privateKeyToAddress(privateKey)
  return {
    index,
    address,
    privateKey,
  }
}

export type VanityOptions = {
  prefix?: string
  suffix?: string
  isCaseSensitive: boolean
  maxAttempts: number
  onProgress?: (attempts: number) => void
}

export const vanityGenerator = async (
  options: VanityOptions,
  signal?: AbortSignal
): Promise<WalletData | null> => {
  const { prefix = '', suffix = '', isCaseSensitive, maxAttempts, onProgress } = options
  
  let attempts = 0
  const targetPrefix = isCaseSensitive ? prefix : prefix.toLowerCase()
  const targetSuffix = isCaseSensitive ? suffix : suffix.toLowerCase()

  while (attempts < maxAttempts) {
    if (signal?.aborted) return null

    attempts++
    if (attempts % 100 === 0 && onProgress) {
      onProgress(attempts)
      // Allow UI to breathe
      await new Promise(resolve => setTimeout(resolve, 0))
    }

    const privateKey = generatePrivateKey()
    const address = privateKeyToAddress(privateKey)
    
    const checkAddress = isCaseSensitive ? address : address.toLowerCase()
    
    // Remove 0x for checking if prefix doesn't start with it, 
    // but usually vanity prefix includes the 0x or is after it.
    // Let's assume the user provides the part AFTER 0x or the whole thing.
    
    const addressWithout0x = checkAddress.slice(2)
    const prefixWithout0x = targetPrefix.startsWith('0x') ? targetPrefix.slice(2) : targetPrefix
    const suffixString = targetSuffix

    if (addressWithout0x.startsWith(prefixWithout0x) && addressWithout0x.endsWith(suffixString)) {
      return {
        index: 0,
        address,
        privateKey,
      }
    }
  }

  return null
}
