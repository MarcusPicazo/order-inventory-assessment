export interface CreateOrderInput {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export interface OrderResponse {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    pricePerUnit: number;
  }>;
}

export interface OrderListResponse {
  orders: OrderResponse[];
  total: number;
  page: number;
  limit: number;
}
