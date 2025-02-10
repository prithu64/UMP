import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function Forminput({placeholder,onChange,label,type,className}){

    const [isVisible,setVisible] = useState(false)    
    const toggle=()=>{
       setVisible(!isVisible)
    };

    return <div className="mb-4 relative">
    <div className="text-sm font-medium text-left py-2 " >
      {label}
    </div>
    <div className="relative">
       <input onChange={onChange}  className={`w-full border rounded border-slate-200 px-2 py-1 ${className}`} type={type ==="password"?(isVisible?"text":"password"):type} placeholder={placeholder} />
       {type === "password" && (
        <button type="button" onClick={toggle} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
          {isVisible ? <FaEye size={20}/>:<FaEyeSlash size={20}/>}
        </button>
       )}
    </div>
   
 </div>
}