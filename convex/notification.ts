import { query } from "@/convex/_generated/server";
import { getAuthenticateduser } from "./user";

export const getNotification = query({
  handler: async (ctx) => {
    const user = await getAuthenticateduser(ctx);

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_receiver", (q) => q.eq("receiverId", user._id))
      .order("desc")
      .collect();

    // فلترة الإشعارات اللي نوعها like أو comment، ومستبعد اللي عملها هو نفسه
    const filtered = notifications.filter(
      (n) =>
        (n.type === "like" || n.type === "comment") && n.senderId !== user._id
    );

    const notificationsWithInfo = await Promise.all(
      filtered.map(async (n) => {
        const [sender, post, comment] = await Promise.all([
          ctx.db.get(n.senderId),
          n.postId ? ctx.db.get(n.postId) : null,
          n.commentId ? ctx.db.get(n.commentId) : null,
        ]);

        return {
          user: {
            image: sender?.image,
            username: sender?.username,
            id: sender?._id,
          },
          postImage: post?.imageUrl,
          comment,
          type: n.type,
        };
      })
    );

    return notificationsWithInfo;
  },
});
