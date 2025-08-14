import redis from './redis';

export const CACHE_KEYS = {
  PROPERTIES: 'properties',
  PROPERTY: (id) => `property:${id}`,
  DASHBOARD_STATS: 'dashboard:stats',
  PROPERTY_TYPES: 'property:types',
  SALES_DATA: 'sales:data',
  USER: (id) => `user:${id}`,
};

export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  DASHBOARD: 600, // 10 minutes
};

export class CacheManager {
  static async get(key) {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async set(key, data, ttl = CACHE_TTL.MEDIUM) {
    try {
      await redis.setex(key, ttl, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  static async del(key) {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  static async invalidatePattern(pattern) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Cache pattern invalidation error:', error);
      return false;
    }
  }
}