import { isAddress } from "viem";
import { type AddressTokenBalance } from "@/app/portfolio/lib/holdings";

type BlockscoutConfig = {
  apiBaseUrl: string;
  apiKey: string;
  chainId: string;
};

type BlockscoutTokenInfo = {
  address_hash?: string;
  decimals?: string;
  exchange_rate?: string;
  icon_url?: string;
  name?: string;
  symbol?: string;
  type?: string;
};

type BlockscoutTokenBalanceItem = {
  token?: BlockscoutTokenInfo | null;
  token_id?: string | null;
  token_instance?: {
    token?: BlockscoutTokenInfo | null;
  } | null;
  value?: string;
};

type BlockscoutTransactionParty = {
  ens_domain_name?: string | null;
  hash?: string | null;
  name?: string | null;
};

export type BlockscoutTransaction = {
  block_number?: number;
  fee?: {
    value?: string;
  } | null;
  from?: BlockscoutTransactionParty | null;
  hash?: string;
  method?: string | null;
  result?: string | null;
  status?: string | null;
  timestamp?: string;
  to?: BlockscoutTransactionParty | null;
  value?: string;
};

type BlockscoutTransactionsResponse = {
  items?: BlockscoutTransaction[];
};

const getBlockscoutConfig = (): BlockscoutConfig => {
  const apiBaseUrl = process.env.BLOCKSCOUT_API_BASE_URL;
  const apiKey = process.env.BLOCKSCOUT_API_KEY;
  const chainId = process.env.BLOCKSCOUT_CHAIN_ID;

  if (!apiBaseUrl || !apiKey || !chainId) {
    throw new Error(
      "Missing Blockscout configuration. Set BLOCKSCOUT_API_BASE_URL, BLOCKSCOUT_CHAIN_ID, and BLOCKSCOUT_API_KEY in .env.local."
    );
  }

  return {
    apiBaseUrl: apiBaseUrl.replace(/\/$/, ""),
    apiKey,
    chainId,
  };
};

const buildAddressUrl = (
  address: string,
  resource: "token-balances" | "transactions"
) => {
  const { apiBaseUrl, apiKey, chainId } = getBlockscoutConfig();

  if (!isAddress(address)) {
    throw new Error("Address tidak valid.");
  }

  const url = new URL(
    `${apiBaseUrl}/${chainId}/api/v2/addresses/${address}/${resource}`
  );
  url.searchParams.set("apikey", apiKey);
  return url;
};

const getPreferredToken = (item: BlockscoutTokenBalanceItem) =>
  item.token_instance?.token || item.token || null;

const toNumber = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
};

const buildAddressDetailUrl = (address: string) => {
  const { apiBaseUrl, apiKey, chainId } = getBlockscoutConfig();
  const url = new URL(`${apiBaseUrl}/${chainId}/api/v2/addresses/${address}`);
  url.searchParams.set("apikey", apiKey);
  return url;
};

export async function getBlockscoutHoldings(address: string) {
  const config = getBlockscoutConfig();
  
  const [tokensRes, addressRes] = await Promise.all([
    fetch(buildAddressUrl(address, "token-balances"), { cache: "no-store" }),
    fetch(buildAddressDetailUrl(address), { cache: "no-store" })
  ]);

  if (!tokensRes.ok || !addressRes.ok) {
    throw new Error("Gagal mengambil data dari Blockscout.");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tokensPayload = (await tokensRes.json()) as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addressPayload = (await addressRes.json()) as any;

  const holdings: AddressTokenBalance[] = [];

  // Add native balance
  if (addressPayload && addressPayload.coin_balance) {
    holdings.push({
      address: "native",
      balance: addressPayload.coin_balance,
      chainId: Number(config.chainId),
      decimals: 18,
      displaySymbol: "ETH",
      id: "native-eth",
      isNative: true,
      name: "Ethereum",
      price: toNumber(addressPayload.exchange_rate),
      symbol: "ETH",
      verified: true,
    });
  }

  // Add token balances
  if (Array.isArray(tokensPayload)) {
    const tokens = tokensPayload
      .map((item) => item as BlockscoutTokenBalanceItem)
      .map((item) => {
        const token = getPreferredToken(item);
        const addressHash = token?.address_hash;

        if (!token || !addressHash || typeof item.value !== "string") {
          return null;
        }

        return {
          address: addressHash,
          balance: item.value,
          chainId: Number(config.chainId),
          decimals: Number(token.decimals || "0"),
          displaySymbol: token.symbol,
          icon: token.icon_url,
          id: `${addressHash}-${item.token_id || "blockscout"}`,
          name: token.name,
          price: toNumber(token.exchange_rate),
          symbol: token.symbol,
          type: token.type,
          verified: true,
        } satisfies AddressTokenBalance;
      })
      .filter((item): item is AddressTokenBalance => item !== null);
      
    holdings.push(...tokens);
  }

  return holdings;
}

export async function getBlockscoutTransactions(address: string) {
  const response = await fetch(buildAddressUrl(address, "transactions"), {
    cache: "no-store",
  });

  const payload = (await response.json()) as BlockscoutTransactionsResponse;

  if (!response.ok) {
    throw new Error("Gagal mengambil transactions dari Blockscout.");
  }

  return Array.isArray(payload.items) ? payload.items : [];
}
