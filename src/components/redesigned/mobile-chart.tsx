"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Label
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Expand, X, Info } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { 
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface MobileChartProps {
  title: string;
  description: string;
  data: any[];
  type: 'line' | 'bar' | 'pie';
  dataKey?: string;
  config: {
    [key: string]: {
      label: string;
      color: string;
    };
  };
}

export function MobileChart({ title, description, data, type, dataKey, config }: MobileChartProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management for accessibility
  useEffect(() => {
    if (!isExpanded && expandButtonRef.current) {
      expandButtonRef.current.focus();
    }
  }, [isExpanded]);

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            accessibilityLayer
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
            >
              <Label value="Time Period" position="insideBottom" offset={-5} />
            </XAxis>
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip 
              contentStyle={{ fontSize: '14px' }}
              formatter={(value) => [value.toLocaleString(), '']}
            />
            <Legend 
              wrapperStyle={{ fontSize: '14px' }}
            />
            {Object.keys(config).map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={config[key].color}
                activeDot={{ r: 8 }}
                name={config[key].label}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            accessibilityLayer
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
            >
              <Label value="Time Period" position="insideBottom" offset={-5} />
            </XAxis>
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip 
              contentStyle={{ fontSize: '14px' }}
              formatter={(value) => [value.toLocaleString(), '']}
            />
            <Legend 
              wrapperStyle={{ fontSize: '14px' }}
            />
            {Object.keys(config).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={config[key].color}
                name={config[key].label}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );
      case 'pie':
        const COLORS = Object.values(config).map(item => item.color);
        return (
          <PieChart accessibilityLayer>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  aria-label={`${entry.name}: ${(entry[dataKey || 'value'] * 100).toFixed(1)}%`}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ fontSize: '14px' }}
              formatter={(value) => [value.toLocaleString(), '']}
            />
            <Legend 
              wrapperStyle={{ fontSize: '14px' }}
            />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <Card 
      className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg"
      role="region"
      aria-labelledby={`chart-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle id={`chart-title-${title.replace(/\s+/g, '-').toLowerCase()}`}>
              {title}
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              {description}
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chart showing {title.toLowerCase()}</p>
                </TooltipContent>
              </UITooltip>
            </CardDescription>
          </div>
          <Sheet open={isExpanded} onOpenChange={setIsExpanded}>
            <SheetTrigger asChild>
              <Button 
                ref={expandButtonRef}
                variant="ghost" 
                size="icon" 
                className="touch-target"
                aria-label={`Expand ${title} chart`}
              >
                <Expand className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-full md:max-w-4xl">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b pb-4">
                  <SheetTitle>{title}</SheetTitle>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsExpanded(false)}
                    aria-label="Close expanded chart"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 py-4">
                  <div className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {renderChart()}
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}