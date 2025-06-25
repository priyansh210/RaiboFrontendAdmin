import { 
  ExternalSalesAnalytics, 
  ExternalProductAnalytics, 
  ExternalSalesChart, 
  ExternalRevenueChart, 
  ExternalAnalyticsDashboard,
  ExternalTopProduct,
  ExternalCategoryDistribution,
  ExternalSalesChartData,
  ExternalRevenueChartData
} from '../models/external/AnalyticsExternalModels';

import { 
  SalesAnalytics, 
  ProductAnalytics, 
  SalesChart, 
  RevenueChart, 
  AnalyticsDashboard,
  TopProduct,
  CategoryDistribution,
  SalesChartData,
  RevenueChartData
} from '../models/internal/AnalyticsInternalModels';

export const AnalyticsMapper = {
  /**
   * Map external sales analytics to internal model
   */
  toInternalSalesAnalytics: (external: ExternalSalesAnalytics): SalesAnalytics => ({
    totalSales: external.totalSales,
    totalRevenue: external.totalRevenue,
    totalOrders: external.totalOrders,
    averageOrderValue: external.averageOrderValue,
    salesGrowth: external.salesGrowth,
    revenueGrowth: external.revenueGrowth,
  }),

  /**
   * Map external product analytics to internal model
   */
  toInternalProductAnalytics: (external: ExternalProductAnalytics): ProductAnalytics => ({
    totalProducts: external.totalProducts,
    activeProducts: external.activeProducts,
    pendingProducts: external.pendingProducts,
    rejectedProducts: external.rejectedProducts,
    topSellingProducts: external.topSellingProducts.map(AnalyticsMapper.toInternalTopProduct),
    categoryDistribution: external.categoryDistribution.map(AnalyticsMapper.toInternalCategoryDistribution),
  }),

  /**
   * Map external top product to internal model
   */
  toInternalTopProduct: (external: ExternalTopProduct): TopProduct => ({
    id: external.id,
    name: external.name,
    sales: external.sales,
    revenue: external.revenue,
    imageUrl: external.imageUrl,
  }),

  /**
   * Map external category distribution to internal model
   */
  toInternalCategoryDistribution: (external: ExternalCategoryDistribution): CategoryDistribution => ({
    categoryId: external.categoryId,
    categoryName: external.categoryName,
    productCount: external.productCount,
    percentage: external.percentage,
  }),

  /**
   * Map external sales chart to internal model
   */
  toInternalSalesChart: (external: ExternalSalesChart): SalesChart => ({
    period: external.period as 'daily' | 'weekly' | 'monthly',
    data: external.data.map(AnalyticsMapper.toInternalSalesChartData),
  }),

  /**
   * Map external sales chart data to internal model
   */
  toInternalSalesChartData: (external: ExternalSalesChartData): SalesChartData => ({
    date: external.date,
    sales: external.sales,
    revenue: external.revenue,
    orders: external.orders,
  }),

  /**
   * Map external revenue chart to internal model
   */
  toInternalRevenueChart: (external: ExternalRevenueChart): RevenueChart => ({
    period: external.period as 'daily' | 'weekly' | 'monthly',
    data: external.data.map(AnalyticsMapper.toInternalRevenueChartData),
  }),

  /**
   * Map external revenue chart data to internal model
   */
  toInternalRevenueChartData: (external: ExternalRevenueChartData): RevenueChartData => ({
    date: external.date,
    revenue: external.revenue,
    profit: external.profit,
    expenses: external.expenses,
  }),

  /**
   * Map external analytics dashboard to internal model
   */
  toInternalAnalyticsDashboard: (external: ExternalAnalyticsDashboard): AnalyticsDashboard => ({
    salesAnalytics: AnalyticsMapper.toInternalSalesAnalytics(external.salesAnalytics),
    productAnalytics: AnalyticsMapper.toInternalProductAnalytics(external.productAnalytics),
    salesChart: AnalyticsMapper.toInternalSalesChart(external.salesChart),
    revenueChart: AnalyticsMapper.toInternalRevenueChart(external.revenueChart),
    lastUpdated: new Date(external.lastUpdated),
  }),
};
