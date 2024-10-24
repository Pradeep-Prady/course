// services/courseService.js

import Course from "../models/coursesModel.js";

// Fetch all courses
export const getAllCourses = async (userId) => {
  try {
    // Fetch the courses for the user
    const courses = await Course.find({ createdBy: userId });

    // Check if any course has chapters
    const coursesWithChapters = await Promise.all(
      courses.map(async (course) => {
        if (course.chapters && course.chapters.length > 0) {
          // Populate chapters only if available
          // return await course.populate('chapters').execPopulate();
          return await course.populate('chapters')

        }
        return course; // Return course as is if no chapters
      })
    );

    return coursesWithChapters;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching courses');
  }
};


// Get a specific course by ID
export const getCourseById = async (id) => {
  try {
    const course = await Course.findById(id).populate("chapters");
    if (!course) throw new Error("Course not found");
    return course;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

// Create a new course
export const createCourse = async (courseData) => {
  try {
    const course = await Course.create(courseData);

    return course;
  } catch (error) {
    console.log(error);
    throw new Error("Error creating course");
  }
};

// Update a course
export const updateCourse = async (id, courseData) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(id, courseData, {
      new: true,
    });
    if (!updatedCourse) throw new Error("Course not found");
    return updatedCourse;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete a course
export const deleteCourse = async (id) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) throw new Error("Course not found");
    return deletedCourse;
  } catch (error) {
    throw new Error(error.message);
  }
};
