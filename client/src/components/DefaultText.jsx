import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminDashboard, studentDashboard, teacherDashboard } from "../redux/user/userSlice";
import { assets } from "../assets/assets";
import Spinner from "./Spinner";

const roleDashboardAction = {
    admin: adminDashboard,
    teacher: teacherDashboard,
    student: studentDashboard,
};

const DashboardLoader = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { loading, message } = useSelector((state) => state.user);

    useEffect(() => {
        if (user?.role && roleDashboardAction[user.role]) {
            dispatch(roleDashboardAction[user.role]());
        }

        // WE CAN WRITE THIS INSTEAD
        // if (user && user.role) {
        //     if (user.role === 'admin') {
        //         dispatch(adminDashboard())
        //     }
        //     if (user.role === 'teacher') {
        //         dispatch(teacherDashboard())
        //     }
        //     if (user.role === 'student') {
        //         dispatch(studentDashboard())
        //     }
        // }
    }, [dispatch, user]);

    // Restriction error messages
    // we use this case for best practice for example if we want that if any string in array matches with message then we can show some special UI components 
    const isRestriction =
        message &&          
        [         
            "not verified",
            "not approved by admin",
            "not approved by superAdmin",
            "not verified with your Email adress",
        ].some((frag) => message?.toLowerCase().includes(frag));   

    if (loading) return <Spinner />
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">

            {isRestriction ? (
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md flex flex-col items-center text-center border border-indigo-300">
                    <img
                        src={assets.warning_icon}
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
                    {/* Place your normal dashboard UI here */}
                    <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                        Welcome, {user.name}
                    </h2>
                    
                </div>
            )}
        </div>
    );
};

export default DashboardLoader;

















// import { useSelector } from 'react-redux'
// import { assets } from '../assets/assets'

// const DefaultText = () => {
//   const { user } = useSelector((state) => state.auth)

//     return (
//         <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
//             <img src={assets.header_img} className='w-36 h-36 rounded-full mb-6' />

//             <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
//                 Hey {user ? user.name : "Developer"}!
//                 <img src={assets.hand_wave} className='w-8 aspect-square' />
//             </h1>
//             <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our App</h2>
//             <p className='mb-8 max-w-md'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus delectus perspiciatis ducimus dolore.</p>
//             <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>Get Started</button>
//         </div>
//     )
// }

// export default DefaultText