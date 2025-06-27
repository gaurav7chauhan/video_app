import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const loggedInUser = req.user._id;
  if (!loggedInUser) throw new ApiError(400, "user ID is required");

  //SubscriberCount
  const totalSubscriberCount = await Subscription.countDocuments({
    channel: loggedInUser,
  });
  if (!totalSubscriberCount) {
    throw new ApiError(400, "Subscribers not found");
  }

  //VideosCount
  const totalVideosCount = await Video.countDocuments({ owner: loggedInUser });
  if (!totalVideosCount) {
    throw new ApiError(400, "Videos not found");
  }

  //LikesCount
  const userVideos = await Video.find({ owner: loggedInUser }).select("_id");
  const videoIds = userVideos.map((video) => video._id);

  const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });
  if (!totalLikes) {
    throw new ApiError(400, "Likes not count");
  }

  //ViewsCount
  const totalViews = await Video.aggregate([
    {
      $match: {
        owner: loggedInUser,
      },
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
      },
    },
  ]);
  if (!totalViews) throw new ApiError(400, "Views not count");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalSubscribers: totalSubscriberCount,
        totalVideos: totalVideosCount,
        totalLikes: totalLikes,
        totalViews: totalViews[0]?.totalViews || 0,
      },
      "Channel stats fetched successfully"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const allUploadedVideos = await Video.find({ owner: req.user._id }).select(
    "thumbnail title duration views"
  );

  if (!allUploadedVideos) {
    throw new ApiError(400, "Videos not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allUploadedVideos,
        "Channel videos fetched successfully"
      )
    );
});

export { getChannelStats, getChannelVideos };
