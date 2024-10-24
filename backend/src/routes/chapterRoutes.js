// src/routes/chapterRoutes.js
import express from "express";
import { isAuthenticatedUser } from "../utils/middlewares/authenticate.js";
import { createChapter } from "../controllers/chapterController.js";

const router = express.Router();

// Create a new chapter
router.post("/", isAuthenticatedUser, createChapter);

export default router;
