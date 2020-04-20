export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

interface Duration {
  startDate: string;
  endDate: string;
}

interface Discharge {
  date: string;
  criteria: string;
}

export enum HealthCheckRating {
  'Healthy' = 0,
  'LowRisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3
}

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

export enum EntryTypes {
  Hospital = 'Hospital',
  OccupationalHealthcare = 'OccupationalHealthcare',
  HealthCheck = 'HealthCheck'
}
export interface HospitalEntry extends BaseEntry {
  type: EntryTypes.Hospital;
  discharge: Discharge;
}
export interface OccupationalHealthCareEntry extends BaseEntry {
  type: EntryTypes.OccupationalHealthcare;
  employerName: string;
  sickLeave?: Duration;
}
export interface HealthCheckEntry extends BaseEntry {
  type: EntryTypes.HealthCheck;
  healthCheckRating: HealthCheckRating;
}

export type Entry = | HospitalEntry | OccupationalHealthCareEntry | HealthCheckEntry;

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries?: Entry[];

  /** Unix timestamp (seconds since January 1, 1970) representing when the data was fully fetched
   * 
   * Exists only to satisfy the requirement 9.17 "Do not fetch the information if it already is in the app state".
   * This seems to be the least "hackiest" way to do it without creating a complex state or using a full blown caching solution
   * 
   * TODO: Refactor this horrible hack if a better solution is available
   * */
  fetchTimestamp?: number;
}
