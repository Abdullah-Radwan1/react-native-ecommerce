import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticateduser } from "./user";

export const toggleBookark = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await getAuthenticateduser(ctx);
    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_post_and_user", (q) => {
        return q.eq("postId", args.postId).eq("userId", user._id);
      })
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    } else {
      await ctx.db.insert("bookmarks", {
        userId: user._id,
        postId: args.postId,
      });
      return true;
    }
  },
});

export const getBookmarks = query({
  handler: async (ctx) => {
    const user = await getAuthenticateduser(ctx);
    const bookmarks = ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    const bookmarksWithInfo = await Promise.all(
      (await bookmarks).map(async (bookmark) => {
        const post = await ctx.db.get(bookmark.postId);

        return post;
      })
    );
    return bookmarksWithInfo;
  },
});
