const express = require("express");
const router = express.Router();
const jwt =  require("jsonwebtoken")
const zod = require("zod");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")
const { User } = require("../db");
const {JWT_SECRET,RESET_SECRET, PASS_SECRET} =require("../config");
const { protect } = require("../authMiddleware");


const signupSchema = zod.object({
    username : zod.string(),
    email : zod.string().email(),
    password : zod.string().min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/\W/, "Password must contain at least one special character (@$!%*?&)")
})

const signinSchema = zod.object({
    username : zod.string(),
    password : zod.string().min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[@$!%*?&+\+]/, "Password must contain at least one special character (@$!%*?&)")
})

const emailSchema = zod.object({
    email : zod.string().email()
})

const passwordSchema = zod.object({
    password : zod.string().min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[@$!%*?&\+]/, "Password must contain at least one special character (@$!%*?&)")
})

const updateSchema = zod.object({
    username : zod.string().optional(),
    email : zod.string().optional()
})


//signup
router.post("/signup",async (req,res)=>{
   const {success} = signupSchema.safeParse(req.body);//safeparse gives a success object
   if(!success){
    return res.json({
        msg : "Invalid data"
    })
   }
   
   try{
   const username = req.body.username.toLowerCase();
   const email = req.body.email.toLowerCase();
   const passwordString =req.body.password
   
   const saltRounds = 10;
   const hashedpassword = await bcrypt.hash(passwordString,saltRounds);

   console.log("checking if user exist...")
   const existingUser = await User.findOne({
       $or:[{username},{email}]
   });


   if(existingUser){
     console.log("user already exist")
     return res.json({
        msg : "Username/email taken"
     })
   }
      
     console.log("creating user")
     const dbUser = await User.create({username,email, password: hashedpassword});

     console.log("user created",dbUser)
  
     const userId = dbUser._id
    
    console.log("generate JWT token")
    const token = jwt.sign({
      userId
      },JWT_SECRET)
     
     
    
    console.log("setting token in cookie")
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"strict",
        secure:false,
        maxAge:7*24*60*60*1000 //cookie expires in 7 days
    })
    console.log("cookie set")

     res.status(201).json({
        msg : "User successfully created",
      })


    }catch(error){
         console.log("signup error",error);
      }})


router.get("/getUser",protect,async(req,res)=>{

    try {
         const user = await User.findById(req.user.id).select("-password");
         if(!user){
            return res.status(404).json({
             msg : "User not found"
            })
         }
         res.json({user})
    } catch (error) {
        console.log("error while fetching",error)
        return res.status(500).json({
            msg:"Server error"        
        })
    }
   
})

//signin
router.post("/signin",async(req,res)=>{
 if(!req.body){
    return res.json({
        msg : "No input"
    })
 }
 const {success} = signinSchema.safeParse(req.body);
 if(!success){
    return res.json({
        message :"Invalid input"
    })
 }

 try {
    const username = req.body.username.toLowerCase();
    const password = req.body.password ;
     
    
    console.log("finding user in database");
    const user = await User.findOne({
        username
    })
    
    if(!user){
        console.log("no such user")
        return res.json({
            success:false,
            message : "User doesnt exist"
        })
    }
    
    console.log("checking if password correct")
    const keyMatch = await bcrypt.compare(password,user.password);

    if(!keyMatch){
        console.log("Wrong password")
        return res.json({
            success:false,
            message:'Wrong Password'
        })
    } 

    const userId = user._id;
    const role = user.role;

    console.log("generate token")
    const token  = jwt.sign({userId,role},JWT_SECRET,{expiresIn:"2h"});


    //set the token in a cookie
    res.cookie("token",token,{
        httpOnly: true,
        secure: false,//only enable in production
        sameSite:"Strict"
    })
    
    //send success response
    res.status(200).json({
        success:true,
        message : "YOU ARE LOGGED IN",
        token : token,
        role : role
    })


    
    if(role==="admin"){
        console.log("welcome admin");
    }else{
         console.log("logged in")
    }
    } catch (error) {
    console.log("Signin error",error)
 }});


router.post("/logout",(req,res)=>{
    res.clearCookie("token",{
        sameSite:"strict",
        httpOnly:true,
        secure:false //only in production
    })
    return res.status(200).json({
        msg:"Logged out successfully"
    })
})

//forgot password
router.post("/forgotPassword",async(req,res)=>{
    console.log("finding user")
    await User.findOne({email : req.body.email})
    .then(user=>{
        if(!user){
            console.log("user not found")
            return res.json({
                Status : false,
                message:"User not found "})
        }
        const token = jwt.sign({id : user._id},JWT_SECRET,{expiresIn:"1d"})
        
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'prgthemessenger@gmail.com',
              pass: PASS_SECRET
            }
          });
          
          var mailOptions = {
            from: 'youremail@gmail.com',
            to: req.body.email ,
            subject: 'Reset Link',
            text: `http://localhost:5173/reset-password/${user._id}/${token}`
          };
          console.log("mail sent")
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              return res.json({
                Status:false,
                message : "failed"
              })
            } else {
              return res.json({
                Status : true,
                message : "Success"})
            }
          });
    })

})

router.put("/reset-password/:id/:token",async(req,res)=>{
   const  {id,token} = req.params;
   console.log("checking password")
   const result = passwordSchema.safeParse(req.body);
   if(!result.success){
    console.log("password validation failed",result.error.errors)
    return res.json({
        Status : false ,
        message : "Invalid Password"
    })
   }
   try {
    console.log("verifying token")
     const decoded = jwt.verify(token,JWT_SECRET);
     const saltRounds = 10;
     const hashedpassword = await bcrypt.hash(req.body.password,saltRounds)
     
     console.log("updating password")
     await User.findByIdAndUpdate( id,{password : hashedpassword})
     console.log("password updated")

     res.json({
        Status : true,
        message : "Password Updated"
     })

   } catch (error) {
    console.log("error : ",error);
    return res.status(500).json({
        Status : false,
        message : "Server error"
    })
   }
  
})

//update user
router.put("/update",protect,async(req,res)=>{
    const {success} = updateSchema.safeParse(req.body);
    if(!success){
       return res.json({
            msg : "invalid input"
        })
    }

    try {
        const updatefields = {}
        if(req.body.username){
            updatefields.username = req.body.username.toLowerCase()
        }
        if(req.body.email){
            updatefields.email = req.body.email.toLowerCase()
        }
       
         console.log("updating user")
         const updatedUser =  await User.updateOne({_id: req.user.id},updatefields)
         
         res.json({
            updatedUser,
            msg : "Updated successfully"
         })
        

    } catch (error) {
        console.log("error",error)
        return res.status(500).json({
            msg : "Server Error"
        })
    }
})

//delete account
router.delete("/delete",protect,async (req,res)=>{
    try {
        console.log("getting user id and deleting")
        //find the user and delete
        await User.findByIdAndDelete(req.user.id);
        
        //clear auth token
        res.clearCookie("token"); 

        return res.json({
            msg : "User deleted successfully"
        })
    } catch (error) {
        console.log("error deleting user",error)
        return res.json({
            msg : "Server error"
        })
    }
})


module.exports = router;


