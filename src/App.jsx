import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './Pages/auth/SignUp'
import UserProfile from './Pages/UserProfile'
import Login from './Pages/auth/Login'
import AdminPanel from './Pages/AdminPanel'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<UserProfile />} />
        <Route path='/admin' element={<AdminPanel/>}/> 
      </Routes>
    </div>
  )
}

export default App
