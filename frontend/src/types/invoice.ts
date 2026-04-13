import type { Order } from "./order";
import type { Product } from "./product";

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
  order?: Order & {
    orderItems: {
      id: number;
      orderId: number;
      product: Product;
      productId: number;
      quantity: number;
      unitPrice: number;
    }[];
  };
};

export type GetSellerInvoiceDetailsResponse = {
  invoice: Invoice;
};
