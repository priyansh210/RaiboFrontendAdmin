// Internal models for Analytics used in the app

export interface SalesAnalytics {
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  salesGrowth: number;
  revenueGrowth: number;
}

export interface ProductAnalytics {
  totalProducts: number;
  activeProducts: number;
  pendingProducts: number;
  rejectedProducts: number;
  topSellingProducts: TopProduct[];
  categoryDistribution: CategoryDistribution[];
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  imageUrl: string;
}

export interface CategoryDistribution {
  categoryId: string;
  categoryName: string;
  productCount: number;
  percentage: number;
}

export interface SalesChart {
  period: 'daily' | 'weekly' | 'monthly';
  data: SalesChartData[];
}

export interface SalesChartData {
  date: string;
  sales: number;
  revenue: number;
  orders: number;
}

export interface RevenueChart {
  period: 'daily' | 'weekly' | 'monthly';
  data: RevenueChartData[];
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  profit: number;
  expenses: number;
}

export interface AnalyticsDashboard {
  salesAnalytics: SalesAnalytics;
  productAnalytics: ProductAnalytics;
  salesChart: SalesChart;
  revenueChart: RevenueChart;
  lastUpdated: Date;
}
