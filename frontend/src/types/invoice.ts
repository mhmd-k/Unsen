export type Invoice = {
  id: number;
  orderId: number;
  issuedDate: Date;
  amount: number;
  status: "GENERATED" | "PAID";
  createdAt?: Date;
  updatedAt?: Date;
};
