import React, { useState, useEffect } from "react";
import axios from "axios";

const LocalConnect = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLocation({
          latitude,
          longitude,
        });

        try {
          const response = await axios.get(
            `http://localhost:3000/api/local-business/nearby?lat=${latitude}&lng=${longitude}`,
          );

          console.log("Nearby Businesses:", response.data.businesses);

          setBusinesses(response.data.businesses || []);
        } catch (error) {
          console.log("Nearby Business Error:", error);
        } finally {
          setLoading(false);
        }
      },

      (error) => {
        console.log("Location Error:", error);

        setLoading(false);
      },
    );
  }, []);

  const filteredBusinesses = businesses.filter((item) => {
    const shoppingCategory = [
      "gift",
      "craft",
      "supermarket",
      "mall",
      "clothes",
      "jewelry",
      "books",
      "convenience",
      "market",
    ];

    if (selectedCategory === "All") return true;

    if (selectedCategory === "Food") return item.category === "restaurant";

    if (selectedCategory === "Cafe") return item.category === "cafe";

    if (selectedCategory === "Shopping")
      return shoppingCategory.includes(item.category);

    return true;
  });

  return (
    <div className="pt-32 px-6 md:px-16 bg-gray-50 min-h-screen">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-800">
          Discover Local Treasures
        </h1>

        <p className="mt-3 text-gray-600">
          Explore nearby food, cafes, shops and local experiences.
        </p>

        {location && (
          <p className="mt-3 text-green-600">📍 Current location detected</p>
        )}

        <div className="flex flex-wrap gap-3 mt-6">
          {["All", "Food", "Cafe", "Shopping"].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full border ${
                selectedCategory === category
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="mt-10">🔍 Finding nearby places...</p>
      ) : filteredBusinesses.length === 0 ? (
        <p className="mt-10">No nearby businesses found.</p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {filteredBusinesses.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
            >
              <div className="text-4xl mb-4">
                {item.category === "restaurant"
                  ? "🍽️"
                  : item.category === "cafe"
                    ? "☕"
                    : "🛍️"}
              </div>

              <h2 className="text-xl font-bold">{item.name}</h2>

              <p className="text-blue-600 mt-1">{item.category}</p>

              <p className="text-gray-600 mt-3">
                {item.description || "Nearby local business"}
              </p>

              <p className="text-gray-500 mt-3">
                📍 {item.address || "Nearby Area"}
              </p>

              <a
                href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-5 bg-black text-white px-5 py-2 rounded-full"
              >
                Open Map
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocalConnect;
