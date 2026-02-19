import { useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { useGetOrderById } from "@/hooks/useGetOrderById";
import OrderProductsTable from "@/components/OrderProductsTable";

const OrderDetails = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useGetOrderById(Number(id));

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

  console.log(products);

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

          <OrderProductsTable products={products} totalPrice={totalPrice} />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;
