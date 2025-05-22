import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser)

export default router;


//yha pe ye router hume us route pe le jata h jha hume jana the as a user jaise ki
//router.route("/login").post(login) <--- ye login ek method hoga jha iska operation likha hoga just like registerUser