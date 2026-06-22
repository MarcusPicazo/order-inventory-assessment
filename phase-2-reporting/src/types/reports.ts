export interface SalesReportQuery {
  startDate?: string;
  endDate?: string;
  groupBy?: "day" | "week" | "month";
  page?: number;
  limit?: number;
}

export interface SalesReportEntry {
  period: string;
  orderCount: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface InventoryReportEntry {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  reserved: number;
  available: number;
  lowStock: boolean;
}

export interface TopProductEntry {
  productId: string;
  productName: string;
  sku: string;
  unitsSold: number;
  totalRevenue: number;
}
