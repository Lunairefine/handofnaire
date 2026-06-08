/**
 * Service to interact with the Etherscan API to fetch contract source code
 */

/**
 * Fetches contract source code from Etherscan
 * Returns a fallback message if not found or unverified.
 */
export async function getContractSourceCode(
  address: string,
  contractName: string,
  mintType: 'public' | 'whitelist' | 'owner' | 'free' | 'paid',
  functionName: string = 'mint'
): Promise<string> {
  try {
    let targetAddress = address;
    
    const url = `https://eth.blockscout.com/api/v2/smart-contracts/${targetAddress}`;
    const res = await fetch(url);
    const data = await res.json();

    let sourceCode = data.source_code;
    
    if (data.implementations && data.implementations.length > 0) {
      targetAddress = data.implementations[0].address_hash;
      const implUrl = `https://eth.blockscout.com/api/v2/smart-contracts/${targetAddress}`;
      const implRes = await fetch(implUrl);
      const implData = await implRes.json();
      if (implData.source_code) {
        sourceCode = implData.source_code;
      }
    }

    if (sourceCode) {
       return sourceCode;
    }
  } catch (error) {
    console.error('Failed to fetch from Blockscout:', error);
  }

  const cleanName = functionName.split('(')[0].replace(/[^a-zA-Z0-9_]/g, '').trim();
  return `// Method \`function ${cleanName}()\` is executed by this transaction,\n// but its exact implementation was not found in the verified contract source code.\n// The contract might be using inheritance, proxy interfaces, or delegate calls.`;
}
