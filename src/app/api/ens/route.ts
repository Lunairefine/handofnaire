import { NextResponse } from "next/server";
import { type Address, createPublicClient, http, isAddress } from "viem";
import { mainnet } from "viem/chains";
import { getEnsAvatar, getEnsName, getEnsText, normalize } from "viem/ens";

const client = createPublicClient({
  chain: mainnet,
  transport: http(process.env.ENS_RPC_URL || "https://eth.llamarpc.com"),
});

const buildMetadataAvatarUrl = (name: string) =>
  `https://metadata.ens.domains/mainnet/avatar/${encodeURIComponent(
    normalize(name)
  )}`;

const ENS_TIMEOUT_MS = 2500;

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<null>((resolve) => {
        timeoutId = setTimeout(() => resolve(null), timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

const normalizeUrl = (url: string | null) => {
  if (!url) {
    return null;
  }

  if (url.startsWith("ipfs://")) {
    const assetPath = url
      .slice("ipfs://".length)
      .replace(/^ipfs\//, "");
    return `https://ipfs.io/ipfs/${assetPath}`;
  }

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:")
  ) {
    return url;
  }

  return null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address || !isAddress(address)) {
    return NextResponse.json(
      { error: "Missing or invalid address" },
      { status: 400 }
    );
  }

  try {
    const apiBaseUrl = process.env.BLOCKSCOUT_API_BASE_URL || "https://eth.blockscout.com";
    const chainId = process.env.BLOCKSCOUT_CHAIN_ID || "1";
    const apiKey = process.env.BLOCKSCOUT_API_KEY || "";

    const basePath = process.env.BLOCKSCOUT_API_BASE_URL ? `${apiBaseUrl}/${chainId}` : apiBaseUrl;
    const addressUrl = `${basePath}/api/v2/addresses/${address}`;
    
    const [rawEnsName, addressInfoRes] = await Promise.all([
      withTimeout(
        getEnsName(client, { address: address as Address }),
        ENS_TIMEOUT_MS
      ).catch(() => null),
      fetch(`${addressUrl}${apiKey ? `?apikey=${apiKey}` : ""}`, { cache: "no-store" }).catch(() => null)
    ]);

    let addressType: "EOA" | "CONTRACT" = "EOA";
    let isVerified = false;
    let blockscoutEnsName: string | null = null;

    if (addressInfoRes && addressInfoRes.ok) {
      const info = await addressInfoRes.json();
      addressType = info.is_contract ? "CONTRACT" : "EOA";
      isVerified = !!info.is_verified;
      blockscoutEnsName = info.ens_domain_name || null;
    }

    const finalEnsName = rawEnsName || blockscoutEnsName;

    if (!finalEnsName) {
      return NextResponse.json({
        ensName: null,
        ensAvatar: null,
        ensBanner: null,
        addressType,
        isVerified,
      });
    }

    const normalizedEnsName = normalize(finalEnsName);
    let ensAvatar: string | null = null;
    let ensBanner: string | null = null;

    try {
      const resolvedAvatar = await withTimeout(
        getEnsAvatar(client, {
          name: normalizedEnsName,
        }),
        ENS_TIMEOUT_MS
      ).catch(() => null);

      ensAvatar = normalizeUrl(resolvedAvatar);
    } catch {
    }

    if (!ensAvatar) {
      ensAvatar = buildMetadataAvatarUrl(normalizedEnsName);
    }

    try {
      const resolvedBanner = await withTimeout(
        getEnsText(client, {
          name: normalizedEnsName,
          key: "header", 
        }),
        ENS_TIMEOUT_MS
      ).then(res => res || withTimeout(
        getEnsText(client, {
          name: normalizedEnsName,
          key: "banner",
        }),
        ENS_TIMEOUT_MS
      )).catch(() => null);

      ensBanner = normalizeUrl(resolvedBanner);
    } catch {
    }

    return NextResponse.json({
      ensName: normalizedEnsName,
      ensAvatar,
      ensBanner,
      addressType,
      isVerified,
    });
  } catch {
    return NextResponse.json({
      ensName: null,
      ensAvatar: null,
      ensBanner: null,
      addressType: "EOA",
      isVerified: false,
    });
  }
}
