'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { MINT_SIGNATURES } from '@/parser/abi';
import type { MintTransaction } from '@/types';

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

function getEthereumProvider() {
  return window.ethereum as unknown as EthereumProvider | undefined;
}

interface MintPanelProps {
  selectedTx: MintTransaction;
  mintPrice: string;
  networkName: string;
  chainId?: number;
  explorerUrl: string;
}

function getSignature(functionName: string) {
  const signature = functionName.includes('(') ? functionName : Object.values(MINT_SIGNATURES).find((item) => item.startsWith(`${functionName}(`));
  return signature || null;
}

function getParameterTypes(signature: string) {
  const params = signature.slice(signature.indexOf('(') + 1, -1).trim();
  return params ? params.split(',').map((type) => type.trim()) : [];
}

function explainRevert(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  const data = (error as { data?: string })?.data || (error as { info?: { error?: { data?: string } } })?.info?.error?.data;
  const selector = typeof data === 'string' ? data.slice(0, 10).toLowerCase() : '';
  const known: Record<string, string> = {
    '0xf947691f': 'NoAgentId(): wallet ini tidak memiliki Agent ID/allowlist yang diwajibkan kontrak.',
    '0x788a686f': 'WrongPayment(): jumlah mint atau native value tidak sesuai aturan kontrak.',
    '0x52df9fe5': 'SoldOut(): supply mint sudah habis.',
    '0x414bfec4': 'FreeMintUsed(): wallet ini sudah memakai jatah free mint.',
  };
  return known[selector] || message.replace(/^execution reverted: /i, '') || 'Transaksi ditolak oleh kontrak.';
}

export default function MintPanel({ selectedTx, mintPrice, networkName, chainId, explorerUrl }: MintPanelProps) {
  const signature = useMemo(() => getSignature(selectedTx.functionName), [selectedTx.functionName]);
  const parameterTypes = useMemo(() => signature ? getParameterTypes(signature) : [], [signature]);
  const [account, setAccount] = useState('');
  const [values, setValues] = useState<string[]>(() => parameterTypes.map((type) => type.startsWith('uint') ? String(selectedTx.quantity || 1) : ''));
  const [value, setValue] = useState(selectedTx.value || mintPrice || '0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const connect = useCallback(async () => {
    const ethereum = getEthereumProvider();
    if (!ethereum) {
      setStatus({ type: 'error', message: 'Wallet tidak ditemukan. Install MetaMask atau wallet EVM terlebih dahulu.' });
      return '';
    }
    setIsConnecting(true);
    setStatus(null);
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      const nextAccount = accounts[0] || '';
      setAccount(nextAccount);
      setValues((current) => current.map((item, index) => parameterTypes[index]?.startsWith('address') ? nextAccount : item));
      return nextAccount;
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Gagal menghubungkan wallet.' });
      return '';
    } finally {
      setIsConnecting(false);
    }
  }, [parameterTypes]);

  useEffect(() => {
    const ethereum = getEthereumProvider();
    if (!ethereum?.on) return;
    const onAccountsChanged = (...args: unknown[]) => setAccount((args[0] as string[] | undefined)?.[0] || '');
    ethereum.on('accountsChanged', onAccountsChanged);
    return () => ethereum.removeListener?.('accountsChanged', onAccountsChanged);
  }, []);

  const handleMint = async () => {
    if (!signature) {
      setStatus({ type: 'error', message: 'Signature fungsi mint tidak dikenali dari transaksi ini.' });
      return;
    }
    const ethereum = getEthereumProvider();
    if (!ethereum) {
      setStatus({ type: 'error', message: 'Hubungkan wallet terlebih dahulu.' });
      return;
    }
    setIsMinting(true);
    setStatus(null);
    try {
      const connectedAccount = account || await connect();
      if (!connectedAccount) return;
      const provider = new ethers.BrowserProvider(ethereum as ConstructorParameters<typeof ethers.BrowserProvider>[0]);
      const network = await provider.getNetwork();
      if (chainId && Number(network.chainId) !== chainId) {
        setStatus({ type: 'error', message: `Ganti jaringan wallet ke ${networkName} sebelum mint.` });
        return;
      }
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(selectedTx.contractAddress, [`function ${signature}`], signer);
      const args = values.map((input, index) => {
        const type = parameterTypes[index];
        if (type.endsWith('[]')) return input.split(',').map((item) => item.trim()).filter(Boolean);
        return input.trim();
      });
      if (args.some((arg) => typeof arg === 'string' && !arg)) throw new Error('Lengkapi semua parameter fungsi terlebih dahulu.');
      const tx = await contract[selectedTx.functionName.split('(')[0]](...args, { value: ethers.parseEther(value || '0') });
      setStatus({ type: 'success', message: `Transaksi dikirim: ${tx.hash.slice(0, 10)}…` });
      await tx.wait();
      setStatus({ type: 'success', message: `Mint berhasil dikonfirmasi: ${tx.hash.slice(0, 10)}…` });
    } catch (error) {
      setStatus({ type: 'error', message: explainRevert(error) });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="border-t border-[var(--border-color)] pt-4 mt-2">
      <div className="flex items-center gap-1.5 mb-2.5">
        <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-sans">Write Function / Mint</h3>
      </div>
      <div className="border border-[var(--border-color)] bg-[var(--bg-main)] p-3 rounded-[1px] space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-[var(--text-secondary)] truncate">{signature || selectedTx.functionName}</span>
          {account ? <span className="text-[10px] text-emerald-500">Connected: {account.slice(0, 6)}…{account.slice(-4)}</span> : null}
        </div>
        {!signature && <p className="text-[10px] text-amber-500">Signature fungsi tidak tersedia untuk write call.</p>}
        {parameterTypes.map((type, index) => (
          <label key={`${type}-${index}`} className="block text-[10px] text-[var(--text-secondary)]">
            <span className="block mb-1">arg{index} · {type}{type.endsWith('[]') ? ' (pisahkan dengan koma)' : ''}</span>
            <input value={values[index] || ''} onChange={(event) => setValues((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} placeholder={type.startsWith('address') ? '0x...' : type.startsWith('uint') ? '1' : type.endsWith('[]') ? '0x..., 0x...' : type} className="w-full bg-white/[0.03] border border-[var(--border-color)] px-2.5 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-zinc-500" />
          </label>
        ))}
        <label className="block text-[10px] text-[var(--text-secondary)]">
          <span className="block mb-1">Native value ({networkName})</span>
          <input value={value} onChange={(event) => setValue(event.target.value)} inputMode="decimal" className="w-full bg-white/[0.03] border border-[var(--border-color)] px-2.5 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-zinc-500" />
        </label>
        {status && <p className={`text-[10px] ${status.type === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>{status.message}</p>}
        <div className="flex gap-2">
          <button onClick={() => void connect()} disabled={isConnecting} className="flex-1 border border-zinc-500/40 text-zinc-400 hover:bg-zinc-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-1.5">
            {isConnecting ? 'Connecting...' : account ? 'Wallet Connected' : 'Connect Wallet'}
          </button>
          <button onClick={() => void handleMint()} disabled={isMinting || !signature} className="flex-1 bg-zinc-500 text-black hover:bg-zinc-400 px-3 py-2 text-[10px] font-bold uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-1.5">
            {isMinting ? 'Minting...' : 'Mint Now'}
          </button>
        </div>
        <a href={`${explorerUrl}/address/${selectedTx.contractAddress}#writeContract`} target="_blank" rel="noreferrer" className="block text-center text-[9px] text-[var(--text-secondary)] hover:text-zinc-500">View contract write methods</a>
      </div>
    </div>
  );
}
