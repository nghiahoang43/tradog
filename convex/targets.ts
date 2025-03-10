import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    botId: v.id("bots"),
    symbol: v.string(),
    type: v.union(v.literal("stock"), v.literal("crypto")),
  },
  handler: async (ctx, args) => {
    const bot = await ctx.db.get(args.botId);
    if (!bot) {
      throw new Error("Bot not found");
    }

    const assetId = await ctx.db.insert("targets", {
      botId: args.botId,
      symbol: args.symbol,
      type: args.type,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return assetId;
  },
});

export const getByBotId = query({
  args: {
    botId: v.id("bots"),
  },
  handler: async (ctx, args) => {
    const assets = await ctx.db
      .query("targets")
      .withIndex("botId", (q) => q.eq("botId", args.botId))
      .collect();

    return assets || [];
  },
});

export const getBySymbol = query({
  args: {
    botId: v.id("bots"),
    symbol: v.string(),
  },
  handler: async (ctx, args) => {
    const asset = await ctx.db
      .query("targets")
      .withIndex("by_botId_symbol", (q) =>
        q.eq("botId", args.botId).eq("symbol", args.symbol)
      )
      .first();

    return asset || null;
  },
});
