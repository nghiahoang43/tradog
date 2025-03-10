"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlpacaQuote } from "@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2";
import { useEffect, useState, useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { debounce } from "lodash";
import { useBotId } from "@/hooks/useBotId";
import { toast } from "sonner";
import { useConvex } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

const orderFormSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  amount: z.coerce.number().min(1),
  takeProfit: z.coerce.number(),
  stopLoss: z.coerce.number(),
});

const OrderPanel = () => {
  const botId = useBotId();
  const client = useConvex();
  const form = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      symbol: "",
      amount: 1,
      takeProfit: 0,
      stopLoss: 0,
    },
  });

  const [marketPrice, setMarketPrice] = useState(0);

  const getAsset = async (symbol: string) => {
    if (!symbol) return;

    try {
      const response = await fetch(`/api/alpaca/asset?symbol=${symbol}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data: { quote: AlpacaQuote } = await response.json();
      if (response.ok) {
        setMarketPrice(data.quote.AskPrice);
      }
    } catch (error) {
      console.error("Error fetching asset:", error);
    }
  };

  // Debounce function to delay API calls
  const debouncedGetAsset = useCallback(
    debounce((symbol) => getAsset(symbol), 100),
    []
  );

  // Listen for changes in `symbol` field
  useEffect(() => {
    const subscription = form.watch(({ symbol }) => {
      if (symbol) {
        debouncedGetAsset(symbol.toUpperCase());
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch, debouncedGetAsset]);

  function onSubmit(values: z.infer<typeof orderFormSchema>) {
    // if (!Number.isInteger(values.amount)) {
    //   toast.error("Invalid amount");
    //   return;
    // }
    if (
      values.takeProfit !== 0 &&
      values.takeProfit <= marketPrice * values.amount
    ) {
      toast.error("Invalid take profit value");
      return;
    }
    if (
      values.takeProfit !== 0 &&
      values.stopLoss >= marketPrice * values.amount
    ) {
      toast.error("Invalid stop loss value");
      return;
    }
    const createOrder = async () => {
      try {
        const response = await fetch("/api/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            symbol: values.symbol,
            amount: values.amount,
            type: values.symbol.includes("/USD") ? "crypto" : "stock",
          }),
        });

        const data = await response.json();

        if (!data.success) {
          toast.error("Failed to create asset");
          return;
        }
        let targetId = null;
        const target = await client.query(api.target.getBySymbol, {
          botId,
          symbol: values.symbol,
        });
        targetId = target?._id;

        if (!target) {
          targetId = await client.mutation(api.assets.create, {
            botId,
            symbol: values.symbol,
            type: values.symbol.includes("/USD") ? "crypto" : "stock",
          });
        }

        if (data.order && targetId) {
          // Handle successful order
          const orderId = await client.mutation(api.orders.create, {
            type: "market",
            targetId,
            amount: values.amount,
            alpacaOrderId: data.order.id,
            tp: values.takeProfit,
            sl: values.stopLoss,
            side: "buy",
          });
        }

        toast.success("Order placed successfully");
        form.reset();
      } catch (error) {
        console.error("Error creating asset:", error);
        toast.error("Failed to create asset");
      }
    };

    createOrder();
  }

  return (
    <Card className="w-full p-5">
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="symbol">Symbol</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="TSLA"
                    id="symbol"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between w-full">
            <span className="font-medium text-sm">Market Price</span>
            <span className="font-medium text-sm">${marketPrice}</span>
          </div>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="amount">{"Amount (USD)"}</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    id="amount"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between w-full pb-4">
            <span className="font-medium text-sm">Estimated cost</span>
            <span className="font-medium text-sm">
              ${(marketPrice * form.watch("amount")).toFixed(2)}
            </span>
          </div>
          <div className="flex w-full items-center gap-1.5 pb-4">
            <div className="w-[50%]">
              <FormField
                control={form.control}
                name="takeProfit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-500" htmlFor="takeProfit">
                      Take profit
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        id="takeProfit"
                        type="number"
                        min={0}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[50%]">
              <FormField
                control={form.control}
                name="stopLoss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-500" htmlFor="stopLoss">
                      Stop Loss
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        id="stopLoss"
                        type="number"
                        min={0}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button
            className="w-full"
            disabled={form.getValues()["symbol"].length === 0}
          >
            Add target
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default OrderPanel;
