import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user deatils from frontend
  // validation - not empty
  // check if user already exist or not by: username, email(unique)
  // check for images and avatar
  // upload them to cloudinary, check again for avatar
  // create user object - create entry in db
  // we remove password and refresh token field from response
  // check for user creation
  // return yes.

  const { fullName, username, email, password } = req.body;
  console.log(`fullName:${fullName}, email:${email}, password:${password}`);

  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  } else if (!email.includes("@")) {
    throw new ApiError(400, "Please verify email");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser?.username) {
    throw new ApiError(409, "Username already exists.");
  } else if (existedUser?.email) {
    throw new ApiError(409, "Email already exists.");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required.");

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required.");
  }

  //performing CRUD operations

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  //find the created user
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user.");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully.")    
  )

});

export { registerUser };
