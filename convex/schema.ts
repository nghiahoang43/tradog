import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    apiKey: v.optional(v.string()),
  }).index("email", ["email"]),
  bots: defineTable({
    name: v.string(),
    userId: v.id("users"),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("stopped")
    ),
    budget: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("userId", ["userId"]),
  targets: defineTable({
    botId: v.id("bots"),
    symbol: v.string(),
    type: v.union(v.literal("stock"), v.literal("crypto")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("botId", ["botId"])
    .index("by_botId_symbol", ["botId", "symbol"]),
  orders: defineTable({
    targetId: v.id("targets"),
    alpacaOrderId: v.string(),
    amount: v.number(),
    side: v.union(v.literal("buy"), v.literal("sell")),
    type: v.union(v.literal("market"), v.literal("limit")),
    tp: v.number(),
    sl: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("filled"),
      v.literal("failed")
    ),
    executedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("targetId", ["targetId"]),
  tradeHistory: defineTable({
    botId: v.id("bots"),
    assetId: v.id("targets"),
    buy_order_id: v.string(),
    sell_order_id: v.string(),
    buy_price: v.number(),
    sell_price: v.number(),
    buy_quantity: v.number(),
    sell_quantity: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("botId", ["botId"]),
});

export default schema;
