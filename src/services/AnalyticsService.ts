import { apiService } from '@/services/ApiService';
import { 
  ExternalAnalyticsDashboard, 
  ExternalSalesAnalytics, 
  ExternalProductAnalytics 
} from '../models/external/AnalyticsExternalModels';
import { 
  AnalyticsDashboard, 
  SalesAnalytics, 
  ProductAnalytics 
} from '../models/internal/AnalyticsInternalModels';
import { AnalyticsMapper } from '../mappers/AnalyticsMapper';

// Service for analytics-related logic
export const AnalyticsService = {
  /**
   * Get analytics dashboard data and map to internal model.
   */
  getAnalyticsDashboard: async (companyId: string): Promise<AnalyticsDashboard> => {
    try {
      const externalData: ExternalAnalyticsDashboard = await apiService.getAnalyticsDashboard(companyId);
      return AnalyticsMapper.toInternalAnalyticsDashboard(externalData);
    } catch (error) {
      throw new Error('Failed to fetch analytics dashboard');
    }
  },

  /**
   * Get sales analytics and map to internal model.
   */
  getSalesAnalytics: async (companyId: string, period: string = 'monthly'): Promise<SalesAnalytics> => {
    try {
      const externalData: ExternalSalesAnalytics = await apiService.getSalesAnalytics(companyId, period);
      return AnalyticsMapper.toInternalSalesAnalytics(externalData);
    } catch (error) {
      throw new Error('Failed to fetch sales analytics');
    }
  },

  /**
   * Get product analytics and map to internal model.
   */
  getProductAnalytics: async (companyId: string): Promise<ProductAnalytics> => {
    try {
      const externalData: ExternalProductAnalytics = await apiService.getProductAnalytics(companyId);
      return AnalyticsMapper.toInternalProductAnalytics(externalData);
    } catch (error) {
      throw new Error('Failed to fetch product analytics');
    }
  },
};
