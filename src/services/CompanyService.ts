import { apiService } from '@/services/ApiService';
import { ExternalShop } from '../models/external/ShopExternalModels';
import { Shop } from '../models/internal/ShopInternalModels';
import { ShopMapper } from '../mappers/ShopMapper';

// Service for company/shop-related logic
export const CompanyService = {
  /**
   * Fetch all shops and map to internal model.
   */
  getAllShops: async (): Promise<Shop[]> => {
    const externalShops: ExternalShop[] = await apiService.getAllShops();
    return ShopMapper.toInternalList(externalShops);
  },
  /**
   * Fetch a shop by ID and map to internal model.
   */
  getShopById: async (shopId: string): Promise<Shop | undefined> => {
    const externalShop: ExternalShop | undefined = await apiService.getShopById(shopId);
    return externalShop ? ShopMapper.toInternal(externalShop) : undefined;
  },
  /**
   * Create a new shop and map to internal model.
   */
  createShop: async (shopData: Omit<Shop, 'id'>): Promise<Shop> => {
    try {
      const externalShop = await apiService.createShop(shopData);
      return ShopMapper.toInternal(externalShop);
    } catch (error) {
      throw new Error('Failed to create shop');
    }
  },
  /**
   * Update an existing shop and map to internal model.
   */
  updateShop: async (shopId: string, shopData: Partial<Shop>): Promise<Shop> => {
    try {
      const externalShop = await apiService.updateShop(shopId, shopData);
      return ShopMapper.toInternal(externalShop);
    } catch (error) {
      throw new Error('Failed to update shop');
    }
  },
  /**
   * Get company details and map to internal model.
   */
  getCompanyDetails: async (companyId: string) => {
    try {
      return await apiService.getCompanyDetails(companyId);
    } catch (error) {
      throw new Error('Failed to fetch company details');
    }
  },
  /**
   * Update company details.
   */
  updateCompanyDetails: async (companyId: string, data: any) => {
    try {
      return await apiService.updateCompanyDetails(companyId, data);
    } catch (error) {
      throw new Error('Failed to update company details');
    }
  },
  /**
   * Upload company profile photo.
   */
  uploadCompanyPhoto: async (file: File) => {
    try {
      return await apiService.uploadCompanyPhoto(file);
    } catch (error) {
      throw new Error('Failed to upload company photo');
    }
  },
};
