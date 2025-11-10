import { Request, Response, NextFunction } from 'express';
import { cache, CacheKeys } from '../lib/cache';
import crypto from 'crypto';

/**
 * Response caching middleware
 * Caches GET requests for specified duration
 */
export function cacheResponse(ttlSeconds: number = 60) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key from URL and query params
    const cacheKey = `http:${req.originalUrl}`;

    // Try to get from cache
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      console.log(`✅ Cache HIT: ${cacheKey}`);
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedResponse);
    }

    console.log(`❌ Cache MISS: ${cacheKey}`);
    res.setHeader('X-Cache', 'MISS');

    // Override res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = (data: any) => {
      // Cache successful responses only
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(cacheKey, data, ttlSeconds);
      }

      return originalJson(data);
    };

    next();
  };
}

/**
 * Invalidate cache for specific patterns
 */
export function invalidateCache(pattern: string): void {
  const stats = cache.getStats();

  const keysToDelete = stats.keys.filter(key => key.includes(pattern));

  keysToDelete.forEach(key => cache.delete(key));

  console.log(`🗑️  Invalidated ${keysToDelete.length} cache entries matching: ${pattern}`);
}

/**
 * Hash content for cache key generation
 */
export function hashContent(content: string): string {
  return crypto.createHash('md5').update(content).digest('hex');
}
