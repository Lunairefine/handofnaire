import { useState, useEffect, useRef, useCallback } from 'react';
import { ethers } from 'ethers';
import { MintTransaction } from '@/types';
import { detectMintFunction, analyzeMintType } from '@/parser/abi';
import { useAppContext } from '@/app/components/AppContext';
import { NETWORK_CONFIG } from '@/services/networkConfig';
import { resolveFunctionSignature } from '@/services/blockExplorer';

const PERMANENTLY_BLOCKED_CONTRACTS = new Set([
  '0xbd216513d74c8cf14cf4747e6aaa6420ff64ee9e', // uniswapv4
  '0x1ef615c7d6b02fd05acff1572951f5cd0e342d93', // slipstream
]);

const ZERO_TOPIC = `0x${'0'.repeat(64)}`;
const TRANSFER_TOPIC = ethers.id('Transfer(address,address,uint256)');
const TRANSFER_SINGLE_TOPIC = ethers.id('TransferSingle(address,address,address,uint256,uint256)');
const TRANSFER_BATCH_TOPIC = ethers.id('TransferBatch(address,address,address,uint256[],uint256[])');
const CONSECUTIVE_TRANSFER_TOPIC = ethers.id('ConsecutiveTransfer(uint256,uint256,address,address)');

export function useMintScanner(mode: string = 'ERC721') {
  const { isScanning, setIsScanning, customRpcUrl, activeNetwork } = useAppContext();
  const [transactions, setTransactions] = useState<MintTransaction[]>([]);
  const [blocksScanned, setBlocksScanned] = useState<number>(0);
  const [activeMintsCount, setActiveMintsCount] = useState<number>(0);
  const [latestBlock, setLatestBlock] = useState<number>(0);
  const [status, setStatus] = useState<string>('Initializing...');
  const [tps, setTps] = useState<number>(0);
  const [temporaryBlockedContracts, setTemporaryBlockedContracts] = useState<string[]>([]);

  const scannedTxHashes = useRef<Set<string>>(new Set());
  const lastBlockRef = useRef<number>(0);
  const isScanningRef = useRef<boolean>(isScanning);
  const temporaryBlockedContractsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    isScanningRef.current = isScanning;
  }, [isScanning]);

  const blockContractTemporarily = useCallback((address: string) => {
    const normalizedAddress = address.toLowerCase();
    temporaryBlockedContractsRef.current.add(normalizedAddress);
    setTemporaryBlockedContracts(Array.from(temporaryBlockedContractsRef.current));
    setTransactions(prev => {
      const filtered = prev.filter(tx => tx.contractAddress.toLowerCase() !== normalizedAddress);
      setActiveMintsCount(new Set(filtered.map(tx => tx.contractAddress)).size);
      return filtered;
    });
  }, []);

  const unblockContract = useCallback((address: string) => {
    temporaryBlockedContractsRef.current.delete(address.toLowerCase());
    setTemporaryBlockedContracts(Array.from(temporaryBlockedContractsRef.current));
  }, []);

  // Reset scanning status when moving between routes
  useEffect(() => {
    setIsScanning(false);
    return () => {
      setIsScanning(false);
    };
  }, [setIsScanning]);

  useEffect(() => {
    lastBlockRef.current = 0;
    scannedTxHashes.current.clear();
    setTransactions([]);
    setBlocksScanned(0);
    setActiveMintsCount(0);
    setLatestBlock(0);
    setStatus('Initializing...');
  }, [activeNetwork, mode]);

  useEffect(() => {
    let pollingTimeout: NodeJS.Timeout;
    let isActive = true;

    if (isScanning) {
      setTimeout(() => { if (isActive) setStatus('Connecting...') }, 0);

      const networkRpc = NETWORK_CONFIG[activeNetwork]?.rpcUrl || NETWORK_CONFIG.ethereum.rpcUrl;
      const rpcUrl = customRpcUrl || networkRpc;
      const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, { staticNetwork: true });

      const pollBlock = async () => {
        if (!isActive) return;
        try {
          const blockNumber = await provider.getBlockNumber();
          setLatestBlock(blockNumber);
          
          if (blockNumber > lastBlockRef.current) {
            const prevBlock = lastBlockRef.current;
            let scanCompleted = true;
            
            const startScan = prevBlock === 0 ? Math.max(0, blockNumber - 20) : prevBlock + 1;
            const endScan = blockNumber;

            for (let b = startScan; b <= endScan; b++) {
              if (!isActive) break;
              setStatus('Scanning...');
              
              const topics = mode === 'ERC721'
                ? [[TRANSFER_TOPIC, TRANSFER_SINGLE_TOPIC, TRANSFER_BATCH_TOPIC, CONSECUTIVE_TRANSFER_TOPIC]]
                : [[TRANSFER_TOPIC]];

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
                  scanCompleted = false;
                  break;
                }
                throw err;
              }

              if (!isActive) break;

              if (logs.length === 0) {
                console.log(`No mint logs found in block #${b}`);
                continue;
              }

              const mintLogs = logs.filter(log => {
                const eventTopic = log.topics[0];

                if (eventTopic === TRANSFER_TOPIC) {
                  return log.topics[1] === ZERO_TOPIC;
                }

                if (mode === 'ERC721' && (eventTopic === TRANSFER_SINGLE_TOPIC || eventTopic === TRANSFER_BATCH_TOPIC)) {
                  return log.topics[2] === ZERO_TOPIC;
                }

                return mode === 'ERC721' && eventTopic === CONSECUTIVE_TRANSFER_TOPIC && log.topics[3] === ZERO_TOPIC;
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
              if (!isActive) break;
              const newTxs: MintTransaction[] = [];
              const uniqueHashes = Array.from(txHashToLogs.keys());

              const BATCH_SIZE = 5;
              for (let i = 0; i < uniqueHashes.length; i += BATCH_SIZE) {
                if (!isActive) break;
                const batch = uniqueHashes.slice(i, i + BATCH_SIZE);
                await Promise.all(batch.map(async (hash) => {
                  try {
                    if (!isActive) return;
                    if (scannedTxHashes.current.has(hash)) return;

                    const tx = await provider.getTransaction(hash);
                    if (!isActive || !tx) return;

                    const logsForTx = txHashToLogs.get(hash)!;
                    const quantity = logsForTx.length;
                    const contractAddress = ethers.getAddress(logsForTx[0].address);
                    const normalizedContractAddress = contractAddress.toLowerCase();
                    if (
                      PERMANENTLY_BLOCKED_CONTRACTS.has(normalizedContractAddress) ||
                      temporaryBlockedContractsRef.current.has(normalizedContractAddress)
                    ) return;
                    scannedTxHashes.current.add(hash);

                    const ethValue = ethers.formatEther(tx.value);
                    const priceVal = parseFloat(ethValue) / quantity;
                    
                    const detection = detectMintFunction(tx.data);
                    let functionName = detection.functionName;
                    const selector = detection.selector;
                    
                    if (functionName.startsWith('Unknown') && tx.to && tx.to !== '0x') {
                      const networkConfig = NETWORK_CONFIG[activeNetwork] || NETWORK_CONFIG.ethereum;
                      const resolved = await resolveFunctionSignature(tx.to, selector, networkConfig.blockscoutApiUrl);
                      if (!isActive) return;
                      if (resolved) {
                        functionName = resolved;
                      }
                    }
                    
                    const mintType = analyzeMintType(functionName, tx.value, tx.from);
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
            if (scanCompleted) {
              lastBlockRef.current = blockNumber;
              setStatus('Monitoring');
            }
          }
        } catch (error: unknown) {
          console.error('RPC Error details:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          setStatus('Retrying...');
        }
        if (isActive) {
          pollingTimeout = setTimeout(pollBlock, 5000);
        }
      };

      pollBlock();
    }

    return () => {
      isActive = false;
      if (pollingTimeout) clearTimeout(pollingTimeout);
    };
  }, [isScanning, mode, activeNetwork, customRpcUrl]);

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
    temporaryBlockedContracts,
    blockContractTemporarily,
    unblockContract,
    toggleScanning: useAppContext().toggleScanning,
    clearFeed
  };
}
