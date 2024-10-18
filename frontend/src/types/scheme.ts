export type SchemeData = {
  id: string;
  name: string;
  description: string;
  benefits: string;
  eligibility: EligibilityCriteria[];
  nextSteps: string;
  numSteps: number;
};

export type EligibilityCriteria = {
  description: string;
  satisfied: boolean;
};