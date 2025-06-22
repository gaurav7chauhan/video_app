import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;

  if (!content) throw new ApiError(400, "Tweet content is required");

  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet successfully fetched"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;
  const userTweets = await Tweet.findById(userId).select("content");

  if (!userTweets || userTweets.length === 0) {
    throw new ApiError(404, "User tweets not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, userTweets, "User tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { updatedTweet } = req.body;

  if (!updatedTweet || !tweetId) throw new ApiError(404, "Content not found");

  const tweet = await Tweet.findOneAndUpdate(
    // use this method for security reasons
    { _id: tweetId, owner: req.user._id },
    { $set: { content: updatedTweet } },
    { new: true }
  );

  if (!tweet) throw new ApiError(404, "Tweet not found");

  return res.status(200).json(new ApiResponse(200));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  if (!tweetId) throw new ApiError(404, "tweet not found");

  const deletedTweet = await Tweet.findOneAndDelete({
    _id: tweetId,
    owner: req.user._id,
  });

  if (!deletedTweet) {
    throw new ApiError(
      404,
      "Tweet not found or you are not authorized to delete it"
    );
  }
  
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "tweet is deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
