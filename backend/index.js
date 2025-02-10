const express = require("express");
const app = express();
const mainRouter = require("./route/index")
const cors = require("cors")
const cookieParser = require("cookie-parser");


app.use(cors(
    {
        origin : "http://localhost:5173",
        credentials:true //for cookies
    }
))

app.use(express.json());
app.use(cookieParser());//enable cookie parsing

app.use("/api/v1",mainRouter);//connecting to main router 

app.listen(3000,()=>{
    console.log("Server running on port 3000")
})