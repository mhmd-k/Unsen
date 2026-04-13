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
import { Button } from "@/components/ui/button";
import { IoMdPaper } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingSpinnerInfinity from "@/components/LoadingSpinnerInfinity";

const OrderDetails = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useGetOrderById(Number(id));

  if (isLoading) return <LoadingSpinnerInfinity />;

  if (error || !data)
    return (
      <p className="text-center p-6">
        Error loading order details. Please try again later.
      </p>
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
    products,
  } = data;

  return (
    <div className="py-10 px-4 container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-medium flex gap-4">
            Order #{id} <span>{OrderStatusBadge(status)}</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="ms-auto">
                  Invoice <IoMdPaper />
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-lg max-h-96 overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{data.invoice.invoiceNumber}</DialogTitle>
                </DialogHeader>

                {/* Invoice content goes here */}
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Status:</strong> {data.invoice.status}
                  </p>

                  <p>
                    <strong>Issued At:</strong>{" "}
                    {new Date(data.invoice.issuedAt!).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-1 text-sm">
                  <h3 className="font-semibold">Payment Info</h3>
                  <p>
                    <strong>Status:</strong> {data.invoice.payment.status}
                  </p>
                  <p>
                    <strong>Amount:</strong>{" "}
                    {formatCurrency(data.invoice.payment.amount)}
                  </p>
                  <p>
                    <strong>Card:</strong> ******
                    {data.invoice.payment.cardLast4}
                  </p>
                  <p>
                    <strong>Processed At:</strong>{" "}
                    {new Date(
                      data.invoice.payment.processedAt!,
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-1 text-sm">
                  <h3 className="font-semibold">Shipping Info</h3>
                  <p>
                    <strong>Contact:</strong> {contact}
                  </p>
                  <p>
                    <strong>Address:</strong> {address}
                  </p>
                  <p>
                    {" "}
                    <strong>Apartment:</strong> {apartment}
                  </p>
                  <p>
                    <strong>City:</strong> {city} {state ? `, ${state}` : ""} -{" "}
                    {zipCode}
                  </p>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Final Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(
                            (product.price -
                              (product.discount * product.price) / 100) *
                              product.quantity,
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="text-right flex-1 font-semibold">
                  Total: {formatCurrency(data.invoice.totalAmount)}
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription className="space-y-1">
            <div>Placed on: {new Date(createdAt!).toLocaleDateString()}</div>
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
