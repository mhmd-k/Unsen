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
import { formatCurrency } from "@/lib/utils";

export const description = "A line chart";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const RevenueOverTime = ({
  data,
}: {
  data: { month: string; revenue: number }[];
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
        <CardDescription>
          Showing Revenues for the past 12 months.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="mx-auto h-75 w-full" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex min-w-32.5 items-center text-xs text-muted-foreground">
                      {chartConfig[name as keyof typeof chartConfig]?.label ||
                        name}
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium text-foreground tabular-nums">
                        {formatCurrency(value as number)}
                      </div>
                    </div>
                  )}
                />
              }
            />
            <Line
              dataKey="revenue"
              type="natural"
              stroke="var(--color-revenue)"
              strokeWidth={3}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueOverTime;
