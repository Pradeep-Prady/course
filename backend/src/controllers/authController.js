// src/controllers/authController.js
import User from "../models/userModel.js";
import { createAccessToken, verifyRefreshToken } from "../utils/jwtUtils.js";
// import { verifyRefreshToken, createAccessToken } from "../utils/jwtUtils.js";

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // get refresh token from cookies

  if (!refreshToken) return res.sendStatus(401);

  try {
    const verified = verifyRefreshToken(refreshToken);
    const user = await User.findById(verified.id);
    
    if (!user || !user.jwtTokens.includes(refreshToken)) {
      return res.sendStatus(403); // Forbidden
    }

    const accessToken = createAccessToken({ id: user._id });
    res.json({ accessToken });
  } catch (error) {
    res.sendStatus(403); // Forbidden
  }
};


// src/controllers/authController.js
export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204); // No content
  
    try {
      const user = await User.findOne({ "jwtTokens": refreshToken });
      if (user) {
        user.jwtTokens = user.jwtTokens.filter(token => token !== refreshToken);
        await user.save();
      }
  
      res.clearCookie("refreshToken"); // Clear cookie
      res.sendStatus(204); // No content
    } catch (error) {
      res.status(500).json({ error: "Logout failed" });
    }
  };
  