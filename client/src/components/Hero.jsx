import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import Weather from "./Weather";

const Hero = () => {
  const { navigate, getToken, axios, setSearchCities } = useAppContext();
  const [destination, setDestinations] = useState("");

  const onSearch = async (e) => {
    e.preventDefault();
    navigate(`/rooms?destination=${destination}`);

    // call api for searched cities

    await axios.post(
      "/api/user/store-recent-search",
      { recentSearchedCity: destination },
      { headers: { Authorization: `Bearer ${await getToken()}` } },
    );

    // destination for  searched cities max 3 recent searched cities

    setSearchCities((prevSearchedCities) => {
      const updateSearchedCities = [...prevSearchedCities, destination];
      if (updateSearchedCities.length > 3) {
        updateSearchedCities.shift();
      }
      return updateSearchedCities;
    });
  };

  return (
    <div className='relative min-h-screen bg-[url("/src/assets/heroImage.png")] bg-cover bg-center bg-no-repeat flex items-center'>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 xl:px-32 py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE */}
          <div className="text-white">
            <p className="inline-block bg-sky-500/30 border border-sky-300 px-4 py-2 rounded-full">
              ✈️ The Ultimate Travel Experience
            </p>

            <h1 className="font-playfair text-4xl md:text-6xl font-bold mt-6 leading-tight">
              Discover Your Perfect
              <br />
              Gateway Destination
            </h1>

            <p className="mt-5 text-gray-200 max-w-xl text-lg">
              Experience luxury and comfort at India's most exclusive hotels and
              resorts. Book hotels, explore destinations and enjoy your journey
              safely.
            </p>

            {/* SEARCH FORM */}

            <form
              onSubmit={onSearch}
              className="bg-white rounded-2xl p-6 mt-10 shadow-2xl"
            >
              <div className="grid md:grid-cols-5 gap-4">
                {/* Destination */}

                <div>
                  <div className="flex items-center gap-2">
                    <img src={assets.calenderIcon} className="w-4" alt="" />

                    <label className="text-gray-700 font-medium">
                      Destination
                    </label>
                  </div>

                  <input
                    onChange={(e) => setDestinations(e.target.value)}
                    value={destination}
                    list="destinations"
                    className="w-full border rounded-lg px-3 py-3 mt-2 outline-none text-gray-700"
                    placeholder="Enter City"
                  />

                  <datalist id="destinations">
                    {cities.map((city, index) => (
                      <option key={index} value={city} />
                    ))}
                  </datalist>
                </div>

                {/* Check In */}

                <div>
                  <div className="flex items-center gap-2">
                    <img src={assets.calenderIcon} className="w-4" alt="" />

                    <label className="text-gray-700 font-medium">
                      Check In
                    </label>
                  </div>

                  <input
                    type="date"
                    className="w-full border rounded-lg px-3 py-3 mt-2 outline-none text-gray-700"
                  />
                </div>

                {/* Check Out */}

                <div>
                  <div className="flex items-center gap-2">
                    <img src={assets.calenderIcon} className="w-4" alt="" />

                    <label className="text-gray-700 font-medium">
                      CheckOut
                    </label>
                  </div>

                  <input
                    type="date"
                    className="w-full border rounded-lg px-3 py-3 mt-2 outline-none text-gray-700"
                  />
                </div>

                {/* Guests */}

                <div>
                  <label className="text-gray-700 font-medium">Guests</label>

                  <input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="0"
                    className="w-full border rounded-lg px-3 py-3 mt-2 outline-none text-gray-700"
                  />
                </div>

                {/* Search */}

                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white mt-7 h-12 flex justify-center items-center gap-2 transition duration-300"
                >
                  <img src={assets.searchIcon} alt="" className="w-5" />
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT SIDE */}

          <div className="flex justify-center">
            <div className="w-full max-w-md">
              {/* Live Weather */}

              <div className="mt-8">
                <Weather />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
