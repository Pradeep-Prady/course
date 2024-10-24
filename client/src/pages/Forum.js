// Forum.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../store/slices/courseSlice";
import { createDiscussion, fetchAllDiscussions } from "../store/slices/discussionSlice";
import DiscussionCard from "../components/DiscussionCard";

const Forum = () => {
  const dispatch = useDispatch();
  const { courses, loading: loadingCourses, error: errorCourses } = useSelector(
    (state) => state.courses
  );
  const {
    discussions,
    loading: loadingDiscussions,
    error: errorDiscussions,
  } = useSelector((state) => state.discussions);

  const [newDiscussion, setNewDiscussion] = useState({
    course: "",
    title: "",
    content: "",
    media: "",
  });

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchAllDiscussions());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDiscussion((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitDiscussion = (e) => {
    e.preventDefault();
    if (!newDiscussion.course) {
      alert("Please select a course.");
      return;
    }
    dispatch(createDiscussion(newDiscussion));
    setNewDiscussion({ course: "", title: "", content: "", media: "" });
  };

  if (loadingCourses) return <p>Loading courses...</p>;
  if (errorCourses) return <p>Error: {errorCourses}</p>;

  return (
    <div className="forum-container max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-600">
        Forum Discussions
      </h1>

      {/* Discussion Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create a New Discussion</h2>
        <form onSubmit={handleSubmitDiscussion} className="space-y-4">
          <select
            name="course"
            value={newDiscussion.course}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Select a Course</option>
            {courses?.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="title"
            value={newDiscussion.title}
            onChange={handleChange}
            placeholder="Discussion Title"
            required
            className="w-full border p-3 rounded focus:ring-2 focus:ring-indigo-400"
          />

          <textarea
            name="content"
            value={newDiscussion.content}
            onChange={handleChange}
            placeholder="Discussion Content"
            required
            rows="4"
            className="w-full border p-3 rounded focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="text"
            name="media"
            value={newDiscussion.media}
            onChange={handleChange}
            placeholder="Media URL (Optional)"
            className="w-full border p-3 rounded focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition"
          >
            Create Discussion
          </button>
        </form>
      </div>

      {/* Discussions List */}
      <div className="w-full bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">All Discussions</h2>
        {loadingDiscussions && <p className="text-gray-500">Loading discussions...</p>}
        {errorDiscussions && <p className="text-red-500">Error: {errorDiscussions}</p>}

        <div className="space-y-6">
          {discussions?.length > 0 ? (
            discussions.map((discussion) => (
              <DiscussionCard key={discussion._id} discussion={discussion} />
            ))
          ) : (
            <p className="text-gray-500 italic">No discussions available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forum;
