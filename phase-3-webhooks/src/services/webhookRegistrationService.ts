import { CreateWebhookInput, WebhookEndpointResponse } from "../types/webhook";

export async function registerWebhook(
  _input: CreateWebhookInput
): Promise<WebhookEndpointResponse> {
  throw new Error("Not implemented");
}

export async function listWebhooks(): Promise<WebhookEndpointResponse[]> {
  throw new Error("Not implemented");
}

export async function deleteWebhook(_id: string): Promise<void> {
  throw new Error("Not implemented");
}
