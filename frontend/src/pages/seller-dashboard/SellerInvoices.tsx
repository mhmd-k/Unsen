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
import useGetSellerinvoices from "@/hooks/useGetSellerInvoices";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { TbEye } from "react-icons/tb";
import { Link } from "react-router-dom";

const SellerInvoices = () => {
  const { data, isLoading } = useGetSellerinvoices();

  if (isLoading) {
    return <LoadingSpinnerInfinity />;
  }

  console.log(data);

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-lg md:text-2xl">Invoices</h1>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Num</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <p className="text-gray-400 flex flex-col gap-2 w-full justify-center items-center">
                      <ShoppingBag size={50} className="text-gray-300" /> No
                      invoices found!
                    </p>
                  </TableCell>
                </TableRow>
              )}
              {data?.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-semibold">
                    <Link
                      to={`/seller-dashboard/invoices/${invoice.id}`}
                      className="text-main! hover:underline!"
                    >
                      {invoice.invoiceNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{invoice.status}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(invoice.totalAmount)}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button variant="link" size="icon">
                      <Link to={`/seller-dashboard/invoices/${invoice.id}`}>
                        <TbEye />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default SellerInvoices;
