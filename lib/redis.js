import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

redis.on('error', (err) => {
  console.log('Redis Client Error', err);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

export default redis;