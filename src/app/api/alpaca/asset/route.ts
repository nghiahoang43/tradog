import { NextResponse } from "next/server";
import client from "@/lib/alpacaClient";

// API Route to Buy Bitcoin
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol is required" },
        { status: 400 }
      );
    }
    const quote = await client.getLatestQuote(symbol);

    return NextResponse.json({ quote });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
