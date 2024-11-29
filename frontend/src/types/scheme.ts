import { PCHIBase } from "./pchi";

export type SchemeData = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  benefits: string;
  eligibility: string;
  nextSteps: string;
  pchiRequired: boolean;
};

export type EligibilityCriteria = {
  description: string;
  satisfied: boolean;
};

export interface SubsidyInfo extends PCHIBase {
  subsidyLevel: number;
}
export interface MohNrLtcSubsidy extends SubsidyInfo {
  pchiBand: string;
  correctAsOf: string;
}
