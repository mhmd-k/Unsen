import type { OrderStatus } from "@/types";
import { Badge } from "./ui/badge";

const OrderStatusBadge = (status: OrderStatus) => {
  if (status === "WAITING_FOR_PAYMENT")
    return (
      <Badge variant="secondary" className="bg-gray-400 text-white">
        Waiting for payment
      </Badge>
    );

  if (status === "CANCELED")
    return (
      <Badge variant="secondary" className="bg-red-400 text-white">
        Canceled
      </Badge>
    );

  return (
    <Badge variant="secondary" className="bg-green-400 text-white">
      Done
    </Badge>
  );
};

export default OrderStatusBadge;
