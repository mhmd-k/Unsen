import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

export const description = "A line chart";

const chartConfig = {
  totalOrders: {
    label: "Total Orders",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const OrdersOverTime = ({
  data,
}: {
  data: { month: string; totalOrders: number }[];
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders Over Time</CardTitle>
        <CardDescription>
          Showing Total Orders for the past 12 months.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto h-75 w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="totalOrders"
              type="natural"
              stroke="var(--color-totalOrders)"
              strokeWidth={3}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default OrdersOverTime;
