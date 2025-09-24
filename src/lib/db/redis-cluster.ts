import { Redis, Cluster } from 'ioredis';
import logger from '@/lib/logger';

/**
 * Redis Clustering Configuration
 *
 * Environment Variables:
 * - REDIS_CLUSTER_ENABLED: Set to 'true' to enable clustering (default: false)
 * - REDIS_CLUSTER_MODE: 'cluster' for Redis Cluster, 'sentinel' for Sentinel (default: 'sentinel')
 * - REDIS_SENTINEL_MASTER_NAME: Name of the master in Sentinel mode (default: 'mymaster')
 * - REDIS_SENTINEL_HOSTS: Comma-separated list of sentinel hosts (default: 'localhost:26379')
 * - REDIS_CLUSTER_NODES: Comma-separated list of cluster nodes (default: 'localhost:6379,localhost:6380,localhost:6381')
 * - REDIS_PASSWORD: Redis password (optional)
 * - REDIS_DB: Redis database number (default: 0)
 *
 * When REDIS_CLUSTER_ENABLED is not set or false, falls back to single Redis instance
 * using standard REDIS_HOST, REDIS_PORT, etc. environment variables.
 */

// Environment variable configuration
const REDIS_CLUSTER_ENABLED = process.env.REDIS_CLUSTER_ENABLED === 'true';
const REDIS_CLUSTER_MODE = process.env.REDIS_CLUSTER_MODE || 'sentinel'; // 'cluster' or 'sentinel'
const REDIS_SENTINEL_MASTER_NAME = process.env.REDIS_SENTINEL_MASTER_NAME || 'mymaster';
const REDIS_SENTINEL_HOSTS = process.env.REDIS_SENTINEL_HOSTS || 'localhost:26379';
const REDIS_CLUSTER_NODES = process.env.REDIS_CLUSTER_NODES || 'localhost:6379,localhost:6380,localhost:6381';

// Parse Sentinel hosts
function parseSentinelHosts(hosts: string): Array<{ host: string; port: number }> {
  return hosts.split(',').map(hostPort => {
    const [host, port] = hostPort.trim().split(':');
    return { host, port: parseInt(port) || 26379 };
  });
}

// Parse Cluster nodes
function parseClusterNodes(nodes: string): Array<{ host: string; port: number }> {
  return nodes.split(',').map(hostPort => {
    const [host, port] = hostPort.trim().split(':');
    return { host, port: parseInt(port) || 6379 };
  });
}

// Base Redis configuration
const baseRedisConfig = {
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
  lazyConnect: true,
};

// Create Redis instances based on configuration
let redis: Redis | Cluster;
let redisPublisher: Redis | Cluster;
let redisSubscriber: Redis | Cluster;

if (REDIS_CLUSTER_ENABLED) {
  if (REDIS_CLUSTER_MODE === 'cluster') {
    // Redis Cluster configuration
    const clusterNodes = parseClusterNodes(REDIS_CLUSTER_NODES);
    const clusterConfig = {
      ...baseRedisConfig,
      clusterRetryDelay: 100,
      redisOptions: baseRedisConfig,
    };

    redis = new Cluster(clusterNodes, clusterConfig);
    redisPublisher = new Cluster(clusterNodes, clusterConfig);
    redisSubscriber = new Cluster(clusterNodes, clusterConfig);

    logger.database.info('Redis Cluster mode enabled', { nodes: clusterNodes });
  } else {
    // Redis Sentinel configuration
    const sentinelHosts = parseSentinelHosts(REDIS_SENTINEL_HOSTS);
    const sentinelConfig = {
      ...baseRedisConfig,
      sentinels: sentinelHosts,
      name: REDIS_SENTINEL_MASTER_NAME,
    };

    redis = new Redis(sentinelConfig);
    redisPublisher = new Redis(sentinelConfig);
    redisSubscriber = new Redis(sentinelConfig);

    logger.database.info('Redis Sentinel mode enabled', { sentinels: sentinelHosts, masterName: REDIS_SENTINEL_MASTER_NAME });
  }
} else {
  // Single Redis instance (fallback)
  const singleConfig = {
    ...baseRedisConfig,
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  };

  redis = new Redis(singleConfig);
  redisPublisher = new Redis(singleConfig);
  redisSubscriber = new Redis(singleConfig);

  logger.database.info('Single Redis instance mode');
}

// Export the Redis instances
export { redis, redisPublisher, redisSubscriber };

// Health check function
export async function checkRedisConnection(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    logger.database.error('Redis connection failed', error);
    return false;
  }
}

// Graceful shutdown
export async function disconnectRedis(): Promise<void> {
  await Promise.all([
    redis.disconnect(),
    redisPublisher.disconnect(),
    redisSubscriber.disconnect(),
  ]);
}

// Type guard to check if Redis instance is a Cluster
export function isRedisCluster(instance: Redis | Cluster): instance is Cluster {
  return instance instanceof Cluster;
}

// Utility to handle cluster-specific operations
export class ClusterAwareCacheManager {
  private redis: Redis | Cluster;

  constructor(redisInstance: Redis | Cluster) {
    this.redis = redisInstance;
  }

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  async invalidatePattern(pattern: string): Promise<void> {
    if (isRedisCluster(this.redis)) {
      // In cluster mode, we need to scan across all nodes
      const keys = [];
      for (const node of this.redis.nodes('master')) {
        const nodeKeys = await node.keys(pattern);
        keys.push(...nodeKeys);
      }
      if (keys.length > 0) {
        // Delete keys across nodes
        const pipeline = this.redis.pipeline();
        keys.forEach(key => pipeline.del(key));
        await pipeline.exec();
      }
    } else {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    }
  }
}

export default redis;