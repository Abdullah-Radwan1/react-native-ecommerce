import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("CLERK_WEBHOOK_SECRET is not set");
    }

    const svixId = req.headers.get("svix-id");
    const svixSignature = req.headers.get("svix-signature");
    const svixTimestamp = req.headers.get("svix-timestamp");

    if (!svixId || !svixSignature || !svixTimestamp) {
      throw new Error("Missing svix headers");
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);

    let event: any;
    try {
      event = wh.verify(body, {
        "svix-signature": svixSignature,
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
      });
    } catch (error) {
      console.error("Invalid webhook signature", error);
      return new Response("Invalid webhook signature", { status: 400 });
    }

    if (event.type === "user.created") {
      const { id, email_addresses, image_url } = event.data;
      const email = email_addresses[0]?.email_address || "";
      const username = event.data.username ?? email.split("@")[0] ?? "user";
      const image =
        event.data.image_url ||
        event.data.profile_image_url ||
        "https://www.gravatar.com/avatar/";

      try {
        await ctx.runMutation(api.user.createuser, {
          username,
          bio: "",
          email,
          clerkId: id,
          image,
        });
      } catch (error) {
        console.error("Webhook user creation error:", error);
        return new Response("Error processing webhook", { status: 500 });
      }
    }

    return new Response("Webhook processed successfully");
  }),
});

export default http;
