"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DollarSignIcon, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
type ViewOption = "day" | "week" | "month" | "year" | "all";

const chartData = [
  { month: "January", mobile: 80 },
  { month: "February", mobile: 200 },
  { month: "March", mobile: 120 },
  { month: "April", mobile: 190 },
  { month: "May", mobile: 130 },
  { month: "June", mobile: 140 },
];
const chartConfig = {
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const dayData = [
  { time: "9:00", mobile: 45 },
  { time: "12:00", mobile: 85 },
  { time: "15:00", mobile: 120 },
  { time: "18:00", mobile: 75 },
  { time: "21:00", mobile: 95 },
];

const weekData = [
  { time: "Mon", mobile: 80 },
  { time: "Tue", mobile: 120 },
  { time: "Wed", mobile: 90 },
  { time: "Thu", mobile: 150 },
  { time: "Fri", mobile: 110 },
  { time: "Sat", mobile: 70 },
  { time: "Sun", mobile: 100 },
];

const monthData = [
  { time: "Week 1", mobile: 300 },
  { time: "Week 2", mobile: 450 },
  { time: "Week 3", mobile: 380 },
  { time: "Week 4", mobile: 420 },
];

const yearData = chartData.map((item) => ({
  time: item.month,
  mobile: item.mobile,
}));

const allData = [
  { time: "2020", mobile: 800 },
  { time: "2021", mobile: 1200 },
  { time: "2022", mobile: 1500 },
  { time: "2023", mobile: 1800 },
  { time: "2024", mobile: 2000 },
];

export const PortfolioChart = () => {
  const [viewOption, setViewOption] = useState<ViewOption>("day");

  const getDataForView = () => {
    switch (viewOption) {
      case "day":
        return dayData;
      case "week":
        return weekData;
      case "month":
        return monthData;
      case "year":
        return yearData;
      case "all":
        return allData;
    }
  };
  const cash = 25432;

  const formatDollar = (cash: number) => {
    return cash.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Your Portfolio
          <Tabs
            defaultValue={viewOption}
            onValueChange={(value) => setViewOption(value as ViewOption)}
          >
            <TabsList>
              <TabsTrigger value="day">1 D</TabsTrigger>
              <TabsTrigger value="week">1 W</TabsTrigger>
              <TabsTrigger value="month">1 M</TabsTrigger>
              <TabsTrigger value="year">1 Y</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
        <Card className="w-64">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Cash</CardTitle>
            <DollarSignIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-2xl font-bold",
                cash > 0 ? "text-green-500" : "text-red-500"
              )}
            >
              {formatDollar(cash)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +10.5% from last month
            </p>
          </CardContent>
        </Card>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart
            accessibilityLayer
            data={getDataForView()}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickFormatter={(value) => formatDollar(value)}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
