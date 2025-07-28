import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from '../config/nodeMailer.js';


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

        //Sending welcome Email
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Customizers King",
            text: `Welcome to Customizers King. your account has been created with email id: ${email}`
        }

        // console.log("Mail options:", mailOption);

        // await transporter.sendMail(mailOption)
        try {
            await transporter.sendMail(mailOption);
            console.log('Email sent');
        } catch (err) {
            console.error('Error sending email:', err);
        }

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

        // //Account must be verified with email
        // if (user || user.isAccountVerified !== true) {
        //     return res.json({ success: false, message: "Your account is not verified" })
        // }

        // // Admin: must be approved by superAdmin
        // if (user.role === 'admin' && user.adminApprovalStatus !== 'approved') {
        //     return res.json({ success: false, message: 'Admin account not yet approved by superAdmin.' });
        // }

        // // Teacher/Student: must be approved by admin
        // if ((user.role === 'teacher' || user.role === 'student') && user.approvalStatus !== 'approved') {
        //     return res.json({ success: false, message: "Account not approved by admin." })
        // }


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


//Send Verification OTP to user's Email
export const sendVerifyOtp = async (req, res) => {
    try {
        // const { userId } = req.body;
        const userId = req.user.id;
        // console.log(userId);

        const user = await userModel.findById(userId);
        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account Already Verified" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}. Verify your account using this OTP.`,
            // html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }

        await transporter.sendMail(mailOption)

        res.json({ success: true, message: "Verification OTP sent on Email" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//Verify the Email using OTP
export const verifyEmail = async (req, res) => {
    const userId = req.user.id;
    const { otp } = req.body;
    if (!userId || !otp) {
        return res.json({ success: false, message: "Missing Details" })
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        if (user.verifyOtp === "" || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" })
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired" })
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
        return res.json({ success: true, message: "Email Verified Successfully" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


//Send password reset OTP
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({ success: false, message: "No user found" });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid email" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 16 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password reset OTP",
            text: `Your password reset OTP is ${otp}. Use this OTP to proceed with resetting your password.`,
            // html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }
        await transporter.sendMail(mailOption)

        return res.json({ success: true, message: "OTP sent on your Email" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//Reset user password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Email, OTP & new password are required" })
    }

    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }
        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: "Password has been reset successfully" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}
