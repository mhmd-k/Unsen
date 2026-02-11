import { useAuth } from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { type GetUserOrdersResponse, type Product } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  CircleCheckBig,
  CircleX,
  EllipsisVertical,
  EyeIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrderStatusBadge from "@/components/OrderStatusBadge";

const Orders = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const {
    data: orders,
    error,
    isLoading,
  } = useQuery({
    queryFn: async () => {
      const res = await axiosPrivate.get<GetUserOrdersResponse>(
        `/orders/by-user/${user?.id}`
      );
      return res.data.orders;
    },
    queryKey: ["user-orders", user?.id],
  });

  if (isLoading)
    return <div className="text-center p-6">Loading orders...</div>;
  if (!orders || error)
    return (
      <div className="text-center text-red-500 p-6">Error loading orders</div>
    );

  return (
    <div className="bg-gray-100 flex-1 py-10">
      <div className="container px-2 mx-auto">
        <h1 className="text-3xl">Your Orders</h1>
        <Card className="mt-6">
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, idx) => (
                  <TableRow key={order.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{OrderStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <ul className="ml-4">
                        {order.products?.map((product: Product) => (
                          <li key={product.id}>
                            {product.name} ({product.brand})
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>€{order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt!).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {order.status === "WAITING_FOR_PAYMENT" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <EllipsisVertical />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="text-gray-600"
                          >
                            <DropdownMenuItem
                              onClick={() => navigate(`/orders/${order.id}`)}
                            >
                              <EyeIcon /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CircleX className="text-red-400" /> Cancel Order
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => navigate("/payment")}
                            >
                              <CircleCheckBig className="text-green-400" />{" "}
                              Confirm Purchase
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Orders;
