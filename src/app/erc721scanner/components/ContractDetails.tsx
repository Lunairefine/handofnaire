import React, { useState } from 'react';
import { ContractMetadata, MintTransaction } from '../../../types';
import { shortenAddress, shortenHash, getKnownContract } from '../../../utils/format';
import { ExternalLink, Compass, Zap, Copy, Check, Hash, Coins, Terminal } from 'lucide-react';

interface ContractDetailsProps {
  metadata: ContractMetadata | null;
  selectedTx: MintTransaction | null;
  isLoading: boolean;
  mode?: 'ERC721' | 'ERC20';
}

export default function ContractDetails({
  metadata,
  selectedTx,
  isLoading,
  mode = 'ERC721'
}: ContractDetailsProps) {
  const [mintQuantity, setMintQuantity] = useState<number>(1);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [mintStatusText, setMintStatusText] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const [mintTxHash, setMintTxHash] = useState<string | null>(null);

  const handleMockMint = () => {
    setIsMinting(true);
    setMintStatusText('Constructing transaction payload...');
    
    // Generate a random mock tx hash for the mint transaction
    const mockHash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setMintTxHash(mockHash);

    setTimeout(() => {
      setMintStatusText('Injecting Web3 provider & requesting signature...');
      setTimeout(() => {
        setMintStatusText(`Tx Broadcasted: Waiting for block inclusion...`);
        setTimeout(() => {
          setIsMinting(false);
          setMintStatusText(`Success! Minted NFT successfully! 🎉`);
          // Save the hash to allow users to click it
          setTimeout(() => {
            setMintStatusText(`Tx Hash: ${shortenHash(mockHash)} (Click to view)`);
          }, 1500);
        }, 1500);
      }, 1500);
    }, 1000);
  };

  // If no transaction is selected yet
  if (!selectedTx) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 rounded-[1px] h-[480px] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 border border-dashed border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] mb-3 rounded-[1px]">
          <Compass size={20} className="animate-pulse-slow" />
        </div>
        <p className="text-sm font-semibold text-[var(--text-primary)] font-sans uppercase tracking-wider">No Transaction Selected</p>
        <p className="text-xs text-[var(--text-secondary)] mt-2 max-w-xs font-sans">
          Select any mint transaction from the realtime stream to analyze its transaction hash, contract details, and narrative rules.
        </p>
      </div>
    );
  }



  const progressPercent = metadata 
    ? Math.min(100, Math.max(0, (parseInt(metadata.totalSupply) / (parseInt(metadata.maxSupply) || 10000)) * 100))
    : 0;

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-5 rounded-[1px] flex flex-col gap-5 h-auto lg:h-[680px] overflow-y-auto no-scrollbar justify-between">
      
      <div>
        {/* SECTION 1: INSTANT TRANSACTION DETAILS (Does not wait for metadata load!) */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Hash size={13} className="text-teal-500" />
            <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-sans">
              Transaction Analyzer & Link Hash
            </h3>
          </div>

          <div className="border border-[var(--border-color)] bg-[var(--bg-main)] p-3 rounded-[1px] font-sans text-[11px] space-y-2.5">
            {/* Tx Hash */}
            <div className="flex justify-between items-center py-1 border-b border-[var(--border-color)]/50 gap-2">
              <span className="text-[var(--text-secondary)] shrink-0">TX HASH:</span>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-bold text-[var(--text-primary)] truncate text-right">{shortenHash(selectedTx.hash, 8)}</span>
                <button 
                  onClick={() => handleCopy(selectedTx.hash, 'tx')}
                  className="text-[var(--text-secondary)] hover:text-teal-500 transition-colors cursor-pointer shrink-0"
                  title="Copy Tx Hash"
                >
                  {copiedField === 'tx' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                </button>
                <a
                  href={`https://etherscan.io/tx/${selectedTx.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-500 hover:text-teal-400 shrink-0 flex items-center gap-0.5"
                  title="View on Etherscan"
                >
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {/* Interacted Contract (To) */}
            <div className="flex justify-between items-center py-1 border-b border-[var(--border-color)]/50 gap-2">
              <span className="text-[var(--text-secondary)] shrink-0">INTERACTED CONTRACT (TO):</span>
              <div className="flex items-center gap-2 overflow-hidden">
                {(() => {
                  const known = getKnownContract(selectedTx.to);
                  return known ? (
                    <span className={`${known.color} font-extrabold truncate text-right`}>
                      {known.name}
                    </span>
                  ) : (
                    <span className="font-bold text-[var(--text-primary)] truncate text-right">
                      {shortenAddress(selectedTx.to, 6)}
                    </span>
                  );
                })()}
                <button 
                  onClick={() => handleCopy(selectedTx.to, 'to')}
                  className="text-[var(--text-secondary)] hover:text-teal-500 transition-colors cursor-pointer shrink-0"
                  title="Copy Interacted Contract"
                >
                  {copiedField === 'to' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                </button>
                <a
                  href={`https://etherscan.io/address/${selectedTx.to}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-500 hover:text-teal-400 shrink-0 flex items-center gap-0.5"
                  title="View on Etherscan"
                >
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {/* Token Contract Address (CA) */}
            <div className="flex justify-between items-center py-1 border-b border-[var(--border-color)]/50 gap-2">
              <span className="text-[var(--text-secondary)] shrink-0">TOKEN CONTRACT (NFT):</span>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-bold text-[var(--text-primary)] truncate text-right">{shortenAddress(selectedTx.contractAddress, 6)}</span>
                <button 
                  onClick={() => handleCopy(selectedTx.contractAddress, 'ca')}
                  className="text-[var(--text-secondary)] hover:text-teal-500 transition-colors cursor-pointer shrink-0"
                  title="Copy Token CA"
                >
                  {copiedField === 'ca' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                </button>
                <a
                  href={`https://etherscan.io/address/${selectedTx.contractAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-500 hover:text-teal-400 shrink-0 flex items-center gap-0.5"
                  title="View on Etherscan"
                >
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {/* Sender (From) */}
            <div className="flex justify-between items-center py-1 border-b border-[var(--border-color)]/50 gap-2">
              <span className="text-[var(--text-secondary)] shrink-0">SENDER (FROM):</span>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-bold text-[var(--text-primary)] truncate text-right">{shortenAddress(selectedTx.from, 6)}</span>
                <button 
                  onClick={() => handleCopy(selectedTx.from, 'from')}
                  className="text-[var(--text-secondary)] hover:text-teal-500 transition-colors cursor-pointer shrink-0"
                  title="Copy Sender Address"
                >
                  {copiedField === 'from' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                </button>
                <a
                  href={`https://etherscan.io/address/${selectedTx.from}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-500 hover:text-teal-400 shrink-0 flex items-center gap-0.5"
                  title="View on Etherscan"
                >
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">QUANTITY:</span>
                <span className="font-bold text-[var(--text-primary)]">
                  {selectedTx.quantity} {mode === 'ERC721' ? 'NFT' : 'Tokens'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">VALUE:</span>
                <span className="font-bold text-[var(--text-primary)]">{selectedTx.value} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">SELECTOR:</span>
                <span className="font-bold text-teal-500">{selectedTx.functionSelector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">BLOCK NO:</span>
                <span className="font-bold text-[var(--text-primary)]">#{selectedTx.blockNumber}</span>
              </div>
            </div>
          </div>
        </div>



        {/* SECTION 3: CONTRACT METADATA (Displays pulsing skeletons when loading metadata) */}
        <div className="border-t border-[var(--border-color)] pt-4 mt-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Coins size={13} className="text-teal-500" />
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-sans">
                Smart Contract Metadata
              </h3>
            </div>
            {isLoading && (
              <span className="text-[10px] text-teal-500 font-sans animate-pulse-slow">
                Syncing RPC...
              </span>
            )}
          </div>

          {isLoading || !metadata ? (
            /* Pulsing Skeleton Loader */
            <div className="border border-[var(--border-color)] bg-[var(--bg-main)]/30 p-4 rounded-[1px] flex flex-col gap-3.5 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-[var(--border-color)] w-1/3 rounded-[1px]"></div>
                <div className="h-3.5 bg-[var(--border-color)] w-1/6 rounded-[1px]"></div>
              </div>
              <div className="space-y-1.5 mt-1">
                <div className="h-3 bg-[var(--border-color)] w-full rounded-[1px]"></div>
                <div className="h-2 bg-[var(--border-color)] w-full rounded-[1px]"></div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="h-10 bg-[var(--border-color)] rounded-[1px]"></div>
                <div className="h-10 bg-[var(--border-color)] rounded-[1px]"></div>
              </div>
            </div>
          ) : (
            /* Real Metadata Content */
            <div className="border border-[var(--border-color)] bg-[var(--bg-main)] p-4 rounded-[1px] space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-sans text-[9px] text-teal-500 bg-teal-500/10 px-1.5 py-0.5 rounded-[1px] font-bold uppercase border border-teal-500/20">
                    {metadata.symbol || 'NFT'}
                  </span>
                  <h2 className="text-sm font-extrabold text-[var(--text-primary)] mt-1.5">{metadata.name}</h2>
                </div>
                <span className={`text-[9px] font-sans font-bold px-1.5 py-0.5 border rounded-[1px] uppercase ${
                  metadata.mintStatus === 'Active'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                    : metadata.mintStatus === 'Paused'
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                }`}>
                  {metadata.mintStatus}
                </span>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-sans mb-1.5">
                  <span className="text-[var(--text-secondary)] font-medium">Mint Progress</span>
                  <span className="font-bold text-[var(--text-primary)]">
                    {parseInt(metadata.totalSupply).toLocaleString()} / {parseInt(metadata.maxSupply).toLocaleString()} ({progressPercent.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-[var(--bg-surface)] h-1.5 rounded-[1px] overflow-hidden border border-[var(--border-color)]">
                  <div
                    className="bg-teal-500 h-full rounded-[1px] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1 text-[9px] text-[var(--text-secondary)] font-sans">
                  <span>Available: {parseInt(metadata.availableMint).toLocaleString()}</span>
                  <span>Unminted: {Math.max(0, parseInt(metadata.maxSupply) - parseInt(metadata.totalSupply)).toLocaleString()}</span>
                </div>
              </div>

              {/* Grid pricing & deployer */}
              <div className="grid grid-cols-2 gap-3 font-sans text-[10px]">
                <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-2.5 rounded-[1px]">
                  <p className="text-[9px] text-[var(--text-secondary)] uppercase">Mint Price</p>
                  <p className="font-bold text-[var(--text-primary)] mt-0.5">
                    {parseFloat(metadata.mintPrice) === 0 ? 'FREE' : `${metadata.mintPrice} ETH`}
                  </p>
                </div>
                <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-2.5 rounded-[1px] overflow-hidden">
                  <p className="text-[9px] text-[var(--text-secondary)] uppercase">Contract Owner</p>
                  <p className="font-bold text-[var(--text-primary)] mt-0.5 truncate" title={metadata.owner}>
                    {shortenAddress(metadata.owner, 4)}
                  </p>
                </div>
              </div>

              {/* Contract Capabilities */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {[
                  { label: 'ERC721A Standard', active: metadata.isERC721A },
                  { label: 'Pausable Support', active: metadata.isPausable },
                  { label: 'Ownable Access', active: metadata.isOwnable },
                  { label: 'Merkle Allowlist', active: metadata.hasMerkleWhitelist },
                ].map((cap, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-1.5 p-1.5 rounded-[1px] border text-[9px] font-sans ${
                      cap.active
                        ? 'bg-teal-500/5 border-teal-500/20 text-teal-500'
                        : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <Zap size={10} className={cap.active ? 'text-teal-500 shrink-0' : 'text-[var(--text-secondary)] shrink-0'} />
                    <span className="truncate">{cap.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 4: INTERACTIVE MINT TRIGGER (Always sharp borders) */}
      <div className="border-t border-[var(--border-color)] pt-4 mt-2">
        <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2 font-sans flex items-center gap-1.5">
          <Terminal size={12} className="text-teal-500" />
          Interactive Mint Trigger
        </h3>
        
        {mintStatusText ? (
          <div className="p-3 bg-teal-500/5 border border-teal-500/20 rounded-[1px] text-center flex flex-col items-center gap-2">
            {isMinting && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
            )}
            <p className="text-xs font-sans text-[var(--text-primary)] break-all">{mintStatusText}</p>
            {mintStatusText.includes('Hash:') && mintTxHash && (
              <a
                href={`https://etherscan.io/tx/${mintTxHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-teal-500 hover:text-teal-400 font-sans underline flex items-center gap-1 mt-1 cursor-pointer"
              >
                <span>View on Etherscan</span>
                <ExternalLink size={10} />
              </a>
            )}
            {!isMinting && (
              <button 
                onClick={() => setMintStatusText(null)}
                className="text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-sans border border-[var(--border-color)] px-2 py-0.5 bg-[var(--bg-main)] rounded-[1px] mt-1 cursor-pointer"
              >
                Reset Trigger
              </button>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            {/* Quantity Selector */}
            <div className="flex items-center border border-[var(--border-color)] bg-[var(--bg-main)] rounded-[1px]">
              <button
                onClick={() => setMintQuantity(q => Math.max(1, q - 1))}
                className="px-2.5 py-1 text-sm font-bold text-[var(--text-secondary)] hover:text-teal-500 font-sans cursor-pointer"
              >
                -
              </button>
              <span className="px-2 py-1 text-xs font-sans font-bold text-[var(--text-primary)] w-6 text-center">
                {mintQuantity}
              </span>
              <button
                onClick={() => setMintQuantity(q => Math.min(10, q + 1))}
                className="px-2.5 py-1 text-sm font-bold text-[var(--text-secondary)] hover:text-teal-500 font-sans cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Mint Action Button */}
            <button
              onClick={handleMockMint}
              disabled={!!(metadata && metadata.mintStatus !== 'Active')}
              className="flex-1 bg-[var(--bg-surface)] border border-teal-500/30 hover:border-teal-500 text-teal-500 hover:text-teal-400 font-sans text-xs font-bold py-2 px-4 rounded-[1px] cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              TRIGGER MINT {mintQuantity} {mode === 'ERC721' ? 'NFT' : 'TOKEN'}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
