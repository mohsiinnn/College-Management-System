import userModel from "../models/userModel.js";

export const checkTeacherApproval = async (req, res, next) => {
    try {
        if (req.user && req.user.role === 'teacher') {
            const user = await userModel.findById(req.user.id);
            if (!user || user.approvalStatus !== 'approved') {
                return res.json({ success: false, message: "Your account is not approved by admin yet." })
            }
        }
        next();
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const checkStudentApproval = async (req, res, next) => {
    try {
        if (req.user && req.user.role === 'student') {
            const user = await userModel.findById(req.user.id);
            if (!user || user.approvalStatus !== 'approved') {
                return res.json({ success: false, message: "Your account is not approved by admin yet." })
            }
        }
        next();
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const checkAdminApproval = async (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            const user = await userModel.findById(req.user.id);
            if (!user || user.approvalStatus !== 'approved') {
                return res.json({success: false, message: "Your account is not approved by superAdmin yet."})
            }
        }
        next();
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}