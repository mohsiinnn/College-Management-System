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

import SubjectsListPage from './pages/admin/subject/SubjectsListPage'
import SubjectCreatePage from './pages/admin/subject/SubjectCreatePage'
import SubjectDetailsPage from './pages/admin/subject/SubjectDetailsPage'
import ClassSubjectsPage from './pages/admin/subject/ClassSubjectsPage'

import TeacherDetailsPage from './pages/admin/teacher/TeacherDetailsPage'
import TeacherCreatePage from './pages/admin/teacher/TeacherCreatePage'
import TeachersListPage from './pages/admin/teacher/TeachersListPage'



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

            {/* TEACHER RELATED  */}
            <Route path="/teachers" element={<TeachersListPage />} />
            <Route path="/teachers/new" element={<TeacherCreatePage />} />
            <Route path="/teachers/:id" element={<TeacherDetailsPage />} />

            {/* CLASS RELATED ROUTES */}
            <Route path="/admin/dashboard/classes" element={<ClassesListPage />} />
            <Route path="/admin/dashboard/classes/new" element={<ClassCreatePage />} />
            <Route path="/admin/dashboard/classes/:id" element={<ClassDetailsPage />} />

            {/* SUBJECT RELATED ROUTES */}
            <Route path="/admin/dashboard/subjects" element={<SubjectsListPage />} />
            <Route path="/admin/dashboard/subjects/new" element={<SubjectCreatePage />} />
            <Route path="/admin/dashboard/subjects/:id" element={<SubjectDetailsPage />} />
            <Route path="/admin/dashboard/classes/:id/subjects" element={<ClassSubjectsPage />} /> {/* optional */}


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