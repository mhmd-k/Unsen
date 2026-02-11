import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { type Product, type GetOrderResponse } from "@/types";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import OrderStatusBadge from "@/components/OrderStatusBadge";

const OrderDetails = () => {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  console.log(id);

  const { data, isLoading, error } = useQuery({
    queryKey: ["order-details", id],
    queryFn: async () => {
      const res = await axiosPrivate.get<GetOrderResponse>(`/orders/${id}`);
      return res.data.order;
    },
    enabled: !!id,
  });

  if (isLoading)
    return <div className="text-center p-6">Loading order details...</div>;

  if (error || !data)
    return (
      <div className="text-center p-6 text-red-500">
        Error loading order details {JSON.stringify(error)}
      </div>
    );

  const {
    status,
    totalPrice,
    createdAt,
    contact,
    address,
    apartment,
    city,
    state,
    zipCode,
    invoice,
    products,
  } = data;

  return (
    <div className="py-10 px-4 container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-medium flex gap-4">
            Order #{id}{" "}
            <div className="ms-auto">{OrderStatusBadge(status)}</div>
          </CardTitle>
          <CardDescription className="space-y-1">
            <div>Placed on: {new Date(createdAt!).toLocaleDateString()}</div>
            <div>
              Invoice Status: <strong>{invoice?.status ?? "N/A"}</strong>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1 text-sm">
            <h3 className="font-semibold">Shipping Info</h3>
            <p>Contact: {contact}</p>
            <p>
              Address: {address}, Apt: {apartment}
            </p>
            <p>
              City: {city} {state ? `, ${state}` : ""} - {zipCode}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-base">Ordered Products</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Original Price</TableHead>
                  <TableHead>Disounted Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: Product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>
                      {" "}
                      {Number(product.discount) ? `%${product.discount}` : "_"}
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      {formatCurrency(
                        product.price - (product.discount * product.price) / 100
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="text-right text-lg font-medium">
            Total: €{totalPrice.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;
