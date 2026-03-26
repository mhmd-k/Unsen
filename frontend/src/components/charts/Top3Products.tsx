import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BoxIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const chartConfig = {
  totalSold: {
    label: "Total Sales",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export default function Top3Products({
  data,
}: {
  data: {
    productId: number;
    totalRevenue: number;
    totalSold: string;
    "product.id": number;
    "product.name": string;
  }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Top 3 products by Sales</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {data.length === 0 ? (
          <div className="h-75 flex items-center justify-center flex-col gap-4">
            <p className="text-gray-400 flex flex-col gap-2 w-full justify-center items-center">
              <BoxIcon size={50} className="text-gray-300" /> No products
              related to you yet!
            </p>
            <Button className="p-0">
              <Link
                to="/seller-dashboard/products/add-product"
                className="px-2 text-white!"
              >
                Add Product
              </Link>
            </Button>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto h-75 w-full">
            <BarChart accessibilityLayer data={data}>
              <YAxis type="number" dataKey="totalSold" hide />
              <XAxis
                dataKey="product.name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 15) + "..."}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="totalSold"
                fill="var(--color-totalSold)"
                radius={5}
                barSize={40}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
