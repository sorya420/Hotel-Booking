import React, { useEffect, useState } from "react";
import axios from "axios";

const NearbyPoliceStations = () => {
  const [policeStations, setPoliceStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const res = await axios.get(
          `https://api.geoapify.com/v2/places?categories=service.police&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=10&apiKey=${API_KEY}`
        );

        setPoliceStations(res.data.features);
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading Police Stations...</p>;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">
        🚓 Nearby Police Stations
      </h2>

      {policeStations.length === 0 ? (
        <p>No Police Station Found.</p>
      ) : (
        policeStations.map((station, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 mb-4 shadow"
          >
            <h3 className="font-bold text-lg">
              {station.properties.name || "Police Station"}
            </h3>

            <p>{station.properties.formatted}</p>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${station.properties.lat},${station.properties.lon}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded"
            >
              📍 View on Map
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default NearbyPoliceStations;