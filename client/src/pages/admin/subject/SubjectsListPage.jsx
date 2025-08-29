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
    const [expandedClasses, setExpandedClasses] = useState({});

    useEffect(() => {
        dispatch(fetchAllSubjects());
        return () => dispatch(clearSubjectState());
    }, [dispatch]);

    useEffect(() => {
        if (error) toast.error(message || "Something went wrong");
        else if (message) toast.success(message);
    }, [error, message]);

    const onDelete = async (id) => {
        if (!confirm("Delete this subject?")) return;
        setActingId(id);
        try {
            await dispatch(deleteSubject(id)).unwrap();
        } catch (e) {
            toast.error(e?.message || "Delete failed");
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
            toast.error(e?.message || "Delete all failed");
        } finally {
            setDeletingAll(false);
        }
    };

    const grouped = subjects.reduce((acc, subj) => {
        const classLabel =
            typeof subj.className === "object" && subj.className
                ? subj.className.className
                : String(subj.className || "Unassigned");
        if (!acc[classLabel]) acc[classLabel] = [];
        acc[classLabel].push(subj);
        return acc;
    }, {});

    const toggleClassDropdown = (classLabel) => {
        setExpandedClasses((prev) => ({
            ...prev,
            [classLabel]: !prev[classLabel],
        }));
    };

    return (
        <div className="max-w-6xl mx-auto p-6 pt-8">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-sky-600">Subjects</h1>
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
                        className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700"
                    >
                        + New Subject
                    </Link>
                    <Link
                        to="/admin/dashboard/subjects-page"
                        className="px-4 py-2.5 rounded-lg bg-sky-600 text-white hover:bg-sky-700"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            {/* Loading / Empty state */}
            {loading && <p className="text-sm text-gray-500">Loading…</p>}
            {!loading && (!subjects || subjects.length === 0) && (
                <p className="text-sm text-gray-500">No subjects found.</p>
            )}

            {/* Grouped dropdown list */}
            {!loading &&
                Object.keys(grouped).map((classLabel) => (
                    <div
                        key={classLabel}
                        className="bg-white rounded-xl shadow mb-4 overflow-hidden"
                    >
                        {/* Class dropdown header */}
                        <button
                            onClick={() => toggleClassDropdown(classLabel)}
                            className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 text-left"
                        >
                            <span className="font-semibold text-gray-700">
                                Class: {classLabel} ({grouped[classLabel].length})
                            </span>
                            <span
                                className={`text-sm text-gray-500 transform transition-transform duration-300 ${expandedClasses[classLabel] ? "rotate-180" : "rotate-0"
                                    }`}
                            >
                                ▼
                            </span>
                        </button>

                        {/* Animated subject list */}
                        <div
                            className={`transition-all duration-500 overflow-hidden ${expandedClasses[classLabel]
                                    ? "max-h-96 opacity-100"
                                    : "max-h-0 opacity-0"
                                }`}
                        >
                            <ul className="divide-y">
                                {grouped[classLabel].map((s) => {
                                    const busy = actingId === s._id;
                                    return (
                                        <li
                                            key={s._id}
                                            className="p-4 flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {s.subjectName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Code: {s.courseCode}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/dashboard/subjects/${s._id}`
                                                        )
                                                    }
                                                    className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200"
                                                >
                                                    Details
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        onDelete(s._id)
                                                    }
                                                    disabled={busy}
                                                    className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                                >
                                                    {busy
                                                        ? "Deleting…"
                                                        : "Delete"}
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default SubjectsListPage;
