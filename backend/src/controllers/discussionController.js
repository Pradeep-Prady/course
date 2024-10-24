import Discussion from "../models/discussionModel.js";
import * as discussionService from "../services/discussionService.js";

// Controller to create a new discussion
export const createDiscussion = async (req, res) => {
  try {
    const data = req.body;
    const discussion = await discussionService.createDiscussion(data);
    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get all discussions
export const getDiscussions = async (req, res) => {
  try {
    const discussions = await discussionService.getDiscussions();
    res.status(200).json(discussions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Controller to get all discussions for a course
export const getDiscussionsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const discussions = await discussionService.getDiscussionsByCourse(
      courseId
    );
    res.status(200).json(discussions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Controller to add a comment to a discussion
export const addComment = async (req, res) => {
  try {
    const { discussionId } = req.params;

    req.body.user = req.user?._id;
    const comment = req.body;
    const updatedDiscussion = await discussionService.addComment(
      discussionId,
      comment
    );

    console.log(
      updatedDiscussion?.comments?.[updatedDiscussion.comments.length - 1]
    );

    res
      .status(200)
      .json(
        updatedDiscussion?.comments?.[updatedDiscussion.comments.length - 1]
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Controller to add a reply to a comment
export const addReply = async (req, res) => {
  try {
    req.body.user = req.user?._id;

    const { discussionId, commentId } = req.params;
    const reply = req.body;
    const updatedDiscussion = await discussionService.addReply(
      discussionId,
      commentId,
      reply
    );

    console.log(
      updatedDiscussion
    );

    res.status(200).json(updatedDiscussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// discussionController.js

// Like a discussion
export const likeDiscussion = async (req, res) => {
  try {
    console.log("here");
    const { discussionId } = req.params;
    const userId = req.user._id;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion)
      return res.status(404).json({ message: "Discussion not found" });

    console.log(discussion);
    if (discussion.likes.includes(userId)) {
      // User has already liked, so remove like
      discussion.likes.pull(userId);
    } else {
      // User has not liked, so add like
      discussion.likes.push(userId);
    }

    await discussion.save();
    res.status(200).json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a comment
export const likeComment = async (req, res) => {
  try {
    const { discussionId, commentId } = req.params;
    const userId = req.user._id;

    const discussion = await Discussion.findById(discussionId).populate(
      "course"
    );
    if (!discussion)
      return res.status(404).json({ message: "Discussion not found" });

    const comment = discussion.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.likes.includes(userId)) {
      // User has already liked, so remove like
      comment.likes.pull(userId);
    } else {
      // User has not liked, so add like
      comment.likes.push(userId);
    }

    await discussion.save();
    res.status(200).json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
