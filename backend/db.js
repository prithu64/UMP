//require('dotenv').config();
const mongoose = require("mongoose");


const connectDB = async()=>{
  try {
    await mongoose.connect("mongodb://localhost:27017/UMP")   
} catch (error) {
  console.log("ERROR: ",error);
} };

connectDB();


const userSchema = mongoose.Schema({
    username : {
        type : String,
        minlength: 4,
        maxlength : 10,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    role : {
        type: String,
        enum : ["user","admin"],
        default :"user",
    
    }
})

const User = mongoose.model("User",userSchema);


module.exports = {
    User
}



