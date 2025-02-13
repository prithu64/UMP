import { useState } from "react";
import Formbutton from "../components/Formbutton";
import Formheading from "../components/Formheading";
import Forminput from "../components/Forminput";
import axios from "axios";
import zxcvbn from "zxcvbn"
import { useNavigate, useParams } from "react-router-dom";


export default function ResetPassword(){
    const navigate = useNavigate()
    const [password,setPassword] = useState("")
    const [passwordStrength,setPasswordStrength] = useState(0);
    const {id,token} = useParams()

    async function handleSend(){
       try {
        await axios.put(`http://localhost:3000/api/v1/user/reset-Password/${id}/${token}`,{
            password
          },{withCredentials:true}).then(res=>{
            if(res.data.Status){
             alert(res.data.message)
             navigate("/signin");
            }
            if(res.data.Status === false){
                alert(res.data.message)
            }
          })
       } catch (error) {
        console.log("error :",error)
        alert("Update failed")
       }
    }

    
    function PasswordStrengthCheck(){
        const result = zxcvbn(password);
        setPasswordStrength(result.score);
    }

    return <div className="flex justify-center items-center h-screen">
            <div className="px-2 border rounded w-80">
                <Formheading label={"Reset Password"} />
                <Forminput placeholder={"Abc12@er"}   className={`focus:border focus:outline-none ${passwordStrength < 4 ? 'focus:border-red-500' : 'focus:border-green-500'}`} onChange={(e)=>{
                    setPassword(e.target.value);
                    PasswordStrengthCheck()
                }} type={"password"} />
                <Formbutton label={"Update"} onClick={handleSend} />
               
            </div>
        </div>
}