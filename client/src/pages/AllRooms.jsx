import React, { useMemo, useState } from "react";
import { assets, facilityIcons } from "../assets/assets";
import { useSearchParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
      />
      <span>{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const { rooms, currency, navigate } = useAppContext();

  const [searchParams, setSearchParams] = useSearchParams();

  const [openFilters, setOpenFilters] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    roomType: [],
    priceRange: [],
  });

  const [selectedSort, setSelectedSort] = useState("");

  const roomTypes = useMemo(() => {
    return [...new Set(rooms.map((room) => room.roomType))];
  }, [rooms]);

  const priceRanges = [
    "0 to 500",
    "500 to 1000",
    "1000 to 2000",
    "2000 to 3000",
  ];

  const sortOptions = [
    "Price Low to High",
    "Price High to Low",
    "Newest First",
  ];

  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: checked
        ? [...prev[type], value]
        : prev[type].filter((item) => item !== value),
    }));
  };

  const matchesRoomType = (room) => {
    return (
      selectedFilters.roomType.length === 0 ||
      selectedFilters.roomType.includes(room.roomType?.trim())
    );
  };

  const matchesPriceRange = (room) => {
    if (selectedFilters.priceRange.length === 0) return true;

    return selectedFilters.priceRange.some((range) => {
      const [min, max] = range.split(" to ").map(Number);

      return (
        Number(room.pricePerNight) >= min && Number(room.pricePerNight) <= max
      );
    });
  };
  const filterDestination = (room) => {
    const destination = searchParams.get("destination");

    if (!destination) return true;

    return room.hotel.city.toLowerCase().includes(destination.toLowerCase());
  };

  const sortRooms = (a, b) => {
    if (selectedSort === "Price Low to High") {
      return a.pricePerNight - b.pricePerNight;
    }

    if (selectedSort === "Price High to Low") {
      return b.pricePerNight - a.pricePerNight;
    }

    if (selectedSort === "Newest First") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    return 0;
  };

  const filteredRooms = useMemo(() => {
    return rooms
      .filter(
        (room) =>
          matchesRoomType(room) &&
          matchesPriceRange(room) &&
          filterDestination(room),
      )
      .sort(sortRooms);
  }, [rooms, selectedFilters, selectedSort, searchParams]);

  const clearFilter = () => {
    setSelectedFilters({
      roomType: [],
      priceRange: [],
    });

    setSelectedSort("");
    setSearchParams({});
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row justify-between pt-28 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="w-full">
        <h1 className="text-4xl font-bold mb-8">Hotel Rooms</h1>

        {filteredRooms.map((room) => (
          <div
            key={room._id}
            className="flex flex-col md:flex-row gap-6 bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 mb-8"
          >
            <img
              src={room.images?.[0]}
              alt=""
              className="h-72 md:w-[45%] object-cover rounded-3xl cursor-pointer hover:scale-105 transition duration-300"
              onClick={() => navigate(`/rooms/${room._id}`)}
            />

            <div className="md:w-1/2">
              <p className="text-gray-500">{room.hotel.city}</p>

              <h2
                className="text-3xl font-bold text-slate-800 hover:text-blue-600 transition cursor-pointer"
                onClick={() => navigate(`/rooms/${room._id}`)}
              ></h2>

              <StarRating />

              <p className="flex items-center gap-2 mt-2">
                <img src={assets.locationIcon} alt="" />
                {room.hotel?.address}
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                {room.amenities.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded"
                  >
                    <img src={facilityIcons[item]} alt="" className="w-5" />

                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-3xl font-bold text-blue-600 mt-5">
                {currency} {room.pricePerNight}/night
              </h3>
              <button
                onClick={() => navigate(`/rooms/${room._id}`)}
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="w-80 bg-white rounded-3xl shadow-xl border border-gray-200 p-6 lg:ml-10 mb-8 top-28 h-fit">
        <div className="flex justify-between">
          <h2 className="font-bold">Filters</h2>

          <button onClick={clearFilter} className="text-blue-600">
            Clear
          </button>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Room Type</h3>

          {roomTypes.map((room) => (
            <CheckBox
              key={room}
              label={room}
              selected={selectedFilters.roomType.includes(room)}
              onChange={(checked) =>
                handleFilterChange(checked, room, "roomType")
              }
            />
          ))}
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Price Range</h3>

          {priceRanges.map((range) => (
            <CheckBox
              key={range}
              label={`₹ ${range}`}
              selected={selectedFilters.priceRange.includes(range)}
              onChange={(checked) =>
                handleFilterChange(checked, range, "priceRange")
              }
            />
          ))}
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Sort By</h3>

          {sortOptions.map((option) => (
            <RadioButton
              key={option}
              label={option}
              selected={selectedSort === option}
              onChange={setSelectedSort}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
