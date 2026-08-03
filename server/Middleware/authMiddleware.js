import User from "../Models/User.js";

export const protect = async (req, res, next) => {
  try {
    // Get auth object from Clerk
    const auth = await req.auth();

    // Get userId
    const { userId } = auth;

    if (!userId) {
      return res.json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Find matching user in our database
    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found. Please try logging in again.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};