import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminDashboard, clearUserState, studentDashboard, teacherDashboard } from "../redux/user/userSlice";
import { assets } from "../assets/assets";
import Spinner from "./Spinner";
import StudentDashboard from "../pages/student/StudentDashboard";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import Navbar from "./Navbar";
import AdminDashboard from "../pages/admin/AdminDashboard";
import { getUserData } from "../redux/auth/authSlice";

const DashboardLoader = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { dashboardData, loading, message } = useSelector((state) => state.user);

    // console.log("ye user hai: ", user?.user?.role);


    useEffect(() => {
        dispatch(getUserData())
    }, [dispatch])

    // console.log(user);

    useEffect(() => {
        if (user && user?.role) {
            if (user?.role === 'admin') {
                dispatch(adminDashboard())
            }
            if (user?.role === 'teacher') {
                dispatch(teacherDashboard())
            }
            if (user?.role === 'student') {
                dispatch(studentDashboard())
            }
        }
        return ()=> dispatch(clearUserState())
    }, [dispatch, user]);
    // console.log("ye dashboarddata hai: ", dashboardData);

    // Restriction error messages
    // we use this case for best practice for example if we want that if any string in array matches with message then we can show some special UI components 
    const isRestriction = message &&
        [
            "not verified",
            "not approved by admin",
            "not approved by superAdmin",
            "Your account is not verified with your Email adress",
            "your account is not approved by superadmin yet.",
        ].some((frag) => message?.toLowerCase().includes(frag));
    ;
    console.log(isRestriction);
    

    let doller;
    if (dashboardData?.data?.role) {

        if (dashboardData?.data?.role === 'admin') {
            doller = <div><AdminDashboard /></div>
        }
        if (dashboardData?.data?.role === 'teacher') {
            doller = <div><TeacherDashboard /></div>
        }
        if (dashboardData?.data?.role === 'student') {
            doller = <div><StudentDashboard /></div>
        }
    }

    if (loading) return <Spinner />
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
            <Navbar />
            {isRestriction ? (
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md flex flex-col items-center text-center border border-indigo-300">
                    <img
                        src={assets.header_img}
                        alt="warning"
                        className="w-14 mb-4"
                    />
                    <h2 className="text-2xl font-bold text-indigo-800 mb-2">
                        Access Restricted
                    </h2>
                    <p className="text-indigo-500 font-medium mb-3">{message}</p>
                    <p className="text-slate-500 text-sm">
                        Please contact your administrator for more information.
                    </p>
                </div>
            ) : (
                // If no restriction, show the dashboard content
                <div className="w-full">
                    {doller}
                </div>
            )}
        </div>
    );
};

export default DashboardLoader;
