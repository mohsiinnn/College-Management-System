import { TrendingUp, Users, GraduationCap, Clock, Building2, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPendingApprovals } from "../../../redux/admin/adminSlice"
import { fetchStudents } from "../../../redux/student/studentSlice"
import { fetchClasses } from "../../../redux/class/classSlice"
import { fetchTeachers } from "../../../redux/teacher/teacherSlice"
import { useEffect } from "react";


const Dashboard = () => {
    const { users } = useSelector((state) => state.users);
    const { classes } = useSelector((state) => state.class)
    const { students } = useSelector((s) => s.student)
    const { teachers } = useSelector((state) => state.teacher)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchPendingApprovals())
        dispatch(fetchClasses())
        dispatch(fetchStudents())
        dispatch(fetchTeachers())

    }, [dispatch])


    return (<>
        <main className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">

                <div className="bg-white rounded-xl shadow-sm p-4 my-0 flex items-center justify-between">
                    {/* Left side: title, value, footer */}
                    <div>
                        <p className="text-sm text-slate-500">Total Students</p>
                        <p className="text-3xl font-semibold text-slate-900 ">{students?.length}</p>
                        <div className="mt-1 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <p className="text-sm text-green-600">+12% from last month</p>
                        </div>
                    </div>

                    {/* Right side: icon vertically centered */}
                    <div className="h-13 w-13 rounded-xl grid place-items-center text-white bg-gradient-to-br from-blue-100 to-indigo-100">
                        <Users className="h-7 w-7 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 my-0 flex items-center justify-between">
                    {/* Left side: title, value, footer */}
                    <div>
                        <p className="text-sm text-slate-500">Total Teachers</p>
                        <p className="text-3xl font-semibold text-slate-900">{teachers?.length}</p>
                        <div className="mt-1 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <p className="text-sm text-green-600">+3% from last month</p>
                        </div>
                    </div>

                    {/* Right side: icon vertically centered */}
                    <div className="h-13 w-13 rounded-xl grid place-items-center text-white bg-gradient-to-br from-green-100 to-emerald-100">
                        <GraduationCap className="h-7 w-7 text-green-600" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 my-0 flex items-center justify-between">
                    {/* Left side: title, value, footer */}
                    <div>
                        <p className="text-sm text-slate-500">Pending Approvals</p>
                        <p className="text-3xl font-semibold text-slate-900">{users.length}</p>
                        <div className="mt-1 flex items-center gap-2">
                            <p className="text-sm text-red-600">Requires attention</p>
                        </div>
                    </div>

                    {/* Right side: icon vertically centered */}
                    <div className="h-13 w-13 rounded-xl grid place-items-center text-white bg-gradient-to-br from-rose-100 to-red-100">
                        <Clock className="h-7 w-7 text-red-600" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 my- flex items-center justify-between">
                    {/* Left side: title, value, footer */}
                    <div>
                        <p className="text-sm text-slate-500">Active Classes</p>
                        <p className="text-3xl font-semibold text-slate-900">{classes?.length}</p>
                        <div className="mt-1 flex items-center gap-2">
                            <p className="text-sm text-indigo-600">Across departments</p>
                        </div>
                    </div>

                    {/* Right side: icon vertically centered */}
                    <div className="h-13 w-13 rounded-xl grid place-items-center text-white bg-gradient-to-br from-violet-100 to-fuchsia-100">
                        <Building2 className="h-7 w-7 text-indigo-600" />
                    </div>
                </div>

            </div>

            {/* Pending Approvals Section */}
            <section className="bg-white h-56 rounded-xl shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    <h2 className="text-base font-semibold text-slate-900">Pending Approvals</h2>
                    <button
                        className="flex items-center gap-1 border border-gray-300 px-4 py-2 rounded-lg text-sm text-black hover:text-slate-800"
                        onClick={() => navigate('/admin/dashboard/pending-approvals')}
                    >
                        <Eye className="h-4 w-4" /> View All
                    </button>
                </div>
                <div className="p-6 text-center text-slate-500">
                    {(users.length === 0) ?
                        <p>No pending approvals</p>
                        : <p className="text-blue-600 font-medium text-2xl">{users.length} users are waiting for approval tab to view</p>
                    }
                </div>
            </section>
        </main>
    </>)
}

export default Dashboard