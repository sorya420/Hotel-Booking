import express from "express";
import { createCabBooking } from "../Controllers/cabController.js";

const router = express.Router();

// Cab Booking API

router.post("/book", createCabBooking);

export default router;
