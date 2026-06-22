import { redisPublisher, redisSubscriber } from "../config/redis";

type EventHandler = (payload: any) => void | Promise<void>;

const handlers: Map<string, EventHandler[]> = new Map();

export function subscribe(event: string, handler: EventHandler): void {
  if (!handlers.has(event)) {
    handlers.set(event, []);
    redisSubscriber.subscribe(event);
  }
  handlers.get(event)!.push(handler);
}

redisSubscriber.on("message", async (channel: string, message: string) => {
  const eventHandlers = handlers.get(channel);
  if (!eventHandlers) return;

  const payload = JSON.parse(message);
  for (const handler of eventHandlers) {
    await handler(payload);
  }
});

export async function publish(event: string, payload: any): Promise<void> {
  await redisPublisher.publish(event, JSON.stringify(payload));
}
