import { useState, useEffect, useRef, useCallback } from 'react';
import { ethers } from 'ethers';
import { MintTransaction } from '@/types';
import { detectMintFunction, analyzeMintType } from '@/parser/abi';
import { useAppContext } from '@/app/components/AppContext';
import { resolveFunctionSignature } from '@/services/blockExplorer';

export function useMintScanner(mode: string = 'ERC721') {
  const { isScanning, setIsScanning, customRpcUrl } = useAppContext();
  const [transactions, setTransactions] = useState<MintTransaction[]>([]);
  const [blocksScanned, setBlocksScanned] = useState<number>(0);
  const [activeMintsCount, setActiveMintsCount] = useState<number>(0);
  const [latestBlock, setLatestBlock] = useState<number>(0);
  const [status, setStatus] = useState<string>('Initializing...');
  const [tps, setTps] = useState<number>(0);

  const scannedTxHashes = useRef<Set<string>>(new Set());
  const lastBlockRef = useRef<number>(0);
  const isScanningRef = useRef<boolean>(isScanning);

  useEffect(() => {
    isScanningRef.current = isScanning;
  }, [isScanning]);

  // Reset scanning status when moving between routes
  useEffect(() => {
    setIsScanning(false);
    return () => {
      setIsScanning(false);
    };
  }, [setIsScanning]);

  useEffect(() => {
    let pollingTimeout: NodeJS.Timeout;

    if (isScanning) {
      setTimeout(() => setStatus('Connecting...'), 0);
      const defaultRpc = process.env.NEXT_PUBLIC_RPC_URL || 'https://ethereum-rpc.publicnode.com';
      const rpcUrl = customRpcUrl || defaultRpc;
      const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, { staticNetwork: true });

      const pollBlock = async () => {
        try {
          const blockNumber = await provider.getBlockNumber();
          setLatestBlock(blockNumber);
          
          if (blockNumber > lastBlockRef.current) {
            const prevBlock = lastBlockRef.current;
            lastBlockRef.current = blockNumber;
            
            const startScan = prevBlock === 0 ? blockNumber - 1 : prevBlock + 1;
            const endScan = blockNumber;

            for (let b = startScan; b <= endScan; b++) {
              setStatus('Scanning...');
              
              const topics = mode === 'ERC721' ? [
                [
                  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', 
                  '0xc3d58168c5ae7397731d063d5bbf3d65785442f3937666f3aec8580e0593f7b0', 
                  '0x4a0b2308138e10cdd41602622944a335be9924aff02798d94e2163c4cdb18d8d'  
                ]
              ] : [
                [
                  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' 
                ]
              ];

              let logs: ethers.Log[];
              try {
                logs = (await provider.getLogs({
                  fromBlock: b,
                  toBlock: b,
                  topics
                })) as ethers.Log[];
              } catch (err: any) {
                if (err.message && err.message.toLowerCase().includes('extends beyond current head block')) {
                  console.warn(`RPC lag detected at block #${b}. Will retry next tick.`);
                  lastBlockRef.current = b - 1;
                  break;
                }
                throw err;
              }

              if (logs.length === 0) {
                console.log(`No mint logs found in block #${b}`);
                continue;
              }

              const mintLogs = logs.filter(log => {
                const isTransfer = log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
                if (isTransfer) {
                  if (mode === 'ERC721') {
                    return log.topics.length === 4 && log.topics[1] === '0x0000000000000000000000000000000000000000000000000000000000000000';
                  } else {
                    return log.topics.length === 3 && log.topics[1] === '0x0000000000000000000000000000000000000000000000000000000000000000';
                  }
                }
                
                if (mode === 'ERC721') {
                  return log.topics[2] === '0x0000000000000000000000000000000000000000000000000000000000000000';
                }

                return false;
              });

              if (mintLogs.length === 0) {
                console.log(`No zero-address mint logs found in block #${b}`);
                continue;
              }

              console.log(`Detected ${mintLogs.length} potential mints in block #${b}`);
              
              const txHashToLogs = new Map<string, ethers.Log[]>();
              mintLogs.forEach(log => {
                if (!txHashToLogs.has(log.transactionHash)) {
                  txHashToLogs.set(log.transactionHash, []);
                }
                txHashToLogs.get(log.transactionHash)!.push(log);
              });

              const blockInfo = await provider.getBlock(b);
              const newTxs: MintTransaction[] = [];
              const uniqueHashes = Array.from(txHashToLogs.keys());

              const BATCH_SIZE = 5;
              for (let i = 0; i < uniqueHashes.length; i += BATCH_SIZE) {
                const batch = uniqueHashes.slice(i, i + BATCH_SIZE);
                await Promise.all(batch.map(async (hash) => {
                  try {
                    if (scannedTxHashes.current.has(hash)) return;
                    scannedTxHashes.current.add(hash);

                    const tx = await provider.getTransaction(hash);
                    if (!tx) return;

                    const logsForTx = txHashToLogs.get(hash)!;
                    const quantity = logsForTx.length;
                    const ethValue = ethers.formatEther(tx.value);
                    const priceVal = parseFloat(ethValue) / quantity;
                    
                    const detection = detectMintFunction(tx.data);
                    let functionName = detection.functionName;
                    const selector = detection.selector;
                    
                    if (functionName.startsWith('Unknown') && tx.to && tx.to !== '0x') {
                      const resolved = await resolveFunctionSignature(tx.to, selector);
                      if (resolved) {
                        functionName = resolved;
                      }
                    }
                    
                    const mintType = analyzeMintType(functionName, tx.value, tx.from);
                    const contractAddress = ethers.getAddress(logsForTx[0].address);

                    newTxs.push({
                      id: `${hash}-${b}`,
                      hash: hash,
                      blockNumber: b,
                      timestamp: (blockInfo?.timestamp || Date.now() / 1000) * 1000,
                      contractAddress,
                      to: tx.to || 'UNKNOWN_TO', 
                      from: tx.from || '0x',
                      value: parseFloat(ethValue).toFixed(4),
                      functionName,
                      functionSelector: selector,
                      mintType,
                      mintPrice: priceVal.toFixed(4),
                      quantity
                    });
                  } catch (e) {
                    console.error(`Error fetching tx ${hash}:`, e);
                  }
                }));
              }

              if (newTxs.length > 0) {
                console.log(`Successfully parsed ${newTxs.length} mint transactions from block #${b}`);
                setTransactions(prev => {
                  const combined = [...newTxs, ...prev].slice(0, 100);
                  const uniqueCAs = new Set(combined.map(t => t.contractAddress));
                  setActiveMintsCount(uniqueCAs.size);
                  return combined;
                });
              }
              setBlocksScanned(prev => prev + 1);
              setTps(parseFloat((uniqueHashes.length / 12).toFixed(2)));
            }
            setStatus('Monitoring');
          }
        } catch (error: unknown) {
          console.error('RPC Error details:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          setStatus('Retrying...');
        }
        
        pollingTimeout = setTimeout(pollBlock, 5000);
      };

      pollBlock();
    }

    return () => {
      if (pollingTimeout) clearTimeout(pollingTimeout);
    };
  }, [isScanning, mode]);

  const clearFeed = useCallback(() => {
    setTransactions([]);
    setActiveMintsCount(0);
  }, []);

  return {
    transactions,
    isScanning,
    blocksScanned,
    activeMintsCount,
    latestBlock,
    status,
    tps,
    toggleScanning: useAppContext().toggleScanning,
    clearFeed
  };
}
