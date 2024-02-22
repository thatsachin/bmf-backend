import bcrypt from "bcrypt";
import User from "../model/userSchema.js";
import connectToDB from "../connectToDB.js";

const UserRegister = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            res.status(200).json({
                "success": false,
                "message": "All fields are required!"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        connectToDB();
        const user = new User({
            fullName,
            email,
            password: hashedPassword,
        })
        await user.save();
        return res.status(200).json({ 
            message: 'User Registered Successfully.',
            success: true
        });
    }
    catch(error) {
        console.log(error);
    }
}

export default UserRegister;