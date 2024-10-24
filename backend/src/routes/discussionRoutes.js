import express from "express";
import * as discussionController from "../controllers/discussionController.js";
import { isAuthenticatedUser } from "../utils/middlewares/authenticate.js";

const router = express.Router();

// Route to create a new discussion
router.post("/", isAuthenticatedUser, discussionController.createDiscussion);

router.get("/course/all", discussionController.getDiscussions);
// Route to get all discussions for a specific course
router.get(
  "/course/:courseId",
  isAuthenticatedUser,
  discussionController.getDiscussionsByCourse
);

// Route to add a comment to a discussion
router.post(
  "/:discussionId/comments",
  isAuthenticatedUser,
  discussionController.addComment
);

// Route to add a reply to a comment
router.post(
  "/:discussionId/comments/:commentId/replies",
  isAuthenticatedUser,
  discussionController.addReply
);

// Route to like/unlike a discussion
router.post(
  "/:discussionId/like",
  isAuthenticatedUser,
  discussionController.likeDiscussion
);

// Route to like/unlike a comment
router.post(
  "/:discussionId/comments/:commentId/like",
  isAuthenticatedUser,
  discussionController.likeComment
);

export default router;
