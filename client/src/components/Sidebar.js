import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import { logout } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/users/logout", {}, { withCredentials: true }); // Logout request to backend
      dispatch(logout()); // Clear user state
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <div className="h-full">
      <aside className="w-64 h-full bg-gray-800 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8">My Dashboard</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/" className="hover:bg-gray-700 p-2 rounded">
            Home
          </Link>
          <Link to="/courses" className="hover:bg-gray-700 p-2 rounded">
            Courses
          </Link>

          <Link to="/forum" className="hover:bg-gray-700 p-2 rounded">
            Forum
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 hover:bg-red-600 text-white p-2 rounded"
        >
          Logout
        </button>
      </aside>
    </div>
  );
};

export default Sidebar;
