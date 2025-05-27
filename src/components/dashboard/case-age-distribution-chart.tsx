
"use client";

import React, { useMemo, ComponentProps } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CalendarClock } from 'lucide-react';

const initialChartData = [
  { ageBracket: "0-30 days", cases: 120 },
  { ageBracket: "31-90 days", cases: 250 },
  { ageBracket: "91-180 days", cases: 180 },
  { ageBracket: "181-365 days", cases: 90 },
  { ageBracket: ">1 year", cases: 50 },
];

const chartConfig = {
  cases: {
    label: "Number of Cases",
    color: "hsl(var(--chart-5))",
  },
} satisfies ComponentProps<typeof ChartContainer>["config"];

interface CaseAgeDistributionChartProps {
  selectedTimePeriod: string;
  selectedCourtRank: string;
  selectedCourtName: string;
}

export function CaseAgeDistributionChart({ selectedTimePeriod, selectedCourtRank, selectedCourtName }: CaseAgeDistributionChartProps) {
  const processedData = useMemo(() => {
    return initialChartData.map(item => {
      let adjustedCases = item.cases;
      if (selectedTimePeriod !== "all") {
        adjustedCases *= 0.9; // Simulate 10% reduction for time period filter
      }
      if (selectedCourtRank !== "all") {
        adjustedCases *= 0.85; // Simulate 15% reduction for court rank filter
      }
      if (selectedCourtName !== "all" && selectedCourtRank !== "all") {
        adjustedCases *= 0.8; // Simulate 20% reduction for specific court filter
      }
      return { ...item, cases: Math.max(0, Math.round(adjustedCases)) };
    });
  }, [selectedTimePeriod, selectedCourtRank, selectedCourtName]);

  const isFiltered = selectedTimePeriod !== 'all' || selectedCourtRank !== 'all' || (selectedCourtName !== 'all' && selectedCourtRank !== 'all');

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarClock className="h-6 w-6 text-[hsl(var(--chart-5))]" />
          <CardTitle>Case Age Distribution</CardTitle>
        </div>
        <CardDescription>Distribution of pending cases by age. {isFiltered ? '(Filtered)' : ''}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart accessibilityLayer data={processedData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="ageBracket"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis dataKey="cases" allowDecimals={false} />
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
