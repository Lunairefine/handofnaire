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

const signatureCache = new Map<string, string>();

/**
 * Resolves a function signature from a contract's verified ABI or OpenChain database.
 */
export async function resolveFunctionSignature(address: string, selector: string): Promise<string | null> {
  if (signatureCache.has(selector)) return signatureCache.get(selector)!;
  
  try {
    const url = `https://eth.blockscout.com/api/v2/smart-contracts/${address}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.abi) {
      const { ethers } = await import('ethers');
      const abi = typeof data.abi === 'string' ? JSON.parse(data.abi) : data.abi;
      const iface = new ethers.Interface(abi);
      
      const func = iface.getFunction(selector);
      if (func) {
        const signature = func.format('minimal').replace('function ', '');
        signatureCache.set(selector, signature);
        return signature;
      }
    }
  } catch (error) {
    console.error(`Failed to resolve ABI for ${address}:`, error);
  }
  
  // Fallback to openchain signature database
  try {
    const res = await fetch(`https://api.openchain.xyz/signature-database/v1/lookup?function=${selector}&filter=true`);
    const data = await res.json();
    if (data.ok && data.result?.function?.[selector]?.[0]?.name) {
      const name = data.result.function[selector][0].name;
      signatureCache.set(selector, name);
      return name;
    }
  } catch (error) {
    console.error('Failed to fetch from OpenChain:', error);
  }
  
  return null;
}
