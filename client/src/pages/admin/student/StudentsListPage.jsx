// src/pages/students/StudentsListPage.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
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

// Child component so Hooks aren't inside a loop
const ClassSection = ({
  label,
  classStudents,
  isOpen,
  onToggle,
  onDelete,
  onDetails,
  actingId,
}) => {
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const recalc = () => {
      // set exact height when open, 0 when closed
      setMaxHeight(isOpen ? `${el.scrollHeight}px` : "0px");
    };

    recalc();
    // Recalculate on resize or font changes
    window.addEventListener("resize", recalc);
    const ro = new ResizeObserver(recalc);
    ro.observe(el);

    return () => {
      window.removeEventListener("resize", recalc);
      ro.disconnect();
    };
  }, [isOpen, classStudents.length]);

  return (
    <div className="mb-4 bg-white shadow rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-3 bg-gray-200 hover:bg-gray-300"
      >
        <span className="font-medium">
          {label} ({classStudents.length})
        </span>
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Animated content */}
      <div
        ref={contentRef}
        style={{ maxHeight }}
        className="transition-all duration-300 ease-in-out overflow-hidden"
      >
        <ul className="divide-y">
          {classStudents.map((st) => {
            const busy = actingId === st._id;
            return (
              <li key={st._id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{st?.student?.name || "Unnamed Student"}</p>
                  <p className="text-xs text-gray-500">
                    Attendance entries: {st?.attendance?.length ?? 0}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onDetails(st._id)}
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
    </div>
  );
};

const StudentsListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { students = [], loading = false, error = false, message = "" } =
    useSelector((s) => s.student || {});

  const [expandedClasses, setExpandedClasses] = useState({});
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

  const handleDetails = (id) => navigate(`/admin/dashboard/students/${id}`);

  // Group once; stable across renders unless students changes
  const grouped = useMemo(() => {
    return students.reduce((acc, st) => {
      const label = st?.sClass?.className || "No Class";
      if (!acc[label]) acc[label] = [];
      acc[label].push(st);
      return acc;
    }, {});
  }, [students]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Top Buttons (unchanged) */}
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
      {!loading && students.length === 0 && (
        <p className="text-sm text-gray-500">No students found.</p>
      )}

      {/* Sections */}
      {!loading &&
        Object.entries(grouped).map(([label, classStudents]) => (
          <ClassSection
            key={label}
            label={label}
            classStudents={classStudents}
            isOpen={!!expandedClasses[label]}
            onToggle={() =>
              setExpandedClasses((prev) => ({ ...prev, [label]: !prev[label] }))
            }
            onDelete={onDelete}
            onDetails={handleDetails}
            actingId={actingId}
          />
        ))}
    </div>
  );
};

export default StudentsListPage;
