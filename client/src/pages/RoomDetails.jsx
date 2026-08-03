import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const RoomDetails = () => {
  const { id } = useParams();

  const { rooms, axios, getToken, navigate } = useAppContext();

  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guest, setGuest] = useState(1);

  const [paymentMethod, setPaymentMethod] = useState("Pay At Hotel");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const roomData = rooms.find((room) => room._id === id);

    if (roomData) {
      setRoom(roomData);
      setMainImage(roomData.images[0]);
    }
  }, [rooms, id]);

  // Razorpay Payment

  const startPayment = async (booking) => {
    try {
      const { data } = await axios.post(
        "/api/payment/create-order",

        {
          bookingType: "hotel",

          bookingId: booking._id,

          amount: booking.totalPrice,

          paymentMethod: "Online",
        },

        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        },
      );

      if (!data.success) {
        return toast.error(data.message);
      }

      const options = {
        key: data.key,

        amount: data.order.amount,

        currency: "INR",

        name: "Travel Booking",

        description: "Hotel Room Booking",

        order_id: data.order.id,

        handler: async function (response) {
          const verify = await axios.post(
            "/api/payment/verify-payment",

            {
              razorpay_order_id: response.razorpay_order_id,

              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_signature: response.razorpay_signature,
            },
          );

          if (verify.data.success) {
            toast.success("Payment Successful");

            navigate("/my-bookings");
          }
        },

        prefill: {
          name: "Guest",
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razor = new window.Razorpay(options);

      razor.open();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleBooking = async () => {
    try {
      if (!checkInDate || !checkOutDate) {
        return toast.error("Please select dates");
      }

      setLoading(true);

      const { data } = await axios.post(
        "/api/bookings/create-booking",

        {
          room: room._id,

          checkInDate,

          checkOutDate,

          guest: Number(guest),

          paymentMethod,
        },

        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        },
      );

      if (data.success) {
        // Offline

        if (paymentMethod === "Pay At Hotel") {
          toast.success("Booking Confirmed");

          navigate("/my-bookings");
        }

        // Online
        else {
          await startPayment(data.booking);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!room) {
    return <div className="py-40 text-center">Loading Room Details...</div>;
  }

  return (
    <div className="py-28 px-4 md:px-16 lg:px-24 xl:px-32">
      <h1 className="text-4xl font-playfair">
        {room.hotel?.name}

        <span className="text-sm ml-2">({room.roomType})</span>
      </h1>

      <div className="flex gap-2 mt-3">
        <StarRating />
        200+ reviews
      </div>

      <div className="flex gap-2 text-gray-500 mt-3">
        <img src={assets.locationIcon} />

        {room.hotel?.address}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        <img
          src={mainImage}
          className="lg:w-1/2 h-[450px] object-cover rounded-3xl"
        />

        <div className="grid grid-cols-2 gap-4">
          {room.images?.map((img, index) => (
            <img
              key={index}
              src={img}
              onClick={() => setMainImage(img)}
              className="h-40 rounded-xl cursor-pointer object-cover"
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <div>
          <h2 className="text-3xl font-playfair">Experience Luxury</h2>

          <div className="flex flex-wrap gap-3 mt-5">
            {room.amenities.map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 px-4 py-2 rounded-xl flex gap-2"
              >
                <img src={facilityIcons[item]} className="w-5" />

                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-3xl font-bold text-blue-600">
          ₹{room.pricePerNight}/night
        </p>
      </div>

      <div className="mt-16 bg-white shadow-xl p-6 rounded-3xl flex flex-wrap gap-6 items-end">
        <div>
          <label>Check In</label>

          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="block border p-2 rounded"
          />
        </div>

        <div>
          <label>Check Out</label>

          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="block border p-2 rounded"
          />
        </div>

        <div>
          <label>Guests</label>

          <input
            type="number"
            value={guest}
            onChange={(e) => setGuest(e.target.value)}
            className="block border p-2 rounded w-24"
          />
        </div>

        <div>
          <label>Payment</label>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="block border p-2 rounded"
          >
            <option>Pay At Hotel</option>

            <option value="Online Payment">Online Payment</option>
          </select>
        </div>

        <button
          onClick={handleBooking}
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl"
        >
          {loading ? "Processing..." : "Book Now"}
        </button>
      </div>

      <div className="mt-20">
        {roomCommonData.map((item, index) => (
          <div key={index} className="flex gap-3 mb-5">
            <img src={item.icon} className="w-6" />

            <div>
              <p>{item.title}</p>

              <p className="text-gray-500">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomDetails;
