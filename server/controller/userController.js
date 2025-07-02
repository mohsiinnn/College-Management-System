import userModel from "../models/userModel.js";

export const superAdminDashBoard = async(req, res) => {
  const userId = req.user.id;
  const user = await userModel.findById(userId)
  if (user) {
    res.json({success: true, message: "this is super admin Dashboard"})
  }
}

export const adminDashBoard = async(req, res) => {
  const userId = req.user.id;
  const user = await userModel.findById(userId)
  if (user) {
    res.json({success: true, message: "this is Admin Dashboard"})
  }
}

export const teacherDashBoard = async(req, res) => {
  const userId = req.user.id;
  const user = await userModel.findById(userId)
  if (user) {
    res.json({success: true, message: "this is Teaacher Dashboard"})
  }
}
export const studentDashBoard = async(req, res) => {
  const userId = req.user.id;
  const user = await userModel.findById(userId)
  if (user) {
    res.json({success: true, message: "this is Student Dashboard"})
  }
}