import { NextResponse } from "next/server";
import alpacaClient from "@/lib/alpacaClient";

// API Route to Buy Tesla Stock (TSLA)
export async function POST(req: Request) {
  try {
    const { symbol, quantity } = await req.json(); // Get quantity from request

    // check if symbol is valid
    const asset = await alpacaClient.getAsset(symbol);
    if (!asset) {
      return NextResponse.json(
        { success: false, error: "Invalid symbol" },
        { status: 400 }
      );
    }

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid quantity" },
        { status: 400 }
      );
    }

    // Place a market order to buy Tesla stock (TSLA)
    const order = await alpacaClient.createOrder({
      symbol: symbol,
      qty: quantity,
      side: "buy",
      type: "market",
      time_in_force: "gtc",
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
