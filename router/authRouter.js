import express from "express";
import login from "../controller/userLogin.js";
import register from "../controller/userRegister.js";
import logout from "../controller/userLogout.js";
import checkLoginStatus from "../controller/checkLoginStatus.js";
import GetUserData from "../controller/getUserData.js";
import UpdateUserData from "../controller/updateUserData.js";
import AuthChecker from "../middleware/authChecker.js";

const authRouter = express.Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.get("/logout", logout);

authRouter.get("/get-user-data", GetUserData);

authRouter.post("/update-user-data", AuthChecker, UpdateUserData);

authRouter.get("/check-login-status", checkLoginStatus);

export default authRouter;