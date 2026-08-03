import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { getUserData, storeRecentSearchedCities } from "../Controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", protect, getUserData);
userRouter.post("/store-recent-search", protect, storeRecentSearchedCities);

export default userRouter;
