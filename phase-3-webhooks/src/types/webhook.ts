export interface CreateWebhookInput {
  url: string;
  events: WebhookEventType[];
}

export type WebhookEventType =
  | "order.created"
  | "order.updated"
  | "inventory.low";

export interface WebhookEndpointResponse {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
}

export interface WebhookDeliveryResponse {
  id: string;
  endpointId: string;
  eventType: string;
  payload: any;
  status: string;
  attempts: number;
  lastError: string | null;
  createdAt: string;
}
