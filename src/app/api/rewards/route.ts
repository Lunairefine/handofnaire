import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userAddress = searchParams.get("userAddress");

  if (!userAddress) {
    return NextResponse.json(
      { error: "Missing userAddress" },
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
  const url = `${baseUrl}/v3/rewards?user=${userAddress}`;

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
