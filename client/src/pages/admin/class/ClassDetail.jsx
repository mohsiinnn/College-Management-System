import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClassById,
  removeClassStudents,
  deleteClass,
  clearClassState,
} from "../../../redux/class/classSlice";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ClassDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentClass = null, loading = false, message = "", error = false } =
    useSelector((s) => s.class || {});

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    dispatch(fetchClassById(id));
    return () => dispatch(clearClassState());
  }, [dispatch, id]);

  useEffect(() => {
    if (error && message) toast.error(message);
    else if (message) toast.success(message);
  }, [error, message]);

  const onClearStudents = async () => {
    if (!confirm("Remove ALL students from this class?")) return;
    setBusy(true);
    try {
      await dispatch(removeClassStudents(id)).unwrap();
    } catch (e) {
      toast.error(e?.message || String(e) || "Operation failed");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Delete this class? This also removes related data.")) return;
    setBusy(true);
    try {
      await dispatch(deleteClass(id)).unwrap();
      navigate("/admin/dashboard/classes");
    } catch (e) {
      toast.error(e?.message || String(e) || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 pt-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-sky-600">Class Details</h1>
        <button
          onClick={() => navigate('/admin/dashboard/classes')}
          className="px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Back to list
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}

      {!loading && !currentClass && (
        <p className="text-sm text-gray-500">Class not found.</p>
      )}

      {!loading && currentClass && (
        <div className="bg-white rounded-xl shadow p-4 space-y-3">
          <p>
            <span className="font-medium">Class Name:</span> {currentClass.className}
          </p>
          <p>
            <span className="font-medium">Department:</span>{" "}
            {currentClass.department || "-"}
          </p>
          <p>
            <span className="font-medium">Students:</span>{" "}
            {Array.isArray(currentClass.student)
              ? currentClass.student.length
              : 0}
          </p>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onClearStudents}
              disabled={busy}
              className="px-3 py-1.5 rounded-md bg-amber-500 text-white disabled:opacity-50"
            >
              {busy ? "Working…" : "Clear Students"}
            </button>
            <button
              onClick={onDelete}
              disabled={busy}
              className="px-3 py-1.5 rounded-md bg-red-600 text-white disabled:opacity-50"
            >
              {busy ? "Deleting…" : "Delete Class"}
            </button>
            <button
              onClick={() => navigate('/admin/dashboard/students')}
              className="px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              View all students
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassDetailsPage;
