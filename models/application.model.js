const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const jobApplicationSchema=new Schema({
    title:{
        type:Schema.Types.ObjectId,
        ref:"Job",
        required:true,
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status :{
        type:String,
        enum:["pending","accepted","rejected"],//set of possible value that it can have
        required:true,
    },
})

module.exports = mongoose.model("Application",jobApplicationSchema);