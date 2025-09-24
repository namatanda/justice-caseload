import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface KPICardProps {
  title: string;
  value: string;
  icon: ReactNode;
  description?: string;
  valueClassName?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function KPICard({ title, value, icon, description, valueClassName, trend }: KPICardProps) {
  return (
    <Card 
      className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg border border-border"
      role="region"
      aria-labelledby={`kpi-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle 
          id={`kpi-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-sm font-medium text-muted-foreground"
        >
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div 
          className={`text-2xl font-bold ${valueClassName || 'text-primary'}`}
          aria-live="polite"
          aria-atomic="true"
        >
          {value}
        </div>
        {description && (
          <CardDescription className="text-xs pt-1">
            {description}
          </CardDescription>
        )}
        {trend && (
          <div 
            className={`flex items-center pt-2 text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-500'}`}
            aria-label={`Trend: ${trend.isPositive ? 'increased' : 'decreased'} by ${trend.value}`}
          >
            <span>{trend.value}</span>
            <span className="ml-1" aria-hidden="true">
              {trend.isPositive ? '↑' : '↓'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}