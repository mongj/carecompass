// TODO: Enum types should be fetched from the backend
export enum Residence {
  HOME = "HOME",
  NURSING_HOME_LTCF = "NURSING_HOME_LTCF",
  OTHER = "OTHER",
}

export enum Citizenship {
  CITIZEN = "CITIZEN",
  PR = "PR",
  OTHER = "OTHER",
}

// Note: may want to align with singpass codes in the future
export enum Relationship {
  PARENT = "PARENT",
  SPOUSE = "SPOUSE",
  OTHER_FAMILY = "OTHER_FAMILY",
  NON_FAMILY = "NON_FAMILY",
}

export interface CaregiverData {
  citizenship: Citizenship;
}

export interface CareRecipientData {
  care_recipient_age: number;
  care_recipient_citizenship: Citizenship;
  care_recipient_residence: Residence;
  care_recipient_relationship: Relationship;
}

export interface UserDataBase extends CaregiverData, CareRecipientData {
  clerk_id: string;
}

export interface UserDataFull extends UserDataBase {
  household_size: number;
  total_monthly_household_income: number;
  annual_property_value: number;
  monthly_pchi: number;
}

export interface UserData extends UserDataFull {
  id: number;
  threads: UserThreadData[];
}

export interface UserThreadData {
  title: string;
  thread_id: string;
}
