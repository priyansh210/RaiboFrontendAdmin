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
};
