// import express from "express";
// import { checkAvailability , createBooking, getUserBookings, getHotelBookings } from "../Controllers/bookingController.js";
// import {protect} from "../Middleware/authMiddleware.js";

// const bookingRouter = express.Router();


// bookingRouter.post("/check-availabilty", checkAvailability);
// bookingRouter.post("/book",protect, createBooking);
// bookingRouter.get("/user",protect, getUserBookings);
// bookingRouter.get("/hotel",protect, getHotelBookings);

// export default bookingRouter;

import express from "express";
import {
  checkRoomAvailability,
  createBooking,
  getUserBookings,
  getHotelBookings
} from "../controllers/bookingController.js";

import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();


router.post(
  "/check-availability",
  checkRoomAvailability
);


router.post(
  "/create-booking",
  protect,
  createBooking
);


router.get(
  "/user",
  protect,
  getUserBookings
);


router.get(
  "/hotel",
  protect,
  getHotelBookings
);



export default router;