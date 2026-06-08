export type AddressTokenBalance = {
  address: string;
  chainId: number;
  decimals: number;
  displaySymbol?: string;
  icon?: string;
  id: string;
  isNative?: boolean;
  isTest?: boolean;
  name?: string;
  price?: number;
  priceSource?: string;
  symbol?: string;
  type?: string;
  updatedAt?: number;
  verified?: boolean;
  balance: string;
};

export const isValidAddress = (value: string) =>
  /^0x[a-fA-F0-9]{40}$/.test(value.trim());

const isTokenBalance = (value: unknown): value is AddressTokenBalance => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.address === "string" &&
    typeof candidate.balance === "string" &&
    typeof candidate.decimals === "number"
  );
};

export const extractTokenBalances = (payload: unknown): AddressTokenBalance[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isTokenBalance);
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const envelope = payload as {
    data?: unknown;
    result?: unknown;
    balances?: unknown;
    items?: unknown;
  };
  const nested =
    envelope.data ?? envelope.result ?? envelope.balances ?? envelope.items;

  return Array.isArray(nested) ? nested.filter(isTokenBalance) : [];
};

export const getErrorMessage = (payload: unknown, fallback: string) => {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const candidate = payload as Record<string, unknown>;
  return typeof candidate.error === "string" ? candidate.error : fallback;
};

export const parseTokenBalance = (raw: string, decimals: number) => {
  if (!raw) {
    return 0;
  }

  try {
    const value = BigInt(raw);
    const base = BigInt(10) ** BigInt(decimals || 0);
    const whole = value / base;
    const fraction = value % base;
    const fractionString = fraction
      .toString()
      .padStart(decimals || 0, "0")
      .slice(0, 8);

    return Number(`${whole.toString()}.${fractionString || "0"}`);
  } catch {
    const fallback = Number(raw) / Math.pow(10, decimals || 0);
    return Number.isFinite(fallback) ? fallback : 0;
  }
};

export const isZeroBalance = (raw: string) => {
  if (!raw) {
    return true;
  }

  try {
    return BigInt(raw) === BigInt(0);
  } catch {
    return Number(raw) === 0;
  }
};

export const formatTokenAmount = (raw: string, decimals: number) => {
  if (!raw) return "0";

  try {
    const value = BigInt(raw);
    const base = BigInt(10) ** BigInt(decimals || 0);
    const whole = value / base;
    const fraction = value % base;
    const fractionString = fraction
      .toString()
      .padStart(decimals || 0, "0")
      .slice(0, 4)
      .replace(/0+$/, "");

    return fractionString ? `${whole.toString()}.${fractionString}` : whole.toString();
  } catch {
    const fallback = Number(raw) / Math.pow(10, decimals || 0);
    return Number.isFinite(fallback) ? fallback.toFixed(4) : raw;
  }
};

export const formatUsd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value >= 100 ? 0 : 2,
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value);

export const getTokenUsdValue = (token: AddressTokenBalance) =>
  parseTokenBalance(token.balance, token.decimals) * (token.price || 0);

export const buildHoldingsSummary = (tokens: AddressTokenBalance[]) => {
  const nativeAsset =
    tokens.find((token) => token.isNative && !isZeroBalance(token.balance)) || null;
  const visibleTokens = tokens.filter((token) => {
    if (token.isNative) {
      return false;
    }

    if (isZeroBalance(token.balance)) {
      return false;
    }

    return typeof token.price === "number" && getTokenUsdValue(token) > 0;
  });
  const sortedTokens = [...visibleTokens].sort((left, right) => {
    if (left.isNative && !right.isNative) {
      return -1;
    }

    if (!left.isNative && right.isNative) {
      return 1;
    }

    const usdDelta = getTokenUsdValue(right) - getTokenUsdValue(left);
    if (usdDelta !== 0) {
      return usdDelta;
    }

    return (
      parseTokenBalance(right.balance, right.decimals) -
      parseTokenBalance(left.balance, left.decimals)
    );
  });
  return {
    nativeAsset,
    sortedTokens,
  };
};
