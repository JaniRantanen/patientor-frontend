export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

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

  /** Unix timestamp (seconds since January 1, 1970) representing when the data was fully fetched
   * 
   * Exists only to satisfy the requirement 9.17 "Do not fetch the information if it already is in the app state".
   * This seems to be the least "hackiest" way to do it without creating a complex state or using a full blown caching solution
   * 
   * TODO: Refactor this horrible hack if a better solution is available
   * */
  fetchTimestamp?: number;
}
