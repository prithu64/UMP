import { useState } from "react";
import Bottomwarning from "../components/Bottomwarning";
import Formbutton from "../components/Formbutton";
import Formheading from "../components/Formheading";
import Forminput from "../components/Forminput";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import PasswordRule from "../components/PasswordRule";
import zxcvbn from "zxcvbn"

export default function Signup(){
     
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [passwordStrength,setPasswordStrength] = useState(0);
    const navigate = useNavigate()

   async function handleSignIn(e){
    e.preventDefault();
    try {
        await axios.post("http://localhost:3000/api/v1/user/signup",{
        username,email,password
       },{withCredentials:true})

       alert("Account created successfully")

       navigate("/userDashboard")
    } catch (error) {
        console.log("error in sign up",error)
        alert("Sign up failed");
    }
    }

    function PasswordStrengthCheck(){
        const result = zxcvbn(password);
        setPasswordStrength(result.score);
    }

  return  <div className="flex justify-center items-center min-h-screen bg-slate-300">
  <div className="w-80 bg-white rounded-lg text-center px-4 py-8">
    <Formheading label={"Sign up"}/>
    <Forminput placeholder={"abc123"} label={"Username"} type={"text"} onChange={(e)=>{
      setUsername(e.target.value)
    }}/>
    <Forminput placeholder={"abc123@gmail.com"} label={"Email"} type={"email"} onChange={(e)=>{
      setEmail(e.target.value)
    }}/>
    <Forminput placeholder={"abc123"} label={"Password"} type={"password"}    className={`focus:border focus:outline-none ${passwordStrength < 4 ? 'focus:border-red-500' : 'focus:border-green-500'}`}  onChange={(e)=>{
      setPassword(e.target.value)
      PasswordStrengthCheck()
      
    }}/>
    <PasswordRule/>
    <Bottomwarning label={"Already a User ?"} buttonText={"Sign in"} to={"/signin"}/>
    <Formbutton label={"Sign up"} onClick={handleSignIn} />
  </div>
</div>
}