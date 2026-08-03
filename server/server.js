import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import cabRoutes from "./Routes/cabRoutes.js";
import emergencyRouter from "./Routes/emergencyRoutes.js";
import bikeShopRoutes from "./Routes/bikeShopRoutes.js";
import localBusinessRoutes from "./routes/localBusinessRoutes.js";
import clerkWebhooks from "./Controllers/clerkWebhooks.js";
import userRouter from "./Routes/userRoutes.js";
import hotelRouter from "./Routes/hotelRoute.js";
import { connectClodinary } from "./configs/cloudinary.js";
import roomRouter from "./Routes/RoomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import chatRouter from "./Routes/chatRoutes.js";
import paymentRouter from "./Routes/paymentRoutes.js";


connectDB(); // Connect to MongoDB
connectClodinary(); // Connect to Cloudinary

const app = express();
app.use(cors()); // Enable Cross-origin Resouce Sharing


//Important raw body parser for clerk webhook, reguster bedore express.json

app.post("api/clerk", express.raw({ type: "application/json" }), clerkWebhooks);
//MiddleWare
app.use(express.json());
app.use(clerkMiddleware());

// //Api to listen clerk webhooks
// app.post("/api/clerk", clerkWebhooks);

app.get("/", (req, res) => res.send("Backend is Working Fine..."));
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRoutes);
app.use("/api/cab", cabRoutes);
app.use("/api/emergency", emergencyRouter);
app.use("/api/bikeshop", bikeShopRoutes);
app.use("/api/chat", chatRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/local-business", localBusinessRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
