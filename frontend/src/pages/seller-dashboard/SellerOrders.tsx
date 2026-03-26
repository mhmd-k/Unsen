import LoadingSpinnerInfinity from "@/components/LoadingSpinnerInfinity";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useGetSellerOrders from "@/hooks/useGetSellerOrders";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const SellerOrders = () => {
  const { data, isLoading } = useGetSellerOrders();

  if (isLoading) {
    return <LoadingSpinnerInfinity />;
  }

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-lg md:text-2xl">Your Orders</h1>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Price</TableHead>
                {/* <TableHead></TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <p className="text-gray-400 flex flex-col gap-2 w-full justify-center items-center">
                      <ShoppingBag size={50} className="text-gray-300" /> No
                      orders found
                    </p>
                  </TableCell>
                </TableRow>
              )}
              {data?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-main! font-medium"
                    >
                      #{order.id}
                    </Link>
                  </TableCell>
                  <TableCell>{order.contact}</TableCell>
                  <TableCell>
                    {order.address}, {order.city}, {order.state} {order.zipCode}
                  </TableCell>
                  <TableCell>
                    {order.canceledAt ? (
                      <Tooltip>
                        <TooltipContent>
                          Canceled at:{" "}
                          {new Date(order.canceledAt).toLocaleString()}
                        </TooltipContent>
                        <TooltipTrigger>
                          {OrderStatusBadge(order.status)}
                        </TooltipTrigger>
                      </Tooltip>
                    ) : (
                      <>{OrderStatusBadge(order.status)}</>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(order.totalPrice)}
                  </TableCell>

                  {/* <TableCell className="text-right">
                    {order.status === "PAID" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <EllipsisVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <RiRefund2Line /> Refund
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default SellerOrders;
