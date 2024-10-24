// src/controllers/userController.js
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { createAccessToken, createRefreshToken } from "../utils/jwtUtils.js";
import _ from "lodash";
import { BADREQUEST, SUCCESS } from "../utils/constants/statusCode.js";
import AppSuccess from "../utils/response-handlers/app-success.js";
import AppError from "../utils/response-handlers/app-error.js";
import { addTokenToUser, loginCheck } from "../services/userService.js";
import { sendToken } from "./../utils/response-handlers/sendToken.js";
import Course from "../models/coursesModel.js";
import Chapter from "./../models/chapterModel.js";
import Topic from "../models/topicModel.js";

// Register a new user
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    sendToken(res, newUser, "User registered successfully", SUCCESS);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

// Login user
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (_.isEmpty(email) || _.isEmpty(password)) {
    return next(new AppError("Email and Password are required", BADREQUEST));
  }

  try {
    const user = await loginCheck(email);
    if (!user) {
      return next(new AppError("Email or password is incorrect", BADREQUEST));
    }

    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      return next(new AppError("Invalid Email or Password", BADREQUEST));
    }

    // Generate tokens
    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });

    // Save refresh token to the database
    await addTokenToUser(user._id, refreshToken);

    // Store the refresh token in a secure, HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiration
    });

    sendToken(res, user, "User logged in successfully", SUCCESS);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Login failed" });
    }
  }
};

// Logout user
export const logoutUser = async (req, res) => {
  const { token } = req.body;

  try {
    await User.updateOne(
      { "jwtTokens.token": token },
      { $pull: { jwtTokens: { token } } }
    );

    // Clear the access token and refresh token cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// Logout a user

// userProfile

export const userProfile = async (req, res) => {
  try {
    if (req.user) {
      return res
        .status(200)
        .send(new AppSuccess(req.user, "User successfully sent here", 200));
    } else {
      return next(new AppError("User not found", 404));
    }
  } catch (error) {
    return next(new AppError("An error occurred while fetching the user", 500));
  }
};

// Get   getHomeData

export const getHomeData = async (req, res) => {
  try {
    const courses = await Course.find({}).countDocuments();
    const chapters = await Chapter.find({}).countDocuments();
    const topics = await Topic.find({}).countDocuments();

    return res
      .status(200)
      .send(
        new AppSuccess(
          { courses, chapters, topics },
          "User successfully sent here",
          200
        )
      );
  } catch (error) {
    return next(new AppError("An error occurred while fetching the user", 500));
  }
};
