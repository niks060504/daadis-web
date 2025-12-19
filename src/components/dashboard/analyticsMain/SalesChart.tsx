"use client"

// import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, 
  // LabelList, 
  XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart"
import { Label } from "../../ui/label"
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group"
// import { Button } from "../../ui/button"
import { useState } from "react"
const chartData = [
  { month: "January 2023", desktop: 18600 },
  { month: "February 2023", desktop: 3050 },
  { month: "March 2023", desktop: 27000 },
  { month: "April 2023", desktop: 3000 },
  { month: "May 2023", desktop: 20900 },
  { month: "June 2023", desktop: 21400 },
  { month: "July 2023", desktop: 18600 },
  { month: "August 2023", desktop: 3050 },
  { month: "September 2023", desktop: 23700 },
  { month: "October 2023", desktop: 7300 },
  { month: "November 2023", desktop: 20900 },
  { month: "December 2023", desktop: 21400 },
  { month: "January 2024", desktop: 18600 },
  { month: "February 2024", desktop: 30005 },
  { month: "March 2024", desktop: 23700 },
  { month: "April 2024", desktop: 7000 },
  { month: "May 2024", desktop: 2090 },
  { month: "June 2024", desktop: 24000 },
  { month: "July 2024", desktop: 18600 },
  { month: "August 2024", desktop: 30500 },
  { month: "September 2024", desktop: 237 },
  { month: "October 2024", desktop: 7300 },
  { month: "November 2024", desktop: 2090 },
  { month: "December 2024", desktop: 2140 },
]

const chartConfig = {
  desktop: {
    label: "Sales in (₹): ",
    color: "#fde047",
  },
} satisfies ChartConfig;


export function SalesChart() {

  const [ data, setData ] = useState(chartData);

  const handleClick = (event: any) => {
    switch (event?.target?.value) {
      case "three-months" : {
        console.log("Three months");
        setData([chartData[chartData.length - 3], chartData[chartData.length - 2], chartData[chartData.length - 1]]);
      }
      break;
      case "six-months" : {
        setData([chartData[chartData.length - 6], chartData[chartData.length - 5], chartData[chartData.length - 4], chartData[chartData.length - 3], chartData[chartData.length - 2], chartData[chartData.length - 1]]);
      }
      break;
      case "one-year" : {
        console.log("One year");
        setData([chartData[chartData.length - 12], chartData[chartData.length - 11], chartData[chartData.length - 10], chartData[chartData.length - 9], chartData[chartData.length - 8], chartData[chartData.length - 7], chartData[chartData.length - 6], chartData[chartData.length - 5], chartData[chartData.length - 4], chartData[chartData.length - 3], chartData[chartData.length - 2], chartData[chartData.length - 1]]);
      }
      break;
      case "all-time" : {
        console.log("All time");
        setData(chartData);
      }
      break;
    }
  }

  return (
    <Card className="max-h-full">
      <CardHeader>
        <CardTitle>Sales</CardTitle>
        <CardDescription>
          <RadioGroup className="flex mt-4" defaultValue="all-time">
            <div className="flex items-center space-x-2">
              <RadioGroupItem onClick={handleClick} className="" value="three-months" id="r1" />
              <Label htmlFor="r1">3 months</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem onClick={handleClick} value="six-months" id="r2" />
              <Label htmlFor="r2">6 months</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem onClick={handleClick} value="one-year" id="r3" />
              <Label htmlFor="r3">One year</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem onClick={handleClick} value="all-time" id="r4" />
              <Label htmlFor="r4">All time</Label>
            </div>
          </RadioGroup>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-[200px] w-full" config={chartConfig}>
          <BarChart className="max-h-full]" accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={0}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              dataKey="desktop"
              // tickLine={false}
              // tickMargin={0}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="#fde047" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
