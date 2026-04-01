import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { type Product } from "@/types";
import { Link } from "react-router-dom";

const OrderProductsTable = ({
  products,
  totalPrice,
}: {
  products: (Product & { quantity: number })[];
  totalPrice: number;
}) => {
  return (
    <>
      <div className="space-y-2">
        <h3 className="font-semibold text-base">Ordered Products</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Original Price</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Final Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="flex items-center">
                  <div className="w-20 h-20">
                    <img
                      src={product.images[product.primaryImageIndex].url}
                      className="object-fill"
                    />
                  </div>{" "}
                  <Link
                    to={`/shop/${product.id}`}
                    className="hover:text-main! transition-colors"
                  >
                    {product.name}
                  </Link>
                </TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell className="text-red-400 font-semibold text-xs">
                  {Number(product.discount) ? `%${product.discount}` : "_"}
                </TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell className="text-main font-semibold">
                  {formatCurrency(
                    (product.price - (product.discount * product.price) / 100) *
                      product.quantity,
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-right text-lg font-medium">
        Total: ${totalPrice.toFixed(2)}
      </div>
    </>
  );
};

export default OrderProductsTable;
