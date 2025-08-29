import { useDispatch, useSelector } from 'react-redux'
import { User, Mail, GraduationCap, ClipboardList } from "lucide-react";
import { fetchStudentOnly, clearStudentState } from '../../../redux/student/studentSlice'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const StudentProfileCard = () => {
    const dispatch = useDispatch()
    const { dashboardData } = useSelector((state) => state.user)
    const {
        student = null,
        loading = false,
        message = "",
        error = false,
    } = useSelector((s) => s.student || {});

    useEffect(() => {
        const id = dashboardData?.data?._id;
        if (id) {
            dispatch(fetchStudentOnly(id));
        } else {
            console.error("User _id is missing!", dashboardData);
        }

        return () => dispatch(clearStudentState())
    }, [dispatch, dashboardData])

    useEffect(() => {
        if (error) {
            toast.error(message)
        }
        else if (message) {
            toast.success(`error hai ${message}`)
        }
    }, [error, message])

    return (
        <div className="min-h-80  flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

                <div className="bg-sky-600 px-6 py-4">
                    <h1 className="text-2xl font-semibold text-white text-center">
                        Student Details
                    </h1>
                </div>

                <div className="px-8 py-12 flex flex-col items-center justify-center text-center">
                    {loading && (
                        <p className="text-gray-500 italic">Loading...</p>
                    )}

                    {!loading && !student && (
                        <p className="text-sm text-gray-500">Student not found.</p>
                    )}

                    {!loading && student && (
                        <div className="space-y-6 w-full text-left">

                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-sky-100 rounded-full">
                                    <User className="w-6 h-6 text-sky-600" />
                                </div>
                                <p className="text-lg font-medium text-slate-900">
                                    {student?.student?.name || "—"}
                                </p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-sky-100 rounded-full">
                                    <Mail className="w-6 h-6 text-sky-600" />
                                </div>
                                <p className="text-base text-slate-700">
                                    {student?.student?.email || "—"}
                                </p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-sky-100 rounded-full">
                                    <GraduationCap className="w-6 h-6 text-sky-600" />
                                </div>
                                <p className="text-base text-slate-700">
                                    {student?.sClass?.className || "—"}
                                </p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-sky-100 rounded-full">
                                    <ClipboardList className="w-6 h-6 text-sky-600" />
                                </div>
                                <p className="text-base text-slate-700">
                                    Attendance Entries:{" "}
                                    {Array.isArray(student.attendance)
                                        ? student.attendance.length
                                        : 0}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StudentProfileCard
