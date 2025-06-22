import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/c/:channelId")
  .get(getUserChannelSubscribers) // ✅ channelId goes here
  .post(toggleSubscription);

router.route("/u/:subscriberId").get(getSubscribedChannels); // ✅ subscriberId goes here

export default router;
