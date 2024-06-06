import { BloodType, Gender, UserRole } from "@prisma/client";


export type TRegistration = {
  name: string;
  email: string;
  password: string;
  bloodType: BloodType;
  gender: Gender;
  location: string;
  age: number;
  bio: string;
  lastDonationDate: string;
  role: keyof typeof UserRole;
};

export type TLogin = {
  email: string;
  password: string;
};
