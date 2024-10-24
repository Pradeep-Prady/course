import mongoose from "mongoose";

// Comment schema (used for comments and replies)
const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Like/Unlike functionality
    replies: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: { type: String, required: true },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Likes for replies
        createdAt: { type: Date, default: Date.now }, // Timestamp for replies
      },
    ],
  },
  { timestamps: true } // Timestamps for comments
);

// Discussion schema
const discussionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    media: { type: [String], default: [] }, // Optional media (images/videos)
    comments: [commentSchema], // Embedded comments schema
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Likes for discussion
  },
  { timestamps: true }
);

const Discussion = mongoose.model("Discussion", discussionSchema);
export default Discussion;
