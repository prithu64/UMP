import { Link } from "react-router-dom"
export default function Bottomwarning({label,buttonText,to}){
   return <div className="flex text-sm justify-center py-2 ">
      <div>{label}</div>
      <Link to={to} className="cursor-pointer underline pl-1">{buttonText}</Link>
   </div>
}