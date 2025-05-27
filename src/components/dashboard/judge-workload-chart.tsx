"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Gavel } from 'lucide-react';

const chartData = [
  { judge: "Judge Smith", workload: 45 },
  { judge: "Judge Doe", workload: 62 },
  { judge: "Judge Garcia", workload: 38 },
  { judge: "Judge Lee", workload: 55 },
  { judge: "Judge Chen", workload: 49 },
];

const chartConfig = {
  workload: {
    label: "Active Cases",
    color: "hsl(var(--chart-4))", // Different blue/neutral color
  },
};

export function JudgeWorkloadChart() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Gavel className="h-6 w-6 text-[hsl(var(--chart-4))]" />
          <CardTitle>Workload per Judge</CardTitle>
        </div>
        <CardDescription>Current number of active cases assigned to each judge.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                dataKey="judge"
                type="category"
                tickLine={false}
                tickMargin={5}
                axisLine={false}
                width={80}
              />
              <ChartTooltip 
                cursor={{ fill: 'hsl(var(--accent)/0.2)' }}
                content={<ChartTooltipContent />} 
              />
              <Bar dataKey="workload" fill="var(--color-workload)" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
