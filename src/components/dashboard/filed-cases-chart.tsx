"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { FolderPlus } from 'lucide-react';

const chartData = [
  { month: "January", cases: 186 },
  { month: "February", cases: 205 },
  { month: "March", cases: 237 },
  { month: "April", cases: 173 },
  { month: "May", cases: 209 },
  { month: "June", cases: 214 },
];

const chartConfig = {
  cases: {
    label: "Cases Filed",
    color: "hsl(var(--chart-1))",
  },
};

export function FiledCasesChart() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FolderPlus className="h-6 w-6 text-primary" />
          <CardTitle>Filed Cases Trend</CardTitle>
        </div>
        <CardDescription>Number of new cases filed per month over the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
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
