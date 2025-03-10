import { NextResponse } from "next/server";
import client from "@/lib/alpacaClient";

// API Route to Buy Bitcoin
export async function POST(req: Request) {
  try {
    const { quantity } = await req.json(); // Get quantity from request

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid quantity" },
        { status: 400 }
      );
    }

    // Place a market order to buy Bitcoin (BTC/USD)
    const order = await client.createOrder({
      symbol: "BTC/USD", // Buying Bitcoin
      qty: quantity,
      side: "buy",
      type: "market", // Market order (executes at current price)
      time_in_force: "gtc", // Order remains until manually canceled
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
