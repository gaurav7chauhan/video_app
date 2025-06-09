import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jsonWebToken from "jsonwebtoken";

// we use Nullish Coalescing (??) inplace of OR (||)
// instead of empty res we use _ in place of res. Its completely your choice
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Get token from cookies or header
    const token =
      req.cookies?.accessToken ??
      req.header("Authorization")?.replace("Bearer ", "");

    // If no token, throw unauthorized error
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Verify token
    const decodedToken = jsonWebToken.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    if (!decodedToken) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // remove the sensitive info
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // Save decoded payload (usually includes user id, email, etc.) in request
    req.user = user;

    // Move to next middleware or controller
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
});
