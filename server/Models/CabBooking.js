// // import mongoose from "mongoose";


// // const cabSchema = new mongoose.Schema({

// //     pickup: {
// //         type: String,
// //         required: true
// //     },

// //     destination: {
// //         type: String,
// //         required: true
// //     },

// //     date: {
// //         type: String,
// //         required: true
// //     },

// //     time: {
// //         type: String,
// //         required: true
// //     },

// //     cabType: {
// //         type: String,
// //         default: "Mini"
// //     },

// //     passenger: {
// //         type: String,
// //         required: true
// //     },

// //     phone: {
// //         type: String,
// //         required: true
// //     },


// // },
// // {
// //     timestamps:true
// // });


// // const Cab = mongoose.model(
// //     "Cab",
// //     cabSchema
// // );


// // export default Cab;

// import mongoose from "mongoose";


// const cabSchema = new mongoose.Schema({

//     pickup:{
//         type:String,
//         required:true
//     },

//     destination:{
//         type:String,
//         required:true
//     },

//     date:{
//         type:String,
//         required:true
//     },

//     time:{
//         type:String,
//         required:true
//     },

//     cabType:{
//         type:String,
//         default:"Mini"
//     },

//     passenger:{
//         type:String,
//         required:true
//     },

//     phone:{
//         type:String,
//         required:true
//     }

// },
// {
//     timestamps:true
// });


// const Cab = mongoose.model(
//     "Cab",
//     cabSchema
// );


// export default Cab;

import mongoose from "mongoose";


const cabSchema = new mongoose.Schema({

    pickup:{
        type:String,
        required:true
    },


    destination:{
        type:String,
        required:true
    },


    date:{
        type:String,
        required:true
    },


    time:{
        type:String,
        required:true
    },


    cabType:{
        type:String,
        default:"Mini"
    },


    passenger:{
        type:String,
        required:true
    },


    phone:{
        type:String,
        required:true
    },


    // Distance in KM
    distance:{
        type:String,
        default:"0"
    },


    // Total calculated fare
    fare:{
        type:Number,
        default:0
    }


},
{
    timestamps:true
});



const Cab = mongoose.model(
    "Cab",
    cabSchema
);


export default Cab;