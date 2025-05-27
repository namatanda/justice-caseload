
"use client";

import React, { useMemo, ComponentProps } from 'react';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { FolderClock } from 'lucide-react';

const initialChartData = [
  { month: "January", cases: 250 },
  { month: "February", cases: 275 },
  { month: "March", cases: 260 },
  { month: "April", cases: 280 },
  { month: "May", cases: 270 },
  { month: "June", cases: 265 },
];

const chartConfig = {
  cases: {
    label: "Pending Cases",
    color: "hsl(var(--chart-3))",
  },
} satisfies ComponentProps<typeof ChartContainer>["config"];

interface PendingCasesChartProps {
  selectedCaseType: string;
  selectedAge: string;
}

export function PendingCasesChart({ selectedCaseType, selectedAge }: PendingCasesChartProps) {
  const processedData = useMemo(() => {
    return initialChartData.map(item => {
      let adjustedCases = item.cases;
      if (selectedCaseType !== "all") {
        adjustedCases *= 0.82;
      }
      if (selectedAge !== "all") {
        adjustedCases *= 0.88;
      }
      return { ...item, cases: Math.max(0, Math.round(adjustedCases)) };
    });
  }, [selectedCaseType, selectedAge]);
  
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FolderClock className="h-6 w-6 text-accent" />
          <CardTitle>Pending Cases Trend</CardTitle>
        </div>
        <CardDescription>Number of pending cases per month over the last 6 months. {selectedCaseType !== 'all' || selectedAge !== 'all' ? '(Filtered)' : ''}</CardDescription>
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
              <Line type="monotone" dataKey="cases" stroke="var(--color-cases)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-cases)" }} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
