import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios"; // Adjust path as needed

// Async Thunk: Fetch Courses
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/courses", {
        withCredentials: true,
      });
      return response.data; // Assuming API returns courses array
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch courses");
    }
  }
);

// Async Thunk: Add a New Course
export const addCourse = createAsyncThunk(
  "courses/addCourse",
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/courses", courseData, {
        withCredentials: true,
      });
      return response.data; // Assuming API returns the created course object
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add course");
    }
  }
);

// Async Thunk: Delete a Course
export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/courses/${id}`, { withCredentials: true });
      return id; // Return the deleted course's ID for local state update
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete course");
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchCourseById",
  async (id) => {
    const response = await fetch(`/api/courses/${id}`);
    return response.json();
  }
);

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ id, data }) => {
    const response = await fetch(`/api/courses/${id}`, {
      method: "PUT",
      body: data,
    });
    return response.json();
  }
);
// Initial State
const initialState = {
  courses: [],
  loading: false,
  error: null,
};

// Courses Slice
const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Course
      .addCase(addCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload); // Add new course to the state
      })

      // Delete Course
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter(
          (course) => course._id !== action.payload
        );
      });
  },
});

export default courseSlice.reducer;
