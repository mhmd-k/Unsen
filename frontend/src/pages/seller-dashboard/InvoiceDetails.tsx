import LoadingSpinnerInfinity from "@/components/LoadingSpinnerInfinity";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetInvoiceById from "@/hooks/useGetInvoiceById";
import { formatCurrency } from "@/lib/utils";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const InvoiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetInvoiceById(Number(id));

  console.log("Invoice details data:", data);

  if (isLoading) return <LoadingSpinnerInfinity />;

  if (!data || error) return <></>;

  return (
    <>
      <Button size="lg" variant="ghost" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </Button>
      <Card className="max-w-2xl mx-auto">
        <CardContent>
          <h1 className="font-semibold text-center">{data.invoiceNumber}</h1>

          {/* Invoice content goes here */}
          <div className="space-y-1 text-sm">
            <p>
              <strong>Status:</strong> {data.status}
            </p>

            <p>
              <strong>Issued At:</strong>{" "}
              {new Date(data.issuedAt!).toLocaleDateString()}
            </p>
          </div>

          {data.order && (
            <div className="space-y-1 text-sm">
              <h3 className="font-semibold">Shipping Info</h3>
              <p>
                <strong>Contact:</strong> {data.order.contact}
              </p>
              <p>
                <strong>Address:</strong> {data.order.address}
              </p>
              <p>
                {" "}
                <strong>Apartment:</strong> {data.order.apartment}
              </p>
              <p>
                <strong>City:</strong> {data.order.city}{" "}
                {data.order.state ? `, ${data.order.state}` : ""} -{" "}
                {data.order.zipCode}
              </p>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Final Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.order?.orderItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(
                      (item.product.price -
                        (item.product.discount * item.product.price) / 100) *
                        item.quantity,
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="text-right flex-1 font-semibold">
            Total: {formatCurrency(data.totalAmount)}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default InvoiceDetails;
