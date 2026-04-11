import api from './api';
import {
  Application,
  ApplicationRequest,
  JobListing,
  Page,
  TeacherProfile,
  TeacherProfileRequest,
} from '../types';

export const teacherService = {
  async createProfile(request: TeacherProfileRequest): Promise<TeacherProfile> {
    const { data } = await api.post<TeacherProfile>('/teachers/profile', request);
    return data;
  },

  async updateProfile(request: TeacherProfileRequest): Promise<TeacherProfile> {
    const { data } = await api.put<TeacherProfile>('/teachers/profile', request);
    return data;
  },

  async getProfile(): Promise<TeacherProfile> {
    const { data } = await api.get<TeacherProfile>('/teachers/profile');
    return data;
  },

  async uploadResume(fileUri: string, mimeType: string, fileName: string): Promise<TeacherProfile> {
    const formData = new FormData();
    formData.append('file', { uri: fileUri, type: mimeType, name: fileName } as any);
    const { data } = await api.post<TeacherProfile>('/teachers/upload/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async uploadPhoto(fileUri: string, mimeType: string, fileName: string): Promise<TeacherProfile> {
    const formData = new FormData();
    formData.append('file', { uri: fileUri, type: mimeType, name: fileName } as any);
    const { data } = await api.post<TeacherProfile>('/teachers/upload/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async uploadVideo(fileUri: string, mimeType: string, fileName: string): Promise<TeacherProfile> {
    const formData = new FormData();
    formData.append('file', { uri: fileUri, type: mimeType, name: fileName } as any);
    const { data } = await api.post<TeacherProfile>('/teachers/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async getApplications(): Promise<Application[]> {
    const { data } = await api.get<Application[]>('/teachers/applications');
    return data;
  },

  async applyForJob(jobListingId: string, request: ApplicationRequest): Promise<Application> {
    const { data } = await api.post<Application>(`/teachers/apply/${jobListingId}`, request);
    return data;
  },

  async browseJobs(params: {
    subject?: string;
    location?: string;
    page?: number;
    size?: number;
  }): Promise<Page<JobListing>> {
    const { data } = await api.get<Page<JobListing>>('/teachers/jobs', { params });
    return data;
  },
};
