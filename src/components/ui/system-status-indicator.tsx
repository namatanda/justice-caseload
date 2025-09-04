"use client";

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Database, Activity, CloudOff, RefreshCw } from 'lucide-react';
import { useSystemStatus } from '@/hooks/use-system-status';
import { Button } from './button';

export function SystemStatusIndicator() {
  const { redis, workers, isChecking, checkStatus } = useSystemStatus();
  
  return (
    <div className="flex space-x-2 items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={redis.isConnected ? 'outline' : 'destructive'}
              className="flex items-center gap-1 px-2 py-1"
            >
              <Database className="h-3 w-3" />
              <span className="text-xs">
                {redis.status === 'checking' ? 'Checking Redis...' : 
                 redis.isConnected ? 'Redis Connected' : 'Redis Unavailable'}
              </span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {redis.isConnected 
                ? 'Redis is connected. Background processing is available.' 
                : 'Redis is unavailable. File processing will be limited.'}
              {redis.lastChecked && (
                <span className="block text-xs text-muted-foreground mt-1">
                  Last checked: {timeAgo(redis.lastChecked)}
                </span>
              )}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={workers.isActive ? 'outline' : 'secondary'}
              className="flex items-center gap-1 px-2 py-1"
            >
              {workers.isActive 
                ? <Activity className="h-3 w-3" /> 
                : <CloudOff className="h-3 w-3" />}
              <span className="text-xs">
                {workers.status === 'checking' ? 'Checking Workers...' : 
                 workers.isActive ? 'Workers Active' : 'Workers Inactive'}
              </span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {workers.isActive 
                ? 'Background workers are processing jobs normally.' 
                : 'Background workers are not running. Some features may be limited.'}
              {workers.lastChecked && (
                <span className="block text-xs text-muted-foreground mt-1">
                  Last checked: {timeAgo(workers.lastChecked)}
                </span>
              )}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={checkStatus} 
        disabled={isChecking}
        className="h-6 px-2 ml-1"
      >
        <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
}

// Helper function to format time ago
function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}