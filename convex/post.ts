import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticateduser } from "./user";

export const generatePostUrl = mutation(async (ctx) => {
  const currentUser = await getAuthenticateduser(ctx);

  return await ctx.storage.generateUploadUrl();
});

export const createPost = mutation({
  args: { caption: v.string(), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const user = await getAuthenticateduser(ctx);

    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) {
      throw new Error("Image URL not found.");
    }
    //increase the post count for the user
    await ctx.db.patch(user._id, { posts: user.posts + 1 });
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


export const getFeedPosts = query({
  handler: async (ctx) => {
    const user = await getAuthenticateduser(ctx);

    const posts = await ctx.db.query("posts").order("desc").take(10);

    const postWithUserInteraction = await Promise.all(
      posts.map(async (post) => {
        const postAuthor = (await ctx.db.get(post.userId))!;

        const isLiked = await ctx.db
          .query("likes")
          .withIndex("by_post_and_user", (q) =>
            q.eq("postId", post._id).eq("userId", user._id)
          )
          .first();

        const isBooked = await ctx.db
          .query("bookmarks")
          .withIndex("by_post_and_user", (q) =>
            q.eq("postId", post._id).eq("userId", user._id)
          )
          .first();

        return {
          ...post,
          author: {
            _id: postAuthor?._id,
            username: postAuthor?.username,
            image: postAuthor?.image,
          },
          isLiked: !!isLiked,
          isBooked: !!isBooked,
        };
      })
    );
    return postWithUserInteraction;
  },
});

export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = (await getAuthenticateduser(ctx))!;
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_post_and_user", (q) =>
        q.eq("postId", args.postId).eq("userId", user._id)
      )
      .first();

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.postId, { likes: post.likes - 1 });
      return false; //the user has unliked the post
    } else {
      await ctx.db.insert("likes", {
        userId: user._id,
        postId: args.postId,
      });
      await ctx.db.patch(args.postId, { likes: post?.likes + 1 });
      //send a notification to the post owner if the user who liked the post is not the owner of the post
      if (user._id !== post.userId) {
        await ctx.db.insert("notifications", {
          receiverId: post.userId,
          senderId: user._id,
          type: "like",
          postId: args.postId,
        });
      }
      return true; //the user has liked the post
    }
  },
});

export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await getAuthenticateduser(ctx);

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    if (post.userId !== user._id) throw new Error("Unauthorized");

    const [likes, comments, bookmarks] = await Promise.all([
      ctx.db
        .query("likes")
        .withIndex("by_post", (q) => q.eq("postId", post._id))
        .collect(),
      ctx.db
        .query("comments")
        .withIndex("by_post", (q) => q.eq("postId", post._id))
        .collect(),
      ctx.db
        .query("bookmarks")
        .withIndex("by_post", (q) => q.eq("postId", post._id))
        .collect(),
    ]);

    await Promise.all([
      ...likes.map((like) => ctx.db.delete(like._id)),
      ...comments.map((comment) => ctx.db.delete(comment._id)),
      ...bookmarks.map((bookmark) => ctx.db.delete(bookmark._id)),
    ]);

    await ctx.db.delete(post._id);

    return { success: true };
  },
});
