// import User from "../Models/User.js";
// import { Webhook } from "svix";

// const clerkWebhooks = async (req, res) => {
//   console.log("========== WEBHOOK HIT ==========");
//   try {
//     // create a Svix instance with clerk webhook secret.
//     const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//     // Getting Headers
//     const headers = {
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp": req.headers["svix-timestamp"],
//       "svix-signature": req.headers["svix-signature"],
//     };

//     //verifying Headers
//     await whook.verify(JSON.stringify(req.body), headers);

//     //Getting data from request body

//     const payload = whook.verify(req.body, headers);

//     const { data, type } = payload;

//     //Switch case for different Events
//     switch (type) {
//       case "user.created": {
//         const userData = {
//           _id: data.id,
//           email: data.email_addresses[0].email_address,
//           username:
//             `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() ||
//             data.email_addresses[0].email_address.split("@")[0],
//           image: data.profile_image_url,
//         };

//         await User.create(userData);

//         // try {
//         //   const user = await User.create(userData);
//         //   console.log("User created:", user);
//         // } catch (err) {
//         //   console.error("CREATE ERROR:", err);
//         // }
//         break;
//       }

//       case "user.updated": {
//         const userData = {
//           _id: data.id,
//           email: data.email_addresses[0].email_address,
//           username:
//             `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() ||
//             data.email_addresses[0].email_address.split("@")[0],
//           image: data.profile_image_url,
//         };
//         await User.findByIdAndUpdate(data.id, userData);
//         break;
//       }
//       case "user.deleted": {
//         await User.findByIdAndDelete(data.id);
//         break;
//       }

//       default:
//         break;
//     }

//     res.json({ success: true, message: "webhook recieved" });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// export default clerkWebhooks;



import { Webhook } from "svix";
import User from "../Models/User.js";

const clerkWebhooks = async (req, res) => {
  console.log("========== CLERK WEBHOOK HIT ==========");

  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res.status(500).json({
        success: false,
        message: "CLERK_WEBHOOK_SECRET is missing",
      });
    }

    const wh = new Webhook(webhookSecret);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verify webhook (req.body is raw because express.raw() is used)
    const payload = wh.verify(req.body, headers);

    const { data, type } = payload;

    console.log("Webhook Event:", type);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address,
          username:
            `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
            data.email_addresses?.[0]?.email_address.split("@")[0],
          image: data.image_url || data.profile_image_url,
        };

        console.log("Creating User:", userData);

        await User.create(userData);

        console.log(" User Created");
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses?.[0]?.email_address,
          username:
            `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
            data.email_addresses?.[0]?.email_address.split("@")[0],
          image: data.image_url || data.profile_image_url,
        };

        await User.findByIdAndUpdate(data.id, userData);

        console.log(" User Updated");
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);

        console.log("User Deleted");
        break;
      }

      default:
        console.log("Ignored Event:", type);
    }

    return res.status(200).json({
      success: true,
      message: "Webhook received",
    });
  } catch (error) {
    console.error("Webhook Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default clerkWebhooks;