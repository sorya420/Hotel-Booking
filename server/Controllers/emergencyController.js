import Emergency from "../Models/EmergencyModel.js";

// Create Emergency Request
export const createEmergencyRequest = async (req, res) => {
  try {

    const emergency = await Emergency.create(req.body);

    res.status(201).json({
      success: true,
      message: "Emergency request submitted successfully.",
      emergency,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Emergency Requests
export const getAllEmergencyRequests = async (req, res) => {

  try {

    const requests = await Emergency.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      requests,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Emergency Status
export const updateEmergencyStatus = async (req, res) => {

  try {

    const emergency = await Emergency.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      emergency,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Emergency Request
export const deleteEmergencyRequest = async (req, res) => {

  try {

    await Emergency.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Emergency Request Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};