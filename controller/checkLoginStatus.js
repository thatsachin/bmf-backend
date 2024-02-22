import connectToDB from "../connectToDB.js";
import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";

const CheckLoginStatus = async (req, res) => {
    try {
        const { token } = req.cookies;
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
        } else {
            return res.status(200).json({
                "success": true,
                "message": "User is logged in",
                "user": user.fullName
            })
        }
    }
    catch(error) {
        return res.status(500).json({
            "success": false,
            "errorMessage": error.message
        })
    }
}

export default CheckLoginStatus;