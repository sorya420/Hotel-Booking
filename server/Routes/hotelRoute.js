import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { registerHotel } from "../Controllers/hotelController.js";

const hotelRouter = express.Router();


hotelRouter.post("/", protect, registerHotel )

export default hotelRouter;
