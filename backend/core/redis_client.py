"""
Redis client configuration
"""
import redis.asyncio as aioredis
from core.config import settings
import json
from typing import Any, Optional


class RedisClient:
    """Redis client wrapper"""
    
    def __init__(self):
        self.redis = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True
        )
    
    async def get(self, key: str) -> Optional[str]:
        """Get value from Redis"""
        return await self.redis.get(key)
    
    async def set(
        self,
        key: str,
        value: Any,
        ex: Optional[int] = None
    ) -> bool:
        """Set value in Redis"""
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        return await self.redis.set(key, value, ex=ex)
    
    async def delete(self, key: str) -> int:
        """Delete key from Redis"""
        return await self.redis.delete(key)
    
    async def exists(self, key: str) -> bool:
        """Check if key exists"""
        return await self.redis.exists(key) > 0
    
    async def expire(self, key: str, seconds: int) -> bool:
        """Set expiration for key"""
        return await self.redis.expire(key, seconds)
    
    async def incr(self, key: str) -> int:
        """Increment value"""
        return await self.redis.incr(key)
    
    async def ping(self) -> bool:
        """Check Redis connection"""
        return await self.redis.ping()
    
    async def close(self):
        """Close Redis connection"""
        await self.redis.close()


# Global Redis client instance
redis_client = RedisClient()
