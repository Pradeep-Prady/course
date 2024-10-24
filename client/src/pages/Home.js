import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, logout } from "../store/slices/authSlice";
import axiosInstance from "../axios"; // Adjust path as needed
import Sidebar from "../components/Sidebar";
import { fetchHomeData } from "../store/slices/homeSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const { totalCourses,totalChapters,totalTopics } = useSelector((state) => state.home);


  // Fetch user profile on component mount
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex w-full min-h-screen bg-gray-200">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <header className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            Welcome, {user?.username || "User"}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <img
              src={
                user?.profilePicture ||
                "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1729754310~exp=1729757910~hmac=88a329cc3fec7bc5024615b94c0338cbf3f3f0fef88a4bcf6515216c0fc0d57a&w=740"
              }
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        <main className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-4">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Courses Card */}
            <div className="bg-blue-500 text-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-xl font-semibold mb-2">Total Courses</h3>
              <p className="text-4xl font-bold">{totalCourses}</p>
            </div>
            {/* Total Chapters Card */}
            <div className="bg-green-500 text-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-xl font-semibold mb-2">Total Chapters</h3>
              <p className="text-4xl font-bold">{totalChapters}</p>
            </div>
            {/* Total Topics Card */}
            <div className="bg-purple-500 text-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-xl font-semibold mb-2">Total Topics</h3>
              <p className="text-4xl font-bold">{totalTopics}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
