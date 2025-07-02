import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";


export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.json({ success: false, message: "Missing Details" })
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword, role });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })


        return res.json({ success: true });

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: "Email and Password are required" })
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid email" })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" })
        }


        // Admin: must be approved by superAdmin
        if (user.role === 'admin' && user.adminApprovalStatus !== 'approved') {
            return res.json({ success: false, message: 'Admin account not yet approved by superAdmin.' });
        }

        // Teacher/Student: must be approved by admin
        if ((user.role === 'teacher' || user.role === 'student') && user.approvalStatus !== 'approved') {
            return res.json({ success: false, message: "Account not approved by admin." })
        }


        //Here we are generating Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.cookie("token", token, {    //Here we are storing token in cookie
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        //Here we are removing Cookie from response
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({ success: true, message: "Logged Out" })

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

