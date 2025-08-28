import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_BACKEND_URL;


//Admin Dashboard
const admin = async () => {
    const response = await axios.get(`${API_URL}/api/user/admin-dashboard`)

    // if (response.data) {
    //     localStorage.setItem('user', JSON.stringify(response.data))
    // }

    return response.data
}

//student Dashboard
const student = async () => {
    const response = await axios.get(`${API_URL}/api/user/student-dashboard`)

    // if (response.data) {
    //     localStorage.setItem('user', JSON.stringify(response.data))
    // }

    return response.data
}

//Teacher Dashboard
const teacher = async () => {
    const response = await axios.get(`${API_URL}/api/user/teacher-dashboard`)

    // if (response.data) {
    //     localStorage.setItem('user', JSON.stringify(response.data))
    // }

    return response.data
}

const userService = {
    admin,
    student,
    teacher
}

export default userService;