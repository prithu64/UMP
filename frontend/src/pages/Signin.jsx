import axios from "axios";
import Bottomwarning from "../components/Bottomwarning";
import Formbutton from "../components/Formbutton";
import Formheading from "../components/Formheading";
import Forminput from "../components/Forminput";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signin(){

    const isButtonDisabled=()=>{
        return username === ""|| password===""
    }

    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();
   
    async function handleSubmit(e){
        e.preventDefault();
        try {
               const response = await axios.post("http://localhost:3000/api/v1/user/signin",{
                username,password
            },{withCredentials : true})
        
            if(!response.data.success){
              return alert("Invalid Input"); 
            }
            
            if(response.data.role === "user"){
             navigate("/userDashboard")
            }
            if(response.data.role==="admin"){
                navigate("/adminDashboard")
            }
            
        } catch (error) {
            console.log("error in signining in",error)
            alert("sign in error")
        }
    } 

    return <div className="flex justify-center h-screen bg-slate-300">
        <div className="flex flex-col justify-center">
            <div className="w-80 bg-white rounded-lg text-center px-4 h-max p-2">
                <Formheading label={"Sign in"}/>
                <Forminput placeholder={"abc123"} label={"Username/Email"} type={"text"} onChange={(e)=>{
                    setUsername(e.target.value)
                }}/>
                <Forminput placeholder={"abc123"} label={"Password"} type={"password"} onChange={(e)=>{
                    setPassword(e.target.value)
                }}/>
                
                <Bottomwarning label={"New here ?"} buttonText={"Sign up"} to={"/signup"}/>
               <div  className="text-xs underline mb-2"><Link to={"/forgotPassword"}>Forgot Password</Link></div>

                <Formbutton label={"Sign in"} onClick={handleSubmit}  disabled={isButtonDisabled()} />
            </div>
        </div>
      </div>   
}