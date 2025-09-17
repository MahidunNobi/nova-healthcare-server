import { BloodGroup, Gender, MaritalStatus } from "@prisma/client";

export type IPatient = {
  name: string;
  contactNumber: string;
  address?: string;
  patientHealthData?: IPatientHealthData;
  medicalReport?: IMedicalReport;
};

export type IPatientHealthData = {
  patientId: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  hasAllergies?: boolean;
  hasDiabetes?: boolean;
  height: string;
  weight: string;
  smokingStatus?: boolean;
  dietaryPreferences?: string;
  pregnancyStatus?: boolean;
  mentalHealthHistory?: string;
  immunizationStatus?: string;
  hasPastSurgeries?: boolean;
  recentAnxiety?: boolean;
  recentDepression?: boolean;
  maritalStatus?: MaritalStatus;
};

export type IMedicalReport = {
  reportName: string;
  reportLink: string;
};
