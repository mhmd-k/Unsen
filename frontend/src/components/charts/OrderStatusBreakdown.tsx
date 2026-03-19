import { Pie, PieChart } from "recharts";

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

export const description = "A donut chart";

const chartConfig = {
  count: {
    label: "Number of Orders",
    color: "var(--primary)",
  },
  PAID: {
    label: "PAID",
    color: "var(--chart-2)",
  },
  CANCELLED: {
    label: "CANCELLED",
    color: "var(--chart-1)",
  },
  WAITING_FOR_PAYMENT: {
    label: "WAITING_FOR_PAYMENT",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const OrderStatusBreakdown = ({
  data,
}: {
  data: {
    status: string;
    count: number;
  }[];
}) => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Order Status Breakdown</CardTitle>
        <CardDescription>
          Showing the distribution of order statuses.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto h-75 w-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data.map((item) => ({
                ...item,
                fill: chartConfig[item.status as keyof typeof chartConfig]
                  .color,
              }))}
              dataKey="count"
              nameKey="status"
              innerRadius="40%"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default OrderStatusBreakdown;
