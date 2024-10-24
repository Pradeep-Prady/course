import mongoose from 'mongoose';

// Create a schema for comments
const commentSchema = new mongoose.Schema({
  discussionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discussion', // Reference to the Discussion model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment', // Reference to the Comment model for replies
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const Comment = mongoose.model('Comment', commentSchema);

// Export the model
export default Comment;
