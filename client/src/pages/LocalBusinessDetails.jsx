import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const LocalBusinessDetails = () => {
  const { id } = useParams();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/local-business/${id}`,
        );

        setBusiness(response.data.business);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  if (loading) {
    return <div className="pt-32 text-center">Loading...</div>;
  }

  if (!business) {
    return <div className="pt-32 text-center">Business Not Found</div>;
  }

  return (
    <div className="pt-32 px-6 md:px-16 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-800">{business.name}</h1>

        <p className="text-blue-600 mt-2">{business.category}</p>

        <p className="text-gray-600 mt-5">{business.description}</p>

        <div className="mt-5 space-y-3">
          <p>⭐ Rating: {business.rating || "4.5"}</p>

          <p>📍 Location: {business.address}</p>

          <p>📞 Contact: {business.phone || "Not Available"}</p>
        </div>

        <button className="mt-8 bg-black text-white px-6 py-3 rounded-full">
          Visit Shop
        </button>
      </div>
    </div>
  );
};

export default LocalBusinessDetails;
