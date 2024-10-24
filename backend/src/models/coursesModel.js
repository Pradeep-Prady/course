import mongoose from 'mongoose';

// Create a schema for courses
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true, // Prevent duplicate courses
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 1, // Minimum of 1 hour
  },
  category: {
    type: String,
    required: true,
    enum: ['Web Development', 'Data Science', 'Design', 'Marketing'], // Restricted categories
  },
  level: {
    type: String,
    required: true,
    enum: ['Basic', 'Intermediate', 'Advanced'],
  },
  coverImage: {
    type: String,
    required: true, // Path or URL to cover image
  },
  tags: {
    type: [String],
    default: [], // Optional tags for filtering/search
  },
  chapters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter', // Reference to the Chapter model
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
