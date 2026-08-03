import User from "../Models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  console.log("========== WEBHOOK HIT ==========");
  try {
    // create a Svix instance with clerk webhook secret.
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Getting Headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    //verifying Headers
    await whook.verify(JSON.stringify(req.body), headers);

    //Getting data from request body

    const payload = whook.verify(req.body, headers);

    const { data, type } = payload;

    //Switch case for different Events
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          username:
            `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() ||
            data.email_addresses[0].email_address.split("@")[0],
          image: data.profile_image_url,
        };

        await User.create(userData);

        // try {
        //   const user = await User.create(userData);
        //   console.log("User created:", user);
        // } catch (err) {
        //   console.error("CREATE ERROR:", err);
        // }
        break;
      }

      case "user.updated": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          username:
            `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() ||
            data.email_addresses[0].email_address.split("@")[0],
          image: data.profile_image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }

      default:
        break;
    }

    res.json({ success: true, message: "webhook recieved" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
