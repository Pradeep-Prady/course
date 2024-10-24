// src/store/slices/homeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios"; // Adjust path as needed

// Async thunk for fetching home data
export const fetchHomeData = createAsyncThunk(
  "home/fetchHomeData",
  async () => {
    const response = await axiosInstance.get("/users/home", {
      withCredentials: true,
    }); // Adjust API endpoint as needed
    console.log(response.data?.data);
    return response.data?.data;

    
  }
);

const homeSlice = createSlice({
  name: "home",
  initialState: {
    loading: false,
    error: null,
    totalCourses: 0,
    totalChapters: 0,
    totalTopics: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.totalCourses = action.payload.courses; // Adjust based on your response structure
        state.totalChapters = action.payload.chapters; // Adjust based on your response structure
        state.totalTopics = action.payload.topics; // Adjust based on your response structure
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export actions and reducer
export const homeReducer = homeSlice.reducer;
export const selectHome = (state) => state.home; // Selector for accessing home state
