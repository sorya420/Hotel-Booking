// export default Rides;

import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import NearbyBikeShops from "../components/NearbyBikeShops";

const Rides = () => {
  const [showCab, setShowCab] = useState(false);
  const [showBike, setShowBike] = useState(false);

  const [distance, setDistance] = useState(0);
  const [fare, setFare] = useState(0);

  const fareRates = {
    Mini: 12,
    Sedan: 15,
    SUV: 20,
    Luxury: 30,
  };

  const [formData, setFormData] = useState({
    pickup: "",
    destination: "",
    date: "",
    time: "",
    cabType: "Mini",
    passenger: "",
    phone: "",
    distance: "",
    fare: "",
    paymentMethod: "Online",
  });

  const handleChange = (e) => {
    const updatedData = {
      ...formData,

      [e.target.name]: e.target.value,
    };

    setFormData(updatedData);

    if (e.target.name === "cabType" && distance) {
      const newFare = distance * fareRates[e.target.value];

      setFare(Math.round(newFare));

      setFormData({
        ...updatedData,

        fare: Math.round(newFare),
      });
    }
  };

  // Calculate Distance & Fare

  const calculateFare = async () => {
    try {
      if (!formData.pickup || !formData.destination) {
        alert("Enter pickup and destination");

        return;
      }

      const pickup = await axios.get(
        "https://nominatim.openstreetmap.org/search",

        {
          params: {
            q: formData.pickup,

            format: "json",
          },
        },
      );

      const drop = await axios.get(
        "https://nominatim.openstreetmap.org/search",

        {
          params: {
            q: formData.destination,

            format: "json",
          },
        },
      );

      const startLat = pickup.data[0].lat;
      const startLon = pickup.data[0].lon;

      const endLat = drop.data[0].lat;
      const endLon = drop.data[0].lon;

      const route = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}`,

        {
          params: {
            overview: false,
          },
        },
      );

      const km = route.data.routes[0].distance / 1000;

      const totalFare = km * fareRates[formData.cabType];

      setDistance(km.toFixed(1));

      setFare(Math.round(totalFare));

      setFormData({
        ...formData,

        distance: km.toFixed(1),

        fare: Math.round(totalFare),
      });
    } catch (error) {
      console.log("Fare Error", error);

      alert("Distance calculate nahi hua");
    }
  };
  const openRazorpay = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/payment/create-order",
        {
          bookingType: "Cab",
          bookingId: Date.now().toString(),
          amount: fare,
          paymentMethod: "Online",
        },
      );

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Travel Booking",
        description: "Cab Booking Payment",
        order_id: data.order.id,

        handler: async function (response) {
          await axios.post(
            "http://localhost:3000/api/payment/verify",
            response,
          );

          // Payment verify hone ke baad cab booking save hogi
          await axios.post("http://localhost:3000/api/cab/book", formData);

          alert("✅ Payment Successful & Cab Booked");
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.log(error);

      alert("Payment Failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Offline Payment
      if (formData.paymentMethod === "Offline") {
        await axios.post("http://localhost:3000/api/cab/book", formData);

        alert("✅ Cab Booked Successfully (Offline Payment)");

        return;
      }

      // ================= Online Payment =================

      const orderResponse = await axios.post(
        "http://localhost:3000/api/payment/create-order",
        {
          bookingType: "cab",
          bookingId: crypto.randomUUID(), // Temporary ID
          amount: fare,
          paymentMethod: "Online",
        },
      );

      const { order, key } = orderResponse.data;
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "Travel Booking",
        description: "Cab Booking Payment",
        order_id: order.id,

        handler: async function (response) {
          // Payment Verify
          const verify = await axios.post(
            "http://localhost:3000/api/payment/verify",
            response,
          );

          if (verify.data.success) {
            // Save Cab Booking
            await axios.post("http://localhost:3000/api/cab/book", formData);

            alert("✅ Payment Successful & Cab Booked");

            // Reset Form
            setFormData({
              pickup: "",
              destination: "",
              date: "",
              time: "",
              cabType: "Mini",
              passenger: "",
              phone: "",
              distance: "",
              fare: "",
              paymentMethod: "Online",
            });

            setDistance(0);
            setFare(0);
          } else {
            alert("❌ Payment Verification Failed");
          }
        },

        prefill: {
          name: formData.passenger,
          contact: formData.phone,
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();

      return;

      setFormData({
        pickup: "",
        destination: "",
        date: "",
        time: "",
        cabType: "Mini",
        passenger: "",
        phone: "",
        distance: "",
        fare: "",
      });

      setDistance(0);
      setFare(0);
    } catch (error) {
      console.log(error);

      alert("Booking Failed");
    }
  };

  return (
    <div className="pt-28 pb-16 px-4 md:px-16 lg:px-24 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">🚗 Rides</h1>

        <div className="flex flex-col gap-4 mb-8">
          <button
            onClick={() => {
              setShowCab(!showCab);
              setShowBike(false);
            }}
            className="bg-yellow-500 text-white py-4 rounded-xl font-semibold"
          >
            🚕 Cab Booking
          </button>

          <button
            onClick={() => {
              setShowBike(!showBike);
              setShowCab(false);
            }}
            className="bg-green-600 text-white py-4 rounded-xl font-semibold"
          >
            🏍️ Bike Rental
          </button>
        </div>

        {showCab && (
          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-3xl font-bold text-center">🚖 Cab Booking</h2>

            <form
              onSubmit={handleSubmit}
              className="grid md:grid-cols-2 gap-5 mt-6"
            >
              <input
                name="pickup"
                value={formData.pickup}
                onChange={handleChange}
                placeholder="Pickup Location"
                className="border p-3 rounded"
                required
              />

              <input
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Drop Location"
                className="border p-3 rounded"
                required
              />

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="border p-3 rounded"
              />

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="border p-3 rounded"
              />

              <select
                name="cabType"
                value={formData.cabType}
                onChange={handleChange}
                className="border p-3 rounded"
              >
                <option>Mini</option>

                <option>Sedan</option>

                <option>SUV</option>

                <option>Luxury</option>
              </select>

              <input
                name="passenger"
                value={formData.passenger}
                onChange={handleChange}
                placeholder="Passenger Name"
                className="border p-3 rounded"
              />

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Mobile Number"
                className="border p-3 rounded md:col-span-2"
              />
              <div className="md:col-span-2 bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Payment Method</h3>

                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online"
                    checked={formData.paymentMethod === "Online"}
                    onChange={handleChange}
                  />
                  Online Payment
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Offline"
                    checked={formData.paymentMethod === "Offline"}
                    onChange={handleChange}
                  />
                  Pay Offline
                </label>
              </div>

              <button
                type="button"
                onClick={calculateFare}
                className="md:col-span-2 bg-blue-600 text-white py-3 rounded"
              >
                Calculate Fare
              </button>

              <div className="md:col-span-2 bg-blue-50 p-5 rounded-xl">
                <p className="text-xl">Distance: {distance} KM</p>

                <p className="text-3xl font-bold text-blue-600">₹{fare}</p>
              </div>

              <button
                type="submit"
                className="md:col-span-2 bg-black text-white py-4 rounded-xl"
              >
                Book Cab
              </button>
            </form>
          </div>
        )}

        {showBike && (
          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-3xl font-bold text-center">🏍️ Bike Rental</h2>

            <NearbyBikeShops />
          </div>
        )}
      </div>
    </div>
  );
};

export default Rides;
