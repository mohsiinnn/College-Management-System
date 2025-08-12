import { Bell, Search, Clock, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    fetchPendingApprovals,
    approveUser,
    rejectUser,
    clearAdminState,
} from "../../../redux/admin/adminSlice";
import SidebarUI from "../../../components/SidebarUI";


export default function Pendings({ count = 0 }) {

    const { users, loading, error, message } = useSelector((state) => state.users);

    // Function to toggle sidebar (triggers event the sidebar listens to)
    const toggleSidebar = () => {
        window.dispatchEvent(new Event("cms:toggle-sidebar"));
    };

    const dispatch = useDispatch();

    const [actingId, setActingId] = useState(null);

    // initial fetch
    useEffect(() => {
        dispatch(fetchPendingApprovals());
        return () => {
            // cleanup: clear transient messages when leaving page
            dispatch(clearAdminState());
        };
    }, [dispatch]);

    // surface store messages via toast
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
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar component */}
            <SidebarUI />

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white ">
                    <div className="px-4 sm:px-6 lg:px-8 h-24 flex items-center gap-3">

                        <div className="flex flex-col pl-16">
                            <h1 className="text-xl sm:text-3xl font-bold text-sky-600">Admin Dashboard</h1>
                            <p className=" text-slate-500 -mt-0.5">
                                Welcome back, manage your college efficiently
                            </p>
                        </div>

                        <div className="ml-auto flex items-center gap-3">
                            {/* Notifications */}
                            <div className="relative">
                                <button className="p-2 rounded-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200">
                                    <Bell className="h-5 w-5 text-slate-700" />
                                </button>
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[10px] font-semibold bg-red-500 text-white">
                                    2
                                </span>
                            </div>

                            {/* Search bar */}
                            <div className="hidden sm:flex items-center gap-2 border border-gray-300 rounded-xl px-3 h-10 w-60">
                                <Search className="h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="outline-none text-sm bg-transparent placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="min-h-screen bg-slate-50 p-6 md:p-10">
                    {/* Page header */}
                    <div className="mx-auto max-w-6xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-semibold text-emerald-600">Pending Approvals</h1>
                                <p className="mt-1 text-sm text-slate-500">Review and approve user registrations</p>
                            </div>

                            <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
                                <Clock className="h-4 w-4" aria-hidden />
                                <span>{count} users waiting for approval</span>
                            </div>
                        </div>

                        {/* Content card */}
                        <div className="mt-6 rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                            {(users.length === 0) ? (
                                <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                                        <Check className="h-10 w-10 text-emerald-600" aria-hidden />
                                    </div>
                                    <h2 className="text-lg font-medium text-slate-900">All caught up!</h2>
                                    <p className="max-w-md text-sm text-slate-500">
                                        There are no pending user approvals at this time.
                                    </p>
                                </div>
                            ) : (
                                <div className="px-6 py-6">

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
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}






// import React, { useEffect, useState } from "react";
// import { Clock, Check } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import {
//     fetchPendingApprovals,
//     approveUser,
//     rejectUser,
//     clearAdminState,
// } from "../../../redux/admin/adminSlice";
// import SidebarUI from "../../../components/SidebarUI";


// export default function Pendings({ count = 0 }) {

//     const dispatch = useDispatch();
//     const { users, loading, error, message } = useSelector((state) => state.users);

//     const [actingId, setActingId] = useState(null);

//     // initial fetch
//     useEffect(() => {
//         dispatch(fetchPendingApprovals());
//         return () => {
//             // cleanup: clear transient messages when leaving page
//             dispatch(clearAdminState());
//         };
//     }, [dispatch]);

//     // surface store messages via toast
//     useEffect(() => {
//         if (error) toast.error(error);
//         if (message) toast.success(message);
//     }, [error, message]);

//     const handleApprove = async (id) => {
//         setActingId(id);
//         try {
//             const res = await dispatch(approveUser(id)).unwrap();
//             if (res.success) { toast.success("User approved"); }
//             else { toast.error(res.message) }
//         } catch (error) {
//             toast.error(error.message || "Failed to approve");
//         } finally {
//             setActingId(null);
//         }
//     };

//     const handleReject = async (id) => {
//         setActingId(id);
//         try {
//             await dispatch(rejectUser(id)).unwrap();
//             toast.success("User rejected");
//         } catch (e) {
//             toast.error(e?.message || e || "Failed to reject");
//         } finally {
//             setActingId(null);
//         }
//     };


//     return (
//         <div className="min-h-screen bg-slate-50 p-6 md:p-10">
//             {/* Page header */}
//             <div className="mx-auto max-w-6xl">
//                 <div className="flex items-start justify-between gap-4">
//                     <div>
//                         <h1 className="text-3xl font-semibold text-emerald-600">Pending Approvals</h1>
//                         <p className="mt-1 text-sm text-slate-500">Review and approve user registrations</p>
//                     </div>

//                     <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
//                         <Clock className="h-4 w-4" aria-hidden />
//                         <span>{count} users waiting for approval</span>
//                     </div>
//                 </div>

//                 {/* Content card */}
//                 <div className="mt-6 rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
//                     {(users.length === 0) ? (
//                         <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
//                             <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
//                                 <Check className="h-10 w-10 text-emerald-600" aria-hidden />
//                             </div>
//                             <h2 className="text-lg font-medium text-slate-900">All caught up!</h2>
//                             <p className="max-w-md text-sm text-slate-500">
//                                 There are no pending user approvals at this time.
//                             </p>
//                         </div>
//                     ) : (
//                         <div className="px-6 py-6">
//                             {/* When there are items, you can replace this with your list/table */}
//                             {/* <div className="rounded-lg border border-slate-200 p-6 text-sm text-slate-600"> */}

//                             {!loading && (
//                                 <ul className="space-y-3">
//                                     {users.map((user) => (
//                                         <li
//                                             key={user._id}
//                                             className="flex items-center justify-between bg-white rounded-lg shadow p-4"
//                                         >
//                                             <div>
//                                                 <p className="font-medium">
//                                                     {user.name}{" "}
//                                                     <span className="text-gray-500">({user.email})</span>
//                                                 </p>
//                                                 <p className="text-xs text-gray-500">Role: {user.role}</p>
//                                             </div>

//                                             <div className="flex gap-2">
//                                                 <button
//                                                     onClick={() => handleApprove(user._id)}
//                                                     disabled={actingId === user._id}
//                                                     className="px-3 py-1.5 rounded-md bg-green-600 text-white disabled:opacity-50"
//                                                 >
//                                                     {actingId === user._id ? "Approving…" : "Approve"}
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleReject(user._id)}
//                                                     disabled={actingId === user._id}
//                                                     className="px-3 py-1.5 rounded-md bg-red-600 text-white disabled:opacity-50"
//                                                 >
//                                                     {actingId === user._id ? "Rejecting…" : "Reject"}
//                                                 </button>
//                                             </div>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}

//                             {/* </div> */}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }
