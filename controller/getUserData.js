import connectToDB from "../connectToDB.js";
import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";

const GetUserData = async (req, res) => {
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

        return res.status(200).json({
            "success": true,
            "fullName": user.fullName,
            "email": user.email
        })
    }
    catch(error) {
        return res.status(500).json({
            "success": false,
            "errorMessage": error.message
        })
    }
}

export default GetUserData;