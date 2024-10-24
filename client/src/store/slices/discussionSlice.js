import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios"; // Adjust path as needed

// Async Thunk: Fetch All Discussions
export const fetchAllDiscussions = createAsyncThunk(
  "discussions/fetchAllDiscussions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/discussions/course/all", {
        withCredentials: true,
      });
      return response.data; // Assuming the API returns an array of discussions
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch all discussions"
      );
    }
  }
);

// Async Thunk: Fetch Discussions by Course
export const fetchDiscussionsByCourse = createAsyncThunk(
  "discussions/fetchDiscussionsByCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/discussions/${courseId}`, {
        withCredentials: true,
      });
      return response.data; // Assuming API returns discussions for the course
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch discussions by course"
      );
    }
  }
);

// Async Thunk: Create a New Discussion
export const createDiscussion = createAsyncThunk(
  "discussions/createDiscussion",
  async (discussionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/discussions",
        discussionData,
        {
          withCredentials: true,
        }
      );
      return response.data; // Assuming API returns the created discussion object
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create discussion"
      );
    }
  }
);

// Async Thunk: Create a New Comment
export const createComment = createAsyncThunk(
  "discussions/createComment",
  async ({ discussionId, commentData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/discussions/${discussionId}/comments`,
        commentData,
        { withCredentials: true }
      );
      return { discussionId, comment: response.data }; // API returns the new comment
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create comment"
      );
    }
  }
);

// Async Thunk: Create a New Reply
export const createReply = createAsyncThunk(
  "discussions/createReply",
  async ({ discussionId, commentId, replyData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/discussions/${discussionId}/comments/${commentId}/replies`,
        replyData,
        { withCredentials: true }
      );
      return { discussionId, commentId, reply: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create reply");
    }
  }
);

// Async Thunk: Like a Discussion
export const likeDiscussion = createAsyncThunk(
  "discussions/likeDiscussion",
  async (discussionId) => {
    const response = await axiosInstance.post(
      `/discussions/${discussionId}/like`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

// Async Thunk: Like a Comment
export const likeComment = createAsyncThunk(
  "discussions/likeComment",
  async ({ discussionId, commentId }) => {
    const response = await axiosInstance.post(
      `/discussions/${discussionId}/comments/${commentId}/like`, // Ensure commentId is passed correctly
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

// Async Thunk: Update a Discussion
export const updateDiscussionAPI = createAsyncThunk(
  "discussions/updateDiscussion",
  async ({ discussionId, updatedDiscussion }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/discussions/${discussionId}`,
        updatedDiscussion,
        { withCredentials: true }
      );
      return response.data; // Assuming the API returns the updated discussion
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update discussion"
      );
    }
  }
);

// Initial State
const initialState = {
  discussions: [],
  loading: false,
  error: null,
};

// Discussions Slice
const discussionSlice = createSlice({
  name: "discussions",
  initialState,
  reducers: {
    setUpdatedDiscussion: (state, action) => {
      const { discussionId, updatedDiscussion } = action.payload;
      const discussionIndex = state.discussions.findIndex(
        (d) => d._id === discussionId
      );
      if (discussionIndex !== -1) {
        state.discussions[discussionIndex] = updatedDiscussion;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Discussions
      .addCase(fetchAllDiscussions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllDiscussions.fulfilled, (state, action) => {
        state.loading = false;
        state.discussions = action.payload;
      })
      .addCase(fetchAllDiscussions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Discussions by Course
      .addCase(fetchDiscussionsByCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDiscussionsByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.discussions = action.payload;
      })
      .addCase(fetchDiscussionsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Discussion
      .addCase(createDiscussion.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDiscussion.fulfilled, (state, action) => {
        state.loading = false;
        state.discussions.push(action.payload);
      })
      .addCase(createDiscussion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Comment
      .addCase(createComment.fulfilled, (state, action) => {
        const { discussionId, comment } = action.payload;
        const discussion = state.discussions.find(
          (d) => d._id === discussionId
        );
        if (discussion) discussion.comments.push(comment);
      })

      // Handle creating reply
      .addCase(createReply.fulfilled, (state, action) => {
        const { discussionId, commentId, reply } = action.payload;
        const discussion = state.discussions.find(
          (d) => d._id === discussionId
        );
        const comment = discussion?.comments.find((c) => c._id === commentId);
        if (comment) comment.replies.push(reply);
      })

      // Like Discussion
      .addCase(likeDiscussion.fulfilled, (state, action) => {
        const discussionIndex = state.discussions.findIndex(
          (d) => d._id === action.payload._id
        );
        if (discussionIndex !== -1) {
          state.discussions[discussionIndex] = action.payload;
        }
      })

      // Like Comment
      .addCase(likeComment.fulfilled, (state, action) => {
        const discussionIndex = state.discussions.findIndex(
          (d) => d._id === action.payload._id
        );
        if (discussionIndex !== -1) {
          state.discussions[discussionIndex] = action.payload;
        }
      })

      // Update Discussion
      .addCase(updateDiscussionAPI.fulfilled, (state, action) => {
        const updatedDiscussion = action.payload;
        const discussionIndex = state.discussions.findIndex(
          (d) => d._id === updatedDiscussion._id
        );
        if (discussionIndex !== -1) {
          state.discussions[discussionIndex] = updatedDiscussion;
        }
      });
  },
});

// Export actions and reducer
export const { setUpdatedDiscussion } = discussionSlice.actions;
export default discussionSlice.reducer;
