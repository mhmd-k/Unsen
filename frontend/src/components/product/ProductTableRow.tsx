import type { Product } from "@/types";
import { TableCell, TableRow } from "../ui/table";
import { formatCurrency } from "@/lib/utils";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";

const ProductTableRow = ({ product }: { product: Product }) => {
  return (
    <TableRow key={product.id}>
      <TableCell>
        <div className="flex gap-2 items-center me-7">
          <img
            src={product.images[product.primaryImageIndex]}
            className="h-20 aspect-square object-cover"
          />
          <span className="whitespace-break-spaces">{product.name}</span>
        </div>
      </TableCell>
      <TableCell>
        {product.description.length > 30
          ? `${product.description.slice(0, 30)}...`
          : product.description}
      </TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>{formatCurrency(product.price)}</TableCell>
      <TableCell>
        {Number(product.discount) ? `${product.discount}%` : "_"}
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Button variant="ghost" size="icon">
            <Pencil />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProductTableRow;
