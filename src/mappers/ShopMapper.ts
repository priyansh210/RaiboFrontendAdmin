import { ExternalShop } from '../models/external/ShopExternalModels';
import { Shop } from '../models/internal/ShopInternalModels';

export class ShopMapper {
  static toInternal(external: ExternalShop): Shop {
    return {
      id: external.id,
      name: external.name,
      location: external.location,
      owner: external.owner,
      contact: external.contact,
      description: external.description,
    };
  }

  static toInternalList(externals: ExternalShop[]): Shop[] {
    return externals.map(this.toInternal);
  }
}
