import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateCourse, fetchCourseById } from "../store/slices/courseSlice";
import ChaptersForm from "./ChaptersForm"; // Reuse your existing component
import { FaSpinner } from "react-icons/fa"; // Optional: Loading icon

const EditCourseForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { course, loading, error } = useSelector((state) => state.courses);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    level: "",
    coverImage: "",
    chapters: [], // Populate chapters here
  });

  // Fetch course by ID on component mount
  useEffect(() => {
    dispatch(fetchCourseById(id));
  }, [dispatch, id]);

  // Populate the form data when course is loaded
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        category: course.category,
        duration: course.duration,
        level: course.level,
        coverImage: course.coverImage,
        chapters: course.chapters || [],
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChaptersChange = (newChapters) => {
    setFormData((prevData) => ({ ...prevData, chapters: newChapters }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateCourse({ id, ...formData }));
    navigate("/courses"); // Redirect after successful update
  };

  if (loading) return <FaSpinner className="animate-spin text-blue-500" />;

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg p-8 rounded-lg">
      <h2 className="text-3xl font-bold mb-6">Edit Course</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Course Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Duration (hrs)</label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Level</label>
        <input
          type="text"
          name="level"
          value={formData.level}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Cover Image URL</label>
        <input
          type="text"
          name="coverImage"
          value={formData.coverImage}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        />
      </div>

      <h3 className="text-2xl font-bold mt-6 mb-4">Chapters</h3>
      <ChaptersForm
        courseId={id}
        chapters={formData.chapters}
        onChaptersChange={handleChaptersChange} // Handle chapters updates
      />

      <button
        type="submit"
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Update Course
      </button>
    </form>
  );
};

export default EditCourseForm;
