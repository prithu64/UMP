import axios from "axios"
import { useEffect, useState } from "react"
import { MdOutlineDelete } from "react-icons/md";

export default function UserList() {
    const [users, setUsers] = useState([]);

    async function GetUser() {
        try {
            const response = await axios.get("http://localhost:3000/api/v1/admin/getUsers",{withCredentials:true});

            if (!response.data || !response.data.users) {
                return alert("Server Error");
            }

            console.log("Users fetched:", response.data.users);
            setUsers(response.data.users);
        } catch (error) {
            console.log("Error fetching users:", error);
            alert("Failed to fetch users");
        }
    }

    async function Handledelete(userId){
        if(!window.confirm("delete User ? ")){
            return;
        }
       try {
        await axios.delete(`http://localhost:3000/api/v1/admin/deleteUser/${userId}`, { withCredentials: true });
        alert("user deleted successfully");
        setUsers(users.filter(user=>user._id !== userId)); 
       } catch (error) {
        console.log("error",error)
        alert("Failed to delete user")
       }
    }

    useEffect(() => {
        GetUser();
    }, []);

    return (
        <div className="p-3">
            <h2 className="text-center text-2xl font-semibold mb-8">User List</h2>
            {users.length === 0 ? (
                <p className="flex justify-center items-center h-screen w-full">No users found</p>
            ) : (
                users.map((user) => (
                    <div key={user._id} className="border flex-row p-2 m-2">
                        <p ><strong>Username:</strong> {user.username}</p>
                        <p ><strong>Email:</strong> {user.email}</p>
                        <p ><strong>Role:</strong> {user.role}</p>
                        <div className="flex justify-end items-center h-full">
                             <button className="cursor-pointer" onClick={()=>{
                                Handledelete(user._id);
                             }}><MdOutlineDelete size={30} /></button>
                        </div>
                    </div>
                    
                ))
            )}
        </div>
    );
}
