const express = require("express");
const router = express.Router();
const jwt =  require("jsonwebtoken")
const zod = require("zod");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")
const { User } = require("../db");
const {JWT_SECRET,RESET_SECRET} =require("../config");
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
        msg:"Invalid input"
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
            msg : "User doesnt exist"
        })
    }
    
    console.log("checking if password correct")
    const keyMatch = await bcrypt.compare(password,user.password);

    if(!keyMatch){
        console.log("Wrong password")
        return res.json({
            msg :'Wrong Password'
        })
    } 

    const userId = user._id;
    const role = user.role;

    console.log("generate token")
    const token  = jwt.sign({userId,role},JWT_SECRET,{expiresIn:"1h"});


    //set the token in a cookie
    res.cookie("token",token,{
        httpOnly: true,
        secure: false,//only enable in production
        sameSite:"Strict"
    })
    
    //send success response
    res.status(200).json({
        msg : "YOU ARE LOGGED IN",
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


const Transporter = nodemailer.createTransport({//nodemailer
    service : "gmail",
    auth : {
        user : "prgthemessenger@gmail.com",
        pass : "lfof yibf ejyp mhtm"
    }
});
//forgot password
router.post("/forgotPassword",async(req,res)=>{
 const {success} = emailSchema.safeParse(req.body);
 if(!success){
    return res.json({
        msg :"invalid input"
    })
 }
 try {
     const email = req.body.email.toLowerCase();
     console.log("finding user mail")
     const user = await User.findOne({
        email
     })
     console.log(user)
    
     if(!user){
        console.log("user not found")
        return res.json({
            msg : "User not found"
        })
     }

     const userId = user._id

     console.log("generating reset token");
     const resetToken = jwt.sign({userId},RESET_SECRET,{expiresIn:"15m"})

     console.log("setting the reset token")
     const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

     const mailOptions = {
        from : "et22bthcs034@kazirangauniversity.in",
        to : user.email,
        subject : "Password reset",
        html : `<p>Click<a href="${resetLink}">Here</a> to reset your password. This expires in 15min</p>`
     };

     await Transporter.sendMail(mailOptions);

     res.json({
        msg:"Reset link sent to your Email"
     })
     console.log("Reset link sent to mail")
 } catch (error) {
    console.log("Forgot password error",error)
    return  res.json({
        msg : "Internal server error"
    })
 }})



//reset password
router.put("/reset-password",async(req,res)=>{
 const {token,password} = req.body
 
 console.log("recieved password : ",password)
 const {success} = passwordSchema.safeParse({password});
 
 if(!success){
    console.log("validation failer")
   return res.json({
        msg : "Invalid Password"
    })
 }
 
 console.log("checking for reset token")
 if(!token){
   return res.json({
    msg :"Reset token required"
   })
 }
 
 try {
 console.log("decoding reset token")
 const decoded = jwt.verify(token,RESET_SECRET);

 const userId = decoded.userId;
 const saltRounds = 10;
 const hashedpassword = await bcrypt.hash(password,saltRounds);
 
 console.log("finding user and updating the password ")
 const user = await User.findByIdAndUpdate(userId,{password : hashedpassword});

 if(!user){
    console.log("user not found")
    return res.json({
        msg : "User not found"
    })
 }

 console.log("Password updated")
 res.json({
    msg:"Password updated"
 })

 } catch (error) {
console.log("Error",error)
return res.status(400).json({
    msg : "Invalid token"
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
        console.log("getting user id")
        const userId = req.user.id;
        
        //find the user and delete
        await User.findByIdAndDelete(userId);
        
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


