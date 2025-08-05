import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/resetPassword'

const App = () => {
  return (
    <>
      <Router>
        <div>
          <ToastContainer />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/email-verify' element={<EmailVerify />} />
            <Route path='/reset-password' element={<ResetPassword />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App