import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
  if (!query && !userId) throw new ApiError(404, "Please send query or userId");

  const filter = {};

  if (userId) filter.owner = userId;

  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const sortOption = {};
  if (sortBy) {
    sortOption[sortBy] = sortType === "asc" ? 1 : -1;
  } else {
    sortOption.createdAt = -1;
  }

  const filterTheQuery = await Video.find(filter)
    .skip(skip)
    .limit(Number(limit))
    .sort(sortOption);

  return res
    .status(200)
    .json(new ApiResponse(200, filterTheQuery, "filter data fetched"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  if (!title || !description) {
    throw new ApiError(400, "Please provide title and decription");
  }

  console.log(req.files);

  let videoFileLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.videoFile) &&
    req.files.videoFile.length > 0
  ) {
    videoFileLocalPath = req.files.videoFile[0].path;
  }

  if (!videoFileLocalPath) {
    throw new ApiError(400, "Video is not found");
  }

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);

  if (!videoFile) {
    throw new ApiError(400, "Video is not uploaded");
  }

  let thumbnailFileLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.thumbnail) &&
    req.files.thumbnail.length > 0
  ) {
    thumbnailFileLocalPath = req.files.thumbnail[0].path;
  }

  if (!thumbnailFileLocalPath) {
    throw new ApiError(400, "thumbnail is not found");
  }

  const thumbnailFile = await uploadOnCloudinary(thumbnailFileLocalPath);

  if (!thumbnailFile) {
    throw new ApiError(400, "thumbnail is not uploaded");
  }

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnailFile.url,
    title: title,
    description: description,
    duration: videoFile.duration,
    owner: req.user._id,
  });

  const videoDataSendToUser = await Video.findById(video._id).select(
    "-owner -duration"
  );

  return res
    .status(201)
    .json(
      new ApiResponse(200, videoDataSendToUser, "Video successfully uploaded")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!videoId) {
    throw new ApiError(404, "Video is not found 1");
  }
  const getVideo = await Video.findById(videoId);

  if (!getVideo) {
    throw new ApiError(400, "Video not found 2");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getVideo, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  //TODO: update video details like title, description, thumbnail
  if (!videoId) throw new ApiError(404, "Video is not found");

  if (!title || !description) {
    throw new ApiError(400, "Please provide title and description");
  }

  let thumbnailLocalPath;
  if (req.file) thumbnailLocalPath = req.file.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnail file is requierd");
  }

  const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnailFile) throw new ApiError(400, "thumbnail file is not uploaded");

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: thumbnailFile.url,
      },
    },
    {
      new: true,
    }
  ).select("title description thumbnail");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video is successfully updated"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!videoId) throw new ApiError(404, "Video ID is required");

  const video = await Video.findByIdAndDelete(videoId);

  if (!video) throw new ApiError(404, "video is not found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) throw new ApiError(404, "Video ID is required");

  const findVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $bit: {
        isPublished: { xor: 1 },
      },
    },
    {
      new: true,
    }
  );

  if (!findVideo) throw new ApiError(404, "Video is not found");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        findVideo,
        `Video is ${findVideo.isPublished ? "Published" : "unpublished"} successfully`
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
