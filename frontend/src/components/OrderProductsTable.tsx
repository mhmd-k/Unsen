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
  products: Product[];
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
              <TableHead>Discount</TableHead>
              <TableHead>Original Price</TableHead>
              <TableHead>Final Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: Product) => (
              <TableRow key={product.id}>
                <TableCell className="flex items-center">
                  <div className="w-20 h-20">
                    <img
                      src={product.images[product.primaryImageIndex]}
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
                <TableCell>
                  {" "}
                  {Number(product.discount) ? `%${product.discount}` : "_"}
                </TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>
                  {formatCurrency(
                    product.price - (product.discount * product.price) / 100,
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
