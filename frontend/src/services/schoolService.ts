import api from './api';
import {
  Application,
  ApplicationStatus,
  JobListing,
  JobListingRequest,
  Page,
  SchoolProfile,
  SchoolProfileRequest,
  TeacherProfile,
} from '../types';

export const schoolService = {
  async createProfile(request: SchoolProfileRequest): Promise<SchoolProfile> {
    const { data } = await api.post<SchoolProfile>('/schools/profile', request);
    return data;
  },

  async updateProfile(request: SchoolProfileRequest): Promise<SchoolProfile> {
    const { data } = await api.put<SchoolProfile>('/schools/profile', request);
    return data;
  },

  async getProfile(): Promise<SchoolProfile> {
    const { data } = await api.get<SchoolProfile>('/schools/profile');
    return data;
  },

  async createJob(request: JobListingRequest): Promise<JobListing> {
    const { data } = await api.post<JobListing>('/schools/jobs', request);
    return data;
  },

  async updateJob(jobId: string, request: JobListingRequest): Promise<JobListing> {
    const { data } = await api.put<JobListing>(`/schools/jobs/${jobId}`, request);
    return data;
  },

  async deactivateJob(jobId: string): Promise<void> {
    await api.delete(`/schools/jobs/${jobId}`);
  },

  async getJobs(): Promise<JobListing[]> {
    const { data } = await api.get<JobListing[]>('/schools/jobs');
    return data;
  },

  async browseTeachers(params: {
    subject?: string;
    location?: string;
    minExperience?: number;
    maxExperience?: number;
    page?: number;
    size?: number;
  }): Promise<Page<TeacherProfile>> {
    const { data } = await api.get<Page<TeacherProfile>>('/schools/teachers', { params });
    return data;
  },

  async getTeacherProfile(teacherId: string): Promise<TeacherProfile> {
    const { data } = await api.get<TeacherProfile>(`/schools/teachers/${teacherId}`);
    return data;
  },

  async getApplicationsForJob(jobId: string): Promise<Application[]> {
    const { data } = await api.get<Application[]>(`/schools/applications/${jobId}`);
    return data;
  },

  async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
    note?: string
  ): Promise<Application> {
    const { data } = await api.put<Application>(
      `/schools/applications/${applicationId}/status`,
      { status, note }
    );
    return data;
  },
};
