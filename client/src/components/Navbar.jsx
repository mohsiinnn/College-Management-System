import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthState, getUserData, logoutUser, sendVerifyOtp } from '../redux/auth/authSlice'


const Navbar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth)




    const sendVerificationOtp = () => {
        dispatch(sendVerifyOtp())
        dispatch(clearAuthState())
        navigate('/email-verify')
    }

    const logout = () => {
        dispatch(logoutUser())
        dispatch(clearAuthState())
        navigate('/')
    }

    // useEffect(() => {
    //     dispatch(getUserData())
    // }, [dispatch])

    // console.log(user);

    return (
        <div className="w-full flex justify-between items-center p-3 sm:p-6 sm:px-24 absolute top-0">
            {/* Logo */}
            <img
                src="/cms_logo.png"
                alt=""
                className="w-16 sm:w-24"
            />

            {user ? (
                <div className="relative group">
                    {/* Hidden checkbox for mobile toggle */}
                    <input
                        type="checkbox"
                        id="user-menu"
                        className="hidden peer"
                    />

                    {/* This label works for mobile click */}
                    <label
                        htmlFor="user-menu"
                        className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white cursor-pointer"
                    >
                        {user?.name ? user.name[0].toUpperCase() : "?"}
                    </label>

                    {/* This Dropdown works on both hover and click on mobile */}
                    <div className="absolute hidden peer-checked:block group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
                        <ul className="list-none m-0 p-2 bg-gray-100 text-xs sm:text-sm min-w-[110px] sm:min-w-[140px]">
                            {!user?.isAccountVerified && (
                                <li
                                    onClick={sendVerificationOtp}
                                    className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                                >
                                    Verify Email
                                </li>
                            )}
                            <li
                                onClick={logout}
                                className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                            >
                                Logout
                            </li>
                        </ul>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-1 sm:gap-2 border border-gray-500 rounded-full px-3 py-1 sm:px-6 sm:py-2 text-xs sm:text-base text-gray-800 hover:bg-gray-100 transition-all"
                >
                    Go back & Login again
                    <img
                        src={assets.arrow_icon}
                        alt=""
                        className="w-3 sm:w-4"
                    />
                </button>
            )}
        </div>
    );


}

export default Navbar