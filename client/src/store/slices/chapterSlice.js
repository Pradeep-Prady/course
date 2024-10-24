import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios";

// Async thunk to add a chapter along with topics
export const addChapter = createAsyncThunk(
  "chapters/addChapter",
  async ({ title, courseId, topics }) => {

    console.log(title, courseId, topics )
    const response = await axiosInstance.post(
      "/chapters",
      { title, courseId, topics },
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

const chapterSlice = createSlice({
  name: "chapters",
  initialState: {
    chapters: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addChapter.pending, (state) => {
        state.loading = true;
      })
      .addCase(addChapter.fulfilled, (state, action) => {
        state.loading = false;
        state.chapters.push(action.payload);
      })
      .addCase(addChapter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default chapterSlice.reducer;
