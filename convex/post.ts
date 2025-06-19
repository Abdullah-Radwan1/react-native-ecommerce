import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generatePostUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: User identity is required.");
  }
  return await ctx.storage.generateUploadUrl();
});

export const createPost = mutation({
  args: { caption: v.string(), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: User identity is required.");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    // identity.subject is the Clerk user ID
    if (!user) {
      throw new Error("User not found.");
    }

    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) {
      throw new Error("Image URL not found.");
    }
    await ctx.db.insert("posts", {
      userId: user._id,
      caption: args.caption,
      storageId: args.storageId,
      imageUrl: imageUrl,
      comments: 0,
      likes: 0,
    });
  },
});
