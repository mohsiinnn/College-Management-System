import { User, Users, GraduationCap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthState, registerUser } from '../redux/auth/authSlice'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // const { user } = useSelector((state) => state.auth)

  const adminDashboard = () => {
    // dispatch(registerUser())  //iss ki wjha sy error a raha hai ku ky jesy hi ye reducer call hota hai tou backend main empty values a jati hain jis ki wjha sy server error a raha hai
    navigate('/admin')
    dispatch(clearAuthState())
  }
  
  const studentDashboard = () => {
    // dispatch(registerUser())
    navigate('/student')
    dispatch(clearAuthState())
  }

  const teacherDashboard = () => {
    // dispatch(registerUser())
    navigate('/teacher')
    dispatch(clearAuthState())
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {/* Admin */}
        <div className="bg-gradient-to-b from-purple-800 to-blue-900 rounded-2xl p-6 flex flex-col items-center text-white shadow-xl hover:scale-105 transform transition"
          onClick={adminDashboard}
        >
          <User size={48} className="mb-4" />
          <h3 className="text-xl font-semibold mb-2">Admin</h3>
          <p className="text-center">Login as an administrator to access the dashboard to manage app data.</p>
        </div>
        {/* Student */}
        <div className="bg-gradient-to-b from-purple-800 to-blue-900 rounded-2xl p-6 flex flex-col items-center text-white shadow-xl hover:scale-105 transform transition"
          onClick={studentDashboard}
        >
          <GraduationCap size={48} className="mb-4" />
          <h3 className="text-xl font-semibold mb-2">Student</h3>
          <p className="text-center">Login as a student to explore course materials and assignments.</p>
        </div>
        {/* Teacher */}
        <div className="bg-gradient-to-b from-purple-800 to-blue-900 rounded-2xl p-6 flex flex-col items-center text-white shadow-xl hover:scale-105 transform transition"
          onClick={teacherDashboard}
        >
          <Users size={48} className="mb-4" />
          <h3 className="text-xl font-semibold mb-2">Teacher</h3>
          <p className="text-center">Login as a teacher to create courses, assignments, and track student progress.</p>
        </div>
      </div>
    </div>
  );
}

export default Header