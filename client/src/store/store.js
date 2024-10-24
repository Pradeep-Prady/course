import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./slices/courseSlice";
import authReducer from "./slices/authSlice";
import discussionReducer from "./slices/discussionSlice";
import { homeReducer } from "./slices/homeSlice";
 
const store = configureStore({
  reducer: {
    courses: courseReducer,
    auth: authReducer,
    discussions: discussionReducer,
    home: homeReducer,
  },
  // courses: courseReducer,
});

export default store;
