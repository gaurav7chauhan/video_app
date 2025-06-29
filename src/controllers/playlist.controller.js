import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //TODO: create playlist
  if (!name || !description) {
    throw new ApiError(404, "please add name or description");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
    // we don't add videos now because no videos are available yet
  });

  if (!playlist) throw new ApiError(404, "playlist not created");

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  if (!userId) throw new ApiError(404, "userId is not found");

  const userPlaylists = await Playlist.find({ owner: userId }).select("videos");

  if (!userPlaylists) throw new ApiError(404, "playlists not found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, userPlaylists, "user playlists successfully fetched")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  if (!playlistId) throw new ApiError(404, "playlists not found");

  const playlists = await Playlist.findById(playlistId).select(
    "videos description name"
  );

  if (!playlists) throw new ApiError(404, "Playlist not found");

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !videoId) throw new ApiError(404, "queries is not found");

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $addToSet: { videos: videoId },
    },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Video added to playlist successfully"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  if (!playlistId || !videoId) {
    throw new ApiError(400, "Both playlistId and videoId are required");
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: { videos: videoId },
    },
    { new: true }
  );

  if (!playlist) throw new ApiError(404, "playlist not found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video removed from playlist successfully")
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  if (!playlistId || !name || !description) {
    throw new ApiError(400, "please send inputs");
  }

  const newPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: { name, description },
    },
    {
      new: true,
    }
  );

  if (!newPlaylist) {
    throw new ApiError(404, "Playlist not found or could not be updated");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, newPlaylist, "Playlist updated successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if (!playlistId) throw new ApiError(400, "playlistId is required");

  const removePlaylist = await Playlist.findByIdAndDelete(playlistId);

  if (!removePlaylist) throw new ApiError(404, "playlist not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "playlist successfully remove"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
