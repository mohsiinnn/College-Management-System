import { Bell, Menu, Search, TrendingUp, Users, GraduationCap, Clock, Building2, Eye } from "lucide-react";
import SidebarUIOnlyFancy from "../../components/Testing"; // Your existing fancy sidebar

export default function AdminDashboard() {
  // Function to toggle sidebar (triggers event the sidebar listens to)
  const toggleSidebar = () => {
    window.dispatchEvent(new Event("cms:toggle-sidebar"));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar component */}
      <SidebarUIOnlyFancy />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white ">
          <div className="px-4 sm:px-6 lg:px-8 h-24 flex items-center gap-3">

            <div className="flex flex-col pl-16">
              <h1 className="text-xl sm:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
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

        {/* Dashboard content */}
        <main className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">

            <div className="bg-white rounded-xl shadow-sm p-4 my-0 flex items-center justify-between">
              {/* Left side: title, value, footer */}
              <div>
                <p className="text-sm text-slate-500">Total Students</p>
                <p className="text-3xl font-semibold text-slate-900 ">0</p>
                <div className="mt-1 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-600">+12% from last month</p>
                </div>
              </div>

              {/* Right side: icon vertically centered */}
              <div className="h-13 w-13 rounded-xl grid place-items-center text-white bg-gradient-to-br from-blue-100 to-indigo-100">
                <Users className="h-7 w-7 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 my-0 flex items-center justify-between">
              {/* Left side: title, value, footer */}
              <div>
                <p className="text-sm text-slate-500">Total Teachers</p>
                <p className="text-3xl font-semibold text-slate-900">0</p>
                <div className="mt-1 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-600">+3% from last month</p>
                </div>
              </div>

              {/* Right side: icon vertically centered */}
              <div className="h-13 w-13 rounded-xl grid place-items-center text-white bg-gradient-to-br from-green-100 to-emerald-100">
                <GraduationCap className="h-7 w-7 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 my-0 flex items-center justify-between">
              {/* Left side: title, value, footer */}
              <div>
                <p className="text-sm text-slate-500">Pending Approvals</p>
                <p className="text-3xl font-semibold text-slate-900">0</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-sm text-red-600">Requires attention</p>
                </div>
              </div>

              {/* Right side: icon vertically centered */}
              <div className="h-13 w-13 rounded-xl grid place-items-center text-white bg-gradient-to-br from-rose-100 to-red-100">
                <Clock className="h-7 w-7 text-red-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 my- flex items-center justify-between">
              {/* Left side: title, value, footer */}
              <div>
                <p className="text-sm text-slate-500">Active Classes</p>
                <p className="text-3xl font-semibold text-slate-900">2</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-sm text-indigo-600">Across departments</p>
                </div>
              </div>

              {/* Right side: icon vertically centered */}
              <div className="h-13 w-13 rounded-xl grid place-items-center text-white bg-gradient-to-br from-violet-100 to-fuchsia-100">
                <Building2 className="h-7 w-7 text-indigo-600" />
              </div>
            </div>

          </div>

          {/* Pending Approvals Section */}
          <section className="bg-white h-56 rounded-xl shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <h2 className="text-base font-semibold text-slate-900">Pending Approvals</h2>
              <button className="flex items-center gap-1 border border-gray-300 px-4 py-2 rounded-lg text-sm text-black hover:text-slate-800">
                <Eye className="h-4 w-4" /> View All
              </button>
            </div>
            <div className="p-6 text-center text-slate-500">
              No pending approvals
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}