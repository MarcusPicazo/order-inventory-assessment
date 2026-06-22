export const config = {
  databaseUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/orderdb?schema=public",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  port: parseInt(process.env.PORT || "3000", 10),
};
