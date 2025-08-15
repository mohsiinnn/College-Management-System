import { useDispatch, useSelector } from 'react-redux'
import { fetchStudentOnly, clearStudentState } from '../../../redux/student/studentSlice'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const StudentProfileCard = () => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const {
        student = null,
        loading = false,
        message = "",
        error = false,
    } = useSelector((s) => s.student || {});

    useEffect(() => {
        const id = user?.user?._id;
        if (id) {
            dispatch(fetchStudentOnly(id));
        } else {
            console.error("User _id is missing!", user);
        }

        return () => dispatch(clearStudentState())
    }, [dispatch, user])

    useEffect(() => {
        if (error) {
            toast.error(message)
        }
        else if (message) {
            toast.success(`error hai ${message}`)
        }
    }, [error, message])

    return (
        <div className="min-h-screen bg-slate-50 py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-emerald-600 mb-6">
                    Student Details
                </h1>

                <div className="mx-auto max-w-xl bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="px-6 py-10 text-center">
                        {loading && (
                            <p className="text-gray-500 italic">Loading...</p>
                        )}

                        {!loading && !student && (
                            <p className="text-sm text-gray-500">Student not found.</p>
                        )}

                        {!loading && student && (
                            <div className="space-y-4 text-left">
                                <p className="text-lg font-semibold text-slate-900">
                                    Name:{" "}
                                    <span className="font-normal text-gray-700">
                                        {student?.student?.name}
                                    </span>
                                </p>
                                <p className="text-lg font-semibold text-slate-900">
                                    Email:{" "}
                                    <span className="font-normal text-gray-700">
                                        {student?.student?.email || "_"}
                                    </span>
                                </p>
                                <p className="text-lg font-semibold text-slate-900">
                                    Class:{" "}
                                    <span className="font-normal text-gray-700">
                                        {student?.sClass?.className || "-"}
                                    </span>
                                </p>
                                <p className="text-lg font-semibold text-slate-900">
                                    Attendance Entries:{" "}
                                    <span className="font-normal text-gray-700">
                                        {Array.isArray(student.attendance) ? student.attendance.length : 0}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentProfileCard
