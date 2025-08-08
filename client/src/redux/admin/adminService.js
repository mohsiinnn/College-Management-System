import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_BACKEND_URL;

//Pending Approvals
const allPendingApprovals = async () => {
    const response = await axios.get(`${API_URL}/api/admin/pending-approvals`)
    return response.data
}
const approveUser = async (userId) => {
    const response = await axios.post(`${API_URL}/api/admin/approve-user/${userId}`)
    return response.data
}
const rejectUser = async (userId) => {
    const response = await axios.post(`${API_URL}/api/admin/reject-user/${userId}`)
    return response.data
}


const adminService = {
    allPendingApprovals,
    approveUser,
    rejectUser
}

export default adminService