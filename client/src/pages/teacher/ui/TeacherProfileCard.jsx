import { useDispatch, useSelector } from 'react-redux'
import { fetchOneTeacher, clearTeacherState } from '../../../redux/teacher/teacherSlice'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const TeacherProfileCard = () => {
    // const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const {
        teacher = null,     // details
        loading = false,
        error = false,
        message = "",
    } = useSelector((s) => s.teacher || {});


    useEffect(() => {
        const id = user?.user?._id; // get correct _id
        console.log("id: ", id)

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

    // console.log(student);


    return (
        <div className="min-h-screen  bg-slate-50">

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 mt-5">
                <h1 className="text-3xl font-semibold text-emerald-600">Teacher Details</h1>
            </div>
            {/* Table */}
            <div className=" h-70 mt-0 mx-16 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                <div className="px-6 py-16 text-center items-center justify-center">
                    {!loading && !teacher && (
                        <p className="text-sm text-gray-500">Teacher not found.</p>
                    )}
                    {!loading && teacher && (
                        <div>
                            <p className="text-slate-900 font-medium">Name: <span>{teacher?.teacher?.name}</span></p>
                            <p className="text-sm text-slate-500 mt-1">Email: <span>{teacher?.teacher?.email || "_"}</span></p>
                            <p className="text-slate-900 font-medium">Class: <span>{teacher?.tClass?.className || "-"}</span></p>
                            <p className="text-slate-900 font-medium">Subjects Entries: <span>{Array.isArray(teacher.tSubjects) ? teacher.tSubjects.length : 0}</span></p>
                        </div>
                    )}
                </div>

            </div>

            <div className="bg-white rounded-xl shadow p-4">
                <h2 className="text-lg font-medium mb-3">Attendance Log</h2>
                {Array.isArray(teacher?.tSubjects) && teacher?.tSubjects?.length > 0 ? (
                    <ul className="divide-y">
                        {teacher?.tSubjects
                            .slice()
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map((a, idx) => (
                                <li key={idx} className="py-2 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{new Date(a.date).toDateString()}</p>
                                        <p className="text-xs text-gray-500">
                                            Status: {a.status} • Subject: {String(a.subjectName)}
                                        </p>
                                    </div>
                                </li>
                            ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">No attendance yet.</p>
                )}
            </div>
        </div>
    )
}


export default TeacherProfileCard