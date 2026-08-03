// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const NearbyBikeShops = () => {

//   const [shops, setShops] = useState([]);
//   const [loading, setLoading] = useState(true);


//   useEffect(() => {


//     if (!navigator.geolocation) {

//       alert("Geolocation not supported");
//       setLoading(false);
//       return;

//     }



//     navigator.geolocation.getCurrentPosition(

//       async(position)=>{


//         const lat = position.coords.latitude;
//         const lon = position.coords.longitude;


//         console.log(
//           "Bike Location:",
//           lat,
//           lon
//         );



//         try{


//           const query = `

//           [out:json];

//           (
//             node["amenity"="bicycle_rental"](around:50000,${lat},${lon});
//             node["shop"="bicycle"](around:50000,${lat},${lon});
//             way["shop"="bicycle"](around:50000,${lat},${lon});
//             node["rental"="motorcycle"](around:50000,${lat},${lon});
//           );

//           out center;

//           `;



//           const response = await axios.post(

//             "https://overpass.kumi.systems/api/interpreter",

//             query,

//             {
//               headers:{
//                 "Content-Type":"text/plain"
//               }
//             }

//           );



//           console.log(
//             "Bike Shops Data:",
//             response.data.elements
//           );



//           setShops(
//             response.data.elements || []
//           );


//         }

//         catch(error){

//           console.log(
//             "Bike Shop Error:",
//             error
//           );

//         }


//         setLoading(false);


//       },

//       (error)=>{

//         console.log(error);

//         alert("Please allow location access");

//         setLoading(false);

//       }


//     );


//   },[]);





//   if(loading){

//     return (

//       <p className="text-center mt-5">

//         🔍 Finding Bike Rental Shops...

//       </p>

//     );

//   }





//   return (

//     <div className="mt-8">


//       <h2 className="text-3xl font-bold mb-5">

//         🏍️ Nearby Bike Rental Shops

//       </h2>



//       {
//         shops.length === 0 ? (

//           <p className="text-gray-500">

//             No Bike Rental Shop Found Nearby.

//           </p>

//         )

//         :

//         (

//           shops.map((shop,index)=>{


//             const data = shop.tags || {};


//             const latitude =
//               shop.lat || shop.center?.lat;


//             const longitude =
//               shop.lon || shop.center?.lon;



//             return (

//               <div

//                 key={index}

//                 className="bg-white border rounded-xl p-5 shadow-md mb-5"

//               >



//                 <h3 className="text-xl font-bold text-green-700">

//                   🏍️ {data.name || "Bike Rental Shop"}

//                 </h3>




//                 <p className="mt-2 text-gray-600">

//                   📍 

//                   {
//                     data["addr:street"] ||
//                     data["addr:city"] ||
//                     "Address not available"
//                   }

//                 </p>




//                 <p className="mt-2">

//                   🚲 Available for Rental

//                 </p>




//                 <button

//                   className="mt-4 bg-black text-white px-5 py-3 rounded-lg"

//                 >

//                   🏍️ View Bikes

//                 </button>




//                 <a

//                   href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}

//                   target="_blank"

//                   rel="noreferrer"

//                   className="inline-block ml-3 bg-blue-600 text-white px-5 py-3 rounded-lg"

//                 >

//                   🗺️ Map

//                 </a>



//               </div>

//             )


//           })

//         )
//       }



//     </div>

//   );

// };


// export default NearbyBikeShops;

import React, { useEffect, useState } from "react";
import axios from "axios";


const NearbyBikeShops = () => {


  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);



  const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {


    const R = 6371;


    const dLat =
      (lat2-lat1) * Math.PI / 180;


    const dLon =
      (lon2-lon1) * Math.PI / 180;



    const a =
      Math.sin(dLat/2) *
      Math.sin(dLat/2) +

      Math.cos(lat1*Math.PI/180) *
      Math.cos(lat2*Math.PI/180) *

      Math.sin(dLon/2) *
      Math.sin(dLon/2);



    const c =
      2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1-a)
      );


    return (R*c).toFixed(2);

  };






  useEffect(()=>{


    navigator.geolocation.getCurrentPosition(

      async(position)=>{


        const userLat =
        position.coords.latitude;


        const userLon =
        position.coords.longitude;



        try{


          const response = await axios.get(
            "http://localhost:3000/api/bikeshop/all"
          );



          let shopData =
          response.data.data || [];



          const updatedShops =
          shopData.map((shop)=>{


            let distance = null;



            if(shop.location){


              distance =
              calculateDistance(

                userLat,
                userLon,

                shop.location.latitude,
                shop.location.longitude

              );


            }



            return {

              ...shop,

              distance

            };


          });




          updatedShops.sort(
            (a,b)=>
            Number(a.distance || 999) -
            Number(b.distance || 999)
          );



          setShops(updatedShops);



        }

        catch(error){

          console.log(
            "Bike Error:",
            error
          );

        }


        setLoading(false);


      },


      ()=>{

        alert(
          "Please allow location access"
        );

        setLoading(false);

      }


    );


  },[]);







  if(loading){

    return <p>
      🔍 Finding Nearby Bike Rental...
    </p>

  }






  return (

    <div className="mt-8">


      <h2 className="text-3xl font-bold mb-5">

        🏍️ Nearby Bike Rental Shops

      </h2>



      {
        shops.length===0 ?

        (

          <p>
            No Bike Rental Shop Found
          </p>

        )

        :

        (

          shops.map((shop,index)=>(


            <div

            key={index}

            className="border rounded-xl p-5 mb-5 shadow"

            >


              <h3 className="text-xl font-bold text-green-700">

                🏍️ {shop.shopName}

              </h3>



              <p>
                📍 {shop.address}, {shop.city}
              </p>



              {
                shop.distance &&

                <p className="mt-2">

                  📏 {shop.distance} km away

                </p>
              }



              <h4 className="font-bold mt-4">

                Available Bikes

              </h4>



              {
                shop.bikes?.map((bike,i)=>(

                  <div
                  key={i}
                  className="border p-3 mt-3 rounded"
                  >

                    🏍️ {bike.bikeName}

                    <br/>

                    💰 ₹{bike.pricePerDay}/day


                    <button

                    className="mt-2 bg-black text-white px-4 py-2 rounded"

                    >

                    Book Bike

                    </button>


                  </div>


                ))
              }


            </div>


          ))

        )
      }



    </div>

  );


};


export default NearbyBikeShops;