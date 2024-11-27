import { Citizenship, Residence, UserDataBase } from "../types/user";

// Types
interface EligibilityResult {
  id: string;
  criteriaCount: number;
  eligibleReasons: string[];
  ineligibleReasons?: string[];
  additionalVerificationDetails?: string[];
  otherDetails?: string[];
}

enum EligibilityStatus {
  ELIGIBLE = "eligible",
  INELIGIBLE = "ineligible",
  NEEDS_VERIFICATION = "needs_verification",
}

interface DetailedEligibilityResult {
  schemeId: string;
  eligibilityStatus: EligibilityStatus;
  criteriaCount: number;
  eligibleReasons: string[];
  ineligibleReasons?: string[];
  additionalVerificationDetails?: string[];
  otherDetails?: string[];
}

const CURRENT_YEAR = new Date().getFullYear();

// Individual scheme checkers
export const checkParentRelief = (user: UserDataBase): EligibilityResult => {
  const reasons = [
    `Your dependant(s) were 55 years of age and above in ${CURRENT_YEAR}`,
    "If your dependant(s) were living with you in the same household in Singapore, you qualify for $9,000 in tax relief per dependant",
    "If your dependant(s) who do/does not live with you but you have incurred more than S$2,000 supporting them, you may qualify for $5,500 in tax relief per dependant",
  ];
  const additionalVerificationCriteria = [
    `Your dependant(s) did not have an annual income of more than $8,000 each in ${CURRENT_YEAR}`,
    "No other relevant reliefs have been claimed on your dependant",
  ];

  const criteriaCount = reasons.length + additionalVerificationCriteria.length;
  const eligibleReasons = [];
  const ineligibleReasons = [];

  if (user.care_recipient_age >= 55) {
    eligibleReasons.push(reasons[0]);
  } else {
    ineligibleReasons.push(reasons[0]);
  }

  if (user.care_recipient_residence === Residence.HOME) {
    eligibleReasons.push(reasons[1]);
  } else {
    eligibleReasons.push(reasons[2]);
  }

  return {
    id: "PARENT-RELIEF",
    criteriaCount,
    eligibleReasons,
    ineligibleReasons,
    additionalVerificationDetails: additionalVerificationCriteria,
  };
};

export const checkCaregiversTrainingGrant = (
  user: UserDataBase,
): EligibilityResult => {
  const reasons = [
    "Care recipient is a Singapore Citizen or Permanent Resident",
    "Care recipient is aged 65 and older OR have a disability certified by a doctor's memo or Functional Assessment Report",
  ];
  const additionalVerificationCriteria = [
    "Caregiver must be person in charge of caring for the care recipient (this can include family members and foreign domestic workers)",
    "The full grant quantum has not been claimed by other family members or caregivers",
    "Selected course is on the approved list of courses",
    "Completion of the training course with a certificate of attendance if there is one",
  ];

  const criteriaCount = reasons.length + additionalVerificationCriteria.length;

  const eligibleReasons = [];
  const ineligibleReasons = [];

  if (
    user.care_recipient_citizenship === Citizenship.CITIZEN ||
    user.care_recipient_citizenship === Citizenship.PR
  ) {
    eligibleReasons.push(reasons[0]);
  } else {
    ineligibleReasons.push(reasons[0]);
  }

  if (user.care_recipient_age >= 65) {
    eligibleReasons.push(reasons[1]);
  } else {
    ineligibleReasons.push(reasons[1]);
  }

  return {
    id: "CAREGIVERS-TRAINING-GRANT",
    criteriaCount,
    eligibleReasons,
    ineligibleReasons,
    additionalVerificationDetails: additionalVerificationCriteria,
  };
};

export const checkHomeCaregivingGrant = (
  user: UserDataBase,
): EligibilityResult => {
  const reasons = [
    "Care recipient is a Singapore Citizen (SC)",
    "Care recipient is not in a residential long-term care institution (e.g. nursing home)",
  ];
  const additionalVerificationCriteria = [
    "Care recipient must always require some assistance with at least 3 Activities of Daily Living, as certified via a Functional Assessment Report",
    "If your household monthly income per person is $1,500 or less* and your household owns no more than one property, you may qualify for $400 in monthly cash payouts",
    "If household has no income, the annual value of property must be less than $21,000",
    "If your household monthly income per person is between $1,501 and $3,600, you may qualify for $250 monthly cash payout",
  ];

  const criteriaCount = reasons.length + additionalVerificationCriteria.length;

  const eligibleReasons = [];
  const ineligibleReasons = [];

  if (user.care_recipient_citizenship === Citizenship.CITIZEN) {
    eligibleReasons.push(reasons[0]);
  } else {
    ineligibleReasons.push(reasons[0]);
  }
  if (user.care_recipient_residence !== Residence.NURSING_HOME_LTCF) {
    eligibleReasons.push(reasons[1]);
  } else {
    ineligibleReasons.push(reasons[1]);
  }

  return {
    id: "HOME-CAREGIVING-GRANT",
    criteriaCount,
    eligibleReasons,
    ineligibleReasons,
    additionalVerificationDetails: additionalVerificationCriteria,
  };
};

export const checkMdwLevyConcession = (
  user: UserDataBase,
): EligibilityResult => {
  let eligibleReasons: string[] = [];
  let ineligibleReasons: string[] = [];

  const isCaseOne =
    user.care_recipient_citizenship === Citizenship.CITIZEN &&
    user.citizenship === Citizenship.CITIZEN &&
    user.care_recipient_residence === Residence.HOME;

  const isCaseTwo =
    user.care_recipient_citizenship === Citizenship.PR &&
    user.citizenship === Citizenship.CITIZEN &&
    user.care_recipient_residence === Residence.HOME &&
    user.care_recipient_age >= 67;

  if (isCaseOne) {
    eligibleReasons = [
      "Care recipient is a Singaporean Citizen",
      "Applicant is a Singapore Citizen",
      "Applicant lives with care recipient",
      "Care recipient is elderly person aged 67 and above*",
    ];
  } else if (isCaseTwo) {
    eligibleReasons = [
      "Care recipient is a Singaporean Permanent Resident",
      "Applicant is a Singapore Citizen",
      "Applicant lives with care recipient",
      "Care recipient is elderly person aged 67 and above*",
    ];
  } else {
    ineligibleReasons = [
      "Does not meet all criteria for the levy concession - must meet all criteria in one of the following cases:",
      "Case 1: Care recipient is Singapore Citizen, applicant is Singapore Citizen, and they live together",
      "Case 2: Care recipient is Singapore PR, applicant is Singapore Citizen, they live together, and care recipient is 67 or older",
    ];
  }

  const otherDetails = [
    "*or person with disability as certified by Functional Assessment Report as requiring assistance with at least 1 activity of daily living",
  ];
  const criteriaCount = 4;

  return {
    id: "MIGRANT-DOMESTIC-WORKER-LEVY",
    criteriaCount,
    eligibleReasons,
    ineligibleReasons,
    otherDetails: otherDetails,
  };
};

export const checkMohLtcSubsidy = (user: UserDataBase): EligibilityResult => {
  const reasons = [
    "User of Non-Residential Long-Term Care service is a Singapore Citizen (SC) or Permanent Resident (PR)",
  ];
  const additionalVerificationCriteria = [
    "The service provider is government-funded",
    "Subsidy tiers are based on monthly household per capita income. Click [here](redirect to our eligibility checker when built or the MOH link under benefits) to check the subsidy you may be eligible for.",
  ];
  const criteriaCount = reasons.length + additionalVerificationCriteria.length;

  const eligibleReasons: string[] = [];
  const ineligibleReasons: string[] = [];
  if (
    [Citizenship.CITIZEN, Citizenship.PR].includes(
      user.care_recipient_citizenship,
    )
  ) {
    eligibleReasons.push(reasons[0]);
  } else {
    ineligibleReasons.push(reasons[0]);
  }

  return {
    id: "MOH-NR-LTC-SUBSIDY",
    criteriaCount,
    eligibleReasons,
    ineligibleReasons,
    additionalVerificationDetails: additionalVerificationCriteria,
  };
};

export const checkAllSchemesEligibility = (
  user: UserDataBase,
): DetailedEligibilityResult[] => {
  const checkers = [
    checkParentRelief,
    checkCaregiversTrainingGrant,
    checkHomeCaregivingGrant,
    checkMdwLevyConcession,
    checkMohLtcSubsidy,
  ];

  return checkers.map((checker) => {
    const result = checker(user);

    let eligibilityStatus = EligibilityStatus.ELIGIBLE;

    // Check if there are any verification details needed
    if (
      result.additionalVerificationDetails &&
      result.additionalVerificationDetails.length > 0
    ) {
      eligibilityStatus = EligibilityStatus.NEEDS_VERIFICATION;
    }
    // INELIGIBLE if no eligible reasons and no reasons that need verification
    else if (!result.eligibleReasons.length) {
      eligibilityStatus = EligibilityStatus.INELIGIBLE;
    }

    return {
      schemeId: result.id,
      criteriaCount: result.criteriaCount,
      eligibilityStatus,
      eligibleReasons: result.eligibleReasons,
      ineligibleReasons: result.ineligibleReasons,
      additionalVerificationDetails: result.additionalVerificationDetails,
      otherDetails: result.otherDetails,
    };
  });
};
