import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchClasses,
    removeClassStudents,
    deleteClass,
    clearClassState,
} from "../../../redux/class/classSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ClassesListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { classes = [], loading = false, error = false, message = "" } =
        useSelector((s) => s.class || {});

    const [actingId, setActingId] = useState(null);

    useEffect(() => {
        dispatch(fetchClasses());
        return () => dispatch(clearClassState());
    }, [dispatch]);

    useEffect(() => {
        if (error && message) toast.error(message);
        else if (message) toast.success(message);
    }, [error, message]);

    const onRemoveStudents = async (id) => {
        if (!confirm("Remove ALL students from this class?")) return;
        setActingId(id);
        try {
            await dispatch(removeClassStudents(id)).unwrap();
        } catch (e) {
            toast.error(e?.message || String(e) || "Operation failed");
        } finally {
            setActingId(null);
        }
    };

    const onDelete = async (id) => {
        if (!confirm("Delete this class? This also removes related data.")) return;
        setActingId(id);
        try {
            await dispatch(deleteClass(id)).unwrap();
        } catch (e) {
            toast.error(e?.message || String(e) || "Delete failed");
        } finally {
            setActingId(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 pt-8">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-sky-600">Classes</h1>
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <Link
                            to="/admin/dashboard/classes/new"
                            className="px-4 py-2.5 rounded-lg bg-sky-600 text-white hover:bg-sky-700"
                        >
                            + New Class
                        </Link>
                    </div>
                    <Link
                        to="/admin/dashboard/classes-page"
                        className="px-4 py-2.5 rounded-lg bg-sky-600 text-white hover:bg-sky-700"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            {loading && <p className="text-sm text-gray-500">Loading…</p>}

            {!loading && (!classes || classes.length === 0) && (
                <p className="text-sm text-gray-500">No classes found.</p>
            )}

            {!loading && classes?.length > 0 && (
                <div className="bg-white rounded-xl shadow">
                    <ul className="divide-y">
                        {classes.map((c) => {
                            const busy = actingId === c._id;
                            return (
                                <li key={c._id} className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{c.className}</p>
                                        <p className="text-xs text-gray-500">
                                            Dept: {c.department || "-"}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/dashboard/classes/${c._id}`)}
                                            className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200"
                                        >
                                            Details
                                        </button>
                                        <button
                                            onClick={() => onRemoveStudents(c._id)}
                                            disabled={busy}
                                            className="px-3 py-1.5 rounded-md bg-amber-500 text-white disabled:opacity-50"
                                        >
                                            {busy ? "Working…" : "Clear Students"}
                                        </button>
                                        <button
                                            onClick={() => onDelete(c._id)}
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

export default ClassesListPage;
