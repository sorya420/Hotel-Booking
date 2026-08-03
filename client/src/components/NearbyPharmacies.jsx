


// export default NearbyPharmacies;

import React, { useEffect, useState } from "react";
import axios from "axios";

const NearbyPharmacies = () => {

  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;


  useEffect(() => {


    if (!navigator.geolocation) {

      alert("Geolocation not supported");
      setLoading(false);
      return;

    }



    navigator.geolocation.getCurrentPosition(

      async(position)=>{


        const lat = position.coords.latitude;
        const lon = position.coords.longitude;


        console.log(
          "Current Location:",
          lat,
          lon
        );


        try {


          const response = await axios.get(

            "https://api.geoapify.com/v2/places",

            {
              params: {

                // broad search
                categories:
                  "commercial,healthcare",

                filter:
                  `circle:${lon},${lat},20000`,

                bias:
                  `proximity:${lon},${lat}`,

                limit:50,

                apiKey:API_KEY

              }

            }

          );



          console.log(
            "All Places:",
            response.data.features
          );



          const pharmacyList =
            response.data.features.filter((shop)=>{


              const name =
              (
                shop.properties.name ||
                ""
              ).toLowerCase();



              const category =
              (
                shop.properties.categories?.join(" ") ||
                ""
              ).toLowerCase();



              return (

                name.includes("pharma") ||

                name.includes("medical") ||

                name.includes("chemist") ||

                name.includes("medicine") ||

                category.includes("pharmacy") ||

                category.includes("health")

              );


            });



          console.log(
            "Filtered Pharmacy:",
            pharmacyList
          );



          setPharmacies(pharmacyList);



        }

        catch(error){


          console.log(
            "Pharmacy Error:",
            error
          );


        }


        setLoading(false);


      },


      ()=>{


        alert(
          "Please allow location permission"
        );

        setLoading(false);


      }


    );


  },[]);





  if(loading){

    return (

      <p className="text-center mt-5">

        🔍 Finding Nearby Pharmacy...

      </p>

    );

  }





  return (

    <div className="mt-6">


      <h2 className="text-2xl font-bold mb-4">

        💊 Nearby Pharmacy Shops

      </h2>




      {
        pharmacies.length===0 ? (

          <p className="text-gray-500">

            No Pharmacy Found Nearby.

          </p>


        ):(


          pharmacies.map((shop,index)=>{


            const data = shop.properties;



            return (

              <div

                key={index}

                className="border rounded-xl p-5 mb-4 shadow-md bg-white"

              >


                <h3 className="text-xl font-bold text-green-700">

                  💊 {data.name || "Medical Store"}

                </h3>



                <p className="mt-2 text-gray-600">

                  📍 {data.formatted || "Address not available"}

                </p>



                {
                  data.distance && (

                    <p className="mt-2">

                      📏 {(data.distance/1000).toFixed(2)} km away

                    </p>

                  )
                }



                <a

                  href={`https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lon}`}

                  target="_blank"

                  rel="noreferrer"

                  className="inline-block mt-4 bg-green-600 text-white px-5 py-2 rounded-lg"

                >

                  🗺️ View Map

                </a>



              </div>

            );


          })


        )
      }



    </div>

  );

};


export default NearbyPharmacies;