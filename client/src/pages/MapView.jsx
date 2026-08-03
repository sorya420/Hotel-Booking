import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { GeocodingControl } from "@maptiler/geocoding-control/leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Auto move map to current location
function ChangeMapView({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);

  return null;
}

const MapView = () => {
  // Default Location (Delhi)
  const [position, setPosition] = useState([28.6139, 77.209]);
  const [locationName, setLocationName] = useState("Fetching location...");

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const current = [pos.coords.latitude, pos.coords.longitude];

        setPosition(current);
        try {
          const { data } = await axios.get(
            `https://api.maptiler.com/geocoding/${current[1]},${current[0]}.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
          );

          if (data.features && data.features.length > 0) {
            const place = data.features[0];

            const city =
              place.context?.find((item) => item.id.startsWith("place"))
                ?.text ||
              place.context?.find((item) => item.id.startsWith("locality"))
                ?.text ||
              place.text;

            const state = place.context?.find((item) =>
              item.id.startsWith("region"),
            )?.text;

            setLocationName(state ? `${city}, ${state}` : city);
          }
        } catch (error) {
          console.error("Location fetch failed:", error);
        }
      },
      (err) => {
        console.log(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, []);

  return (
    <div className="w-full h-[450px] mt-10 rounded-2xl overflow-hidden border border-gray-300 shadow-xl relative z-0">
      <div className="absolute top-20 left-4 z-[1000] bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-xl border border-gray-200 max-w-sm">
        <p className="text-xs text-gray-500 font-medium">📍 Current Location</p>

        <h3 className="text-sm font-semibold text-gray-800 mt-1">
          {locationName}
        </h3>
      </div>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <ChangeMapView center={position} />

        <TileLayer
          url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAPTILER_KEY}`}
          attribution="&copy; MapTiler & OpenStreetMap"
        />

        {/* Current Location Marker */}
        <Marker position={position}>
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold">📍 Your Current Location</h3>
              <p>You are here.</p>
            </div>
          </Popup>
        </Marker>

        {/* Accuracy Circle */}
        <Circle
          center={position}
          radius={100}
          pathOptions={{
            color: "#2563eb",
            fillColor: "#3b82f6",
            fillOpacity: 0.25,
            weight: 2,
          }}
        />
      </MapContainer>
    </div>
  );
};

export default MapView;
