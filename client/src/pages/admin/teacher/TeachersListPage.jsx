// src/pages/teachers/TeachersListPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTeachers,
  removeTeacher,
  removeAllTeachers,
  clearTeacherState,
} from "../../../redux/teacher/teacherSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TeachersListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { teachers = [], loading = false, error = false, message = "" } =
    useSelector((s) => s.teacher || {});

  const [actingId, setActingId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

  useEffect(() => {
    dispatch(fetchTeachers());
    return () => dispatch(clearTeacherState());
  }, [dispatch]);

  useEffect(() => {
    if (error && message) toast.error(message);
    else if (message) toast.success(message);
  }, [error, message]);

  const onDelete = async (id) => {
    if (!confirm("Delete this teacher profile?")) return;
    setActingId(id);
    try {
      await dispatch(removeTeacher(id)).unwrap();
    } catch (e) {
      toast.error(e?.message || String(e) || "Delete failed");
    } finally {
      setActingId(null);
    }
  };

  const onDeleteAll = async () => {
    if (!confirm("Delete ALL teacher profiles?")) return;
    setDeletingAll(true);
    try {
      await dispatch(removeAllTeachers()).unwrap();
    } catch (e) {
      toast.error(e?.message || String(e) || "Delete all failed");
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Teachers</h1>
        <div className="flex gap-2">
          <button
            onClick={onDeleteAll}
            disabled={deletingAll}
            className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
          >
            {deletingAll ? "Deleting…" : "Delete All"}
          </button>
          <Link
            to="/admin/dashboard/teachers/new"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            + New Teacher Profile
          </Link>
        </div>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}

      {!loading && (!teachers || teachers.length === 0) && (
        <p className="text-sm text-gray-500">No teachers found.</p>
      )}

      {!loading && teachers?.length > 0 && (
        <div className="bg-white rounded-xl shadow">
          <ul className="divide-y">
            {teachers.map((t) => {
              const busy = actingId === t._id;
              return (
                <li key={t._id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {t?.teacher?.name || "Unnamed Teacher"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Class: {t?.tClass?.className || "—"} • Subjects:{" "}
                      {Array.isArray(t?.tSubjects) ? t.tSubjects.length : 0}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/dashboard/teachers/${t._id}`)}
                      className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => onDelete(t._id)}
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

export default TeachersListPage;
