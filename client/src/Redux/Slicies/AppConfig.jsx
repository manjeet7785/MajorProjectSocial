import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import clientAxios from '../../utils/clientAxios';

export const getMyInfo = createAsyncThunk("user/getMyInfo", async (_, thunkAPI) => {
  try {
    thunkAPI.dispatch(setLoading(true));
    const result = await clientAxios.get('/user/getMyInfo');
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  } finally {
    thunkAPI.dispatch(setLoading(false));
  }
});

export const updateMyProfile = createAsyncThunk(
  "user/getUserProfile", async (body, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const result = await clientAxios.put('user/', body);
      return result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
)

export const updateProfile = createAsyncThunk("user/updateProfile", async (data, thunkAPI) => {
  try {
    thunkAPI.dispatch(setLoading(true));
    const result = await clientAxios.put('/user/', data);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  } finally {
    thunkAPI.dispatch(setLoading(false));
  }
});

const AppConfig = createSlice({
  name: "AppConfig",
  initialState: {
    isLoading: false,
    myProfile: {},
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyInfo.fulfilled, (state, action) => {

        state.myProfile = action.payload.result?.user || action.payload.user || {};

      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.myProfile = action.payload.result?.user || action.payload.user;
      })
  }
});

export const { setLoading } = AppConfig.actions;
export default AppConfig.reducer;
