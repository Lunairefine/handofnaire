import { NextResponse } from "next/server";
import { getBlockscoutTransactions } from "@/app/portfolio/lib/blockscout";

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
    const transactions = await getBlockscoutTransactions(userAddress);
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Gagal mengambil transactions dari Blockscout.",
      },
      { status: 500 }
    );
  }
}
