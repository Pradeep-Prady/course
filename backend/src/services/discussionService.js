import Discussion from "../models/discussionModel.js";
// Create a new discussion
export const createDiscussion = async (data) => {
  const discussion = new Discussion(data);
  return await discussion.save();
};

// Get all discussions for a specific course with comments and replies
export const getDiscussionsByCourse = async (courseId) => {
  return await Discussion.find({ course: courseId })
    .populate("course", "title")
    .populate("comments.user", "name")
    .populate("comments.replies.user", "name")
    .exec();
};

export const getDiscussions = async () => {
  return await Discussion.find()
    .populate("course", "title")
    .populate("comments.user", "name")
    .populate("comments.replies.user", "name")
    .exec();
};

// Add a comment to a discussion
export const addComment = async (discussionId, comment) => {
  const discussion = await Discussion.findById(discussionId);
  if (!discussion) throw new Error("Discussion not found");

  discussion.comments.push(comment);
  return await discussion.save();
};

// Add a reply to a comment
export const addReply = async (discussionId, commentId, reply) => {
  const discussion = await Discussion.findById(discussionId);
  if (!discussion) throw new Error("Discussion not found");

  const comment = discussion.comments.id(commentId);
  if (!comment) throw new Error("Comment not found");

  comment.replies.push(reply); // Add the new reply
  await discussion.save(); // Save the updated discussion

  const newReply = comment.replies[comment.replies.length - 1]; // Get the last added reply
  return newReply; // Return only the new reply
};
