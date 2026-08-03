
// import Booking from "../Models/Booking.js";
// import razorpay from "../configs/razorpay.js";
// import Payment from "../Models/Payment.js";
// import crypto from "crypto";


// // ==============================
// // Create Payment Order
// // ==============================
// export const createOrder = async (req, res) => {
//   try {
//     const {
//       bookingType,
//       bookingId,
//       amount,
//       paymentMethod,
//     } = req.body;

//     // Offline Payment
//     if (paymentMethod === "Offline") {
//       const payment = await Payment.create({
//         bookingType,
//         bookingId,
//         amount,
//         paymentMethod,
//         paymentStatus: "Pending",
//       });

//       return res.json({
//         success: true,
//         message: "Offline Booking Created Successfully",
//         payment,
//       });
//     }

//     // Online Payment
//     const options = {
//       amount: Number(amount) * 100, // Razorpay amount in paise
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);

//     const payment = await Payment.create({
//       bookingType,
//       bookingId,
//       amount,
//       paymentMethod: "Online",
//       paymentStatus: "Pending",
//       razorpayOrderId: order.id,
//     });

//     return res.json({
//       success: true,
//       key: process.env.RAZORPAY_KEY_ID,
//       order,
//       payment,
//     });

//   } catch (error) {
//     console.log("Create Order Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Payment Creation Failed",
//     });
//   }
// };

// // ==============================
// // Verify Razorpay Payment
// // ==============================
// export const verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     } = req.body;

//     const body =
//       razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_SECRET)
//       .update(body.toString())
//       .digest("hex");

//     if (expectedSignature === razorpay_signature) {

//       await Payment.findOneAndUpdate(
//         { razorpayOrderId: razorpay_order_id },
//         {
//           paymentStatus: "Paid",
//           razorpayPaymentId: razorpay_payment_id,
//           razorpaySignature: razorpay_signature,
//         }
//       );
// const paymentData = await Payment.findOne({
//   razorpayOrderId: razorpay_order_id
// });


// if(paymentData && paymentData.bookingType === "Hotel"){

//   await Booking.findByIdAndUpdate(
//     paymentData.bookingId,
//     {
//       isPaid:true,
//       status:"confirmed"
//     }
//   );

// }
//       return res.json({
//         success: true,
//         message: "Payment Verified Successfully",
//       });
//     }

//     return res.status(400).json({
//       success: false,
//       message: "Invalid Payment Signature",
//     });

//   } catch (error) {
//     console.log("Verify Payment Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Payment Verification Failed",
//     });
//   }
// };


import Booking from "../Models/Booking.js";
import razorpay from "../configs/razorpay.js";
import Payment from "../Models/Payment.js";
import crypto from "crypto";


// ==============================
// Create Payment Order
// ==============================
export const createOrder = async (req, res) => {
  try {
    const {
      bookingType,
      bookingId,
      amount,
      paymentMethod,
    } = req.body;

    // Offline Payment
    if (paymentMethod === "Offline") {
      const payment = await Payment.create({
        bookingType,
        bookingId,
        amount,
        paymentMethod,
        paymentStatus: "Pending",
      });

      return res.json({
        success: true,
        message: "Offline Booking Created Successfully",
        payment,
      });
    }

    // Online Payment
    const options = {
      amount: Number(amount) * 100, // Razorpay amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const payment = await Payment.create({
      bookingType,
      bookingId,
      amount,
      paymentMethod: "Online",
      paymentStatus: "Pending",
      razorpayOrderId: order.id,
    });

    return res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order,
      payment,
    });

  } catch (error) {
    console.log("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment Creation Failed",
    });
  }
};

// ==============================
// Verify Razorpay Payment
// ==============================
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          paymentStatus: "Paid",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        }
      );


if(paymentData && paymentData.bookingType === "Hotel"){

  await Booking.findByIdAndUpdate(
    paymentData.bookingId,
    {
      isPaid:true,
      status:"confirmed"
    }
  );

}
      return res.json({
        success: true,
        message: "Payment Verified Successfully",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid Payment Signature",
    });

  } catch (error) {
    console.log("Verify Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment Verification Failed",
    });
  }
};