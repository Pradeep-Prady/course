// src/routes/topicRoutes.js
import express from "express";
import { createTopic } from "../controllers/topicController.js";
import { isAuthenticatedUser } from "../utils/middlewares/authenticate.js";

const router = express.Router();

// Add a new topic
router.post("/", isAuthenticatedUser, createTopic);

export default router;
