const express = require("express");
const { adminProtect } = require("../authMiddleware");
const router = express.Router();


router.get("/getUsers",adminProtect,async(req,res)=>{
    try {
       const users = await find().select("-password");
       return res.json({users});  
    } catch (error) {
        console.log("error",error)
        return res.status(500).json({
          msg : "server error"
        })
    }
})

router.put("/update/:id",adminProtect,async(req,res)=>{
    
})



module.exports = router;