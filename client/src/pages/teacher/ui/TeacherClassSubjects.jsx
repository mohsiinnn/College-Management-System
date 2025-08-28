import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from "react-toastify";
import { clearTeacherState, fetchOneTeacher } from '../../../redux/teacher/teacherSlice';
import { clearSubjectState, fetchTeacherClassSubjects } from '../../../redux/subject/subjectSlice'

const TeacherClassSubjects = () => {
    const { user } = useSelector((state) => state.auth)
    const { id } = useParams();  //classId
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const { teacher } = useSelector((s) => s.teacher || {});
    const { classSubjects = [], loading = false, message = "", error = false } = useSelector((s) => s.subject || {});

    useEffect(() => {
        const id = user?.user?._id;

        if (id) {
            dispatch(fetchOneTeacher(id));
        } else {
            console.error("User _id is missing!", user);
        }

        return () => dispatch(clearTeacherState())
    }, [dispatch, user])


    const teacherId = teacher?._id;
    // try {
    //     if (teacherId) {
    //         console.log("TeacherId: ", teacherId);
    //     }
    // } catch (error) {
    //     console.log(error.message);
    // }

    useEffect(() => {
        if (teacherId) {
            dispatch(fetchTeacherClassSubjects({ classId: id, teacherId })).unwrap()
        }
        return () => dispatch(clearSubjectState())
    }, [dispatch, id, teacherId])

    useEffect(() => {
        if (error && message) toast.error(message);
        else if (message) toast.success(message);
    }, [error, message]);

    return (
        <div className="max-w-5xl mx-auto p-6">
            {loading && <p className="text-sm text-gray-500">Loading…</p>}

            {!loading && (!classSubjects || classSubjects.length === 0) && (
                <p className="text-sm text-gray-500">No subjects found for this class.</p>
            )}

            {!loading && classSubjects?.length > 0 && (
                <div className="bg-white rounded-xl shadow">
                    <ul className="divide-y">
                        {classSubjects.map((s) => {

                            return (
                                <li key={s._id} className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{s.subjectName}</p>
                                        <p className="text-xs text-gray-500">Code: {s.courseCode}</p>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/teacher/dashboard/class/subjects/${s._id}`)}
                                        className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200"
                                    >
                                        Take Attendance
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default TeacherClassSubjects