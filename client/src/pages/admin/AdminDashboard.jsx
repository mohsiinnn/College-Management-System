import DashboardLoader from "../../components/DefaultText";
import Navbar from "../../components/Navbar"
import { useNavigate } from "react-router-dom"
import { Users, UserPlus, BookOpen, Layers, ClipboardList, UserCog } from "lucide-react";

const AdminDashboard = () => {
    const navigate = useNavigate()

    return (<>
        <Navbar />
        {/* <DashboardLoader /> */}
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">

                {/* Classes */}
                <div
                    onClick={() => navigate("/admin/dashboard/classes")}
                    className="bg-gradient-to-b from-purple-800 to-blue-900 rounded-2xl p-6 flex flex-col items-center text-white shadow-xl hover:scale-105 transform transition cursor-pointer"
                >
                    <Layers size={48} className="mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Manage Classes</h3>
                    <p className="text-center">View, add, and manage classes.</p>
                </div>

                {/* Subjects */}
                <div
                    onClick={() => navigate("/admin/dashboard/subjects")}
                    className="bg-gradient-to-b from-purple-800 to-blue-900 rounded-2xl p-6 flex flex-col items-center text-white shadow-xl hover:scale-105 transform transition cursor-pointer"
                >
                    <BookOpen size={48} className="mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Manage Subjects</h3>
                    <p className="text-center">View, add, and manage subjects.</p>
                </div>

                {/* Teachers */}
                <div
                    onClick={() => navigate("/admin/dashboard/teachers")}
                    className="bg-gradient-to-b from-purple-800 to-blue-900 rounded-2xl p-6 flex flex-col items-center text-white shadow-xl hover:scale-105 transform transition cursor-pointer"
                >
                    <UserCog size={48} className="mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Manage Teachers</h3>
                    <p className="text-center">View, add, and manage teachers.</p>
                </div>

                {/* Students - View All */}
                <div
                    onClick={() => navigate("/admin/dashboard/students")}
                    className="bg-gradient-to-b from-green-700 to-emerald-900 rounded-2xl p-6 flex flex-col items-center text-white shadow-xl hover:scale-105 transform transition cursor-pointer"
                >
                    <Users size={48} className="mb-4" />
                    <h3 className="text-xl font-semibold mb-2">All Students</h3>
                    <p className="text-center">View and manage all students.</p>
                </div>

                {/* Students - Create */}
                <div
                    onClick={() => navigate("/admin/dashboard/students/new")}
                    className="bg-gradient-to-b from-green-600 to-emerald-800 rounded-2xl p-6 flex flex-col items-center text-white shadow-xl hover:scale-105 transform transition cursor-pointer"
                >
                    <UserPlus size={48} className="mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Add Student</h3>
                    <p className="text-center">Create a new student profile.</p>
                </div>

                {/* Attendance */}
                <div
                    onClick={() => navigate("/admin/dashboard/attendance")}
                    className="bg-gradient-to-b from-amber-700 to-yellow-900 rounded-2xl p-6 flex flex-col items-center text-white shadow-xl hover:scale-105 transform transition cursor-pointer"
                >
                    <ClipboardList size={48} className="mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Attendance</h3>
                    <p className="text-center">Manage attendance records.</p>
                </div>
            </div>
        </div>
    </>);
}

export default AdminDashboard