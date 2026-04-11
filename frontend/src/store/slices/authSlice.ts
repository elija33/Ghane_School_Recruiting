import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { AuthResponse, LoginRequest, RegisterRequest, UserRole } from '../../types';
import { extractErrorMessage } from '../../services/api';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: UserRole | null;
  userId: string | null;
  profileComplete: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  role: null,
  userId: null,
  profileComplete: false,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (request: RegisterRequest, { rejectWithValue }) => {
    try {
      return await authService.register(request);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (request: LoginRequest, { rejectWithValue }) => {
    try {
      return await authService.login(request);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setProfileComplete: (state, action: PayloadAction<boolean>) => {
      state.profileComplete = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    hydrateAuth: (state, action: PayloadAction<Partial<AuthState>>) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    const setAuthFromResponse = (state: AuthState, response: AuthResponse) => {
      state.accessToken = response.accessToken;
      state.refreshToken = response.refreshToken;
      state.role = response.role;
      state.userId = response.userId;
      state.profileComplete = response.profileComplete;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    };

    builder
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, { payload }) => setAuthFromResponse(state, payload))
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, { payload }) => setAuthFromResponse(state, payload))
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { setProfileComplete, clearError, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
