import mongoose from "mongoose";

const localBusinessSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    category:{
        type:String,
        required:true
    },

    description:{
        type:String
    },

    images:[
        {
            type:String
        }
    ],

    address:{
        type:String,
        required:true
    },

    location:{
        latitude:{
            type:Number,
            required:true
        },

        longitude:{
            type:Number,
            required:true
        }
    },

    contact:{
        type:String
    },

    rating:{
        type:Number,
        default:0
    },

    ownerName:{
        type:String
    },

    verified:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
});


const LocalBusiness = mongoose.model(
    "LocalBusiness",
    localBusinessSchema
);


export default LocalBusiness;