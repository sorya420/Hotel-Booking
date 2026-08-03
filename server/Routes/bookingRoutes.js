import express from "express";
import {
  checkRoomAvailability,
  createBooking,
  getUserBookings,
  getHotelBookings,
} from "../Controllers/bookingController.js";

import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/check-availability", checkRoomAvailability);

router.post("/create-booking", protect, createBooking);

router.get("/user", protect, getUserBookings);

router.get("/hotel", protect, getHotelBookings);

export default router;
