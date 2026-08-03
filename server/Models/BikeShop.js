import mongoose from "mongoose";


const bikeShopSchema = new mongoose.Schema({

    shopName:{
        type:String,
        required:true
    },

    ownerName:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    },

    address:{
        type:String,
        required:true
    },

    city:{
        type:String,
        required:true
    },


    bikes:[
        {
            bikeName:{
                type:String
            },

            bikeType:{
                type:String
            },

            pricePerDay:{
                type:Number
            },

            available:{
                type:Boolean,
                default:true
            }
        }
    ],


    location:{
        latitude:Number,
        longitude:Number
    }


},
{
    timestamps:true
});


const BikeShop = mongoose.model(
    "BikeShop",
    bikeShopSchema
);


export default BikeShop;