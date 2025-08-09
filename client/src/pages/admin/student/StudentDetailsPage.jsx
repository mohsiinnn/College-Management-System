// src/pages/students/StudentDetailsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentDetail,
  addStudentAttendance,
  clearStudentAttendance,
  clearStudentAttendanceFromSubject,
  clearAllStudentAttendanceFromSubject,
  clearStudentState,
} from "../../../redux/student/studentSlice";
import { fetchClassSubjects } from "../../../redux/subject/subjectSlice";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

const StudentDetailsPage = () => {
  const { id } = useParams(); // studentId
  const dispatch = useDispatch();

  const {
    student = null,
    loading = false,
    message = "",
    error = false,
  } = useSelector((s) => s.student || {});
  const { classSubjects = [], loading: subjLoading = false } =
    useSelector((s) => s.subject || {});

  const currentClassId = useMemo(
    () => student?.sClass?._id || student?.sClass || "",
    [student]
  );

  // attendance form state
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("present");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    dispatch(fetchStudentDetail(id));
    return () => dispatch(clearStudentState());
  }, [dispatch, id]);

  useEffect(() => {
    if (currentClassId) {
      dispatch(fetchClassSubjects(currentClassId));
    }
  }, [dispatch, currentClassId]);

  useEffect(() => {
    if (error && message) toast.error(message);
    else if (message) toast.success(message);
  }, [error, message]);

  const onMarkAttendance = async () => {
    if (!subjectId || !date || !status) {
      toast.error("Pick subject, date and status");
      return;
    }
    setBusy(true);
    try {
      await dispatch(
        addStudentAttendance({
          studentId: id,
          subjectId,
          status,
          date, // yyyy-mm-dd
        })
      ).unwrap();
      // refresh detail
      dispatch(fetchStudentDetail(id));
      toast.success("Attendance saved");
    } catch (e) {
      toast.error(e?.message || String(e) || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const onClearThisStudentAll = async () => {
    if (!confirm("Clear ALL attendance for this student?")) return;
    setBusy(true);
    try {
      await dispatch(clearStudentAttendance(id)).unwrap();
      dispatch(fetchStudentDetail(id));
      toast.success("Cleared this student's attendance");
    } catch (e) {
      toast.error(e?.message || String(e) || "Clear failed");
    } finally {
      setBusy(false);
    }
  };

  const onClearThisStudentForSubject = async () => {
    if (!subjectId) {
      toast.error("Pick a subject to clear");
      return;
    }
    if (!confirm("Clear this student's attendance for the selected subject?")) return;
    setBusy(true);
    try {
      await dispatch(
        clearStudentAttendanceFromSubject({ studentId: id, subjectId })
      ).unwrap();
      dispatch(fetchStudentDetail(id));
      toast.success("Cleared subject attendance for this student");
    } catch (e) {
      toast.error(e?.message || String(e) || "Clear failed");
    } finally {
      setBusy(false);
    }
  };

  const onClearAllStudentsForSubject = async () => {
    if (!subjectId) {
      toast.error("Pick a subject to clear for all students");
      return;
    }
    if (!confirm("Clear attendance for ALL students for the selected subject?"))
      return;
    setBusy(true);
    try {
      await dispatch(clearAllStudentAttendanceFromSubject(subjectId)).unwrap();
      toast.success("Cleared subject attendance for all students");
    } catch (e) {
      toast.error(e?.message || String(e) || "Bulk clear failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Student Details</h1>
        <Link to="/admin/dashboard/students" className="text-indigo-600 hover:underline">
          Back to list
        </Link>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}

      {!loading && !student && (
        <p className="text-sm text-gray-500">Student not found.</p>
      )}

      {!loading && student && (
        <div className="space-y-6">
          {/* Card: basic info */}
          <div className="bg-white rounded-xl shadow p-4">
            <p><span className="font-medium">Name:</span> {student?.student?.name || "—"}</p>
            <p><span className="font-medium">Class:</span> {student?.sClass?.className || "—"}</p>
            <p><span className="font-medium">Attendance entries:</span> {Array.isArray(student.attendance) ? student.attendance.length : 0}</p>
          </div>

          {/* Card: mark attendance */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-medium mb-3">Mark Attendance</h2>
            <div className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <label className="block text-sm mb-1">Subject</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 outline-none"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  disabled={subjLoading || !currentClassId}
                >
                  <option value="">{subjLoading ? "Loading…" : "-- Select Subject --"}</option>
                  {classSubjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.subjectName} ({s.courseCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-3">
                <label className="block text-sm mb-1">Date</label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2 outline-none"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm mb-1">Status</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>

              <div className="col-span-2">
                <button
                  onClick={onMarkAttendance}
                  disabled={busy}
                  className="w-full px-3 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-50"
                >
                  {busy ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>

          {/* Card: clear attendance */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-medium mb-3">Clear Attendance</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onClearThisStudentAll}
                disabled={busy}
                className="px-3 py-2 rounded-md bg-amber-600 text-white disabled:opacity-50"
              >
                {busy ? "Working…" : "Clear This Student (All)"}
              </button>

              <button
                onClick={onClearThisStudentForSubject}
                disabled={busy || !subjectId}
                className="px-3 py-2 rounded-md bg-amber-500 text-white disabled:opacity-50"
                title={!subjectId ? "Select a subject first" : ""}
              >
                {busy ? "Working…" : "Clear This Student (Subject)"}
              </button>

              <button
                onClick={onClearAllStudentsForSubject}
                disabled={busy || !subjectId}
                className="px-3 py-2 rounded-md bg-red-600 text-white disabled:opacity-50"
                title={!subjectId ? "Select a subject first" : ""}
              >
                {busy ? "Working…" : "Clear ALL Students (Subject)"}
              </button>
            </div>
          </div>

          {/* Card: attendance log (basic) */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-medium mb-3">Attendance Log</h2>
            {Array.isArray(student.attendance) && student.attendance.length > 0 ? (
              <ul className="divide-y">
                {student.attendance
                  .slice()
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((a, idx) => (
                    <li key={idx} className="py-2 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{new Date(a.date).toDateString()}</p>
                        <p className="text-xs text-gray-500">
                          Status: {a.status} • Subject: {String(a.subjectId)}
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
      )}
    </div>
  );
};

export default StudentDetailsPage;
