import * as os from 'os';
import { systemMemoryUsage, systemCpuUsage } from './metrics';

export interface SystemResources {
  cpu: {
    usage: number; // Percentage
    cores: number;
    loadAverage: number[];
  };
  memory: {
    total: number; // Bytes
    free: number; // Bytes
    used: number; // Bytes
    usage: number; // Percentage
  };
  uptime: number; // Seconds
  platform: string;
  arch: string;
  nodeVersion: string;
}

export function getSystemResources(): SystemResources {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryUsage = (usedMemory / totalMemory) * 100;

  // CPU usage calculation (simplified - average over all cores)
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;

  cpus.forEach(cpu => {
    for (const type in cpu.times) {
      totalTick += (cpu.times as any)[type];
    }
    totalIdle += cpu.times.idle;
  });

  const idle = totalIdle / cpus.length;
  const total = totalTick / cpus.length;
  const cpuUsage = 100 - ~~(100 * idle / total);

  // Update Prometheus metrics
  systemMemoryUsage.labels('total').set(totalMemory);
  systemMemoryUsage.labels('free').set(freeMemory);
  systemMemoryUsage.labels('used').set(usedMemory);
  systemCpuUsage.set(cpuUsage);

  return {
    cpu: {
      usage: cpuUsage,
      cores: cpus.length,
      loadAverage: os.loadavg()
    },
    memory: {
      total: totalMemory,
      free: freeMemory,
      used: usedMemory,
      usage: memoryUsage
    },
    uptime: os.uptime(),
    platform: os.platform(),
    arch: os.arch(),
    nodeVersion: process.version
  };
}

export function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(' ') || '0m';
}