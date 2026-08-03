import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../Controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", createOrder);
paymentRouter.post("/verify", verifyPayment);

export default paymentRouter;
