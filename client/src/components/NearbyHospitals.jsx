import React, { useEffect, useState } from "react";
import axios from "axios";

const NearbyHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const query = `
        [out:json];
        (
          node["amenity"="hospital"](around:5000,${lat},${lon});
          way["amenity"="hospital"](around:5000,${lat},${lon});
          relation["amenity"="hospital"](around:5000,${lat},${lon});
        );
        out center tags;
        `;

        try {
          const response = await axios.post(
            "https://overpass-api.de/api/interpreter",
            query,
            {
              headers: {
                "Content-Type": "text/plain",
              },
            }
          );
console.log(response.data);
          setHospitals(response.data.elements);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="mt-6 text-center">
        Loading Nearby Hospitals...
      </div>
    );
  }

  return (
    <div className="mt-8">

      <h2 className="text-2xl font-bold mb-4">
        🏥 Nearby Hospitals
      </h2>

      {hospitals.length === 0 ? (
        <p>No Hospital Found.</p>
      ) : (
        <div className="space-y-4">

          {hospitals.map((hospital, index) => {

            const latitude =
              hospital.lat || hospital.center?.lat;

            const longitude =
              hospital.lon || hospital.center?.lon;

            return (
              <div
                key={index}
                className="border rounded-xl p-4 shadow"
              >

                <h3 className="font-bold text-lg">
                  {hospital.tags?.name || "Hospital"}
                </h3>

                <p className="text-gray-500 mt-2">
                  📍 {hospital.tags?.addr_street || "Address not available"}
                </p>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  🗺️ Get Directions
                </a>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default NearbyHospitals;