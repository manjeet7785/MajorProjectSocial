import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import clientAxios from '../../utils/clientAxios';

export const getUserProfile = createAsyncThunk(
  "posts/getUserProfile",
  async ({ userId }, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const result = await clientAxios.get(`/user/getUserProfile?userId=${userId}`);
      return result.data;
    } catch (error) {
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
      // console.log("Like response:", response.data);
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

const PostsSlice = createSlice({
  name: "posts",
  initialState: {
    userProfile: {},
    loading: false,
    error: null,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.loading = false;
      })
      .addCase(likeAndUnlikePost.fulfilled, (state, action) => {
        const updatedPost = action.payload?.result?.post;
        // console.log("Updated post from like:", updatedPost);

        if (updatedPost && state?.userProfile?.result?.posts) {
          const index = state.userProfile.result.posts.findIndex(item => item._id === updatedPost._id);
          if (index !== -1) {
            state.userProfile.result.posts[index] = updatedPost;
            // console.log("Post updated in state at index:", index);
          }
        }
      })
  }
});

export const { setLoading } = PostsSlice.actions;
export default PostsSlice.reducer;










