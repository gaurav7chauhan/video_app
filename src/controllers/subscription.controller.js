import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  if (!channelId) throw new ApiError(404, "channel not found");

  const existingUser = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });

  if (existingUser) {
    await Subscription.findByIdAndDelete(existingUser._id);
    return res.status(200).json(new ApiResponse(200, {}, "Unsubscribed"));
  } else {
    const newSubs = await Subscription.create({
      subscriber: req.user._id,
      channel: channelId,
    });
    return res.status(201).json(new ApiResponse(201, newSubs, "Subscribed"));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) throw new ApiError(404, "Channel is not found");

  const getSubscribers = await Subscription.find({ channel: channelId })
    .select("subscriber")
    .populate("subscriber", "fullName username avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, getSubscribers, "Subscriber list fetched"));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!subscriberId) throw new ApiError(404, "subscriber is not found");

  const subscribedChannels = await Subscription.find({
    subscriber: subscriberId,
  })
    .select("channel")
    .populate("channel", "fullName username avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, subscribedChannels, "channel list fetched"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
