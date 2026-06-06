import { useState, useEffect, useRef, useCallback } from 'react';
import { ethers } from 'ethers';
import { MintTransaction } from '../types';
import { detectMintFunction, analyzeMintType } from '../parser/abi';
import { useAppContext } from '../app/components/AppContext';

export function useMintScanner(mode: string = 'ERC721') {
  const { isScanning } = useAppContext();
  const [transactions, setTransactions] = useState<MintTransaction[]>([]);
  const [blocksScanned, setBlocksScanned] = useState<number>(0);
  const [activeMintsCount, setActiveMintsCount] = useState<number>(0);
  const [latestBlock, setLatestBlock] = useState<number>(0);
  const [status, setStatus] = useState<string>('Initializing scanner...');
  const [tps, setTps] = useState<number>(0);

  const scannedTxHashes = useRef<Set<string>>(new Set());
  const lastBlockRef = useRef<number>(0);
  const isScanningRef = useRef<boolean>(isScanning);

  // Sync refs for interval closures
  useEffect(() => {
    isScanningRef.current = isScanning;
  }, [isScanning]);

  // Handle Live RPC Polling Loop
  useEffect(() => {
    let pollingTimeout: NodeJS.Timeout;

    if (isScanning) {
      setTimeout(() => setStatus(`Connecting to Ethereum Mainnet (${mode})...`), 0);
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.ankr.com/eth';
      const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, { staticNetwork: true });

      const pollBlock = async () => {
        try {
          const blockNumber = await provider.getBlockNumber();
          setLatestBlock(blockNumber);
          
          if (blockNumber > lastBlockRef.current) {
            const prevBlock = lastBlockRef.current;
            lastBlockRef.current = blockNumber;
            
            // On first run, we scan the current block and the previous one to show immediate results
            const startScan = prevBlock === 0 ? blockNumber - 1 : blockNumber;
            const endScan = blockNumber;

            for (let b = startScan; b <= endScan; b++) {
              setStatus(`Scanning block #${b}...`);
              
              const topics = mode === 'ERC721' ? [
                [
                  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // ERC-721 Transfer
                  '0xc3d58168c5ae7397731d063d5bbf3d65785442f3937666f3aec8580e0593f7b0', // ERC-1155 TransferSingle
                  '0x4a0b2308138e10cdd41602622944a335be9924aff02798d94e2163c4cdb18d8d'  // ERC-1155 TransferBatch
                ]
              ] : [
                [
                  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' // ERC-20 Transfer
                ]
              ];

              // 1. Fetch logs
              const logs = (await provider.getLogs({
                fromBlock: b,
                toBlock: b,
                topics
              })) as ethers.Log[];

              if (logs.length === 0) {
                console.log(`No mint logs found in block #${b}`);
                continue;
              }

              // Filter for from == address(0)
              const mintLogs = logs.filter(log => {
                const isTransfer = log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
                if (isTransfer) {
                  if (mode === 'ERC721') {
                    // ERC721 has 4 topics
                    return log.topics.length === 4 && log.topics[1] === '0x0000000000000000000000000000000000000000000000000000000000000000';
                  } else {
                    // ERC20 has 3 topics
                    return log.topics.length === 3 && log.topics[1] === '0x0000000000000000000000000000000000000000000000000000000000000000';
                  }
                }
                
                if (mode === 'ERC721') {
                  // ERC-1155 TransferSingle/Batch: from is topics[2]
                  return log.topics[2] === '0x0000000000000000000000000000000000000000000000000000000000000000';
                }

                return false;
              });

              if (mintLogs.length === 0) {
                console.log(`No zero-address mint logs found in block #${b}`);
                continue;
              }

              console.log(`Detected ${mintLogs.length} potential mints in block #${b}`);
              
              // Group logs by transaction hash
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

              // 2. Fetch transaction details for each mint hash
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
                    const functionName = detection.isMint ? detection.functionName : 'mint()';
                    const selector = detection.isMint ? detection.selector : (tx.data.length >= 10 ? tx.data.substring(0, 10) : '0x');
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
            setStatus(`Live. Synced to #${blockNumber}. Monitoring...`);
          }
        } catch (error: unknown) {
          console.error('RPC Error details:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          setStatus(`RPC Connection Issue: ${errorMessage}. Retrying...`);
        }
        
        // Schedule next poll
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
