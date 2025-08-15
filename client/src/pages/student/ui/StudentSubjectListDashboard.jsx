import { Bell, Search } from "lucide-react";
import SidebarUI from "./SideBarUI";
import StudentSubjectsList from "./StudentSubjectsList";
import { useSelector } from "react-redux";


export default function StudentSubjectListDashboard() {
    const { user } = useSelector((state) => state.auth)
    // Function to toggle sidebar (triggers event the sidebar listens to)
    const toggleSidebar = () => {
        window.dispatchEvent(new Event("cms:toggle-sidebar"));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar component */}
            <SidebarUI />

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                {/* <Navbar /> */}
                <header className="sticky top-0 z-30 bg-white ">
                    <div className="px-4 sm:px-6 lg:px-8 h-24 flex items-center gap-3">

                        <div className="flex flex-col pl-16">
                            <h1 className="text-xl sm:text-3xl font-bold text-sky-600">Student Dashboard</h1>
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
                {!user.success ? <div className="min-h-screen mt-0 mx-16 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <p className="px-6 py-16 text-center items-center justify-center">
                        {user.message}
                    </p>
                </div> :
                    <div>
                        <StudentSubjectsList />
                    </div>
                }
            </div>
        </div>
    );
}
