export interface FormData {
  fullName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  region: string;
  city: string;
  subjects: string[];
  otherSubject: string;
  experience: string;
  bio: string;
  idNumber: string;
}

export type FormErrors = Partial<Record<keyof FormData | 'cvFileName' | 'idPhotoUri' | 'videoFileName' | 'photoUri', string>>;

export const initialForm: FormData = {
  fullName: '',
  dateOfBirth: '',
  phone: '',
  email: '',
  region: '',
  city: '',
  subjects: [],
  otherSubject: '',
  experience: '',
  bio: '',
  idNumber: '',
};
