"use server"
import type { Redis } from 'ioredis';

export const getRedisClient = async (): Promise<Redis> => {
  const { default: Redis } = await import('ioredis');
  
  const redisUrlString = process.env.REDIS_URL || 'redis://localhost:6379';
  console.log(`[ioredis] Attempting connection using URL: ${redisUrlString}`);
  
  try {
    if (typeof globalThis.__redisClient === 'undefined') {
      const client = new Redis(redisUrlString, {
        connectTimeout: 5000,
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          const delay = Math.min(times * 50, 2000);
          return delay;
        }
      });
      
      client.on('error', (err) => console.error('[ioredis] Redis Client Error', err));
      client.on('connect', () => console.log('[ioredis] Connected to Redis'));
      client.on('ready', () => console.log('[ioredis] Client ready'));
      client.on('reconnecting', () => console.log('[ioredis] Reconnecting...'));
      client.on('end', () => console.log('[ioredis] Connection ended'));
      
      globalThis.__redisClient = client;
    }
    
    return globalThis.__redisClient;
  } catch (error) {
    console.error("[ioredis] Failed to create or connect client:", error);
    throw error;
  }
};

declare global {
  var __redisClient: any;
}