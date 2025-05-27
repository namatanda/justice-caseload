
"use client";

import React, { useMemo, ComponentProps } from 'react';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';

const initialChartData = [
  { month: "January", filed: 186, resolved: 150 },
  { month: "February", filed: 205, resolved: 180 },
  { month: "March", filed: 237, resolved: 200 },
  { month: "April", filed: 173, resolved: 160 },
  { month: "May", filed: 209, resolved: 190 },
  { month: "June", filed: 214, resolved: 205 },
];

const chartConfig = {
  filed: {
    label: "Filed Cases",
    color: "hsl(var(--chart-1))",
  },
  resolved: {
    label: "Resolved Cases",
    color: "hsl(var(--chart-2))",
  },
} satisfies ComponentProps<typeof ChartContainer>["config"];

interface FilingsVsResolutionsChartProps {
  selectedTimePeriod: string;
  selectedCourtRank: string;
  selectedCourtName: string;
}

export function FilingsVsResolutionsChart({ selectedTimePeriod, selectedCourtRank, selectedCourtName }: FilingsVsResolutionsChartProps) {
  const processedData = useMemo(() => {
    return initialChartData.map(item => {
      let adjustedFiled = item.filed;
      let adjustedResolved = item.resolved;

      if (selectedTimePeriod !== "all") {
        adjustedFiled *= 0.9; 
        adjustedResolved *= 0.85;
      }
      if (selectedCourtRank !== "all") {
        adjustedFiled *= 0.8; 
        adjustedResolved *= 0.75; 
      }
      if (selectedCourtName !== "all" && selectedCourtRank !== "all") {
        adjustedFiled *= 0.7;
        adjustedResolved *= 0.65;
      }
      return { 
        ...item, 
        filed: Math.max(0, Math.round(adjustedFiled)),
        resolved: Math.max(0, Math.round(adjustedResolved)),
      };
    });
  }, [selectedTimePeriod, selectedCourtRank, selectedCourtName]);

  const isFiltered = selectedTimePeriod !== 'all' || selectedCourtRank !== 'all' || (selectedCourtName !== 'all' && selectedCourtRank !== 'all');

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <CardTitle>Filings vs. Resolutions Trend</CardTitle>
        </div>
        <CardDescription>Comparison of new cases filed and cases resolved per month. {isFiltered ? '(Filtered)' : ''}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart accessibilityLayer data={processedData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
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
              <Line type="monotone" dataKey="filed" stroke="var(--color-filed)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-filed)" }} activeDot={{r: 6}} name="Filed Cases" />
              <Line type="monotone" dataKey="resolved" stroke="var(--color-resolved)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-resolved)" }} activeDot={{r: 6}} name="Resolved Cases" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
