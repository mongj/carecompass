import { Nullable, WithNullableField } from "./util";

export interface PCHIBase {
  householdSize: number;
  totalMonthlyHouseholdIncome: number;
  monthlyPchi: number;
  annualPropertyValue: Nullable<number>;
}

export interface PCHIFormData
  extends WithNullableField<
    PCHIBase,
    "householdSize" | "totalMonthlyHouseholdIncome" | "annualPropertyValue"
  > {}
