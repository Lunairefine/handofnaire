'use client';

import React, { useState } from 'react';
import { useMintScanner } from '@/hooks/useMintScanner';
import { getContractMetadata } from '@/services/rpc';
import { getContractSourceCode } from '@/services/blockExplorer';
import { extractSolidityFunction } from '@/parser/solidity';
import { ContractMetadata, MintTransaction } from '@/types';
import ScannerStats from '@/app/erc20/components/ScannerStats';
import LiveFeed from '@/app/erc20/components/LiveFeed';
import ContractDetails from '@/app/erc20/components/ContractDetails';
import CodeViewer from '@/app/erc20/components/CodeViewer';
import { useAppContext } from '@/app/components/AppContext';
import { NETWORK_CONFIG } from '@/services/networkConfig';
import NetworkSelector from '@/app/components/NetworkSelector';

export default function ERC20ScannerPage() {
  const {
    transactions,
    blocksScanned,
    activeMintsCount,
    latestBlock,
    status,
    tps,
    clearFeed,
    blockContractTemporarily,
    unblockContract,
    temporaryBlockedContracts,
    isScanning,
    toggleScanning
  } = useMintScanner('ERC20');

  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState<MintTransaction | null>(null);
  const [metadata, setMetadata] = useState<ContractMetadata | null>(null);
  const [solidityCode, setSolidityCode] = useState<string>('');
  
  const [isLoadingMetadata, setIsLoadingMetadata] = useState<boolean>(false);
  const [isLoadingCode, setIsLoadingCode] = useState<boolean>(false);

  const { activeNetwork, customRpcUrl } = useAppContext();
  const networkConfig = NETWORK_CONFIG[activeNetwork] || NETWORK_CONFIG.ethereum;

  const handleSelectContract = async (tx: MintTransaction) => {
    setSelectedTx(tx);
    const address = tx.contractAddress;
    const mintType = tx.mintType;
    setSelectedAddress(address);
    
    const priceGuess = tx.mintPrice || '0.05';

    setIsLoadingMetadata(true);
    setIsLoadingCode(true);

    try {
      const meta = await getContractMetadata(address, priceGuess, customRpcUrl || networkConfig.rpcUrl);
      setMetadata(meta);
      setIsLoadingMetadata(false);

      const source = await getContractSourceCode(address, meta.name, mintType, tx.functionName, networkConfig.blockscoutApiUrl);
      const mintFunction = extractSolidityFunction(source, tx.functionName || 'mint');
      setSolidityCode(mintFunction);
    } catch (e) {
      console.error(e);
      setMetadata({
        address,
        name: 'Unknown ERC20 Token',
        symbol: '???',
        totalSupply: '0',
        maxSupply: '0',
        mintPrice: priceGuess,
        owner: address,
        mintStatus: 'Active',
        availableMint: '0',
        isOwnable: false,
        isPausable: false,
        isERC721A: false,
        hasMerkleWhitelist: false
      });
      setSolidityCode('// Source code not verified on block explorer\n// Function signature: ' + tx.functionName);
    } finally {
      setIsLoadingMetadata(false);
      setIsLoadingCode(false);
    }
  };

  return (
    <>
      <div className="mb-5 flex justify-end">
        <NetworkSelector />
      </div>
      <ScannerStats
        latestBlock={latestBlock}
        blocksScanned={blocksScanned}
        activeMintsCount={activeMintsCount}
        tps={tps}
        status={status}
        mode="ERC20"
        toggleScanning={toggleScanning}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6">
        <div className="lg:col-span-7">
          <LiveFeed
            transactions={transactions}
            selectedAddress={selectedAddress}
            onSelectContract={handleSelectContract}
            onClearFeed={clearFeed}
            onBlockContract={blockContractTemporarily}
            blockedContracts={temporaryBlockedContracts}
            onUnblockContract={unblockContract}
            mode="ERC20"
          />
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <ContractDetails
            metadata={metadata}
            selectedTx={selectedTx}
            isLoading={isLoadingMetadata}
            mode="ERC20"
          />
          <CodeViewer
            solidityCode={solidityCode}
            contractName={metadata?.name || ''}
            isLoading={isLoadingCode}
          />
        </div>
      </div>
    </>
  );
}
