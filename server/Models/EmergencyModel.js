import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    emergencyType: {
      type: String,
      enum: ["Ambulance", "Air Ambulance"],
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
    },

    assignedDriver: {
      type: String,
      default: "",
    },

    assignedHospital: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Emergency =
  mongoose.models.Emergency ||
  mongoose.model("Emergency", emergencySchema);

export default Emergency;