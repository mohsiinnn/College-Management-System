import { Bell, Search, Clock, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    clearAdminState,
    fetchAllAdmins,
} from "../../../redux/superAdmin/SAdminSlice";
import SASidebarUI from "./SASIdebarUI";


export default function SAdmins() {

    const { admins, loading, error, message } = useSelector((state) => state.sUsers);

    // Function to toggle sidebar (triggers event the sidebar listens to)
    const toggleSidebar = () => {
        window.dispatchEvent(new Event("cms:toggle-sidebar"));
    };

    const dispatch = useDispatch();

    // initial fetch
    useEffect(() => {
        dispatch(fetchAllAdmins());
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

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar component */}
            <SASidebarUI />

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white ">
                    <div className="px-4 sm:px-6 lg:px-8 h-24 flex items-center gap-3">

                        <div className="flex flex-col pl-16">
                            <h1 className="text-xl sm:text-3xl font-bold text-sky-600">Super Admin Dashboard</h1>
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
                                <h1 className="text-3xl font-semibold text-emerald-600">Active Admins</h1>
                            </div>
                        </div>

                        {/* Content card */}
                        <div className="mt-6 rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                            {(admins.length === 0) ? (
                                <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                                    <h2 className="text-lg font-medium text-slate-900">All caught up!</h2>
                                    <p className="max-w-md text-sm text-slate-500">
                                        There are no Admins available at this time.
                                    </p>
                                </div>
                            ) : (
                                <div className="px-6 py-6">

                                    {!loading && (
                                        <ul className="space-y-3">
                                            {admins.map((user) => (
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