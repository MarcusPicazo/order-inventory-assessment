export interface OrderCreatedEvent {
  orderId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}
