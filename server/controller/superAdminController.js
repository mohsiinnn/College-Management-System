import userModel from "../models/userModel.js";


export const pendingAdmins = async (req, res) => {
    try {
        const admins = await userModel.find({ adminApprovalStatus: 'pending' });
        if (admins.length > 0) {    
            return res.json({ success: true, data: admins });
        }
        else {
            return res.json({ success: false, message: "No approvals are prending" });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const approveAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await userModel.findByIdAndUpdate(id, { adminApprovalStatus: 'approved' });
        if (admin) {
            return res.json({ success: true, message: "Admin approved" });
        }
        else {
            res.json({ success: false, message: "Admin not found" });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }

}

export const rejectAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await userModel.findByIdAndUpdate(id, { adminApprovalStatus: 'rejected' });
        if (admin) {
            return res.json({ success: true, message: "Admin rejected" });
        }
        else {
            res.json({ success: false, message: "Admin not found" });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }

}