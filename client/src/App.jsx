import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import EmailVerify from './pages/auth/EmailVerify'
import ResetPassword from './pages/auth/ResetPassword'
import { useSelector } from 'react-redux'
import AdminDashboard from './pages/admin/AdminDashboard'
import StudentDashboard from './pages/student/StudentDashboard'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import ClassesListPage from './pages/admin/class/ClassList'
import ClassCreatePage from './pages/admin/class/CreateClass'
import ClassDetailsPage from './pages/admin/class/ClassDetail'



const App = () => {

  const { user } = useSelector((state) => state.auth)

  return (
    <>
      <Router>
        <div>
          <ToastContainer />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/admin' element={<Login role={'admin'} />} />
            <Route path='/student' element={<Login role={'student'} />} />
            <Route path='/teacher' element={<Login role={'teacher'} />} />
            <Route path='/email-verify' element={<EmailVerify />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
            <Route path='/student/dashboard' element={<StudentDashboard />} />
            <Route path='/teacher/dashboard' element={<TeacherDashboard />} />


            <Route path="/admin/dashboard/classes" element={<ClassesListPage />} />
            <Route path="/admin/dashboard/classes/new" element={<ClassCreatePage />} />
            <Route path="/admin/dashboard/classes/:id" element={<ClassDetailsPage />} />

          </Routes>
        </div>

        {/* {user.role === "admin" &&
          <>
            <AdminDashboard />
          </>
        }
        {user.role === 'student' &&
          <>
            <StudentDashboard />
          </>
        }
        {user.role === 'teacher' &&
          <>
            <TeacherDashboard />
          </>
        } */}


      </Router>
    </>
  )
}

export default App