import type { SelectOption } from "@/types";

export const API_URL = "http://localhost:5000/api";

export const bankOptions: SelectOption[] = [
  { label: "Bank of America", value: "BANK_OF_AMERICA" },
  { label: "Chase", value: "CHASE" },
  { label: "Wells Fargo", value: "WELLS_FARGO" },
  { label: "Citibank", value: "CITIBANK" },
  { label: "Capital One", value: "CAPITAL_ONE" },
  { label: "TD Bank", value: "TD_BANK" },
  { label: "PNC Bank", value: "PNC_BANK" },
  { label: "US Bank", value: "US_BANK" },
  { label: "HSBC", value: "HSBC" },
];

export const categories = [
  "Headphones",
  "Phone cases",
  "Speakers",
  "Phone Cases",
];
