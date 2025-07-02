import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";

export const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    // console.log("Token received:", token); // Debug: log the token

    if (!token) {
        return res.json({ success: false, message: "Not authorized. Login again" })
    }

    try {

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(tokenDecode);

        if (tokenDecode.id) {
            // req.body.userId = tokenDecode.id;
            const user = await userModel.findById(tokenDecode.id)
            if (!user) return res.json({ success: false, message: "User not found" });
            req.user = { id: user._id, role: user.role };

        } else {
            return res.json({ success: false, message: "Not authorized. Login again" })
        }

        next();

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


export const requireRole = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.json({ success: false, message: 'Forbidden: Access is denied.' });
        }
    }
}