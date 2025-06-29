import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  if (!videoId) throw new ApiError(400, "video ID is required");

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "unliked video successfully"));
  } else {
    const newLike = await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, newLike, "Liked video successfully"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  if (!commentId) throw new ApiError(400, "Comment ID is required");

  const findLikeSchema = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (findLikeSchema) {
    await Like.findByIdAndDelete(findLikeSchema._id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment unliked successfully"));
  } else {
    const newLike = await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, newLike, "Comment liked successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  if (!tweetId) throw new ApiError(400, "Tweet ID is required");

  const existingTweet = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  if (existingTweet) {
    await Like.findByIdAndDelete(existingTweet._id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Tweet unliked successfully"));
  } else {
    const newTweet = await Like.create({
      tweet: tweetId,
      likedBy: req.user._id,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, newTweet, "Tweet liked successfully"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const likedVideos = await Like.find({
    likedBy: req.user._id,
    video: { $ne: null },
  }) //not equal to null
    .select("video")
    .populate("video", "title thumbnail duration views");

  if (!likedVideos) throw new ApiError(404, "Liked videos not found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos successfully fetched")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
