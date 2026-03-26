import ProductTableRow from "@/components/product/ProductTableRow";
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
import { useAuth } from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import type { GetSellerProductsResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { BoxIcon, Plus } from "lucide-react";
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
              {data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <p className="text-gray-400 flex flex-col gap-2 w-full justify-center items-center">
                      <BoxIcon size={50} className="text-gray-300" /> No
                      products found
                    </p>
                  </TableCell>
                </TableRow>
              )}

              {data?.map((p) => <ProductTableRow key={p.id} product={p} />)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default Products;
