import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";

export const createuser = mutation({
  args: {
    username: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
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
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => {
        return q.eq("clerkId", args.clerkId);
      })
      .unique();
    return user;
  },
});
export const getUserPosts = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(10);
    return posts;
  },
});
export const updateUser = mutation({
  args: {
    id: v.id("users"),
    bio: v.optional(v.string()),
    username: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", args.id))
      .unique();
    if (!user) {
      throw new Error("User not found");
    }
    await ctx.db.patch(user._id, {
      bio: args.bio,
      username: args.username,
    });
  },
});
export const getUserProfile = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", args.userId))
      .unique();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
});
export const toggleFollow = mutation({
  args: {
    followerId: v.id("users"), // the person to follow/unfollow
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticateduser(ctx); // current user (follower)

    const existing = await ctx.db
      .query("follows")
      .withIndex("by_follower_and_following", (q) =>
        q.eq("followerId", user._id).eq("followingId", args.followerId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      await updateFollowCount(ctx, user._id, args.followerId, false);
    } else {
      await ctx.db.insert("follows", {
        followerId: user._id,
        followingId: args.followerId,
      });

      await ctx.db.insert("notifications", {
        receiverId: args.followerId,
        senderId: user._id,
        type: "follow",
      });

      await updateFollowCount(ctx, user._id, args.followerId, true);
    }
  },
});

const updateFollowCount = async (
  ctx: MutationCtx,
  followerId: Id<"users">,
  followingId: Id<"users">,
  isFollowing: boolean
) => {
  const follower = await ctx.db.get(followerId);
  const following = await ctx.db.get(followingId);

  if (!follower || !following) return;

  await ctx.db.patch(follower._id, {
    following: isFollowing
      ? follower.following + 1
      : Math.max(0, follower.following - 1),
  });

  await ctx.db.patch(following._id, {
    followers: isFollowing
      ? following.followers + 1
      : Math.max(0, following.followers - 1),
  });
};

export async function getAuthenticateduser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: User identity is required.");
  }
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
}
