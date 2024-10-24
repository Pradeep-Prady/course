import express from "express";
import {
  getHomeData,
  loginUser,
  logoutUser,
  registerUser,
  userProfile,
} from "../controllers/userController.js";
import { refreshToken } from "../controllers/authController.js";
import { isAuthenticatedUser } from "../utils/middlewares/authenticate.js";

const router = express.Router();

// User registration route
router.post("/register", registerUser);

// User login route
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
// User logout route
router.post("/logout", logoutUser);
router.get("/profile", isAuthenticatedUser, userProfile);

router.get("/home", isAuthenticatedUser,  getHomeData)
export default router;
