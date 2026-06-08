import { NextResponse } from "next/server";
import { getBlockscoutHoldings } from "@/app/portfolio/lib/blockscout";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userAddress = searchParams.get("userAddress");

  if (!userAddress) {
    return NextResponse.json(
      { error: "Missing userAddress" },
      { status: 400 }
    );
  }

  try {
    const holdings = await getBlockscoutHoldings(userAddress);
    return NextResponse.json(holdings);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Gagal mengambil holdings dari Blockscout.",
      },
      { status: 500 }
    );
  }
}
