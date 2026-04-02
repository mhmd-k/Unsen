export type Invoice = {
  id: number;
  invoiceNumber: string;
  issuedAt: string;
  orderId: number;
  refundedAt: null | string;
  status: "ISSUED" | "REFUNDED" | "VOID";
  totalAmount: number;
  payment: {
    amount: number;
    cardLast4: string;
    createdAt: string;
    id: number;
    processedAt: string;
    status: "SUCCESS" | "FAILED" | "PENDING";
  };
};
