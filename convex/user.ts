import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createuser = mutation({
  args: {
    username: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Creating user with args:", args);

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      console.log("User already exists:", existingUser);
      throw new Error("User already exists");
    }

    await ctx.db.insert("users", {
      bio: args.bio,
      email: args.email,
      image: args.image,
      username: args.username,
      clerkId: args.clerkId,
      followers: 0,
      following: 0,
      posts: 0,
    });
  },
});
