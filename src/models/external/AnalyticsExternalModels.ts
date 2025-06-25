// External models for Analytics API responses

export interface ExternalSalesAnalytics {
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  salesGrowth: number;
  revenueGrowth: number;
}

export interface ExternalProductAnalytics {
  totalProducts: number;
  activeProducts: number;
  pendingProducts: number;
  rejectedProducts: number;
  topSellingProducts: ExternalTopProduct[];
  categoryDistribution: ExternalCategoryDistribution[];
}

export interface ExternalTopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  imageUrl: string;
}

export interface ExternalCategoryDistribution {
  categoryId: string;
  categoryName: string;
  productCount: number;
  percentage: number;
}

export interface ExternalSalesChart {
  period: string; // 'daily', 'weekly', 'monthly'
  data: ExternalSalesChartData[];
}

export interface ExternalSalesChartData {
  date: string;
  sales: number;
  revenue: number;
  orders: number;
}

export interface ExternalRevenueChart {
  period: string;
  data: ExternalRevenueChartData[];
}

export interface ExternalRevenueChartData {
  date: string;
  revenue: number;
  profit: number;
  expenses: number;
}

export interface ExternalAnalyticsDashboard {
  salesAnalytics: ExternalSalesAnalytics;
  productAnalytics: ExternalProductAnalytics;
  salesChart: ExternalSalesChart;
  revenueChart: ExternalRevenueChart;
  lastUpdated: string;
}
