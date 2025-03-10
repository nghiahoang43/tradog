import { NextResponse } from "next/server";
import alpacaClient from "@/lib/alpacaClient";

export async function GET() {
  const assets = await alpacaClient.getAssets();
  return NextResponse.json(assets);
}
