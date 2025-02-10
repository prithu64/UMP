export default function Formbutton({label,onClick,disabled}){
 return <div>
    <button className="px-4 py-2 w-full rounded bg-gray-400 font-medium  hover:bg-gray-800 hover:text-white mb-2 mt-2 transition duration-200" disabled={disabled} onClick={onClick}>{label}</button>
 </div>
}