import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { clearSubjectState, fetchSubjectDetails } from '../../../redux/subject/subjectSlice'
import { fetchClassAttendance, batchAddAttendance } from "../../../redux/student/studentSlice";
import { toast } from 'react-toastify'

const TeacherMarkAttendance = () => {
    const { id } = useParams()  //SubjectId
    const dispatch = useDispatch()
    const { subject } = useSelector((s) => s.subject || {});
    const { students, loading, message = "", error } = useSelector((s) => s.student);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    
    const [statuses, setStatuses] = useState({});

    useEffect(() => {
        dispatch(fetchSubjectDetails(id))
        return () => dispatch(clearSubjectState())
    }, [dispatch, id])

    const classId = subject?.className?._id;  //classId

    useEffect(() => {
        if (classId && id && date) {
            dispatch(fetchClassAttendance({ classId, subjectId: id, date }));
        }
    }, [dispatch, classId, id, date]);

    // Initialize statuses when students change
    useEffect(() => {
        if (students && students.length > 0) {
            const initial = {};
            students.forEach(s => {
                initial[s._id] = s.attendance?.status || "present";
            });
            setStatuses(initial);
        }
    }, [students]);

    // Batch mark attendance with per-student status
    const handleBatchAttendance = () => {
        const attendanceArray = students.map(s => ({
            studentId: s._id,
            status: statuses[s._id] || "present"
        }));
        dispatch(batchAddAttendance({ classId, subjectId: id, date, attendance: attendanceArray }))
            .unwrap()
            .then(() => dispatch(fetchClassAttendance({ classId, subjectId: id, date })));
    };

    useEffect(() => {
        if (error && message) toast.error(message);
        else if (message) toast.success(message);
    }, [error, message]);

    return (
        <div className="p-6 bg-white shadow-md rounded-2xl space-y-6">
            {/* Subject Info */}
            <div className="text-center space-y-2 pt-10">
                <p className="text-2xl font-bold text-indigo-700">{subject?.subjectName}</p>
                <p className="text-sm text-gray-500">Course Code: {subject?.courseCode}</p>
                <p className="text-md font-medium text-gray-700">
                    Class Name: {subject?.className?.className}
                </p>
            </div>


            {/* Attendance Section */}
            <div className="space-y-4">
                <div className='flex justify-between'>
                    <h2 className="text-2xl font-bold text-indigo-600">
                        Attendance for {date}
                    </h2>

                    <div className='flex justify-between items-center gap-2'>
                        {/* Date Input */}
                        <label className="block text-sm font-medium text-gray-700">
                            Date:
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="ml-2 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </label>

                        {/* Button */}
                        <button
                            onClick={handleBatchAttendance}
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Mark Attendance
                        </button>
                    </div>
                </div>

                {/* Loading & Message */}
                {loading && <p className="text-sm text-yellow-600">Loading...</p>}
                {message && (
                    <p
                        className={`text-sm ${typeof message === "string"
                            ? "text-green-600"
                            : "text-red-600"
                            }`}
                    >
                        {typeof message === "string" ? message : message.message}
                    </p>
                )}

                {/* Students Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100 text-gray-700 text-sm">
                            <tr>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Class</th>
                                <th className="px-4 py-2 text-left">Mark Attendance</th>
                                <th className="px-4 py-2 text-left">Current Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {students.map(s => (
                                <tr key={s._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 font-medium text-gray-800">
                                        {s.student?.name}
                                    </td>
                                    <td className="px-4 py-2 text-gray-600">
                                        {s.sClass?.className}
                                    </td>
                                    <td className="px-4 py-2">
                                        <select
                                            value={statuses[s._id] || "present"}
                                            onChange={e =>
                                                setStatuses(prev => ({
                                                    ...prev,
                                                    [s._id]: e.target.value
                                                }))
                                            }
                                            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        >
                                            <option value="present">Present</option>
                                            <option value="absent">Absent</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-2 text-gray-600">
                                        {s.attendance?.status ? (
                                            <span className="font-semibold text-gray-800">
                                                {s.attendance?.status}
                                            </span>
                                        ) : (
                                            <span className="italic text-gray-400">Not marked</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>


    )
}

export default TeacherMarkAttendance