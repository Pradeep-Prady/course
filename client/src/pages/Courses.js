import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, addCourse } from "../store/slices/courseSlice";
import CoursesList from "./../components/CoursesList";
import ChaptersForm from "../components/ChaptersForm";

const Courses = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);
  const [showChaptersForm, setShowChaptersForm] = useState(false); // State to toggle chapter form
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    duration: "",
    category: "",
    level: "",
    coverImage: null,
  });

  const categories = ["Web Development", "Data Science", "Design", "Marketing"];
  const levels = ["Basic", "Intermediate", "Advanced"];

  useEffect(() => {
    dispatch(fetchCourses()); // Fetch courses when component loads
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewCourse((prev) => ({ ...prev, coverImage: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in newCourse) {
      formData.append(key, newCourse[key]);
    }
    dispatch(addCourse(formData)).then((result) => {
      if (addCourse.fulfilled.match(result)) {
        // After successfully adding the course, store the ID and show the chapters form
        const createdCourse = result.payload; // Get the created course
        setNewCourse({ ...newCourse, id: createdCourse._id }); // Store the course ID
        setShowChaptersForm(true);
      }
    });
    setNewCourse({
      title: "",
      description: "",
      duration: "",
      category: "",
      level: "",
      coverImage: null,
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Courses Management
        </h1>

        {/* Course Creation Form */}
        {!showChaptersForm ? (
          <div className="bg-white shadow-md rounded-lg p-6 mb-10">
            <h2 className="text-2xl font-semibold mb-4">Add New Course</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="title"
                  value={newCourse.title}
                  onChange={handleChange}
                  placeholder="Course Title"
                  className="p-2 border rounded"
                  required
                />
                <select
                  name="category"
                  value={newCourse.category}
                  onChange={handleChange}
                  className="p-2 border rounded"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="duration"
                  value={newCourse.duration}
                  onChange={handleChange}
                  placeholder="Duration (hours)"
                  className="p-2 border rounded"
                  required
                />
                <select
                  name="level"
                  value={newCourse.level}
                  onChange={handleChange}
                  className="p-2 border rounded"
                  required
                >
                  <option value="">Select Level</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <textarea
                  name="description"
                  value={newCourse.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="p-2 border rounded col-span-1 md:col-span-2"
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="p-2 border rounded col-span-1 md:col-span-2"
                />
              </div>

              <div className="w-full flex items-end justify-center my-5">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Save & Continue
                </button>
              </div>
            </form>
          </div>
        ) : (
          <ChaptersForm courseId={newCourse.id} /> // Render the chapters form if needed
        )}

        <CoursesList />
      </div>
    </div>
  );
};

export default Courses;
