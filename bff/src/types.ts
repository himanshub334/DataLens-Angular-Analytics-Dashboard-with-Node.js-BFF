export interface DashboardDto {
  kpis: {
    revenue: number;
    orders: number;
    customers: number;
    averageOrderValue: number;
  };
  revenueTrend: { date: string; revenue: number }[];
  ordersByChannel: { channel: string; orders: number }[];
  customerMix: { segment: string; customers: number }[];
  transactions: {
    id: number;
    date: string;
    channel: string;
    category: string;
    amount: number;
    status: string;
  }[];
}
