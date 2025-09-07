"use client";

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

interface SystemStatus {
  redis: {
    isConnected: boolean;
    status: 'connected' | 'disconnected' | 'checking';
    lastChecked: Date | null;
  };
  workers: {
    isActive: boolean;
    status: 'active' | 'inactive' | 'checking';
    lastChecked: Date | null;
  };
  isChecking: boolean;
  checkStatus: () => Promise<void>;
}

export function useSystemStatus(): SystemStatus {
  const [redisStatus, setRedisStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [workersStatus, setWorkersStatus] = useState<'active' | 'inactive' | 'checking'>('checking');
  const [redisLastChecked, setRedisLastChecked] = useState<Date | null>(null);
  const [workersLastChecked, setWorkersLastChecked] = useState<Date | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    
    try {
      // Check Redis connection
      const redisResponse = await fetch('/api/workers/init', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const redisResult = await redisResponse.json();
      setRedisStatus(redisResult.redisConnected ? 'connected' : 'disconnected');
      setRedisLastChecked(new Date());
      
      // Only check workers if Redis is connected
      if (redisResult.redisConnected) {
        try {
          // Check queue stats to see if workers are active
          const queueResponse = await fetch('/api/import/queue-stats', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (queueResponse.ok) {
            setWorkersStatus('active');
          } else {
            setWorkersStatus('inactive');
          }
          
          setWorkersLastChecked(new Date());
        } catch (error) {
          logger.api.error('Failed to check worker status', { error });
          setWorkersStatus('inactive');
          setWorkersLastChecked(new Date());
        }
      } else {
        setWorkersStatus('inactive');
        setWorkersLastChecked(new Date());
      }
    } catch (error) {
      logger.api.error('Failed to check Redis status', { error });
      setRedisStatus('disconnected');
      setRedisLastChecked(new Date());
      setWorkersStatus('inactive');
      setWorkersLastChecked(new Date());
    } finally {
      setIsChecking(false);
    }
  };
  
  useEffect(() => {
    checkStatus();
    
    // Check status every 2 minutes
    const interval = setInterval(checkStatus, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return {
    redis: {
      isConnected: redisStatus === 'connected',
      status: redisStatus,
      lastChecked: redisLastChecked,
    },
    workers: {
      isActive: workersStatus === 'active',
      status: workersStatus,
      lastChecked: workersLastChecked,
    },
    isChecking,
    checkStatus,
  };
}