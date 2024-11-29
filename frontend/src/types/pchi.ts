export interface PCHIBase {
  householdSize: number;
  totalMonthlyHouseholdIncome: number;
  monthlyPchi: number;
  annualPropertyValue: number;
}

export interface PCHICreate extends PCHIBase {}
