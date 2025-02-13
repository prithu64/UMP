import { useState } from "react";
import Formbutton from "../components/Formbutton";
import Formheading from "../components/Formheading";
import Forminput from "../components/Forminput";
import axios from "axios";
import { useNavigate } from "react-router-dom";




export default function ForgotPassword(){
    const [email,setEmail] = useState("")
    const navigate = useNavigate()
    async function handleSend(){
       try {
           await axios.post("http://localhost:3000/api/v1/user/forgotPassword",{
            email
          }).then(res=>{
            if(res.data.Status === false){
             alert(res.data.message)
          }if(res.data.Status === true){
            alert(res.data.message)
          }
          navigate("/signin")
          })
          
       } catch (error) {
        console.log("error :",error)
       }
    }
  
    

    return <div className="flex justify-center items-center h-screen">
        <div className="px-2 border rounded w-80">
            <Formheading label={"Forgot Password"} />
            <div className="text-xl">Email</div>
            <Forminput placeholder={"abc@gmail.com"} className={""} onChange={(e)=>{
                setEmail(e.target.value);
                
            }} type={"email"} />
            <Formbutton label={"Send"} onClick={handleSend} />

        </div>
    </div>
}