'use client'

import { useState, useRef } from 'react'
import WalletControls from './WalletControls'
import WalletTable from './WalletTable'
import { WalletData, generateWallet, vanityGenerator } from '@/lib/wallet'
import { downloadTxt } from '@/lib/utils'

export default function WalletGenerator() {
  const [wallets, setWallets] = useState<WalletData[]>([])
  const [isGeneratingVanity, setIsGeneratingVanity] = useState(false)
  const [progress, setProgress] = useState(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleGenerate = (count: number) => {
    const newWallets = Array.from({ length: count }, (_, i) => generateWallet(i))
    setWallets(newWallets)
  }

  const handleStartVanity = async (options: { prefix: string; suffix: string; isCaseSensitive: boolean }) => {
    setIsGeneratingVanity(true)
    setProgress(0)
    abortControllerRef.current = new AbortController()

    const result = await vanityGenerator(
      {
        ...options,
        maxAttempts: 1000000,
        onProgress: (attempts) => setProgress(attempts),
      },
      abortControllerRef.current.signal
    )

    if (result) {
      setWallets([result])
    }
    setIsGeneratingVanity(false)
  }

  const handleStopVanity = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsGeneratingVanity(false)
  }

  const handleExport = () => {
    if (wallets.length === 0) return
    const content = wallets.map((w) => `${w.privateKey} | ${w.address}`).join('\n')
    downloadTxt(content, `wallets_${new Date().getTime()}.txt`)
  }

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Ethereum Wallet Generator</h2>
        <p className="text-[var(--text-secondary)]">
          Generate multiple Ethereum wallets or search for vanity addresses.
        </p>
      </div>

      <WalletControls
        onGenerate={handleGenerate}
        onStartVanity={handleStartVanity}
        onStopVanity={handleStopVanity}
        onExport={handleExport}
        isGeneratingVanity={isGeneratingVanity}
        progress={progress}
      />

      <WalletTable wallets={wallets} />
    </div>
  )
}
