import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_BACKEND_URL;

//Register user
const register = async (userData) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, userData)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

//Login user
const login = async (userData) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, userData)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

//Logout user
const logout = async () => {
    const response = await axios.post(`${API_URL}/api/auth/logout`)

    if (response.data) {
        localStorage.removeItem('user');
    }

    return response.data
}

//Send verification OTP
const sendVerifyOtp = async () => {
    const response = await axios.post(`${API_URL}/api/auth/send-verify-otp`)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

//Send verify OTP
const verifyAccount = async (userData) => {
    const response = await axios.post(`${API_URL}/api/auth/verify-account`, userData)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

// Sent Reset OTP 
const sendResetOtp = async (userData) => {
    const response = await axios.post(`${API_URL}/api/auth/send-reset-otp`, userData)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

// Reset password 
const resetPassword = async (userData) => {
    const response = await axios.post(`${API_URL}/api/auth/reset-password`, userData)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

//student Dashboard
const getUserData = async () => {
    const response = await axios.get(`${API_URL}/api/auth/getUserData`)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}


const authService = {
    register,
    login,
    logout,
    sendVerifyOtp,
    verifyAccount,
    sendResetOtp,
    resetPassword,
    getUserData
}

export default authService