"use client";

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export function WorkerInitializer() {
  const [status, setStatus] = useState<'initializing' | 'success' | 'error' | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const initializeWorkers = async () => {
      try {
        setStatus('initializing');
        
        // First check if Redis is connected
        const checkResponse = await fetch('/api/workers/init', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const checkResult = await checkResponse.json();
        
        if (!checkResult.redisConnected) {
          console.warn('Redis is not connected. Background processing will be limited.');
          setStatus('error');
          setMessage('Redis connection unavailable. File uploads will use synchronous processing.');
          return;
        }
        
        // Initialize workers
        const response = await fetch('/api/workers/init', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const result = await response.json();
        
        if (result.success) {
          console.log('Queue workers initialized successfully');
          setStatus('success');
        } else {
          console.error('Failed to initialize queue workers:', result.error);
          setStatus('error');
          setMessage(result.message || 'Failed to initialize background processing.');
        }
      } catch (error) {
        console.error('Worker initialization error:', error);
        setStatus('error');
        setMessage('Could not connect to worker initialization service.');
      }
    };

    initializeWorkers();
    
    // Re-initialize workers every 30 minutes to ensure they stay active
    const interval = setInterval(initializeWorkers, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!status || status === 'initializing') {
    return null; // Don't show anything during initialization
  }

  if (status === 'error' && message) {
    return (
      <Alert variant="destructive" className="mb-4 max-w-md mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          {message}
        </AlertDescription>
      </Alert>
    );
  }

  return null; // Don't show success message to avoid cluttering the UI
}