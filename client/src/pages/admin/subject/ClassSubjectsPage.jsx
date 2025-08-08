// src/pages/subjects/ClassSubjectsPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClassSubjects,
  deleteSubject,
  deleteSubjectsFromClass,
  clearSubjectState,
} from "../../../redux/subject/subjectSlice";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

const ClassSubjectsPage = () => {
  const { id } = useParams(); // classId
  const dispatch = useDispatch();

  const { classSubjects = [], loading = false, message = "", error = false } =
    useSelector((s) => s.subject || {});

  const [actingId, setActingId] = useState(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    dispatch(fetchClassSubjects(id));
    return () => dispatch(clearSubjectState());
  }, [dispatch, id]);

  useEffect(() => {
    if (error && message) toast.error(message);
    else if (message) toast.success(message);
  }, [error, message]);

  const onDelete = async (subjectId) => {
    if (!confirm("Delete this subject?")) return;
    setActingId(subjectId);
    try {
      await dispatch(deleteSubject(subjectId)).unwrap();
      // refresh class subjects
      dispatch(fetchClassSubjects(id));
    } catch (e) {
      toast.error(e?.message || String(e) || "Delete failed");
    } finally {
      setActingId(null);
    }
  };

  const onClearAll = async () => {
    if (!confirm("Delete ALL subjects in this class?")) return;
    setClearing(true);
    try {
      await dispatch(deleteSubjectsFromClass(id)).unwrap();
      dispatch(fetchClassSubjects(id));
    } catch (e) {
      toast.error(e?.message || String(e) || "Delete class subjects failed");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Class Subjects</h1>
        <Link to="/admin/dashboard/subjects" className="text-indigo-600 hover:underline">
          Back to all subjects
        </Link>
      </div>

      <div className="mb-3">
        <button
          onClick={onClearAll}
          disabled={clearing}
          className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
        >
          {clearing ? "Deleting…" : "Delete All for this Class"}
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}

      {!loading && (!classSubjects || classSubjects.length === 0) && (
        <p className="text-sm text-gray-500">No subjects found for this class.</p>
      )}

      {!loading && classSubjects?.length > 0 && (
        <div className="bg-white rounded-xl shadow">
          <ul className="divide-y">
            {classSubjects.map((s) => {
              const busy = actingId === s._id;
              return (
                <li key={s._id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{s.subjectName}</p>
                    <p className="text-xs text-gray-500">Code: {s.courseCode}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onDelete(s._id)}
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

export default ClassSubjectsPage;
