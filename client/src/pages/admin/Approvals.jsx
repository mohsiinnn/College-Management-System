import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchPendingApprovals,
    approveUser,
    rejectUser,
    clearAdminState,
} from "../../redux/admin/adminSlice";
import { toast } from "react-toastify";

const PendingApprovals = () => {
    const dispatch = useDispatch();
    const { users, loading, error, message } = useSelector((state) => state.users);

    const [actingId, setActingId] = useState(null);


    useEffect(() => {
        dispatch(fetchPendingApprovals());
        return () => {
            // It clears state when leaving page
            dispatch(clearAdminState());
        };
    }, [dispatch]);

    // Toast messages
    useEffect(() => {
        if (error) toast.error(error);
        if (message) toast.success(message);
    }, [error, message]);

    const handleApprove = async (id) => {
        setActingId(id);
        try {
            const res = await dispatch(approveUser(id)).unwrap();
            if (res.success) { toast.success("User approved"); }
            else { toast.error(res.message) }
        } catch (error) {
            toast.error(error.message || "Failed to approve");
        } finally {
            setActingId(null);
        }
    };

    const handleReject = async (id) => {
        setActingId(id);
        try {
            await dispatch(rejectUser(id)).unwrap();
            toast.success("User rejected");
        } catch (e) {
            toast.error(e?.message || e || "Failed to reject");
        } finally {
            setActingId(null);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Pending Approvals</h2>

            {users?.length === 0 && <h2 className="text-2xl font-semibold mb-4">No Approvals Are pending</h2>}
            {loading && <p className="text-sm text-gray-500">Loading users…</p>}
            
            {!loading && (
                <ul className="space-y-3">
                    {users.map((user) => (
                        <li
                            key={user._id}
                            className="flex items-center justify-between bg-white rounded-lg shadow p-4"
                        >
                            <div>
                                <p className="font-medium">
                                    {user.name}{" "}
                                    <span className="text-gray-500">({user.email})</span>
                                </p>
                                <p className="text-xs text-gray-500">Role: {user.role}</p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleApprove(user._id)}
                                    disabled={actingId === user._id}
                                    className="px-3 py-1.5 rounded-md bg-green-600 text-white disabled:opacity-50"
                                >
                                    {actingId === user._id ? "Approving…" : "Approve"}
                                </button>
                                <button
                                    onClick={() => handleReject(user._id)}
                                    disabled={actingId === user._id}
                                    className="px-3 py-1.5 rounded-md bg-red-600 text-white disabled:opacity-50"
                                >
                                    {actingId === user._id ? "Rejecting…" : "Reject"}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PendingApprovals;
