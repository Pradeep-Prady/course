// controllers/courseController.js
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../services/courseService.js";

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    const courses = await getAllCourses(userId);
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single course by ID
export const getCourse = async (req, res) => {
  try {
   
    const course = await getCourseById(req.params.id);
    res.status(200).json(course);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create a new course
export const createNewCourse = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authentication middleware
    let BASE_URL = `${req.protocol}://${req.get("host")}`;

    // Check if the file is available in the request
    if (req.file) {
      const url = `${BASE_URL}/src/uploads/courses/${req.file.originalname}`;
      req.body.coverImage = url;  
    }

    req.body.createdBy = userId; // Assign the creator's ID
    console.log(req.body); // Log the request body to verify all fields

    // Create a new course with the data from req.body
    const course = await createCourse(req.body);
    res.status(201).json(course); // Send back the created course
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message }); // Handle validation errors
  }
};


// Update an existing course
export const updateExistingCourse = async (req, res) => {
  try {
    const updatedCourse = await updateCourse(req.params.id, req.body);
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Delete a course
export const deleteExistingCourse = async (req, res) => {
  try {
    await deleteCourse(req.params.id);
    res.status(204).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
