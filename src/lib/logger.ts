/**
 * Centralized logging utility for the Justice Caseload application
 * 
 * Provides structured logging with different levels and contexts
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogContext = 'upload' | 'import' | 'database' | 'health' | 'system' | 'api' | 'general';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: LogContext;
  message: string;
  data?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isTest = process.env.NODE_ENV === 'test';

  private formatMessage(level: LogLevel, context: LogContext, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    
    // In test environment, suppress most logging unless it's an error
    if (this.isTest && level !== 'error') {
      return;
    }

    const prefix = `[${level.toUpperCase()}] ${context}:`;
    
    if (data && Object.keys(data).length > 0) {
      console.log(`${prefix} ${message}`, data);
    } else {
      console.log(`${prefix} ${message}`);
    }

    // In production, also send to external logging service (if configured)
    if (!this.isDevelopment && level === 'error') {
      this.sendToExternalLogger({ timestamp, level, context, message, data });
    }
  }

  private sendToExternalLogger(entry: LogEntry): void {
    // TODO: Implement external logging service integration
    // For now, just ensure critical errors are visible
    if (entry.level === 'error') {
      console.error('CRITICAL ERROR:', entry);
    }
  }

  debug(context: LogContext, message: string, data?: any): void {
    if (this.isDevelopment) {
      this.formatMessage('debug', context, message, data);
    }
  }

  info(context: LogContext, message: string, data?: any): void {
    this.formatMessage('info', context, message, data);
  }

  warn(context: LogContext, message: string, data?: any): void {
    this.formatMessage('warn', context, message, data);
  }

  error(context: LogContext, message: string, data?: any): void {
    this.formatMessage('error', context, message, data);
  }

  // Convenience methods for common contexts
  upload = {
    debug: (message: string, data?: any) => this.debug('upload', message, data),
    info: (message: string, data?: any) => this.info('upload', message, data),
    warn: (message: string, data?: any) => this.warn('upload', message, data),
    error: (message: string, data?: any) => this.error('upload', message, data),
  };

  import = {
    debug: (message: string, data?: any) => this.debug('import', message, data),
    info: (message: string, data?: any) => this.info('import', message, data),
    warn: (message: string, data?: any) => this.warn('import', message, data),
    error: (message: string, data?: any) => this.error('import', message, data),
  };

  database = {
    debug: (message: string, data?: any) => this.debug('database', message, data),
    info: (message: string, data?: any) => this.info('database', message, data),
    warn: (message: string, data?: any) => this.warn('database', message, data),
    error: (message: string, data?: any) => this.error('database', message, data),
  };

  health = {
    debug: (message: string, data?: any) => this.debug('health', message, data),
    info: (message: string, data?: any) => this.info('health', message, data),
    warn: (message: string, data?: any) => this.warn('health', message, data),
    error: (message: string, data?: any) => this.error('health', message, data),
  };

  system = {
    debug: (message: string, data?: any) => this.debug('system', message, data),
    info: (message: string, data?: any) => this.info('system', message, data),
    warn: (message: string, data?: any) => this.warn('system', message, data),
    error: (message: string, data?: any) => this.error('system', message, data),
  };

  api = {
    debug: (message: string, data?: any) => this.debug('api', message, data),
    info: (message: string, data?: any) => this.info('api', message, data),
    warn: (message: string, data?: any) => this.warn('api', message, data),
    error: (message: string, data?: any) => this.error('api', message, data),
  };
}

// Export singleton instance
export const logger = new Logger();
export default logger;