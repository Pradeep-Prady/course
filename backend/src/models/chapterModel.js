import mongoose from 'mongoose';

// Create a schema for chapters
const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Reference to the Course model
    required: true,
  },
  topics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic', // Reference to the Topic model
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const Chapter = mongoose.model('Chapter', chapterSchema);

// Export the model
export default Chapter;
