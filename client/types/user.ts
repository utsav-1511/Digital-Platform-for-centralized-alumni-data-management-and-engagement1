export interface UserEducation {
  college: string;
  batch: string;
  degree: string;
}

export interface UserProfile extends UserEducation {
  id: string;
  name: string;
  email: string;
  // ...other profile fields
}