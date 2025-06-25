import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) throw new ApiError(400, "Video ID is required");

  const skip = Number(page - 1) * Number(limit);

  const videoComments = await Comment.find({ video: videoId })
    .select("content")
    .populate("owner", "username fullName avatar")
    .skip(skip)
    .limit(Number(limit));

  if (!videoComments) {
    throw new ApiError(404, "Comments not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videoComments, "Comments successfully fetched"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { commentContent } = req.body;

  if (!videoId || !commentContent) {
    throw new ApiError(400, "Video ID or comment is required");
  }
  const commentSchema = await Comment.create({
    content: commentContent,
    video: videoId,
    owner: req.user._id,
  });

  if (!commentSchema) throw new ApiError(404, "Comment not added");

  return res
    .status(201)
    .json(new ApiResponse(201, commentSchema, "Comment add successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { updatedCommentContent } = req.body;

  if (!commentId || !updatedCommentContent) {
    throw new ApiError(400, "commentId or updatedCommentContent is required");
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: updatedCommentContent,
      },
    },
    { new: true }
  );

  if (!comment) throw new ApiError(404, "Comment failed to update");

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  if (!commentId) throw new ApiError(400, "Comment ID is required");

  const findToDeleteComment = await Comment.findByIdAndDelete(commentId);

  if (!findToDeleteComment) {
    throw new ApiError(404, "Comment failed to delete");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
