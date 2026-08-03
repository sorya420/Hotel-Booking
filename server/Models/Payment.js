import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    bookingType: {
      type: String,
      enum: ["hotel", "cab", "bike"],
      required: true,
    },

    bookingId: {
  type: String,
  required: true,
},

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["Online", "Offline"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    razorpayOrderId: String,

    razorpayPaymentId: String,

    razorpaySignature: String,
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;