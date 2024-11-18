export type SchemeData = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  benefits: string;
  eligibility: string;
  nextSteps: string;
};

export type EligibilityCriteria = {
  description: string;
  satisfied: boolean;
};
