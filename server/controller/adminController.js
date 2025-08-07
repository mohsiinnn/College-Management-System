import express from 'express'
import userModel from "../models/userModel.js"


export const pendingApprovals = async (req, res) => {
    try {
        const pendingUsers = await userModel.find({
            approvalStatus: 'pending',
            role: { $in: ['teacher', 'student'] }
        });

        if (pendingUsers.length > 0) {
            return res.json(pendingUsers);
        }
        else {
            return res.json({ data: pendingUsers, message: "No approvals are prending" });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const approveUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.findByIdAndUpdate(id, { approvalStatus: 'approved' })
        if (user) {
            return res.json({ success: true, message: "User approved" });
        }
        else {
            res.json({ success: false, message: "User not found" });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const rejectUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.findByIdAndUpdate(id, { approvalStatus: 'rejected' });
        if (user) {
            return res.json({ success: true, message: "User rejected" });
        }
        else {
            res.json({ success: false, message: "User not found" });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}