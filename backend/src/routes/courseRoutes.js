import express from "express";
import {
  getCourses,
  getCourse,
  createNewCourse,
  updateExistingCourse,
  deleteExistingCourse,
} from "../controllers/courseController.js";
import { isAuthenticatedUser } from "../utils/middlewares/authenticate.js";

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";

// Fix for __dirname not being defined in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to create directories if they don't exist
const createDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Configure Multer
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), "src", "uploads", "courses");

      console.log("Upload Path:", uploadPath); // Debugging

      // Create the directory if it doesn't exist
      createDirectory(uploadPath);

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      console.log("File Name:", file.originalname); // Debugging
      cb(null, file.originalname); // Use the original filename
    },
  }),
});

// Initialize the Express router
const router = express.Router();

// Define routes for course operations
router.get("/", isAuthenticatedUser, getCourses);
router.get("/:id", isAuthenticatedUser, getCourse);
router.post("/", isAuthenticatedUser, upload.single("coverImage"), createNewCourse);
router.put("/:id", isAuthenticatedUser, updateExistingCourse);
router.delete("/:id", isAuthenticatedUser, deleteExistingCourse);

export default router;
