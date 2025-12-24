import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './Slicies/Posts';
import FeedSliceReducer from './Slicies/FeedSlice';
import AppConfigReducer from './Slicies/AppConfig';

const store = configureStore({
  reducer: {
    posts: postsReducer,
    AppConfig: AppConfigReducer,
    FeedSlice: FeedSliceReducer,
  }
});

export default store;













