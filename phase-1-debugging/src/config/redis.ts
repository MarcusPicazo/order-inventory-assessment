import Redis from "ioredis";
import { config } from "./env";

function createClient(): Redis {
  const client = new Redis(config.redisUrl, {
    retryStrategy(times) {
      return Math.min(times * 200, 5000);
    },
    maxRetriesPerRequest: null,
  });
  client.on("error", () => {});
  return client;
}

export const redisClient = createClient();

export const redisSubscriber = createClient();

export const redisPublisher = createClient();
