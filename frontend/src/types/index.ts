// ================================================================
// Ghana Teacher Recruiting Platform — TypeScript Types
// ================================================================

export type UserRole = 'TEACHER' | 'SCHOOL' | 'ADMIN';

export type VerificationStatus = 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'FAILED';

export type ApplicationStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW_REQUESTED'
  | 'REJECTED'
  | 'HIRED';

export type SubscriptionTier = 'BASIC' | 'STANDARD' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

export type VerificationType = 'EDUCATION' | 'CRIMINAL';
export type VerificationProvider = 'ETX_NG' | 'PREMBLY' | 'MANUAL';
export type VerificationRequestStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
export type VerificationResult = 'VERIFIED' | 'UNVERIFIED' | 'FLAGGED';

// ---------------------------------------------------------------
// Auth
// ---------------------------------------------------------------

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  role: UserRole;
  profileComplete: boolean;
  userId: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ---------------------------------------------------------------
// Teacher Profile
// ---------------------------------------------------------------

export interface TeacherProfile {
  id: string;
  userId: string;
  email: string;
  fullName: string | null;
  phoneNumber: string | null;
  location: string | null;
  subjectSpecialization: string | null;
  yearsOfExperience: number;
  resumeUrl: string | null;
  photoUrl: string | null;
  videoUrl: string | null;
  bio: string | null;
  dateOfBirth: string | null;
  idNumber: string | null;
  verificationStatus: VerificationStatus;
  isVisibleToSchools: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  location?: string;
  subjectSpecialization?: string;
  yearsOfExperience?: number;
  bio?: string;
  dateOfBirth?: string;
  idNumber?: string;
}

// ---------------------------------------------------------------
// School Profile
// ---------------------------------------------------------------

export interface SchoolProfile {
  id: string;
  userId: string;
  email: string;
  schoolName: string | null;
  location: string | null;
  contactPerson: string | null;
  phoneNumber: string | null;
  subscriptionTier: SubscriptionTier | null;
  subscriptionStart: string | null;
  subscriptionEnd: string | null;
  isSubscriptionActive: boolean;
  createdAt: string;
}

export interface SchoolProfileRequest {
  schoolName?: string;
  location?: string;
  contactPerson?: string;
  phoneNumber?: string;
}

// ---------------------------------------------------------------
// Job Listing
// ---------------------------------------------------------------

export interface ScreeningQuestion {
  id: string;
  questionText: string;
  questionOrder: number;
  isRequired: boolean;
}

export interface JobListing {
  id: string;
  schoolId: string;
  schoolName: string;
  title: string;
  subject: string;
  location: string;
  description: string;
  requirements: string | null;
  isActive: boolean;
  createdAt: string;
  expiresAt: string | null;
  screeningQuestions: ScreeningQuestion[];
}

export interface JobListingRequest {
  title: string;
  subject: string;
  location: string;
  description: string;
  requirements?: string;
  expiresAt?: string;
  screeningQuestions: {
    questionText: string;
    questionOrder: number;
    required: boolean;
  }[];
}

// ---------------------------------------------------------------
// Application
// ---------------------------------------------------------------

export interface ScreeningAnswer {
  questionId: string;
  questionText: string;
  answerText: string;
}

export interface Application {
  id: string;
  teacherId: string;
  teacherName: string | null;
  teacherEmail: string;
  teacherPhotoUrl: string | null;
  jobListingId: string;
  jobTitle: string;
  schoolName: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  screeningAnswers: ScreeningAnswer[];
}

export interface ApplicationRequest {
  screeningAnswers: {
    questionId: string;
    answerText: string;
  }[];
}

// ---------------------------------------------------------------
// Subscription
// ---------------------------------------------------------------

export interface Subscription {
  id: string;
  schoolId: string;
  plan: SubscriptionTier;
  amount: number;
  currency: string;
  paystackReference: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
}

export interface PaystackInitResponse {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

// ---------------------------------------------------------------
// Verification
// ---------------------------------------------------------------

export interface VerificationRequest {
  id: string;
  teacherId: string;
  teacherName: string | null;
  type: VerificationType;
  provider: VerificationProvider;
  status: VerificationRequestStatus;
  result: VerificationResult | null;
  notes: string | null;
  requestedAt: string;
  completedAt: string | null;
}

// ---------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ---------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// ---------------------------------------------------------------
// API Error
// ---------------------------------------------------------------

export interface ApiError {
  status: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
  fieldErrors?: Record<string, string>;
}

// ---------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  TeacherProfile: undefined;
  TeacherProfessional: { personalData: Record<string, any>; savedRefs?: Array<{ name: string; position: string; phone: string; email: string }> };
  TeacherDocuments: {
    personalData: Record<string, any>;
    references: Array<{ name: string; position: string; phone: string; email: string }>;
  };
  TeacherApp: undefined;
  SchoolApp: undefined;
  AdminApp: undefined;
};

export type TeacherStackParamList = {
  TeacherDashboard: undefined;
  TeacherProfile: undefined;
  UploadResume: undefined;
  TakePhoto: undefined;
  RecordVideo: undefined;
  BrowseJobs: undefined;
  JobDetail: { jobId: string };
  ApplyJob: { jobId: string; jobTitle: string };
  ApplicationStatus: undefined;
  Notifications: undefined;
};

export type SchoolStackParamList = {
  SchoolDashboard: undefined;
  SchoolProfile: undefined;
  Subscription: undefined;
  PostJob: undefined;
  EditJob: { jobId: string };
  ManageJobs: undefined;
  BrowseTeachers: undefined;
  TeacherProfileView: { teacherId: string };
  Applications: { jobId: string; jobTitle: string };
  ApplicationDetail: { applicationId: string; jobTitle: string };
  Notifications: undefined;
};

export type AdminStackParamList = {
  AdminDashboard: undefined;
  ManageTeachers: undefined;
  TeacherVerification: { teacherId: string };
  ManageSchools: undefined;
  Notifications: undefined;
};
