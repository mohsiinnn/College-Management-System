import { useDispatch, useSelector } from 'react-redux'
import { User, Mail } from "lucide-react";
import { fetchOneTeacher, clearTeacherState } from '../../../redux/teacher/teacherSlice'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const TeacherProfileCard = () => {
    const dispatch = useDispatch()
    const { dashboardData } = useSelector((state) => state.user)
    const {
        teacher = null,   
        loading = false,
        error = false,
        message = "",
    } = useSelector((s) => s.teacher || {});


    useEffect(() => {
        const id = dashboardData?.data?._id; 

        if (id) {
            dispatch(fetchOneTeacher(id));
        } else {
            console.error("User _id is missing!", dashboardData);
        }

        return () => dispatch(clearTeacherState())
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
        <div className="min-h-80 bg-gradient-to-br flex items-center justify-center px-4 pt-40">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

                <div className="bg-sky-600 px-6 py-4">
                    <h1 className="text-2xl font-semibold text-white text-center">
                        Teacher Details
                    </h1>
                </div>

                <div className="px-8 py-12 flex flex-col items-center justify-center text-center">
                    {!loading && !teacher && (
                        <p className="text-sm text-gray-500">{message}</p>
                    )}

                    {!loading && teacher && (
                        <div className="space-y-6">

                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-sky-100 rounded-full">
                                    <User className="w-6 h-6 text-sky-600" />
                                </div>
                                <p className="text-lg font-medium text-slate-900">
                                    {teacher?.teacher?.name || "—"}
                                </p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-sky-100 rounded-full">
                                    <Mail className="w-6 h-6 text-sky-600" />
                                </div>
                                <p className="text-base text-slate-700">
                                    {teacher?.teacher?.email || "—"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


export default TeacherProfileCard