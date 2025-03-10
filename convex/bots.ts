import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    name: v.string(),
    budget: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }

    const botId = await ctx.db.insert("bots", {
      name: args.name,
      budget: args.budget,
      userId,
      status: "active",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return botId;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }

    return await ctx.db
      .query("bots")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const getById = query({
  args: {
    id: v.id("bots"),
  },
  handler: async (ctx, args) => {
    const bot = await ctx.db.get(args.id);
    if (!bot) {
      throw new Error("Bot not found");
    }
    return bot;
  },
});
