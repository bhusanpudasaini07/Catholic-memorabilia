export interface IProfile {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: number;
}
export interface IProfileSubmit {
  firstName: string;
  lastName: string;
  phoneNumber: number;
}

export interface IProfileImage {
  image: File;
}
