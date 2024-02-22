import bcrypt from "bcrypt";
import User from "../model/userSchema.js";
import connectToDB from "../connectToDB.js";

const UpdateUserData = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const { _id } = req.user;
        if (!fullName || !email || !password) {
            res.status(200).json({
                "success": false,
                "message": "All fields are required!"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        connectToDB();
        const user = await User.findOne({_id: tokenVerification.id});
            user.fullName = fullName;
            user.email = email;
            user.password = hashedPassword;
            await user.save();
        return res.status(200).json({ 
            message: 'User Data Updated Successfully.',
            success: true
        });
    }
    catch(error) {
        console.log(error);
    }
}

export default UpdateUserData;