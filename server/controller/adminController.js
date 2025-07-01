import express from 'express'
import userModel from "../models/userModel.js"


export const pendindApprovals = async (req, res) => {
    try {
        const pendingUsers = await userModel.find({ approvalStatus: 'pending' });
        if (pendingUsers === '') {
            return res.json({ message: "No approvals are prending" });
        }
        else {
            return res.json(pendingUsers);
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