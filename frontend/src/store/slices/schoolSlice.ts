import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { schoolService } from '../../services/schoolService';
import {
  Application,
  ApplicationStatus,
  JobListing,
  JobListingRequest,
  Page,
  SchoolProfile,
  SchoolProfileRequest,
  Subscription,
  TeacherProfile,
} from '../../types';
import { subscriptionService } from '../../services/subscriptionService';
import { extractErrorMessage } from '../../services/api';

interface SchoolState {
  profile: SchoolProfile | null;
  jobs: JobListing[];
  teachers: Page<TeacherProfile> | null;
  applications: Application[];
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
}

const initialState: SchoolState = {
  profile: null,
  jobs: [],
  teachers: null,
  applications: [],
  subscription: null,
  loading: false,
  error: null,
};

export const fetchSchoolProfile = createAsyncThunk(
  'school/fetchProfile',
  async (_, { rejectWithValue }) => {
    try { return await schoolService.getProfile(); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
  }
);

export const createSchoolProfile = createAsyncThunk(
  'school/createProfile',
  async (request: SchoolProfileRequest, { rejectWithValue }) => {
    try { return await schoolService.createProfile(request); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
  }
);

export const fetchSchoolJobs = createAsyncThunk(
  'school/fetchJobs',
  async (_, { rejectWithValue }) => {
    try { return await schoolService.getJobs(); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
  }
);

export const createJob = createAsyncThunk(
  'school/createJob',
  async (request: JobListingRequest, { rejectWithValue }) => {
    try { return await schoolService.createJob(request); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
  }
);

export const deactivateJob = createAsyncThunk(
  'school/deactivateJob',
  async (jobId: string, { rejectWithValue }) => {
    try { await schoolService.deactivateJob(jobId); return jobId; }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
  }
);

export const fetchApplicationsForJob = createAsyncThunk(
  'school/fetchApplications',
  async (jobId: string, { rejectWithValue }) => {
    try { return await schoolService.getApplicationsForJob(jobId); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'school/updateApplicationStatus',
  async ({ applicationId, status, note }: { applicationId: string; status: ApplicationStatus; note?: string },
         { rejectWithValue }) => {
    try { return await schoolService.updateApplicationStatus(applicationId, status, note); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
  }
);

export const updateSchoolProfile = createAsyncThunk(
  'school/updateProfile',
  async (request: SchoolProfileRequest, { rejectWithValue }) => {
    try { return await schoolService.updateProfile(request); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
  }
);

export const fetchBrowseTeachers = createAsyncThunk(
  'school/browseTeachers',
  async (params: { subject?: string; location?: string; page?: number; size?: number }, { rejectWithValue }) => {
    try { return await schoolService.browseTeachers(params); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
  }
);

export const fetchSubscriptionStatus = createAsyncThunk(
  'school/fetchSubscription',
  async (_, { rejectWithValue }) => {
    try { return await subscriptionService.getSubscriptionStatus(); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
  }
);

const schoolSlice = createSlice({
  name: 'school',
  initialState,
  reducers: {
    clearSchoolState: () => initialState,
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchoolProfile.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchSchoolProfile.fulfilled, (s, { payload }) => { s.loading = false; s.profile = payload; })
      .addCase(fetchSchoolProfile.rejected, (s, { payload }) => { s.loading = false; s.error = payload as string; })

      .addCase(createSchoolProfile.fulfilled, (s, { payload }) => { s.profile = payload; })
      .addCase(updateSchoolProfile.fulfilled, (s, { payload }) => { s.profile = payload; })

      .addCase(fetchBrowseTeachers.pending, (s) => { s.loading = true; })
      .addCase(fetchBrowseTeachers.fulfilled, (s, { payload }) => { s.loading = false; s.teachers = payload; })
      .addCase(fetchBrowseTeachers.rejected, (s) => { s.loading = false; })

      .addCase(fetchSchoolJobs.fulfilled, (s, { payload }) => { s.jobs = payload; })

      .addCase(createJob.fulfilled, (s, { payload }) => { s.jobs = [payload, ...s.jobs]; })

      .addCase(deactivateJob.fulfilled, (s, { payload }) => {
        s.jobs = s.jobs.map(j => j.id === payload ? { ...j, isActive: false } : j);
      })

      .addCase(fetchApplicationsForJob.fulfilled, (s, { payload }) => { s.applications = payload; })

      .addCase(updateApplicationStatus.fulfilled, (s, { payload }) => {
        s.applications = s.applications.map(a => a.id === payload.id ? payload : a);
      })

      .addCase(fetchSubscriptionStatus.fulfilled, (s, { payload }) => { s.subscription = payload; });
  },
});

export const { clearSchoolState, clearError } = schoolSlice.actions;
export default schoolSlice.reducer;
