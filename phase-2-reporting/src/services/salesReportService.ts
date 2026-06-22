import { SalesReportQuery, SalesReportEntry } from "../types/reports";

export async function getSalesReport(
  _query: SalesReportQuery
): Promise<SalesReportEntry[]> {
  throw new Error("Not implemented");
}
