import Chapter from "../models/chapterModel.js";
import Course from "../models/coursesModel.js";
import Topic from "../models/topicModel.js";
import AppError from "../utils/response-handlers/app-error.js";
import AppSuccess from "../utils/response-handlers/app-success.js";

// Create a new chapter with topics
export const createChapter = async (req, res, next) => {
  const { title, courseId, topics } = req.body;

  try {
    // Verify that the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    // Create the chapter
    const newChapter = await Chapter.create({ title, course: courseId });
    course.chapters.push(newChapter._id);
    await course.save();

    // Create topics and associate with the new chapter
    if (topics && topics.length > 0) {
      const topicPromises = topics.map(async (topic) => {
        const newTopic = await Topic.create({
          ...topic,
          chapter: newChapter._id,
        });
        return newTopic._id; // Return the topic ID
      });

      const topicIds = await Promise.all(topicPromises);
      newChapter.topics = topicIds; // Store topic IDs in the chapter
      await newChapter.save(); // Save the chapter after adding topics
    }

    return next(new AppSuccess(newChapter, "Chapter created successfully", 201));
  } catch (error) {
    console.log(error);
    next(new AppError("Failed to create chapter", 500));
  }
};
