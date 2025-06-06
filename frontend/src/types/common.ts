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

export interface ValidationError {
  field: string;
  message: string;
}

export type Status = "idle" | "loading" | "success" | "error";

export type Product = {
  id: number;
  imageUrl: string;
  title: string;
  price: number;
  type: string;
};

export type CartItem = Product & {
  quantity: number;
};
