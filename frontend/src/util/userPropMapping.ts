import { Citizenship, Relationship, Residence } from "@/types/user";

const userResidenceMapping = {
  [Residence.HOME]: "Home",
  [Residence.NURSING_HOME_LTCF]:
    "Nursing home / Residential Long-Term Care (LTC) facility",
  [Residence.OTHER]: "Other",
};

const userCitizenshipMapping = {
  [Citizenship.CITIZEN]: "Singapore Citizen",
  [Citizenship.PR]: "Permanent Resident",
  [Citizenship.OTHER]: "Other",
};

const userRelationshipMapping = {
  [Relationship.PARENT]: "Parent",
  [Relationship.SPOUSE]: "Spouse",
  [Relationship.OTHER_FAMILY]: "Other family",
  [Relationship.NON_FAMILY]: "Non-family member",
};

export const getFormattedUserResidence = (residence: Residence) => {
  return userResidenceMapping[residence] ?? "-";
};

export const getFormattedUserCitizenship = (citizenship: Citizenship) => {
  return userCitizenshipMapping[citizenship] ?? "-";
};

export const getFormattedUserRelationship = (relationship: Relationship) => {
  return userRelationshipMapping[relationship] ?? "-";
};
