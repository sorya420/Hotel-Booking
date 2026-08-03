// import express from "express";

// import {
//   bookCab,
//   getCabBookings,
//   deleteCabBooking,
// } from "../Controllers/cabController.js";

// const router = express.Router();

// router.post("/book", bookCab);
// router.get("/all", getCabBookings);
// router.delete("/:id", deleteCabBooking);

// export default router;


import express from "express";
import { createCabBooking } from "../Controllers/cabController.js";


const router = express.Router();


// Cab Booking API

router.post(
    "/book",
    createCabBooking
);


export default router;