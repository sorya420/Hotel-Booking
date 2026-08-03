import transporter from "../configs/nodemailer.js";
import Booking from "../Models/Booking.js";
import Room from "../Models/Room.js";
import Hotel from "../Models/Hotel.js";

// Check room availability
export const checkAvailability = async ({
  checkInDate,
  checkOutDate,
  room,
}) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });

    return bookings.length === 0;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

// Check availability API
export const checkRoomAvailability = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;

    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });

    res.json({
      success: true,
      isAvailable,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Create Booking API
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guest, paymentMethod } = req.body;

    const user = req.user._id;

    // Check room availability
    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });

    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Room is not available for selected dates",
      });
    }

    // Get room data with hotel details
    const roomData = await Room.findById(room).populate("hotel");

    if (!roomData) {
      return res.json({
        success: false,
        message: "Room not found",
      });
    }

    // Calculate nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return res.json({
        success: false,
        message: "Invalid booking dates",
      });
    }

    const finalPrice = roomData.pricePerNight * nights;

    // Create booking
    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guest: Number(guest),
      checkInDate,
      checkOutDate,
      totalPrice: finalPrice,
      paymentMethod: paymentMethod || "Pay At Hotel",
      isPaid: false,
      status: "pending",
    });

    // Send booking confirmation email
    try {
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: req.user.email,
        subject: "Hotel Booking Confirmation",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #ddd;border-radius:10px;">
            <h2 style="color:#2563eb;">Booking Confirmed 🎉</h2>

            <p>Hello <strong>${req.user.username}</strong>,</p>

            <p>Your hotel booking has been successfully created.</p>

            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px;border:1px solid #ddd;"><strong>Booking ID</strong></td>
                <td style="padding:8px;border:1px solid #ddd;">${booking._id}</td>
              </tr>

              <tr>
                <td style="padding:8px;border:1px solid #ddd;"><strong>Hotel Name</strong></td>
                <td style="padding:8px;border:1px solid #ddd;">${roomData.hotel.name}</td>
              </tr>

              <tr>
                <td style="padding:8px;border:1px solid #ddd;"><strong>Location</strong></td>
                <td style="padding:8px;border:1px solid #ddd;">${roomData.hotel.address}</td>
              </tr>

              <tr>
                <td style="padding:8px;border:1px solid #ddd;"><strong>Room Type</strong></td>
                <td style="padding:8px;border:1px solid #ddd;">${roomData.roomType}</td>
              </tr>

              <tr>
                <td style="padding:8px;border:1px solid #ddd;"><strong>Guests</strong></td>
                <td style="padding:8px;border:1px solid #ddd;">${guest}</td>
              </tr>

              <tr>
                <td style="padding:8px;border:1px solid #ddd;"><strong>Check In</strong></td>
                <td style="padding:8px;border:1px solid #ddd;">${new Date(
                  booking.checkInDate
                ).toDateString()}</td>
              </tr>

              <tr>
                <td style="padding:8px;border:1px solid #ddd;"><strong>Check Out</strong></td>
                <td style="padding:8px;border:1px solid #ddd;">${new Date(
                  booking.checkOutDate
                ).toDateString()}</td>
              </tr>

              <tr>
                <td style="padding:8px;border:1px solid #ddd;"><strong>Total Amount</strong></td>
                <td style="padding:8px;border:1px solid #ddd;">${process.env.CURRENCY || "₹"} ${booking.totalPrice}</td>
              </tr>

              <tr>
                <td style="padding:8px;border:1px solid #ddd;"><strong>Payment Method</strong></td>
                <td style="padding:8px;border:1px solid #ddd;">${booking.paymentMethod}</td>
              </tr>

              <tr>
                <td style="padding:8px;border:1px solid #ddd;"><strong>Status</strong></td>
                <td style="padding:8px;border:1px solid #ddd;">${booking.status}</td>
              </tr>
            </table>

            <p style="margin-top:20px;">
              Thank you for choosing us. We look forward to hosting you.
            </p>

            <p>Have a wonderful trip! 😊</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("Booking confirmation email sent.");
    } catch (mailerError) {
      console.log("Email sending failed:", mailerError.message);
    }

    res.json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// User Booking History
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;

    const bookings = await Booking.find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

// Hotel Owner Bookings
export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({
      owner: req.auth.userId,
    });

    if (!hotel) {
      return res.json({
        success: false,
        message: "No Hotel Found",
      });
    }

    const bookings = await Booking.find({
      hotel: hotel._id,
    })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;

    const totalRevenue = bookings.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    res.json({
      success: true,
      dashboardData: {
        totalBookings,
        totalRevenue,
        bookings,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to fetch hotel bookings",
    });
  }
};