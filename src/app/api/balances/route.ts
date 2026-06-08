import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chainId = searchParams.get("chainId");
  const userAddress = searchParams.get("userAddress");

  if (!chainId || !userAddress) {
    return NextResponse.json(
      { error: "Missing chainId or userAddress" },
      { status: 400 }
    );
  }

  const baseUrl = process.env.API_URL_SCAN;
  if (!baseUrl) {
    return NextResponse.json(
      { error: "Missing API_URL_SCAN" },
      { status: 500 }
    );
  }
  const url = `${baseUrl}/v4/tokens/balances?chainId=${chainId}&userAddress=${userAddress}`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${response.status}` },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upstream error" },
      { status: 500 }
    );
  }
}
