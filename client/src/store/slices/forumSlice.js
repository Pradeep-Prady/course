import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axios'; // Adjust based on your axios instance setup

// Async thunk to fetch discussion topics
export const fetchDiscussionTopics = createAsyncThunk('forum/fetchDiscussionTopics', async () => {
  const response = await axiosInstance.get('/forum/topics');
  return response.data;
});

// Async thunk to create a new discussion topic
export const createDiscussionTopic = createAsyncThunk('forum/createDiscussionTopic', async (topicData) => {
  const response = await axiosInstance.post('/forum/topics', topicData);
  return response.data;
});

// Slice for forum
const forumSlice = createSlice({
  name: 'forum',
  initialState: {
    discussionTopics: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscussionTopics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDiscussionTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.discussionTopics = action.payload;
      })
      .addCase(fetchDiscussionTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createDiscussionTopic.fulfilled, (state, action) => {
        state.discussionTopics.push(action.payload);
      });
  },
});

// Export the actions and reducer
export default forumSlice.reducer;
