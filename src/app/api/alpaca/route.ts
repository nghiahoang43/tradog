import client from "@/lib/alpacaClient";
import { createClient } from "@alpacahq/typescript-sdk";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const account = await client.getAccount();
  console.log(account.status);
  const clock = await client.getClock();

  return NextResponse.json(account);
}
