"use client";
import logger from '@/lib/logger';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, Server, Activity } from 'lucide-react';

interface HealthStatus {
  timestamp: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    database: { status: string; latency: number; error: string | null };
    redis: { status: string; error: string | null };
    workers: { status: string; error: string | null };
  };
}

export function SystemHealthDashboard() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealth(data);
      setLastChecked(new Date());
    } catch (error) {
      logger.system.error('Failed to check health', error);
      setHealth({
        timestamp: new Date().toISOString(),
        status: 'unhealthy',
        services: {
          database: { status: 'unknown', latency: 0, error: 'Failed to check' },
          redis: { status: 'unknown', error: 'Failed to check' },
          workers: { status: 'unknown', error: 'Failed to check' }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeWorkers = async () => {
    try {
      const response = await fetch('/api/workers/init', { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        setTimeout(checkHealth, 1000); // Recheck health after workers init
      }
    } catch (error) {
      logger.system.error('Failed to initialize workers', error);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'unhealthy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'healthy': return 'default';
      case 'degraded': return 'secondary';
      case 'unhealthy': return 'destructive';
      default: return 'outline';
    }
  };

  if (!health) {
    return <div>Loading health status...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Health</h2>
        <div className="flex gap-2">
          <Button 
            onClick={checkHealth} 
            disabled={loading}
            variant="outline" 
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={initializeWorkers}
            variant="outline" 
            size="sm"
          >
            <Server className="h-4 w-4 mr-2" />
            Init Workers
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Overall Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={getStatusVariant(health.status)} className="mb-2">
              {health.status.toUpperCase()}
            </Badge>
            <p className="text-xs text-muted-foreground">
              Last checked: {lastChecked?.toLocaleTimeString() || 'Never'}
            </p>
          </CardContent>
        </Card>

        {/* Database Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={getStatusVariant(health.services.database.status)} className="mb-2">
              {health.services.database.status.toUpperCase()}
            </Badge>
            <p className="text-xs text-muted-foreground">
              Latency: {health.services.database.latency}ms
            </p>
            {health.services.database.error && (
              <p className="text-xs text-red-500 mt-1">
                {health.services.database.error}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Redis Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Server className="h-4 w-4 mr-2" />
              Redis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={getStatusVariant(health.services.redis.status)} className="mb-2">
              {health.services.redis.status.toUpperCase()}
            </Badge>
            {health.services.redis.error && (
              <p className="text-xs text-red-500 mt-1">
                {health.services.redis.error}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Workers Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Workers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={getStatusVariant(health.services.workers.status)} className="mb-2">
              {health.services.workers.status.toUpperCase()}
            </Badge>
            {health.services.workers.error && (
              <p className="text-xs text-red-500 mt-1">
                {health.services.workers.error}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}