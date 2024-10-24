import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCourse } from "../store/slices/courseSlice";
import { FaTrashAlt } from "react-icons/fa"; // For better delete icon
import { Link } from "react-router-dom";

const CoursesList = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      dispatch(deleteCourse(id));
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Courses List</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <table className="w-full border-collapse overflow-hidden rounded-lg shadow-md">
          <thead>
            <tr className="bg-gradient-to-r  bg-blue-500 text-white">
              <th className="p-4 text-left">Cover</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Duration</th>
              <th className="p-4 text-left">Level</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr
                  key={course._id}
                  className="even:bg-gray-100 hover:bg-indigo-50 transition-colors"
                >
                  <td className="p-4 flex justify-center">
                    <img
                      src={
                        course.coverImage || "https://via.placeholder.com/100"
                      }
                      alt={course.title}
                      className="w-16 h-16 rounded-md object-cover shadow-sm"
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-800">
                    {course.title}
                  </td>
                  <td className="p-4 text-gray-600">{course.category}</td>
                  <td className="p-4 text-gray-600">{course.duration} hrs</td>
                  <td className="p-4 text-gray-600">{course.level}</td>
                  <td className="p-4 text-center">
                    <Link
                      to={`/courses/${course._id}`}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Edit Course"
                    >
                      <FaTrashAlt className="inline-block mr-2" /> Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(course._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete Course"
                    >
                      <FaTrashAlt className="inline-block mr-2" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-8 text-gray-500 italic"
                >
                  No courses available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CoursesList;
