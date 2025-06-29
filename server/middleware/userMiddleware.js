import jwt from "jsonwebtoken"

export const isAuthenticated = async (req, res, next) => {
    const {token} = req.cookies;

    if (!token) {
        return res.json({success: false, message: "Not authorized. Login again"})
    }

    try {
        
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(tokenDecode);
        
        if(tokenDecode.id){
            // req.body.userId = tokenDecode.id;
            req.user = { id: tokenDecode.id };
        }else{
            return res.json({success: false, message: "Not authorized. Login again"})
        }
 
        next();

    } catch (error) {
        res.json({success: false, message: error.message})
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