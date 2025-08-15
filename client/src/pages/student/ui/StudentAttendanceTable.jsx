import { Bell, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentOnly, clearStudentState } from '../../../redux/student/studentSlice'
import { useEffect, useState } from 'react'
import SidebarUI from "./SideBarUI";
import { toast } from 'react-toastify'

export default function StudentAttendanceTable() {
  // Function to toggle sidebar (triggers event the sidebar listens to)
  const toggleSidebar = () => {
    window.dispatchEvent(new Event("cms:toggle-sidebar"));
  };

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    student = null,
    loading = false,
    message = "",
    error = false,
  } = useSelector((s) => s.student || {});

  const [openSubject, setOpenSubject] = useState(null);

  useEffect(() => {
    const id = user?.user?._id;
    if (id) {
      dispatch(fetchStudentOnly(id));
    } else {
      console.error("User _id is missing!", user);
    }
    return () => dispatch(clearStudentState());
  }, [dispatch, user]);

  useEffect(() => {
    if (error) {
      toast.error(message);
    } else if (message) {
      toast.success(message);
    }
  }, [error, message]);

  // Group attendance by subject
  const groupedAttendance = (student?.attendance || []).reduce((acc, a) => {
    const subjectName = a.subjectId?.subjectName || "Unknown Subject";
    if (!acc[subjectName]) acc[subjectName] = [];
    acc[subjectName].push(a);
    return acc;
  }, {});

  if (loading) {
    return <div className="text-center py-8">Loading attendance...</div>;
  }

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

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8  mt-5">
              <h1 className="text-3xl font-semibold text-emerald-600">Attendance by Subject</h1>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 m-8">


              {Object.keys(groupedAttendance).length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-500">
                  No attendance records yet.
                </div>
              ) : (
                Object.entries(groupedAttendance).map(([subjectName, records]) => (
                  <div key={subjectName} className="border-b py-3">
                    {/* Subject header */}
                    <button
                      className="w-full flex justify-between items-center font-medium text-gray-700"
                      onClick={() =>
                        setOpenSubject(openSubject === subjectName ? null : subjectName)
                      }
                    >
                      <span>{subjectName}</span>
                      <span>{openSubject === subjectName ? "▲" : "▼"}</span>
                    </button>

                    {/* Dropdown content */}
                    {openSubject === subjectName && (
                      <ul className="mt-2 pl-4 divide-y">
                        {records
                          .slice()
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((a, idx) => (
                            <li key={idx} className="py-2">
                              <p className="text-sm font-medium">
                                {new Date(a.date).toLocaleDateString("en-GB")}
                              </p>
                              <p className="text-xs text-gray-500">Status: {a.status}</p>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                ))
              )}
            </div>


          </div>
        }
      </div>
    </div>
  );
}
