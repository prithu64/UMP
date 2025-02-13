import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import UserDash from './pages/UserDash'
import AdminDash from './pages/AdminDash'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import UserList from './pages/UserList'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route element={<Signin/>} path='/'/>
        <Route element={<UserList/>} path='/userList'/>
        <Route element={<ResetPassword/>} path='/reset-password/:id/:token'/>
        <Route element={<ForgotPassword/>} path='/forgotPassword'/>
        <Route element={<Signup/>} path='/signup'/>
        <Route element={<Signin/> } path='/signin' />
        <Route element={<UserDash/>} path='/userDashboard' />
        <Route element={<AdminDash/>}  path='/adminDashboard'/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
