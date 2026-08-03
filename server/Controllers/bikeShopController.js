import BikeShop from "../models/BikeShop.js";


// Add New Bike Shop

export const addBikeShop = async (req, res) => {

    try {

        const bikeShop = await BikeShop.create(req.body);


        res.status(201).json({

            success: true,

            message: "Bike Shop Added Successfully",

            data: bikeShop

        });


    } catch (error) {

        console.log("Bike Shop Error:", error);


        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};



// Get All Bike Shops

export const getBikeShops = async (req, res) => {

    try {

        const shops = await BikeShop.find();


        res.status(200).json({

            success:true,

            data:shops

        });


    } catch(error){

        console.log(error);


        res.status(500).json({

            success:false,

            message:"Server Error"

        });

    }

};