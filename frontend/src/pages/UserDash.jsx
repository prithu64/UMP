import { useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom";


export default function UserDash(){

     const navigate = useNavigate()
     async function handleLogout(){
       try {
           await axios.post("http://localhost:3000/api/v1/user/logout",{},{
            withCredentials:true
           });
        alert("You are free");
        navigate("/signin")
       } catch (error) {
        console.log("error",error)
       }
    }
     
    const [user,setUser] = useState(null)
    async function fetchUser(){
        try {
             const response = await axios.get("http://localhost:3000/api/v1/user/getUser",{
                withCredentials : true
             }) 

             setUser(response.data.user);
        } catch (error) {
            console.log("error",error)
        }}

    useEffect(()=>{
      fetchUser()
    },[])
    
   if(!user){
    return <h1>Loading...</h1>
   }
     
    return <div className="flex flex-col h-screen justify-center items-center">
         <h1>Welcome, {user.role}</h1>
         <h1>Username : {user.username}</h1>
         <h1>Email: {user.email}</h1>
         <button className="border p-2 mt-2 cursor-pointer" onClick={handleLogout}>Log Out</button>
    </div>
}