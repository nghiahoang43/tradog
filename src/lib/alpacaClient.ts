import Alpaca from "@alpacahq/alpaca-trade-api";

const client = new Alpaca({
  keyId: process.env.ALPACA_API_KEY!,
  secretKey: process.env.ALPACA_SECRET_KEY!,
  paper: true,
});

export default client;
