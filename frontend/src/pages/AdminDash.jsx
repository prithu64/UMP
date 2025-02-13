import { useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { MdOutlineDelete } from "react-icons/md";
import { SlLogout } from "react-icons/sl";
import { FaRegPenToSquare } from "react-icons/fa6";
import { RiLockPasswordLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";



export default function AdminDash(){
     
     const [user,setUser] = useState(null)
     const [isModalOpen,setModalOpen] = useState(false)
     const [username,setUsername] = useState("")
     const [email,setEmail] = useState("");

     const navigate = useNavigate()

     async function deleteUser(){
      try {

        const confirmDelete= window.confirm("Are you sure, you want to delete your account ?")
        if(!confirmDelete){
          return ;
        }

        await axios.delete("http://localhost:3000/api/v1/user/delete",{
          withCredentials:true
        });
        navigate("/signup")
      } catch (error) {
        console.log("error",error)
      }
     } 

     async function handleForgotPassword(){
        try {
           const confirm =  window.confirm("Reset password ?");
           if(!confirm){
            return ;
           }
            navigate("/forgotPassword")
        } catch (error) {
          console.log("error :",error)
        }
     }

     async function handleLogout(){
       try {
        const confirmDelete= window.confirm("Are you sure, you want to log out ?")
        if(!confirmDelete){
          return ;
        }
           await axios.post("http://localhost:3000/api/v1/user/logout",{},{
            withCredentials:true
           });
        alert("You are free");
        navigate("/signin")
       } catch (error) {
        console.log("error",error)
       }
    }
     
    

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
    },[setUser])

    async function handleUpdateUser(e) {
      e.preventDefault();
      try {
        const response = await axios.put("http://localhost:3000/api/v1/user/update", {
          username,
          email
        }, {
          withCredentials: true
        });
        setUser(response.data.updatedUser);
        setModalOpen(false);
      } catch (error) {
        console.log("error", error);
      }
    }
    
   if(!user){
     return <div className="flex justify-center items-center h-screen">
      <h1>Loading...</h1>
    </div> 
   }
     
    return <div className="flex flex-col h-screen justify-center items-center">
         <h1 className="border rounded-full h-10 w-10 text-center text-2xl font-semibold">{user.username[0]}</h1>
         <h1>Welcome, {user.role}</h1>
         <h1>Username : {user.username}</h1>
         <h1>Email: {user.email}</h1>
         <div className="flex ">
         <button className="border p-2 mt-5 mx-6 cursor-pointer" onClick={()=>{
          navigate("/userList")
         }}>< FiUsers size={25} /></button>
         <button className="border p-2 mt-5 mx-6 cursor-pointer" onClick={handleForgotPassword}>< RiLockPasswordLine size={25} /></button>
          <button className="border p-2 mt-5 mx-6 cursor-pointer" onClick={()=>{
            setModalOpen(!isModalOpen)
          }}><FaRegPenToSquare size={25}/> </button>
          <button className="border p-2 mt-5 mx-6 cursor-pointer" onClick={handleLogout}><SlLogout size={25} /></button>
          <button onClick={deleteUser} className="border p-2 mt-5 mx-6 cursor-pointer"><MdOutlineDelete size={25} /></button>
         </div>    
       
         {isModalOpen && (
        <div className="fixed inset-0  bg-slate-400/70 flex justify-center items-center z-10">
          <div className="bg-white p-5 border w-100 h-95 ">
            <h2 className="text-xl font-semibold mb-4 mt-4">Update User Details</h2>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-center mt-9">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="mr-2 p-2 bg-gray-500 text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="p-2 bg-blue-500 text-white cursor-pointer"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
} 