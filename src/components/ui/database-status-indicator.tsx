"use client";

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Database,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertTriangle,
  Wifi,
  WifiOff
} from 'lucide-react';

interface DatabaseStatusIndicatorProps {
  showLabel?: boolean;
  showRetry?: boolean;
  onRetry?: () => void;
  className?: string;
}

type ConnectionStatus = 'checking' | 'connected' | 'disconnected' | 'error';

export function DatabaseStatusIndicator({
  showLabel = true,
  showRetry = true,
  onRetry,
  className = ''
}: DatabaseStatusIndicatorProps) {
  const [status, setStatus] = useState<ConnectionStatus>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      // Try a simple database operation to test connection
      const response = await fetch('/api/import/history?page=1&limit=1');
      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('connected');
      } else if (response.status === 500 &&
                 (result.error?.includes('database') ||
                  result.error?.includes('connection') ||
                  result.details?.includes('localhost:5432'))) {
        setStatus('disconnected');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('disconnected');
    } finally {
      setIsChecking(false);
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkConnection();

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-red-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Database className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking...';
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Issue';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'secondary';
      case 'connected':
        return 'default';
      case 'disconnected':
        return 'destructive';
      case 'error':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getTooltipContent = () => {
    const baseInfo = `Database Status: ${getStatusText()}`;

    if (lastChecked) {
      const timeAgo = Math.floor((Date.now() - lastChecked.getTime()) / 1000);
      const timeString = timeAgo < 60 ? `${timeAgo}s ago` : `${Math.floor(timeAgo / 60)}m ago`;
      return `${baseInfo}\nLast checked: ${timeString}`;
    }

    return baseInfo;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-2 ${className}`}>
            {showLabel && (
              <span className="text-sm text-muted-foreground">Database:</span>
            )}

            <Badge
              variant={getStatusColor() as any}
              className="flex items-center gap-1 cursor-pointer hover:opacity-80"
              onClick={checkConnection}
            >
              {getStatusIcon()}
              <span className="text-xs">{getStatusText()}</span>
            </Badge>

            {showRetry && (status === 'disconnected' || status === 'error') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  checkConnection();
                  onRetry?.();
                }}
                disabled={isChecking}
                className="h-6 px-2 text-xs"
              >
                <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm whitespace-pre-line">
            {getTooltipContent()}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}