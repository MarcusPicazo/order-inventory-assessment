export interface InventoryResponse {
  productId: string;
  productName: string;
  quantity: number;
  reserved: number;
  available: number;
}

export interface InventoryUpdateInput {
  quantity: number;
}
