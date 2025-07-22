// Common/shared types
export type SortOrder = "asc" | "desc";

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export type Status = "idle" | "loading" | "success" | "error";
