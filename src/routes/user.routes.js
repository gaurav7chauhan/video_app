import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1, },
    { name: "coverImage", maxCount: 1, },
  ]),
  registerUser
);

export default router;

//yha pe ye router hume us route pe le jata h jha hume jana the as a user jaise ki
//router.route("/login").post(login) <--- ye login ek method hoga jha iska operation likha hoga just like registerUser
