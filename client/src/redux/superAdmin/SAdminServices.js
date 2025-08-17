import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_BACKEND_URL;

//All Admins
const getAdmins = async () => {
    const response = await axios.get(`${API_URL}/api/super-admin/all-admins`)
    return response.data
}

//Pending Approvals
const allPendingAdmins = async () => {
    const response = await axios.get(`${API_URL}/api/super-admin/pending-admins`)
    return response.data
}
const approveAdmin = async (userId) => {
    const response = await axios.post(`${API_URL}/api/super-admin/approve-admin/${userId}`)
    return response.data
}
const rejectAdmin = async (userId) => {
    const response = await axios.post(`${API_URL}/api/super-admin/reject-admin/${userId}`)
    return response.data
}

const SAdminService = {
    getAdmins,
    allPendingAdmins,
    approveAdmin,
    rejectAdmin
}

export default SAdminService