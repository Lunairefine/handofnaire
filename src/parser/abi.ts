import { ethers } from 'ethers';

export const MINT_SIGNATURES: Record<string, string> = {
  '0xa0712d68': 'mint(uint256)',
  '0x1249c5b2': 'mint()',
  '0x40c10f19': 'mint(address,uint256)',
  '0x84bb1e89': 'safeMint(address,uint256)',
  '0x82c8dc82': 'safeMint(address,uint256,bytes)',
  '0x94b918de': 'publicMint(uint256)',
  '0x2e1a7d4d': 'claim(address,uint256)',
  '0x4e71d92d': 'claim()',
  '0x9b3240e8': 'whitelistMint(uint256,bytes32[])',
  '0xefef39a1': 'buy(uint256)',
  '0xb89de2a3': 'mintNFT(uint256)',
  '0x9bcfd25d': 'publicMint()',
  '0x3d0b2dbb': 'claimNFT(uint256)',
};

export const OTHER_SIGNATURES: Record<string, string> = {
  '0xa9059cbb': 'transfer(address,uint256)',
  '0x23b872dd': 'transferFrom(address,address,uint256)',
  '0x42842e0e': 'safeTransferFrom(address,address,uint256)',
  '0xb88d4fde': 'safeTransferFrom(address,address,uint256,bytes)',
  '0x3593564c': 'execute(bytes,bytes[])',
  '0xb15112a0': 'execute(bytes,bytes[],uint256)',
  '0x11132000': 'batchMint(address[],uint256[])',
  '0x722713f7': 'airdrop(address[],uint256[])',
  '0xd0e30db0': 'deposit()',
  '0x2e1a7d4d': 'withdraw(uint256)'
};

/**
 * Detects if a transaction is a mint transaction based on the first 4 bytes of input data.
 * @param input The transaction data hex string (tx.data)
 */
export function detectMintFunction(input: string): { isMint: boolean; selector: string; functionName: string } {
  if (!input || input === '0x' || input.length < 10) {
    return { isMint: false, selector: '0x', functionName: 'Fallback/Transfer' };
  }

  const selector = input.substring(0, 10).toLowerCase();
  
  if (MINT_SIGNATURES[selector]) {
    return {
      isMint: true,
      selector,
      functionName: MINT_SIGNATURES[selector],
    };
  }

  if (OTHER_SIGNATURES[selector]) {
    return {
      isMint: false,
      selector,
      functionName: OTHER_SIGNATURES[selector],
    };
  }

  return { isMint: false, selector, functionName: `Unknown (${selector})` };
}

/**
 * Decodes the quantity and recipient from mint transaction data
 * @param input The transaction data hex string
 * @param selector The 4-byte selector
 */
export function decodeMintInput(input: string, selector: string): { quantity: number; recipient: string } {
  try {
    const signature = MINT_SIGNATURES[selector];
    if (!signature) return { quantity: 1, recipient: '' };

    const iface = new ethers.Interface([`function ${signature}`]);
    const decoded = iface.decodeFunctionData(signature.split('(')[0], input);

    let quantity = 1;
    let recipient = '';

    if (signature.includes('uint256')) {
      for (const key of Object.keys(decoded)) {
        if (typeof decoded[key] === 'bigint' || typeof decoded[key] === 'number') {
          quantity = Number(decoded[key]);
          break;
        }
      }
    }

    if (signature.includes('address')) {
      for (const key of Object.keys(decoded)) {
        if (typeof decoded[key] === 'string' && decoded[key].startsWith('0x')) {
          recipient = decoded[key];
          break;
        }
      }
    }

    if (quantity <= 0 || quantity > 10000) {
      quantity = 1;
    }

    return { quantity, recipient };
  } catch {
    return { quantity: 1, recipient: '' };
  }
}

/**
 * Analyzes the type of mint based on function name, transaction value, and sender.
 */
export function analyzeMintType(
  functionName: string,
  txValue: bigint,
  sender: string,
  ownerAddress?: string
): 'public' | 'whitelist' | 'owner' | 'free' | 'paid' {
  const nameLower = functionName.toLowerCase();
  
  if (ownerAddress && sender.toLowerCase() === ownerAddress.toLowerCase()) {
    return 'owner';
  }
  
  if (nameLower.includes('whitelist') || nameLower.includes('presale') || nameLower.includes('merkle')) {
    return 'whitelist';
  }

  if (nameLower.includes('owner') || nameLower.includes('admin')) {
    return 'owner';
  }

  if (txValue === BigInt(0)) {
    if (nameLower.includes('public')) {
      return 'public';
    }
    return 'free';
  }

  return 'paid';
}
