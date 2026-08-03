import React, { useState, useEffect } from "react";
import axios from "axios";

import NearbyHospitals from "../components/NearbyHospitals";
import NearbyPoliceStations from "../components/NearbyPoliceStations";
import NearbyPharmacies from "../components/NearbyPharmacies";

const EmergencySOS = () => {
  const [showHospital, setShowHospital] = useState(false);
  const [showPolice, setShowPolice] = useState(false);
  const [showPharmacy, setShowPharmacy] = useState(false);
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);

  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    location: "",
    emergencyType: "Ambulance",
  });

  // Fetch Current Location + Address
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          try {
            const response = await axios.get(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`,
            );

            const address = response.data.features[0]?.properties?.formatted;

            setFormData((prev) => ({
              ...prev,
              location: address || `${latitude}, ${longitude}`,
            }));
          } catch (error) {
            console.log("Address Error:", error);

            setFormData((prev) => ({
              ...prev,
              location: `${latitude}, ${longitude}`,
            }));
          }
        },

        (error) => {
          console.log(error);

          alert("Location access denied.");
        },
      );
    } else {
      alert("Geolocation not supported");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/emergency/request",

        formData,
      );

      console.log(response.data);

      alert("🚨 Emergency Request Sent Successfully");

      setFormData({
        patientName: "",

        phone: "",

        location: formData.location,

        emergencyType: "Ambulance",
      });
    } catch (error) {
      console.log(error);

      alert("❌ Emergency Request Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-28 pb-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-4xl font-bold text-center text-red-600">
          🚨 Emergency SOS
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Get Emergency Help Quickly
        </p>

        {/* Emergency Buttons */}

        <div className="flex flex-col gap-4 mt-8">
          <button
            type="button"
            onClick={() => {
              setShowEmergencyForm(true);

              setShowHospital(false);

              setShowPolice(false);

              setShowPharmacy(false);
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-lg font-semibold shadow-md"
          >
            🚑 Request Emergency
          </button>

          <button
            type="button"
            onClick={() => {
              setShowHospital(true);

              setShowEmergencyForm(false);

              setShowPolice(false);

              setShowPharmacy(false);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold shadow-md"
          >
            🏥 Nearby Hospitals
          </button>

          <button
            type="button"
            onClick={() => {
              setShowPolice(true);

              setShowEmergencyForm(false);

              setShowHospital(false);

              setShowPharmacy(false);
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl text-lg font-semibold shadow-md"
          >
            🚓 Nearby Police Stations
          </button>

          <button
            type="button"
            onClick={() => {
              setShowPharmacy(true);

              setShowEmergencyForm(false);

              setShowHospital(false);

              setShowPolice(false);
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg font-semibold shadow-md"
          >
            💊 Nearby Pharmacy
          </button>
        </div>

        {/* Emergency Form */}

        {showEmergencyForm && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <input
              type="text"
              name="patientName"
              placeholder="Patient Name"
              value={formData.patientName}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />

            <input
              type="text"
              name="location"
              value={formData.location}
              readOnly
              className="w-full border rounded-lg p-3 bg-gray-100"
            />

            <select
              name="emergencyType"
              value={formData.emergencyType}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="Ambulance">🚑 Ambulance</option>

              <option value="Air Ambulance">🚁 Air Ambulance</option>
            </select>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
            >
              🚨 Submit Emergency Request
            </button>
          </form>
        )}

        {/* Result Components */}

        {showHospital && <NearbyHospitals />}

        {showPolice && <NearbyPoliceStations />}

        {showPharmacy && <NearbyPharmacies />}
      </div>
    </div>
  );
};

export default EmergencySOS;
