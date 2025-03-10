import { NextResponse } from "next/server";
import client from "@/lib/alpacaClient";

// API Route to Buy Bitcoin
export async function GET(req: Request) {
  try {
    // Place a market order to buy Bitcoin (BTC/USD)
    // const order = await client.createOrder({
    //   symbol: "BTC/USD", // Buying Bitcoin
    //   qty: quantity,
    //   side: "buy",
    //   type: "market", // Market order (executes at current price)
    //   time_in_force: "gtc", // Order remains until manually canceled
    // });

    const positions = await client.getPositions();

    return NextResponse.json({ success: true, positions });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
