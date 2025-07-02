
export const restrictAdmin = async (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            next()
        }
        else {
            return res.json({ success: false, message: "Login as admin" });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}