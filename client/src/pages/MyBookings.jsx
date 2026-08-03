import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const MyBookings = () => {
  const { axios, getToken } = useAppContext();

  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Bookings"
        subTitle="Easily manage your past, current, and upcoming hotel reservations in one place."
        align="left"
      />

      <div className="max-w-6xl mt-8 w-full text-gray-800">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium py-3">
          <div>Hotels</div>

          <div>Date & Time</div>

          <div>Payment</div>
        </div>

        {bookings.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No bookings found</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] border-b border-gray-300 py-6"
            >
              {/* Hotel Details */}

              <div className="flex flex-col md:flex-row">
                <img
                  src={booking.room?.images?.[0]}
                  className="md:w-44 rounded shadow object-cover"
                />

                <div className="md:ml-4 mt-3 md:mt-0">
                  <p className="font-playfair text-2xl">
                    {booking.hotel?.name}

                    <span className="text-sm">({booking.room?.roomType})</span>
                  </p>

                  <div className="flex gap-2 text-sm text-gray-500 mt-2">
                    <img src={assets.locationIcon} />

                    {booking.hotel?.address}
                  </div>

                  <div className="text-sm text-gray-500 mt-2">
                    Guests: {booking.guest}
                  </div>

                  <p className="mt-2">Total: ₹{booking.totalPrice}</p>
                </div>
              </div>

              {/* Dates */}

              <div className="flex gap-8 mt-4 md:items-center">
                <div>
                  <p>Check-In</p>

                  <p className="text-gray-500 text-sm">
                    {new Date(booking.checkInDate).toDateString()}
                  </p>
                </div>

                <div>
                  <p>Check-Out</p>

                  <p className="text-gray-500 text-sm">
                    {new Date(booking.checkOutDate).toDateString()}
                  </p>
                </div>
              </div>

              {/* Payment */}

              <div className="flex flex-col justify-center mt-4">
                <div className="flex gap-2 items-center">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      booking.isPaid ? "bg-green-500" : "bg-red-500"
                    }`}
                  />

                  <p
                    className={
                      booking.isPaid ? "text-green-500" : "text-red-500"
                    }
                  >
                    {booking.isPaid ? "Paid" : "Unpaid"}
                  </p>
                </div>

                {!booking.isPaid && (
                  <button className="px-4 py-1.5 mt-4 text-xs border rounded-full">
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;
