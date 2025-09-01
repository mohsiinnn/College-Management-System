import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubjectDetails,
  deleteSubject,
  clearSubjectState,
} from "../../../redux/subject/subjectSlice";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SubjectDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { subject = null, loading = false, message = "", error = false } =
    useSelector((s) => s.subject || {});

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    dispatch(fetchSubjectDetails(id));
    return () => dispatch(clearSubjectState());
  }, [dispatch, id]);

  useEffect(() => {
    if (error && message) toast.error(message);
    else if (message) toast.success(message);
  }, [error, message]);

  const onDelete = async () => {
    if (!confirm("Delete this subject?")) return;
    setBusy(true);
    try {
      await dispatch(deleteSubject(id)).unwrap();
      navigate("/admin/dashboard/subjects");
    } catch (e) {
      toast.error(e?.message || String(e) || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 pt-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-sky-600">Subject Details</h1>
        <button
          onClick={() => navigate('/admin/dashboard/subjects')}
          className="px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Back to list
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}

      {!loading && !subject && (
        <p className="text-sm text-gray-500">Subject not found.</p>
      )}

      {!loading && subject && (
        <div className="bg-white rounded-xl shadow p-4 space-y-3">
          <p>
            <span className="font-medium">Subject:</span> {subject.subjectName}
          </p>
          <p>
            <span className="font-medium">Course Code:</span> {subject.courseCode}
          </p>
          <p>
            <span className="font-medium">Class:</span>{" "}
            {typeof subject.className === "object"
              ? subject.className?.className
              : String(subject.className)}
          </p>
          <p>
            <span className="font-medium">Teacher:</span>{" "}
            {subject?.teacher?.teacher?.name || "—"}
          </p>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onDelete}
              disabled={busy}
              className="px-3 py-1.5 rounded-md bg-red-600 text-white disabled:opacity-50"
            >
              {busy ? "Deleting…" : "Delete Subject"}
            </button>
            {!subject?.teacher?.teacher &&
              <button
                onClick={() => navigate('/admin/dashboard/teachers')}
                className="px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Assign Teacher
              </button>
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectDetailsPage;
