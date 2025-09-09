// scripts/clear-redis.ts
import { Redis } from 'ioredis';
import { importQueue, analyticsQueue } from '../src/lib/database/redis';
import { logger } from '../src/lib/logger';

async function clearAllRedisData() {
  const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  
  try {
    logger.database.info('🧹 Starting Redis cleanup...');
    
    // 1. Clear all BullMQ queues
    logger.database.info('📋 Clearing BullMQ queues...');
    await importQueue.obliterate({ force: true });
    await analyticsQueue.obliterate({ force: true });
    logger.database.info('✅ Queues cleared');
    
    // 2. Clear cache data (assuming cache keys follow a pattern)
    logger.database.info('🗄️ Clearing cache data...');
    const cacheKeys = await redis.keys('cache:*');
    if (cacheKeys.length > 0) {
      await redis.del(...cacheKeys);
      logger.database.info(`✅ Cleared ${cacheKeys.length} cache entries`);
    }
    
    // 3. Clear session data
    logger.database.info('🔐 Clearing session data...');
    const sessionKeys = await redis.keys('sess:*');
    if (sessionKeys.length > 0) {
      await redis.del(...sessionKeys);
      logger.database.info(`✅ Cleared ${sessionKeys.length} sessions`);
    }
    
    // 4. Clear rate limiting data
    logger.database.info('⏱️ Clearing rate limiting data...');
    const rateLimitKeys = await redis.keys('rl:*');
    if (rateLimitKeys.length > 0) {
      await redis.del(...rateLimitKeys);
      logger.database.info(`✅ Cleared ${rateLimitKeys.length} rate limit entries`);
    }
    
    // 5. Clear analytics data
    logger.database.info('📊 Clearing analytics cache...');
    const analyticsKeys = await redis.keys('analytics:*');
    if (analyticsKeys.length > 0) {
      await redis.del(...analyticsKeys);
      logger.database.info(`✅ Cleared ${analyticsKeys.length} analytics entries`);
    }
    
    // 6. Clear any remaining Redis keys (optional - use with caution)
    // const allKeys = await redis.keys('*');
    // logger.database.info(`📊 Total keys remaining: ${allKeys.length}`);
    
    logger.database.info('🎉 Redis cleanup completed successfully!');
    
  } catch (error) {
    logger.database.error('❌ Redis cleanup failed:', error);
    throw error;
  } finally {
    await redis.disconnect();
  }
}

// Execute if run directly
if (require.main === module) {
  clearAllRedisData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { clearAllRedisData };