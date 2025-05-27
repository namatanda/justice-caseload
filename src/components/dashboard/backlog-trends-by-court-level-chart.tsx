
"use client";

import React, { useMemo, ComponentProps } from 'react';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Layers } from 'lucide-react'; // Icon for court levels

const initialChartData = [
  { month: "January", supreme: 50, high: 200, district: 500 },
  { month: "February", supreme: 55, high: 210, district: 520 },
  { month: "March", supreme: 48, high: 205, district: 510 },
  { month: "April", supreme: 60, high: 220, district: 530 },
  { month: "May", supreme: 52, high: 215, district: 525 },
  { month: "June", supreme: 58, high: 225, district: 540 },
];

const chartConfig = {
  supreme: {
    label: "Supreme Court Backlog",
    color: "hsl(var(--chart-1))",
  },
  high: {
    label: "High Courts Backlog",
    color: "hsl(var(--chart-2))",
  },
  district: {
    label: "District Courts Backlog",
    color: "hsl(var(--chart-3))",
  },
} satisfies ComponentProps<typeof ChartContainer>["config"];

interface BacklogTrendsByCourtLevelChartProps {
  selectedTimePeriod: string;
  // selectedCourtRank and selectedCourtName might not be directly applicable here
  // as this chart shows trends across all levels, but we accept them for consistency.
  selectedCourtRank: string;
  selectedCourtName: string;
}

export function BacklogTrendsByCourtLevelChart({ selectedTimePeriod, selectedCourtRank, selectedCourtName }: BacklogTrendsByCourtLevelChartProps) {
  const processedData = useMemo(() => {
    return initialChartData.map(item => {
      let factor = 1;
      // Simulate data change based on time period.
      // Court rank/name filters might not directly apply to this aggregate view,
      // but we could add more complex logic if needed.
      if (selectedTimePeriod === "last30") factor = 0.5; // Shorter periods might show smaller numbers
      else if (selectedTimePeriod === "last90") factor = 0.75;
      else if (selectedTimePeriod === "lastYear") factor = 0.9;

      // Apply some variation if specific court rank/name is selected, though it's less direct for this chart
      if (selectedCourtRank !== "all") factor *= 0.95;
      if (selectedCourtName !== "all" && selectedCourtRank !== "all") factor *= 0.9;


      return {
        ...item,
        supreme: Math.max(0, Math.round(item.supreme * factor)),
        high: Math.max(0, Math.round(item.high * factor)),
        district: Math.max(0, Math.round(item.district * factor)),
      };
    });
  }, [selectedTimePeriod, selectedCourtRank, selectedCourtName]);

  const isFiltered = selectedTimePeriod !== 'all' || selectedCourtRank !== 'all' || (selectedCourtName !== 'all' && selectedCourtRank !== 'all');

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Layers className="h-6 w-6 text-primary" />
          <CardTitle>Backlog Trends by Court Level</CardTitle>
        </div>
        <CardDescription>Monthly backlog trends for Supreme, High, and District courts. {isFiltered ? '(Filtered)' : ''}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart accessibilityLayer data={processedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis allowDecimals={false} />
              <ChartTooltip
                cursor={{ stroke: 'hsl(var(--accent)/0.5)', strokeWidth: 1 }}
                content={<ChartTooltipContent />}
              />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="supreme" stroke="var(--color-supreme)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-supreme)" }} activeDot={{r: 6}} name="Supreme Court" />
              <Line type="monotone" dataKey="high" stroke="var(--color-high)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-high)" }} activeDot={{r: 6}} name="High Courts" />
              <Line type="monotone" dataKey="district" stroke="var(--color-district)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-district)" }} activeDot={{r: 6}} name="District Courts" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
