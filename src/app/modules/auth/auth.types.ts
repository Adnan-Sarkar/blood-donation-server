import { BloodType } from "@prisma/client";

export type TRegistration = {
  name: string;
  email: string;
  password: string;
  bloodType: BloodType;
  location: string;
  age: number;
  bio: string;
  lastDonationDate: string;
};

export type TLogin = {
  email: string;
  password: string;
};
