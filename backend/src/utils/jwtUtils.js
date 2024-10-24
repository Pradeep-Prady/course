// src/utils/jwtUtils.js
import jwt from "jsonwebtoken";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

// Create access token
export const createAccessToken = (user) => {
  return jwt.sign(user, accessTokenSecret, { expiresIn: "15m" });
};

// Create refresh token
export const createRefreshToken = (user) => {
  return jwt.sign(user, refreshTokenSecret, { expiresIn: "7d" });
};

// Verify access token
export const verifyAccessToken = (token) => {
  return jwt.verify(token, accessTokenSecret);
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, refreshTokenSecret);
};
