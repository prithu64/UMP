const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");
const { User } = require("./db");


const protect = (req,res,next) =>{
      var count = 0;
    try {
        count+=1 ;
        console.log(count)
        console.log("Extracting token from cookie")
       
       const token = req.cookies.token;

       if(!token){
        console.log("no token found")
        return res.status(401).json({
            msg:"Not authorized,no token"
        })
       }
       
       const decoded = jwt.verify(token,JWT_SECRET);
       req.user = { id : decoded.userId} //assign user data from token 
        
       next();

    }catch(error){
        console.log("error",error)
        return res.json({
            msg:"Invalid token"
        })
    }
   
}

const adminProtect = (req,res,next)=>{
    try {

        console.log("Extracting token from cookie")
        const token = req.cookies.token;
 
        if(!token){
         console.log("no token found")
         return res.json({
             msg:"Not authorized,no token"
         })
        }
        
        const decoded = jwt.verify(token,JWT_SECRET);
        req.user = { id : decoded.userId, role : decoded.role} 
        if(decoded.role !== "admin"){
            return res.json({
                Status : false,
                message : "admin role required"
            })
        }
       next();
    } catch (error) {
        console.log("error",error);
        return res.json({
            Status : false,
            message : "invalid"
        })
    }
}

module.exports = {
    protect,adminProtect
}
