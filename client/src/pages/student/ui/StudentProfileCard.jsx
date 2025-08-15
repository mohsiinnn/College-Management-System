import { useDispatch, useSelector } from 'react-redux'
import { fetchStudentOnly, clearStudentState } from '../../../redux/student/studentSlice'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const StudentProfileCard = () => {
    // const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const {
        student = null,
        loading = false,
        message = "",
        error = false,
    } = useSelector((s) => s.student || {});


    useEffect(() => {
        const id = user?.user?._id; // get correct _id
        // console.log("id: ", id)

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

    // console.log(student);


    return (
        <div className="min-h-screen  bg-slate-50">

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 mt-5">
                <h1 className="text-3xl font-semibold text-emerald-600">Student Details</h1>
            </div>
            {/* Table */}
            <div className=" h-70 mt-0 mx-16 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                <div className="px-6 py-16 text-center items-center justify-center">
                    {!loading && !student && (
                        <p className="text-sm text-gray-500">Student not found.</p>
                    )}
                    {!loading && student && (
                        <div>
                            <p className="text-slate-900 font-medium">Name: <span>{student?.student?.name}</span></p>
                            <p className="text-sm text-slate-500 mt-1">Email: <span>{student?.student?.email || '_'}</span></p>
                            <p className="text-slate-900 font-medium">Class: <span>{student?.sClass?.className || "-"}</span></p>
                            <p className="text-slate-900 font-medium">Attendance Entries: <span>{Array.isArray(student.attendance) ? student.attendance.length : 0}</span></p>
                        </div>
                    )}
                </div>

            </div>

            <div className="bg-white rounded-xl shadow p-4">
                <h2 className="text-lg font-medium mb-3">Attendance Log</h2>
                {Array.isArray(student?.attendance) && student?.attendance?.length > 0 ? (
                    <ul className="divide-y">
                        {student.attendance
                            .slice()
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map((a, idx) => (
                                <li key={idx} className="py-2 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{new Date(a.date).toDateString()}</p>
                                        <p className="text-xs text-gray-500">
                                            Status: {a.status} • Subject: {String(a.subjectId.subjectName)}
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


export default StudentProfileCard