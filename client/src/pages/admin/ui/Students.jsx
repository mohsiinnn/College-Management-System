import { Bell, Search, Plus, Users, UserCheck, UserPlus, Building2, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SidebarUI from "../../../components/SidebarUI";
import { fetchStudents, fetchAllStudents } from "../../../redux/student/studentSlice"
import { useEffect } from "react";

export default function StudentsPage() {
  const { students = [], allStudents } = useSelector((s) => s.student || {});
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Function to toggle sidebar (triggers event the sidebar listens to)
  const toggleSidebar = () => {
    window.dispatchEvent(new Event("cms:toggle-sidebar"));
  };

  useEffect(() => {
    dispatch(fetchStudents())
    dispatch(fetchAllStudents())
  }, [dispatch])


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

        <div className="min-h-screen bg-slate-50">
          {/* Page container */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            {/* Top bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-emerald-600">Students</h1>
                <p className="text-slate-600 text-sm">Manage student records and information</p>
              </div>

              <div className="flex w-full sm:w-auto items-center gap-3">
                {/* Search */}
                <div className="relative w-full sm:w-[380px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="w-full h-11 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
                  />
                </div>

                {/* Add Student */}
                <button
                  className="inline-flex items-center gap-2 h-11 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-700 active:bg-sky-800 shadow-sm"
                  onClick={() => { navigate('/admin/dashboard/students/new') }}
                >
                  <Plus className="h-4 w-4" />
                  Add Student
                </button>
              </div>
            </div>

            {/* Stat cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-7 my-0 flex items-center justify-between">
                {/* Left side: title, value, footer */}
                <div>
                  <p className="text-sm text-slate-500">Total Students</p>
                  <p className="text-3xl font-semibold text-slate-900 mt-2">{allStudents?.length}</p>
                </div>

                {/* Right side: icon vertically centered */}
                <div className="h-13 w-13 rounded-xl grid place-items-center text-white bg-sky-100">
                  <Users className="h-7 w-7 text-sky-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-7 my-0 flex items-center justify-between">
                {/* Left side: title, value, footer */}
                <div>
                  <p className="text-sm text-slate-500">Active Students</p>
                  <p className="text-3xl font-semibold text-slate-900 mt-2">{students.length}</p>
                </div>

                {/* Right side: icon vertically centered */}
                <div className="h-13 w-13 rounded-xl grid place-items-center text-white bg-emerald-100">
                  <UserCheck className="h-7 w-7 text-emerald-600" />
                </div>
              </div>

            </div>

            {/* Table / list wrapper */}
            <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4 justify-between flex">
                <h2 className="text-base font-semibold text-slate-900">All Students ({students.length})</h2>
                <button
                  className="flex items-center gap-1 border border-gray-300 px-4 py-2 rounded-lg text-sm text-black hover:text-slate-800"
                  onClick={() => navigate('/admin/dashboard/students')}>
                  <Eye className="h-4 w-4" /> View All
                </button>
              </div>

              {/* Empty state */}
              <div className="px-6 py-16 text-center items-center justify-center">
                {(students === null) ? (
                  <div>
                    <p className="text-slate-900 font-medium">No students yet</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Students will appear here once they register and are approved.
                    </p>
                  </div>
                ) :
                  <p className="font-semibold text-2xl text-blue-600">Tap to view all Students</p>
                }
              </div>

            </div>
          </div>
        </div>


      </div>
    </div>
  );
}









// import { Search, Plus, Users, UserCheck, UserPlus, Building2, Eye } from "lucide-react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// export default function StudentsPage() {
//   const { students = [] } = useSelector((s) => s.student || {});
//   const navigate = useNavigate()

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Page container */}
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
//         {/* Top bar */}
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
//           <div>
//             <h1 className="text-3xl font-semibold text-emerald-600">Students</h1>
//             <p className="text-slate-600 text-sm">Manage student records and information</p>
//           </div>

//           <div className="flex w-full sm:w-auto items-center gap-3">
//             {/* Search */}
//             <div className="relative w-full sm:w-[380px]">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//               <input
//                 type="text"
//                 placeholder="Search students..."
//                 className="w-full h-11 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
//               />
//             </div>

//             {/* Add Student */}
//             <button
//               className="inline-flex items-center gap-2 h-11 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-700 active:bg-sky-800 shadow-sm"
//               onClick={() => { navigate('/admin/dashboard/students/new') }}
//             >
//               <Plus className="h-4 w-4" />
//               Add Student
//             </button>
//           </div>
//         </div>

//         {/* Stat cards */}
//         <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
//           <div className="bg-white rounded-xl shadow-sm p-7 my-0 flex items-center justify-between">
//             {/* Left side: title, value, footer */}
//             <div>
//               <p className="text-sm text-slate-500">Total Students</p>
//               <p className="text-3xl font-semibold text-slate-900 mt-2">0</p>
//             </div>

//             {/* Right side: icon vertically centered */}
//             <div className="h-13 w-13 rounded-xl grid place-items-center text-white bg-sky-100">
//               <Users className="h-7 w-7 text-sky-600" />
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-7 my-0 flex items-center justify-between">
//             {/* Left side: title, value, footer */}
//             <div>
//               <p className="text-sm text-slate-500">Active Students</p>
//               <p className="text-3xl font-semibold text-slate-900 mt-2">0</p>
//             </div>

//             {/* Right side: icon vertically centered */}
//             <div className="h-13 w-13 rounded-xl grid place-items-center text-white bg-emerald-100">
//               <UserCheck className="h-7 w-7 text-emerald-600" />
//             </div>
//           </div>

//         </div>

//         {/* Table / list wrapper */}
//         <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
//           <div className="border-b border-slate-100 px-5 py-4 justify-between flex">
//             <h2 className="text-base font-semibold text-slate-900">All Students (0)</h2>
//             <button
//               className="flex items-center gap-1 border border-gray-300 px-4 py-2 rounded-lg text-sm text-black hover:text-slate-800"
//               onClick={() => navigate('/admin/dashboard/students')}>
//               <Eye className="h-4 w-4" /> View All
//             </button>
//           </div>

//           {/* Empty state */}
//           <div className="px-6 py-16 text-center items-center justify-center">
//             {(students === null) ? (
//               <div>
//                 <p className="text-slate-900 font-medium">No students yet</p>
//                 <p className="text-sm text-slate-500 mt-1">
//                   Students will appear here once they register and are approved.
//                 </p>
//               </div>
//             ) :
//               <p className="font-semibold text-xl text-blue-600">Tap to view all Students</p>
//             }
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({ label, value, Icon, iconBg }) {
//   return (
//     <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
//       <div className="flex items-center justify-between">
//         <span className="text-sm text-slate-600">{label}</span>
//         <span className={`h-9 w-9 ${iconBg} rounded-lg grid place-items-center`}>
//           <Icon className="h-5 w-5 text-slate-700" />
//         </span>
//       </div>
//       <div className="mt-4 text-3xl font-semibold text-slate-900">{value}</div>
//     </div>
//   );
// }
