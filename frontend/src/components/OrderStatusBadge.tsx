import type { OrderStatus } from "@/types";
import { Badge } from "./ui/badge";

const OrderStatusBadge = (status: OrderStatus) => {
  if (status === "WAITING_FOR_PAYMENT")
    return (
      <Badge variant="secondary" className="bg-gray-400 text-white">
        Waiting for payment
      </Badge>
    );

  if (status === "CANCELLED")
    return (
      <Badge variant="secondary" className="bg-red-400 text-white">
        Canceled
      </Badge>
    );

  if (status === "REFUNDED")
    return (
      <Badge variant="secondary" className="bg-blue-400 text-white">
        REFUNDED
      </Badge>
    );

  return (
    <Badge variant="secondary" className="bg-green-400 text-white">
      Paid
    </Badge>
  );
};

export default OrderStatusBadge;
