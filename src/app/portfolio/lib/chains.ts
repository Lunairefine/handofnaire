export type ChainOption = {
  id: number;
  name: string;
  logo: string;
  fallbackLabel: string;
};

export const makeLogo = (label: string, color: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="32" fill="${color}"/><text x="50%" y="52%" font-size="26" text-anchor="middle" font-family="ABC Monument Grotesk, sans-serif" fill="#0a0a0a" font-weight="700">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const SCAN_CHAINS: ChainOption[] = [
  {
    id: 1,
    name: "Ethereum",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
    fallbackLabel: "E",
  },
  {
    id: 42161,
    name: "Arbitrum",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png",
    fallbackLabel: "A",
  },
  {
    id: 10,
    name: "Optimism",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png",
    fallbackLabel: "O",
  },
  {
    id: 8453,
    name: "Base",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png",
    fallbackLabel: "B",
  },
  {
    id: 137,
    name: "Polygon",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
    fallbackLabel: "P",
  },
  {
    id: 59144,
    name: "Linea",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/linea/info/logo.png",
    fallbackLabel: "L",
  },
  {
    id: 534352,
    name: "Scroll",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/scroll/info/logo.png",
    fallbackLabel: "S",
  },
  {
    id: 81457,
    name: "Blast",
    logo: makeLogo("B", "#B8B8B8"),
    fallbackLabel: "B",
  },
  {
    id: 34443,
    name: "Mode",
    logo: makeLogo("M", "#B8B8B8"),
    fallbackLabel: "M",
  },
  {
    id: 5000,
    name: "Mantle",
    logo: makeLogo("M", "#B8B8B8"),
    fallbackLabel: "M",
  },
  {
    id: 324,
    name: "zkSync Era",
    logo: makeLogo("Z", "#B8B8B8"),
    fallbackLabel: "Z",
  },
  {
    id: 130,
    name: "Unichain",
    logo: makeLogo("U", "#B8B8B8"),
    fallbackLabel: "U",
  },
  {
    id: 57073,
    name: "Ink",
    logo: makeLogo("I", "#B8B8B8"),
    fallbackLabel: "I",
  },
  {
    id: 252,
    name: "Fraxtal",
    logo: makeLogo("F", "#B8B8B8"),
    fallbackLabel: "F",
  },
  {
    id: 56,
    name: "BNB Chain",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/info/logo.png",
    fallbackLabel: "B",
  },
  {
    id: 43114,
    name: "Avalanche",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png",
    fallbackLabel: "A",
  },
  {
    id: 100,
    name: "Gnosis",
    logo: makeLogo("G", "#B8B8B8"),
    fallbackLabel: "G",
  },
  {
    id: 42220,
    name: "Celo",
    logo: makeLogo("C", "#B8B8B8"),
    fallbackLabel: "C",
  },
  {
    id: 99901,
    name: "Elysium",
    logo: makeLogo("E", "#B8B8B8"),
    fallbackLabel: "E",
  },
  {
    id: 999,
    name: "HyperEVM",
    logo: makeLogo("H", "#B8B8B8"),
    fallbackLabel: "H",
  },
];
