import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import clientAxios from '../../utils/clientAxios';



export const getFeedData = createAsyncThunk(
  "user/getFeedData",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const result = await clientAxios.get('/user/getFeedData');
      return result.data;
    } catch (error) {
      console.error("Feed API Error:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
    finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);


export const likeAndUnlikePost = createAsyncThunk("posts/likeAndUnlike",
  async ({ postId }, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const response = await clientAxios.post("posts/like", { postId });
      console.log("Like response:", response.data);
      return response.data; // Return full response
    } catch (e) {
      console.error("Like Error:", e.response?.data || e.message);
      return thunkAPI.rejectWithValue(e.response?.data || e.message);
    }
    finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
)



export const followAndUnfollowUser = createAsyncThunk(
  'user/followAndUnfollow',
  async (body, thunkAPI) => { //

    try {
      thunkAPI.dispatch(setLoading(true));

      const response = await clientAxios.post("/user/follow", body);


      return response.data; // ✅ Success response return karo
    } catch (error) {
      console.error("Follow Error:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);



const FeedSlice = createSlice({
  name: "FeedSlice",
  initialState: {
    feedData: {},

  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedData.fulfilled, (state, action) => {
        state.feedData = action.payload;
        state.loading = false;
      })

      .addCase(likeAndUnlikePost.fulfilled, (state, action) => {
        const updatedPost = action.payload?.result?.post;
        if (updatedPost && state.feedData?.result?.posts) {
          const index = state.feedData.result.posts.findIndex(post => post._id === updatedPost._id);
          if (index !== -1) {
            state.feedData.result.posts[index] = updatedPost;
          }
        }
      })

      .addCase(followAndUnfollowUser.fulfilled, (state, action) => {
        const userId = action.payload.userIdToFollow;
        const index = state.feedData.result.following.findIndex(user => user._id === userId);
        if (index !== -1) {
        }
        console.log("Follow/Unfollow successful:", action.payload);
      })

  }
});

export const { setLoading } = FeedSlice.actions;
export default FeedSlice.reducer;
