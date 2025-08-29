import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { clearAuthState, logoutUser } from '../../../redux/auth/authSlice'
import {
  Menu,
  ChevronLeft,
  GraduationCap,
  Home,
  Clock4,
  Users,
  Monitor,
  Layers,
  BookOpen,
  LogOut,
  CircleCheck,
  Settings,
  User,
  Calendar,
} from "lucide-react";
import { useNavigate, useNavigation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const NAV = [
  { label: "Profile", icon: User },
  { label: "Subjects", icon: BookOpen },
  { label: "Attendance", icon: Calendar },
  { label: "Verify Email", icon: Calendar },
];

const ROUTE_BY_LABEL = {
  Profile: "/student/dashboard",
  Subjects: "/student/dashboard/subjects",
  Attendance: "/student/dashboard/attendance",
  'Verify Email': "/email-verify",
};

export default function SidebarUI({
  onItemClick = (label) => console.log("Clicked:", label),
}) {
  const prefersReducedMotion = useReducedMotion();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const v = localStorage.getItem("cms_sidebar_open");
    return v === null ? true : v === "1";
  });

  const sidebarRef = useRef(null);
  const closeBtnRef = useRef(null);


  const navigate = useNavigate();
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  // Persist open/close
  useEffect(() => {
    localStorage.setItem("cms_sidebar_open", isSidebarOpen ? "1" : "0");
  }, [isSidebarOpen]);

  useEffect(() => {
    const onKey = (e) => {
      const isMeta = e.ctrlKey || e.metaKey;
      if (e.key === "Escape") setIsSidebarOpen(false);
      if (isMeta && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsSidebarOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!isSidebarOpen) return;
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      if (isDesktop) return;
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isSidebarOpen]);

  useEffect(() => {
    if (isSidebarOpen) {
      closeBtnRef.current?.focus({ preventScroll: true });
    }
  }, [isSidebarOpen]);

  const duration = prefersReducedMotion ? 0 : 0.22;

  const asideVariants = {
    hidden: { x: "-100%", opacity: 0.0 },
    visible: { x: 0, opacity: 1.0, transition: { duration } },
    exit: { x: "-100%", opacity: 0.0, transition: { duration: duration * 0.9 } },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration } },
    exit: { opacity: 0, transition: { duration: duration * 0.8 } },
  };

  const ItemButton = ({ icon: Icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
    >
      {Icon ? <Icon className="h-5 w-5 text-slate-500" /> : null}
      <span>{label}</span>
    </button>
  );

  const handleNav = (label) => {
    onItemClick(label); // keep your external callback
    const path = ROUTE_BY_LABEL[label];
    if (path) {
      navigate(path);
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      if (!isDesktop) setIsSidebarOpen(false);
    }
  };

  const logout = () => {
    dispatch(logoutUser())
    dispatch(clearAuthState())
    navigate('/')
  }

  return (
    <>
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-7 left-8 z-50 grid h-11 w-11 place-items-center rounded-md bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-label="Open sidebar"
          title="Open sidebar (Ctrl/Cmd + B)"
        >
          <Menu className="h-5 w-5 text-slate-700" />
        </button>
      )}

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.button
            key="overlay"
            className="fixed inset-0 lg:left-72 bg-black/30 z-40"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            aria-hidden="true"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.aside
            key="aside"
            ref={sidebarRef}
            role="navigation"
            aria-label="Sidebar"
            className="fixed left-0 top-0 z-50 bg-white min-h-screen w-72 flex flex-col"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={asideVariants}
          >

            <div className="flex items-center gap-3 px-4 py-6 pt-10">
              <div className="h-10 w-10 rounded-xl grid place-items-center text-white bg-gradient-to-br from-sky-500 to-sky-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="mr-auto">
                <p className="text-lg font-semibold leading-5">CMS</p>
                <p className="text-xs text-slate-500 -mt-0.5">College Management</p>
              </div>
              <button
                ref={closeBtnRef}
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
                aria-label="Close sidebar"
                title="Close (Esc)"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
            <hr className="text-gray-300 mx-2" />

            <nav className="mt-1 px-2 pb-4 overflow-y-auto pt-2">
              {NAV.map((item) => (
                <motion.div
                  key={item.label}
                  className="mb-1"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: prefersReducedMotion ? 0 : 0.18 } }}
                >
                  <ItemButton
                    icon={item.icon}
                    label={item.label}
                    onClick={() => handleNav(item.label)}
                  />
                </motion.div>
              ))}
            </nav>

            {/* Logout */}
            <div className="mt-auto pb-7 px-3 ">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-3 text-sm text-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
