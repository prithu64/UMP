const express = require("express")
const router = express.Router()//get router from express

const userRouter = require('./user')
const adminRouter = require('./admin')

router.use("/user",userRouter)//for user route
router.use("/admin",adminRouter)//for admin route

module.exports = router;