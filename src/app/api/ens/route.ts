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

const normalizeUrl = (url: string | null, name: string) => {
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
    const apiKey = process.env.BLOCKSCOUT_API_KEY || "";
    const addressUrl = `${process.env.BLOCKSCOUT_API_BASE_URL}/${process.env.BLOCKSCOUT_CHAIN_ID}/api/v2/addresses/${address}`;
    
    const [rawEnsName, addressInfoRes] = await Promise.all([
      getEnsName(client, { address: address as Address }),
      fetch(`${addressUrl}${apiKey ? `?apikey=${apiKey}` : ""}`, { cache: "no-store" })
    ]);

    let addressType: "EOA" | "CONTRACT" = "EOA";
    let isVerified = false;

    if (addressInfoRes.ok) {
      const info = await addressInfoRes.json();
      // Blockscout v2 typically uses "is_contract" and "is_verified"
      addressType = info.is_contract ? "CONTRACT" : "EOA";
      isVerified = !!info.is_verified;
    }

    if (!rawEnsName) {
      return NextResponse.json({
        ensName: null,
        ensAvatar: null,
        ensBanner: null,
        addressType,
        isVerified,
      });
    }

    const normalizedEnsName = normalize(rawEnsName);
    let ensAvatar: string | null = null;
    let ensBanner: string | null = null;

    try {
      const [resolvedAvatar, resolvedBanner] = await Promise.all([
        withTimeout(
          getEnsAvatar(client, {
            name: normalizedEnsName,
          }),
          ENS_TIMEOUT_MS
        ),
        withTimeout(
          getEnsText(client, {
            name: normalizedEnsName,
            key: "header", // Standard ENS header/banner key
          }),
          ENS_TIMEOUT_MS
        ).then(res => res || withTimeout(
          getEnsText(client, {
            name: normalizedEnsName,
            key: "banner",
          }),
          ENS_TIMEOUT_MS
        ))
      ]);

      ensAvatar = normalizeUrl(resolvedAvatar, normalizedEnsName) || 
                  (resolvedAvatar ? buildMetadataAvatarUrl(normalizedEnsName) : null);
      ensBanner = normalizeUrl(resolvedBanner, normalizedEnsName);
    } catch {
      // Silently fail records fetch
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
