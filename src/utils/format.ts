/**
 * Shortens an Ethereum address to 0x1234...5678
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length < chars * 2 + 2) return address;
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

/**
 * Shortens a transaction hash
 */
export function shortenHash(hash: string, chars = 6): string {
  if (!hash) return '';
  if (hash.length < chars * 2 + 2) return hash;
  return `${hash.substring(0, chars + 2)}...${hash.substring(hash.length - chars)}`;
}

/**
 * Formats a timestamp into a readable duration or clock time (e.g., "10s ago" or "13:45:02")
 */
export function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  
  if (seconds < 60) {
    return seconds <= 0 ? 'just now' : `${seconds}s ago`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/**
 * Formats a numeric value or bigint into a nice readable format
 */
export function formatValue(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  if (num === 0) return '0';
  if (num < 0.001) return num.toFixed(6);
  if (num < 1) return num.toFixed(4);
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

import verifyContracts from './verifyContract.json';

/**
 * Returns a human-readable name and color for known contract addresses
 */
export function getKnownContract(address: string): { name: string; color: string } | null {
  if (!address) return null;
  const lowerAddress = address.toLowerCase();
  const contract = verifyContracts.find(
    (c: { name: string; address: string; color?: string }) => c.address.toLowerCase() === lowerAddress
  );
  return contract ? { name: contract.name, color: contract.color || 'text-blue-500' } : null;
}
