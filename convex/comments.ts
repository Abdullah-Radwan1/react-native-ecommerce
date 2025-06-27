import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticateduser } from "./user";

export const addComment = mutation({
  args: { comment: v.string(), postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await getAuthenticateduser(ctx);
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("post not found");
    }
    const commentId = await ctx.db.insert("comments", {
      postId: args.postId,
      userId: user._id,
      content: args.comment,
    });
    await ctx.db.patch(args.postId, { comments: post.comments + 1 });

    if (post.userId !== user._id) {
      ctx.db.insert("notifications", {
        receiverId: post.userId,
        senderId: user._id,
        type: "comment",
        postId: args.postId,
        commentId,
        //to do "can't i make it post._id"
      });
    }
    return commentId;
  },
});
export const getComments = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    const commentWithUserInfo = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          user: {
            image: user?.image,
            username: user?.username,
          },
        };
      })
    );
    return commentWithUserInfo
  },
});
