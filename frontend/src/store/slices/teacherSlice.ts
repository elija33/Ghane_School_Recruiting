import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { teacherService } from '../../services/teacherService';
import { Application, JobListing, Page, TeacherProfile, TeacherProfileRequest } from '../../types';
import { extractErrorMessage } from '../../services/api';

interface TeacherState {
  profile: TeacherProfile | null;
  applications: Application[];
  jobs: Page<JobListing> | null;
  loading: boolean;
  uploadLoading: boolean;
  error: string | null;
}

const initialState: TeacherState = {
  profile: null,
  applications: [],
  jobs: null,
  loading: false,
  uploadLoading: false,
  error: null,
};

export const fetchTeacherProfile = createAsyncThunk(
  'teacher/fetchProfile',
  async (_, { rejectWithValue }) => {
    try { return await teacherService.getProfile(); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
  }
);

export const createTeacherProfile = createAsyncThunk(
  'teacher/createProfile',
  async (request: TeacherProfileRequest, { rejectWithValue }) => {
    try { return await teacherService.createProfile(request); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
  }
);

export const updateTeacherProfile = createAsyncThunk(
  'teacher/updateProfile',
  async (request: TeacherProfileRequest, { rejectWithValue }) => {
    try { return await teacherService.updateProfile(request); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
  }
);

export const fetchTeacherApplications = createAsyncThunk(
  'teacher/fetchApplications',
  async (_, { rejectWithValue }) => {
    try { return await teacherService.getApplications(); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
  }
);

export const browseJobs = createAsyncThunk(
  'teacher/browseJobs',
  async (params: { subject?: string; location?: string; page?: number; size?: number },
         { rejectWithValue }) => {
    try { return await teacherService.browseJobs(params); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
  }
);

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    clearTeacherState: () => initialState,
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherProfile.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchTeacherProfile.fulfilled, (s, { payload }) => { s.loading = false; s.profile = payload; })
      .addCase(fetchTeacherProfile.rejected, (s, { payload }) => { s.loading = false; s.error = payload as string; })

      .addCase(createTeacherProfile.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(createTeacherProfile.fulfilled, (s, { payload }) => { s.loading = false; s.profile = payload; })
      .addCase(createTeacherProfile.rejected, (s, { payload }) => { s.loading = false; s.error = payload as string; })

      .addCase(updateTeacherProfile.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(updateTeacherProfile.fulfilled, (s, { payload }) => { s.loading = false; s.profile = payload; })
      .addCase(updateTeacherProfile.rejected, (s, { payload }) => { s.loading = false; s.error = payload as string; })

      .addCase(fetchTeacherApplications.fulfilled, (s, { payload }) => { s.applications = payload; })

      .addCase(browseJobs.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(browseJobs.fulfilled, (s, { payload }) => { s.loading = false; s.jobs = payload; })
      .addCase(browseJobs.rejected, (s, { payload }) => { s.loading = false; s.error = payload as string; });
  },
});

export const { clearTeacherState, clearError } = teacherSlice.actions;
export default teacherSlice.reducer;
