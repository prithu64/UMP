const express = require("express");
const { adminProtect } = require("../authMiddleware");
const router = express.Router();
const { User } = require("../db");


router.get("/getUsers",adminProtect,async(req,res)=>{
    try {
       const users = await User.find().select("-password");
       return res.json({users});  
    } catch (error) {
        console.log("error",error)
        return res.status(500).json({
          msg : "server error"
        })
    }
})

router.delete("/deleteUser/:id",adminProtect,async(req,res)=>{
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if(!deletedUser){
      return res.status(404).json({
        message : "User not found"
      })
    }
    return res.json({message : "user deleted successfully"})
  } catch (error) {
    console.log("Error deleting user:", error);
    return res.status(500).json({ msg: "Server error" });
  }
})

router.put("/update/:id",adminProtect,async(req,res)=>{
    
})



module.exports = router;