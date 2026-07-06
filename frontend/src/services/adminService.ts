import api from './api';
import {
  Page,
  SchoolProfile,
  TeacherProfile,
  VerificationRequest,
  VerificationResult,
  VerificationStatus,
} from '../types';

export interface AdminAnalytics {
  totalTeachers: number;
  verifiedTeachers: number;
  pendingVerificationTeachers: number;
  totalSchools: number;
  activeSubscriptions: number;
  totalJobPostings: number;
  totalApplications: number;
}

export const adminService = {
  async getAllTeachers(params: {
    status?: VerificationStatus;
    page?: number;
    size?: number;
  }): Promise<Page<TeacherProfile>> {
    const { data } = await api.get<Page<TeacherProfile>>('/admin/teachers', { params });
    return data;
  },

  async approveTeacher(teacherId: string): Promise<TeacherProfile> {
    const { data } = await api.put<TeacherProfile>(`/admin/teachers/${teacherId}/approve`);
    return data;
  },

  async rejectTeacher(teacherId: string, reason?: string): Promise<TeacherProfile> {
    const { data } = await api.put<TeacherProfile>(`/admin/teachers/${teacherId}/reject`, null, {
      params: { reason },
    });
    return data;
  },

  async getAllSchools(params: { page?: number; size?: number }): Promise<Page<SchoolProfile>> {
    const { data } = await api.get<Page<SchoolProfile>>('/admin/schools', { params });
    return data;
  },

  async getAnalytics(): Promise<AdminAnalytics> {
    const { data } = await api.get<AdminAnalytics>('/admin/analytics');
    return data;
  },

  async getTeacherById(teacherId: string): Promise<TeacherProfile> {
    const { data } = await api.get<TeacherProfile>(`/admin/teachers/${teacherId}`);
    return data;
  },

  async initiateVerification(teacherId: string, type: 'EDUCATION' | 'CRIMINAL'): Promise<VerificationRequest> {
    if (type === 'EDUCATION') {
      return adminService.initiateEducationVerification(teacherId);
    }
    return adminService.initiateCriminalCheck(teacherId);
  },

  async initiateEducationVerification(teacherId: string): Promise<VerificationRequest> {
    const { data } = await api.post<VerificationRequest>(`/verification/education/${teacherId}`);
    return data;
  },

  async initiateCriminalCheck(teacherId: string): Promise<VerificationRequest> {
    const { data } = await api.post<VerificationRequest>(`/verification/criminal/${teacherId}`);
    return data;
  },

  async updateVerificationResult(
    verificationId: string,
    payload: { result: VerificationResult; notes?: string }
  ): Promise<VerificationRequest> {
    const { data } = await api.put<VerificationRequest>(`/verification/${verificationId}/result`, payload);
    return data;
  },

  async getVerifications(teacherId: string): Promise<VerificationRequest[]> {
    const { data } = await api.get<VerificationRequest[]>(`/verification/teacher/${teacherId}`);
    return data;
  },

  async getTeacherVerifications(teacherId: string): Promise<VerificationRequest[]> {
    return adminService.getVerifications(teacherId);
  },

  // ── Subjects ──────────────────────────────────────────────────────────────

  async getSubjects(): Promise<string[]> {
    const { data } = await api.get<string[]>('/subjects');
    return data;
  },

  async getSubjectsWithIds(): Promise<{ id: string; name: string; createdAt: string }[]> {
    const { data } = await api.get<{ id: string; name: string; createdAt: string }[]>('/subjects/admin');
    return data;
  },

  async createSubject(name: string): Promise<{ id: string; name: string; createdAt: string }> {
    const { data } = await api.post<{ id: string; name: string; createdAt: string }>('/subjects/admin', { name });
    return data;
  },

  async deleteSubject(id: string): Promise<void> {
    await api.delete(`/subjects/admin/${id}`);
  },

  // ── Regions ──────────────────────────────────────────────────────────────

  async getRegions(): Promise<string[]> {
    const { data } = await api.get<string[]>('/regions');
    return data;
  },

  async getRegionsWithIds(): Promise<{ id: string; name: string; createdAt: string }[]> {
    const { data } = await api.get<{ id: string; name: string; createdAt: string }[]>('/regions/admin');
    return data;
  },

  async createRegion(name: string): Promise<{ id: string; name: string; createdAt: string }> {
    const { data } = await api.post<{ id: string; name: string; createdAt: string }>('/regions/admin', { name });
    return data;
  },

  async deleteRegion(id: string): Promise<void> {
    await api.delete(`/regions/admin/${id}`);
  },
};
