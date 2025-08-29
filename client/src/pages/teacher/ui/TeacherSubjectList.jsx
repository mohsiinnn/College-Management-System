import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOneTeacher, clearTeacherState, } from "../../../redux/teacher/teacherSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TeacherDetailsPage = () => {
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { teacher, loading = false, message = "", error = false } = useSelector((s) => s.teacher || {});

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
        <div className="max-w-4xl mx-auto p-6">


            {loading && <p className="text-sm text-gray-500">Loading…</p>}

            {!loading && !teacher && (
                <p className="text-sm text-gray-500">Teacher not found.</p>
            )}

            {!loading && teacher && (
                <div className="bg-gray-50 rounded-xl shadow p-4 space-y-4">
                    <div className="flex items-center justify-center mb-4">
                        <h1 className="text-2xl font-bold text-blue-600">All Classes</h1>
                    </div>
                    <div className="p-4 rounded-2xl shadow-md bg-white border border-gray-200">
                        
                        <div className="text-sm text-gray-700">
                            <ul className="space-y-3">
                                {teacher?.classes?.length > 0 ? (
                                    teacher.classes.map((cls) => (
                                        <li
                                            key={cls.class._id}
                                            className="p-3 rounded-lg bg-gray-50 border border-gray-100"
                                        >
                                            <span className="font-medium text-gray-900 flex justify-between">
                                                Class: {cls.class.className || "_"}
                                                <button
                                                    onClick={() => navigate(`/teacher/dashboard/class/${cls.class._id}`)}
                                                    className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200"
                                                >
                                                    View
                                                </button>
                                            </span>
                                            <ul className="list-disc list-inside ml-5 mt-1 text-gray-600 space-y-1">
                                                {cls?.subjects?.length > 0 ? (
                                                    cls.subjects.map((subs) => (
                                                        <li key={subs._id} className="pl-1">
                                                            {subs?.subjectName || "_"}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="italic text-gray-400">
                                                        No subjects assigned
                                                    </li>
                                                )}
                                            </ul>
                                        </li>
                                    ))
                                ) : (
                                    <li className="italic text-gray-400">No subjects assigned</li>
                                )}
                            </ul>
                        </div>
                    </div>

                </div>
            )
            }
        </div >
    );
};

export default TeacherDetailsPage;
















// import React, { useEffect } from 'react'
// import { fetchOneTeacher, clearTeacherState } from '../../../redux/teacher/teacherSlice'
// import { useDispatch, useSelector } from 'react-redux'
// import { toast } from 'react-toastify'
// const TeacherSubjectList = () => {
//     const { user } = useSelector((state) => state.auth)
//     const {
//         teacher = null,
//         loading = false,
//         error = false,
//         message = ''
//     } = useSelector((state) => state.teacher)
//     const dispatch = useDispatch()

//     useEffect(() => {
//         const id = user?.user?._id;

//         if (id) {
//             dispatch(fetchOneTeacher(id));
//         } else {
//             console.error("User _id is missing!", user);
//         }

//         return () => dispatch(clearTeacherState())
//     }, [dispatch, user])

//     useEffect(() => {
//         if (error) {
//             toast.error(message)
//         }
//         else if (message) {
//             toast.success(`error hai ${message}`)
//         }
//     }, [error, message])


//     return (
//         <div className="min-h-screen  bg-slate-50">

//             <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 mt-5">
//                 <h1 className="text-3xl font-semibold text-emerald-600">Teacher Details</h1>
//             </div>
//             {/* Table */}
//             <div className=" h-70 mt-0 mx-16 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
//                 {!loading && teacher && (
//                     <div>
//                         <p className="text-slate-900 font-medium">Name: <span>{teacher?.teacher?.name}</span></p>
//                         <p className="text-sm text-slate-500 mt-1">Email: <span>{teacher?.teacher?.email || "_"}</span></p>
//                         <p className="text-slate-900 font-medium">Class: <span>{teacher?.tClass?.className || "-"}</span></p>
//                         <div className="text-slate-900 font-medium">Subjects Entries:
//                             <ul>
//                                 {Array.isArray(teacher.tSubjects) ? teacher.tSubjects.map((user) => (
//                                     <li key={user._id}>
//                                         {user.subjectName} ({user?.tClass?.className})
//                                     </li>
//                                 )): null}
//                             </ul>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default TeacherSubjectList