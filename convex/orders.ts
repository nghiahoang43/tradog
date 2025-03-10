import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    targetId: v.id("targets"),
    alpacaOrderId: v.string(),
    amount: v.number(),
    side: v.union(v.literal("buy"), v.literal("sell")),
    type: v.union(v.literal("market"), v.literal("limit")),
    tp: v.number(),
    sl: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }

    const asset = await ctx.db.get(args.targetId);
    if (!asset) {
      throw new Error("Asset not found");
    }

    const orderId = await ctx.db.insert("orders", {
      targetId: args.targetId,
      alpacaOrderId: args.alpacaOrderId,
      amount: args.amount,
      side: args.side,
      type: args.type,
      status: "pending",
      tp: args.tp,
      sl: args.sl,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return orderId;
  },
});

export const update = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("filled"),
      v.literal("failed")
    ),
    executedAt: v.optional(v.number()), // Optional field
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }

    // Fetch the existing order
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Update the order status and executedAt (only if provided)
    await ctx.db.patch(args.orderId, {
      status: args.status,
      executedAt: args.executedAt ?? order.executedAt, // Preserve existing executedAt if not provided
      updatedAt: Date.now(),
    });

    return { success: true, orderId: args.orderId };
  },
});

export const getAllByAssetId = query({
  args: {
    targetId: v.id("targets"),
  },
  handler: async (ctx, args) => {
    const asset = await ctx.db.get(args.targetId);
    if (!asset) {
      throw new Error("Asset not found");
    }
    return await ctx.db
      .query("orders")
      .withIndex("targetId", (q) => q.eq("targetId", args.targetId))
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  },
});

export const getAllByBotId = query({
  args: {
    botId: v.id("bots"),
  },
  handler: async (ctx, args) => {
    // Fetch all assets belonging to the given botId
    const assets = await ctx.db
      .query("targets")
      .withIndex("botId", (q) => q.eq("botId", args.botId))
      .collect();

    if (assets.length === 0) {
      return [];
    }

    // Create a Map for quick lookup of assets by their ID
    const assetMap = new Map(assets.map((asset) => [asset._id, asset]));

    // Fetch orders for each assetId
    const orders = await Promise.all(
      assets.map((asset) =>
        ctx.db
          .query("orders")
          .withIndex("targetId", (q) => q.eq("targetId", asset._id))
          .order("desc") // Sort by default order field (_creationTime)
          .collect()
      )
    );

    // Flatten and sort orders by createdAt in descending order
    return orders
      .flat()
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((order) => ({
        ...order,
        asset: assetMap.get(order.targetId) || null, // Nest the asset object inside each order
      }));
  },
});
