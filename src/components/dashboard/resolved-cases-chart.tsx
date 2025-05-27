
"use client";

import React, { useMemo, ComponentProps } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { FolderCheck } from 'lucide-react';

const initialChartData = [
  { month: "January", cases: 150 },
  { month: "February", cases: 180 },
  { month: "March", cases: 200 },
  { month: "April", cases: 160 },
  { month: "May", cases: 190 },
  { month: "June", cases: 205 },
];

const chartConfig = {
  cases: {
    label: "Cases Resolved",
    color: "hsl(var(--chart-2))",
  },
} satisfies ComponentProps<typeof ChartContainer>["config"];

interface ResolvedCasesChartProps {
  selectedCaseType: string;
  selectedAge: string;
}

export function ResolvedCasesChart({ selectedCaseType, selectedAge }: ResolvedCasesChartProps) {
  const processedData = useMemo(() => {
    return initialChartData.map(item => {
      let adjustedCases = item.cases;
      if (selectedCaseType !== "all") {
        adjustedCases *= 0.75; 
      }
      if (selectedAge !== "all") {
        adjustedCases *= 0.9;
      }
      return { ...item, cases: Math.max(0, Math.round(adjustedCases)) };
    });
  }, [selectedCaseType, selectedAge]);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FolderCheck className="h-6 w-6 text-[hsl(var(--chart-2))]" />
          <CardTitle>Resolved Cases Trend</CardTitle>
        </div>
        <CardDescription>Number of cases resolved per month over the last 6 months. {selectedCaseType !== 'all' || selectedAge !== 'all' ? '(Filtered)' : ''}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart accessibilityLayer data={processedData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
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
                cursor={{ fill: 'hsl(var(--accent)/0.2)' }}
                content={<ChartTooltipContent />} 
              />
              <Bar dataKey="cases" fill="var(--color-cases)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
