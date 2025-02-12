export default function PasswordRule(){
    return <div className="text-left border border-slate-200 mb-2 rounded-mb">
         <div className="text-xs p-1 text-red-400 ">
         Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.
         </div>
    </div>
}