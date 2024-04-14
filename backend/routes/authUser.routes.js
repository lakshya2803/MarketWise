import express from "express";
import { createUser,forgotPassword,loginUser } from "../controller/user.controller.js";
const router = express.Router();

// registering and logining in user by post method
router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/forgot-password").post(forgotPassword);

export default router;