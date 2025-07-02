
export const restrictAdmin = async (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            next()
        }
        else {
            return res.json({ success: false, message: "SuperAdmin access required." });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


//For Super Admin
export const restrictSuperAdmin = async (req, res, next) => {
    try {
        if (req.user && req.user.role === 'superAdmin') {
            next();
        }
        else{
            return res.json({ success: false, message: "SuperAdmin access required." });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}