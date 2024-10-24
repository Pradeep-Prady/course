import mongoose from 'mongoose';

// Create a schema for topics
const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String, // You can change this to a more specific type (e.g., Buffer) if needed for file uploads
    required: true,
  },
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter', // Reference to the Chapter model
    required: true,
  },
  attachments: [{
    type: String, // Assuming URLs or paths to the attachments
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const Topic = mongoose.model('Topic', topicSchema);

// Export the model
export default Topic;
