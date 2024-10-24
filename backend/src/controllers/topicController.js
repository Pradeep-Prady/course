// src/controllers/topicController.js
import Topic from "../models/topicModel.js";
import Chapter from "../models/chapterModel.js";
import AppError from "../utils/response-handlers/app-error.js";
import AppSuccess from "../utils/response-handlers/app-success.js";

// Add a new topic to a chapter
export const createTopic = async (req, res, next) => {
  const { title, description, content, chapterId } = req.body;

  try {
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return next(new AppError("Chapter not found", 404));
    }

    const newTopic = await Topic.create({
      title,
      description,
      content,
      chapter: chapterId,
    });

    chapter.topics.push(newTopic._id);
    await chapter.save();

    res.status(201).json(AppSuccess(newTopic, "Topic added successfully"));
  } catch (error) {
    next(new AppError("Failed to add topic", 500));
  }
};
