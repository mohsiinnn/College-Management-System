import { Bell, Search } from "lucide-react";
import SidebarUI from "../../components/SidebarUI";
import Dashboard from "./ui/Dashboard";

export default function AdminDashboard() {

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

        <Dashboard />

      </div>
    </div>
  );
}

































// import DashboardLoader from "../../components/DefaultText";
// import Navbar from "../../components/Navbar"
// import { useNavigate } from "react-router-dom"
// import { Users, UserPlus, BookOpen, Layers, ClipboardList, UserCog } from "lucide-react";
// import PendingApprovals from "./Approvals";
// import Dashboard from "./ui/Dashboard";
// import StudentsPage from "./ui/Students";
// import TeachersPage from "./ui/TeachersPage";
// import SubjectsPage from "./ui/SubjectsPage";
// import ClassesPage from "./ui/ClassesPage";

// const AdminDashboard = () => {
//     const navigate = useNavigate()

//     return (<>
//         <Navbar />
//         {/* <PendingApprovals /> */}
//         {/* <Dashboard /> */}
//         {/* <StudentsPage /> */}
//         {/* <TeachersPage /> */}
//         {/* <SubjectsPage /> */}
//         {/* <ClassesPage /> */}

        


//         <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">

//                 {/* Classes */}
//                 <div
//                     onClick={() => navigate("/admin/dashboard/classes")}
//                     className="bg-gradient-to-b from-purple-800 to-blue-900 rounded-2xl p-6 flex flex-col items-center text-white shadow-xl hover:scale-105 transform transition cursor-pointer"
//                 >
//                     <Layers size={48} className="mb-4" />
//                     <h3 className="text-xl font-semibold mb-2">Manage Classes</h3>
//                     <p className="text-center">View, add, and manage classes.</p>
//                 </div>

//                 {/* Subjects */}
//                 <div
//                     onClick={() => navigate("/admin/dashboard/subjects")}
//                     className="bg-gradient-to-b from-purple-800 to-blue-900 rounded-2xl p-6 flex flex-col items-center text-white shadow-xl hover:scale-105 transform transition cursor-pointer"
//                 >
//                     <BookOpen size={48} className="mb-4" />
//                     <h3 className="text-xl font-semibold mb-2">Manage Subjects</h3>
//                     <p className="text-center">View, add, and manage subjects.</p>
//                 </div>

//                 {/* Teachers */}
//                 <div
//                     onClick={() => navigate("/admin/dashboard/teachers")}
//                     className="bg-gradient-to-b from-purple-800 to-blue-900 rounded-2xl p-6 flex flex-col items-center text-white shadow-xl hover:scale-105 transform transition cursor-pointer"
//                 >
//                     <UserCog size={48} className="mb-4" />
//                     <h3 className="text-xl font-semibold mb-2">Manage Teachers</h3>
//                     <p className="text-center">View, add, and manage teachers.</p>
//                 </div>

//                 {/* Students - View All */}
//                 <div
//                     onClick={() => navigate("/admin/dashboard/students")}
//                     className="bg-gradient-to-b from-green-700 to-emerald-900 rounded-2xl p-6 flex flex-col items-center text-white shadow-xl hover:scale-105 transform transition cursor-pointer"
//                 >
//                     <Users size={48} className="mb-4" />
//                     <h3 className="text-xl font-semibold mb-2">All Students</h3>
//                     <p className="text-center">View and manage all students.</p>
//                 </div>

//                 {/* Students - Create */}
//                 <div
//                     onClick={() => navigate("/admin/dashboard/students/new")}
//                     className="bg-gradient-to-b from-green-600 to-emerald-800 rounded-2xl p-6 flex flex-col items-center text-white shadow-xl hover:scale-105 transform transition cursor-pointer"
//                 >
//                     <UserPlus size={48} className="mb-4" />
//                     <h3 className="text-xl font-semibold mb-2">Add Student</h3>
//                     <p className="text-center">Create a new student profile.</p>
//                 </div>

//                 {/* Attendance */}
//                 <div
//                     onClick={() => navigate("/admin/dashboard/attendance")}
//                     className="bg-gradient-to-b from-amber-700 to-yellow-900 rounded-2xl p-6 flex flex-col items-center text-white shadow-xl hover:scale-105 transform transition cursor-pointer"
//                 >
//                     <ClipboardList size={48} className="mb-4" />
//                     <h3 className="text-xl font-semibold mb-2">Attendance</h3>
//                     <p className="text-center">Manage attendance records.</p>
//                 </div>
//             </div>
//         </div>
//     </>);
// }

// export default AdminDashboard