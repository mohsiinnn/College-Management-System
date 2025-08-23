import React, { useEffect } from 'react'
import { fetchOneTeacher, clearTeacherState } from '../../../redux/teacher/teacherSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
const TeacherSubjectList = () => {
    const { user } = useSelector((state) => state.auth)
    const {
        teacher = null,
        loading = false,
        error = false,
        message = ''
    } = useSelector((state) => state.teacher)
    const dispatch = useDispatch()

    useEffect(() => {
        const id = user?.user?._id;

        if (id) {
            dispatch(fetchOneTeacher(id));
        } else {
            console.error("User _id is missing!", user);
        }

        return () => dispatch(clearTeacherState())
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
        <div className="min-h-screen  bg-slate-50">

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 mt-5">
                <h1 className="text-3xl font-semibold text-emerald-600">Teacher Details</h1>
            </div>
            {/* Table */}
            <div className=" h-70 mt-0 mx-16 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                {!loading && teacher && (
                    <div>
                        <p className="text-slate-900 font-medium">Name: <span>{teacher?.teacher?.name}</span></p>
                        <p className="text-sm text-slate-500 mt-1">Email: <span>{teacher?.teacher?.email || "_"}</span></p>
                        <p className="text-slate-900 font-medium">Class: <span>{teacher?.tClass?.className || "-"}</span></p>
                        <div className="text-slate-900 font-medium">Subjects Entries:
                            <ul>
                                {Array.isArray(teacher.tSubjects) ? teacher.tSubjects.map((user) => (
                                    <li key={user._id}>
                                        {user.subjectName} ({user?.tClass?.className})
                                    </li>
                                )): null}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TeacherSubjectList