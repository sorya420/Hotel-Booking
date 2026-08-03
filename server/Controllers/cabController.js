import Cab from "../Models/CabBooking.js";

// Create Cab Booking

export const createCabBooking = async (req, res) => {
  try {
    const newCabBooking = await Cab.create(req.body);

    res.status(201).json({
      success: true,

      message: "Cab Booking Created Successfully",

      data: newCabBooking,
    });
  } catch (error) {
    console.log("Cab Booking Error:", error);

    res.status(500).json({
      success: false,

      message: "Cab Booking Failed",
    });
  }
};
