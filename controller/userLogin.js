import bcrypt from "bcrypt";
import User from "../model/userSchema.js";
import connectToDB from "../connectToDB.js";
import jwt from "jsonwebtoken";

const UserLogin = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(200).json({
                "success": false,
                "message": "All fields are required!",
            });
        }

        connectToDB();
        const user = await User.findOne({email})

        if(!user) {
            return res.status(200).json({
                "success": false,
                "message": "User not found.",
            });
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword) {
            return res.status(200).json({
                "success": false,
                "message": "Invalid password.",
            });
        }

        const jwtToken = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET)

        const expires = new Date(Date.now() + 7 * 24 * 3600000); // 7 days in milliseconds.

        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: true,
            expires,
            sameSite: 'None'  
        });

        return res.status(200).json({
            "success": true,
            "message": "User Logged in successfully."
        })
    }
    catch(error) {
        console.log(error);
    }
}

export default UserLogin;