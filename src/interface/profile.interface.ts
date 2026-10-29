export interface IProfile {
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  contactNumber: number;
}
export interface IProfileSubmit {
  firstName: string;
  lastName: string;
  contactNumber: number;
}

export interface IProfileImage {
  image: File;
}
