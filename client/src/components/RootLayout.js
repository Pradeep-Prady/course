import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../store/slices/authSlice";
import Sidebar from "./Sidebar";

const RootLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  // Fetch profile only if the user doesn't exist in the state
  // useEffect(() => {
  //   if (!user) {
  //     dispatch(fetchUserProfile());
  //   }
  // }, []);

  // Load the user profile when the component mounts
  useEffect(() => {
    dispatch(fetchUserProfile()); // Fetch user profile from backend
  }, [dispatch]);

  console.log(user,'user')

  useEffect(() => {
    if ( !user) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [  user, navigate]);

  // if (loading) {
  //   return (
  //     <div className="w-full h-screen flex items-center justify-center">
  //       <p className="text-xl text-gray-600">Loading...</p>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex">
      <Sidebar />
      <div className="w-full h-full overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
