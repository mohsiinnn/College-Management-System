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

import StudentsListPage from './pages/admin/student/StudentsListPage.jsx'
import StudentDetailsPage from './pages/admin/student/StudentDetailsPage'
import StudentCreatePage from './pages/admin/student/StudentCreatePage.jsx'

import Pendings from './pages/admin/ui/Pendings.jsx'
import StudentsPage from './pages/admin/ui/Students.jsx'
import TeachersPage from './pages/admin/ui/TeachersPage.jsx'
import SubjectsPage from './pages/admin/ui/SubjectsPage.jsx'
import ClassesPage from './pages/admin/ui/ClassesPage.jsx'
import DashboardLoader from './components/DefaultText.jsx'
import StudentAttendanceTable from './pages/student/ui/StudentAttendanceTable.jsx'
import StudentSubjectListDashboard from './pages/student/ui/StudentSubjectListDashboard.jsx'
import SAdminDashboard from './pages/SAdmin/SAdminDashboard.jsx'
import LoginSAdmin from './pages/SAdmin/ui/LoginSAdmin.jsx'
import SAdmins from './pages/SAdmin/ui/SAdmins.jsx'
import TeacherSubjectList from './pages/teacher/ui/TeacherSubjectList.jsx'


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
            <Route path='/student/dashboard' element={<DashboardLoader />} />
            <Route path='/teacher/dashboard' element={<TeacherDashboard />} />


            <Route path='/teacher/dashboard/subjects' element={<TeacherSubjectList />} />


            {/* STUDENT DASHBOARD ROUTES  */}
            <Route path="student/dashboard" element={<StudentDashboard />} />
            <Route path="student/dashboard/attendance" element={<StudentAttendanceTable />} />
            <Route path="student/dashboard/subjects" element={<StudentSubjectListDashboard />} />


            {/* ADMIN DASHBOARD ROUTES  */}

            <Route path='/admin/dashboard/pending-approvals' element={<Pendings />} />
            <Route path='/admin/dashboard/students-page' element={<StudentsPage />} />
            <Route path='/admin/dashboard/teachers-page' element={<TeachersPage />} />
            <Route path='/admin/dashboard/subjects-page' element={<SubjectsPage />} />
            <Route path='/admin/dashboard/classes-page' element={<ClassesPage />} />

            {/* SUPER ADMIN ROUTES  */}
            <Route path='/superAdmin' element={<LoginSAdmin />} />
            <Route path='/superAdmin/dashboard' element={<SAdminDashboard />} />
            <Route path='/superAdmin/dashboard/pending-approvals' element={<SAdminDashboard />} />
            <Route path='/superAdmin/dashboard/admins' element={<SAdmins />} />


            {/* TEACHER RELATED  */}
            <Route path="/admin/dashboard/teachers" element={<TeachersListPage />} />
            <Route path="/admin/dashboard/teachers/new" element={<TeacherCreatePage />} />
            <Route path="/admin/dashboard/teachers/:id" element={<TeacherDetailsPage />} />

            {/* STUDENT RELATED  */}
            <Route path="/admin/dashboard/students" element={<StudentsListPage />} />
            <Route path="/admin/dashboard/students/new" element={<StudentCreatePage />} />
            <Route path="/admin/dashboard/students/:id" element={<StudentDetailsPage />} />

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