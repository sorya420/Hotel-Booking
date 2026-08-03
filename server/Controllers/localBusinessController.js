import LocalBusiness from "../Models/LocalBusiness.js";

// Get all local businesses
export const getLocalBusinesses = async (req, res) => {
  try {
    const businesses = await LocalBusiness.find();

    res.status(200).json({
      success: true,
      businesses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single local business by ID
export const getLocalBusinessById = async (req, res) => {
  try {
    const { id } = req.params;

    const business = await LocalBusiness.findById(id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    res.status(200).json({
      success: true,
      business,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Category filter
export const getBusinessesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const businesses = await LocalBusiness.find({
      category,
    });

    res.status(200).json({
      success: true,
      businesses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add local business
export const addLocalBusiness = async (req, res) => {
  try {
    const business = await LocalBusiness.create(req.body);

    res.status(201).json({
      success: true,

      message: "Business Added Successfully",

      business,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// Nearby local businesses
export const getNearbyLocalBusinesses = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,

        message: "Location required",
      });
    }

    const query = `

        [out:json];

        (

          node["amenity"="restaurant"](around:3000,${lat},${lng});

          node["amenity"="cafe"](around:3000,${lat},${lng});

          node["shop"="gift"](around:3000,${lat},${lng});

          node["shop"="craft"](around:3000,${lat},${lng});

        );

        out center;

        `;

    const response = await fetch(
      "https://overpass.private.coffee/api/interpreter",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/x-www-form-urlencoded",

          "User-Agent": "Travixy-App",
        },

        body: `data=${encodeURIComponent(query)}`,
      },
    );

    const text = await response.text();

    if (response.status !== 200) {
      throw new Error("Nearby service unavailable");
    }

    const data = JSON.parse(text);

    const businesses = data.elements.map((place) => ({
      name: place.tags?.name || "Local Business",

      category: place.tags?.amenity || place.tags?.shop || "Local",

      description: "Nearby local place",

      address: place.tags?.["addr:street"] || "Nearby Area",

      latitude: place.lat || place.center?.lat,

      longitude: place.lon || place.center?.lon,
    }));

    res.status(200).json({
      success: true,

      businesses,
    });
  } catch (error) {
    console.log("Nearby API Error:", error.message);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
