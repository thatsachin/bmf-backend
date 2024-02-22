import connectToDB from "../connectToDB.js";
import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";

const AuthChecker = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(200).json({
                "success": false,
                "message": "Login first!"
            })
        }

        const tokenVerification = jwt.verify(token, process.env.JWT_SECRET);
        connectToDB();
        const user = await User.findOne({_id: tokenVerification.id});
        if(!user){
            res.cookie('token', '', { maxAge: 0 });
            return res.status(200).json({
                "success": false,
                "message": "Login first!"
            })            
        }

        req.user = user;
        next();
    }
    catch(error) {
        return res.status(500).json({
            "success": false,
            "errorMessage": error.message
        })
    }
}

export default AuthChecker;