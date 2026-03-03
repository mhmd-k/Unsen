import ProductTableRow from "@/components/product/ProductTableRow";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import type { GetSellerProductsResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Products = () => {
  const axiosPrivate = useAxiosPrivate();
  const { user } = useAuth();

  const { data } = useQuery({
    queryFn: async () => {
      const res = await axiosPrivate.get<GetSellerProductsResponse>(
        `/products/seller/products`,
      );
      return res.data.data;
    },
    queryKey: [user?.id, "seller-products"],
  });

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-lg md:text-2xl">Your Products</h1>

        <Link to="/seller-dashboard/products/add-product">
          <Button>
            <span className="hidden md:inline-block">Add product</span>
            <Plus />
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>product</TableHead>
                <TableHead>description</TableHead>
                <TableHead>category</TableHead>
                <TableHead>price</TableHead>
                <TableHead className="text-right">discount</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((p) => <ProductTableRow key={p.id} product={p} />)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default Products;
