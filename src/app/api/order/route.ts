import { NextResponse } from "next/server";
import client from "@/lib/alpacaClient";

export async function POST(req: Request) {
  try {
    const { symbol, amount, type } = await req.json();
    console.log(symbol, amount, type);

    // Validate required fields
    if (!symbol || !amount || !type) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Quantity must be greater than 0" },
        { status: 400 }
      );
    }

    if (!["stock", "crypto"].includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid asset type" },
        { status: 400 }
      );
    }

    const formattedSymbol = type === "crypto" ? `${symbol}/USD` : symbol;

    try {
      const asset = await client.getAsset(formattedSymbol);
      if (!asset) {
        return NextResponse.json(
          { success: false, error: "Invalid symbol" },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid symbol" },
        { status: 400 }
      );
    }

    const order = await client.createOrder({
      symbol: formattedSymbol,
      notional: amount,
      side: "buy",
      type: "limit",
      limit_price: 120,
      time_in_force: "day",
    });

    return NextResponse.json({
      success: true,
      order,
      asset: {
        symbol: formattedSymbol,
        amount,
        type,
      },
    });
  } catch (error) {
    console.error("Error creating asset:", JSON.stringify(error));
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
