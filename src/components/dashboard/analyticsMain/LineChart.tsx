"use client"

// import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card.tsx"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart.tsx"
import { DatePicker } from "../couponMain/DatePicker.tsx"
const chartData = [
  { month: "January", visits: 186 },
  { month: "February", visits: 305 },
  { month: "March", visits: 237 },
  { month: "April", visits: 73 },
  { month: "May", visits: 209 },
  { month: "June", visits: 214 },
  { month: "July", visits: 214 },
  { month: "August", visits: 214 },
  { month: "September", visits: 214 },
  { month: "October", visits: 214 },
  { month: "November", visits: 214 },
  { month: "December", visits: 214 },
]

const chartConfig = {
  visits: {
    label: "Visits",
    color: "#000",
  },
} satisfies ChartConfig

export function Component() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart</CardTitle>
        <CardDescription><DatePicker className="" field={""} /></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[200px] w-full" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
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
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line className="bg-yellow"
              dataKey="visits"
              type="natural"
              stroke="#fde047"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
};
