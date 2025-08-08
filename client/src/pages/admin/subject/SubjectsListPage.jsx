// src/pages/subjects/SubjectsListPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllSubjects,
    deleteSubject,
    deleteAllSubjects,
    clearSubjectState,
} from "../../../redux/subject/subjectSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SubjectsListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { subjects = [], loading = false, error = false, message = "" } =
        useSelector((s) => s.subject || {});

    const [actingId, setActingId] = useState(null);
    const [deletingAll, setDeletingAll] = useState(false);

    useEffect(() => {
        dispatch(fetchAllSubjects());
        return () => dispatch(clearSubjectState());
    }, [dispatch]);

    useEffect(() => {
        if (error && message) toast.error(message);
        else if (message) toast.success(message);
    }, [error, message]);

    const onDelete = async (id) => {
        if (!confirm("Delete this subject?")) return;
        setActingId(id);
        try {
            await dispatch(deleteSubject(id)).unwrap();
        } catch (e) {
            toast.error(e?.message || String(e) || "Delete failed");
        } finally {
            setActingId(null);
        }
    };

    const onDeleteAll = async () => {
        if (!confirm("Delete ALL subjects? This cannot be undone.")) return;
        setDeletingAll(true);
        try {
            await dispatch(deleteAllSubjects()).unwrap();
        } catch (e) {
            toast.error(e?.message || String(e) || "Delete all failed");
        } finally {
            setDeletingAll(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">Subjects</h1>
                <div className="flex gap-2">
                    <button
                        onClick={onDeleteAll}
                        disabled={deletingAll}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
                    >
                        {deletingAll ? "Deleting…" : "Delete All"}
                    </button>
                    <Link
                        to="/admin/dashboard/subjects/new"
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        + New Subjects
                    </Link>
                </div>
            </div>

            {loading && <p className="text-sm text-gray-500">Loading…</p>}

            {!loading && (!subjects || subjects.length === 0) && (
                <p className="text-sm text-gray-500">No subjects found.</p>
            )}

            {!loading && subjects?.length > 0 && (
                <div className="bg-white rounded-xl shadow">
                    <ul className="divide-y">
                        {subjects.map((s) => {
                            const busy = actingId === s._id;
                            return (
                                <li key={s._id} className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{s.subjectName}</p>
                                        <p className="text-xs text-gray-500">
                                            Code: {s.courseCode} • Class:{" "}
                                            {typeof s.className === "object" ? s.className?.className : String(s.className)}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/dashboard/subjects/${s._id}`)}
                                            className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200"
                                        >
                                            Details
                                        </button>
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

export default SubjectsListPage;
