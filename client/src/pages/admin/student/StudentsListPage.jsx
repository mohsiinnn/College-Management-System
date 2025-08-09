// src/pages/students/StudentsListPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudents,
  removeStudent,
  removeAllStudents,
  clearAllStudentsAttendance,
  clearStudentState,
} from "../../../redux/student/studentSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const StudentsListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { students = [], loading = false, error = false, message = "" } =
    useSelector((s) => s.student || {});

  const [actingId, setActingId] = useState(null);
  const [bulkBusy, setBulkBusy] = useState(false);

  useEffect(() => {
    dispatch(fetchStudents());
    return () => dispatch(clearStudentState());
  }, [dispatch]);

  useEffect(() => {
    if (error && message) toast.error(message);
    else if (message) toast.success(message);
  }, [error, message]);

  const onDelete = async (id) => {
    if (!confirm("Delete this student profile?")) return;
    setActingId(id);
    try {
      await dispatch(removeStudent(id)).unwrap();
    } catch (e) {
      toast.error(e?.message || String(e) || "Delete failed");
    } finally {
      setActingId(null);
    }
  };

  const onDeleteAll = async () => {
    if (!confirm("Delete ALL student profiles?")) return;
    setBulkBusy(true);
    try {
      await dispatch(removeAllStudents()).unwrap();
    } catch (e) {
      toast.error(e?.message || String(e) || "Delete all failed");
    } finally {
      setBulkBusy(false);
    }
  };

  const onClearAllAttendance = async () => {
    if (!confirm("Clear attendance for ALL students?")) return;
    setBulkBusy(true);
    try {
      await dispatch(clearAllStudentsAttendance()).unwrap();
      toast.success("Cleared attendance for all students");
    } catch (e) {
      toast.error(e?.message || String(e) || "Bulk clear failed");
    } finally {
      setBulkBusy(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Students</h1>
        <div className="flex gap-2">
          <button
            onClick={onClearAllAttendance}
            disabled={bulkBusy}
            className="px-4 py-2 rounded-lg bg-amber-600 text-white disabled:opacity-50"
          >
            {bulkBusy ? "Working…" : "Clear All Attendance"}
          </button>
          <button
            onClick={onDeleteAll}
            disabled={bulkBusy}
            className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
          >
            {bulkBusy ? "Working…" : "Delete All"}
          </button>
          <Link
            to="/admin/dashboard/students/new"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            + New Student
          </Link>
        </div>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}

      {!loading && (!students || students.length === 0) && (
        <p className="text-sm text-gray-500">No students found.</p>
      )}

      {!loading && students?.length > 0 && (
        <div className="bg-white rounded-xl shadow">
          <ul className="divide-y">
            {students.map((st) => {
              const busy = actingId === st._id;
              return (
                <li key={st._id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{st?.student?.name || "Unnamed Student"}</p>
                    <p className="text-xs text-gray-500">
                      Class: {st?.sClass?.className || "—"} • Attendance entries:{" "}
                      {Array.isArray(st?.attendance) ? st.attendance.length : 0}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/dashboard/students/${st._id}`)}
                      className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => onDelete(st._id)}
                      disabled={busy}
                      className="px-3 py-1.5 rounded-md bg-red-600 text-white disabled:opacity-50"
                    >
                      {busy ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StudentsListPage;
