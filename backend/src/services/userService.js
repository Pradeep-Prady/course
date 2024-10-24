import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = new User({ ...userData, password: hashedPassword });
  return await user.save();
};
export const loginCheck = async (email) => {
  const result = await User.findOne({ email: email }).select("+password");

  return result;
};
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};
export const addTokenToUser = async (userId, token) => {
  return await User.updateOne(
    { _id: userId },
    { $push: { jwtTokens: { token } } } // Make sure you're pushing an object with the token
  );
};


// Additional user-related service functions can be added here
