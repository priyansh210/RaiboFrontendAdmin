import { ExternalShop, Shop } from './ShopModels';

export class ShopMapper {
  static toInternal(external: ExternalShop): Shop {
    // Direct mapping, but can be extended for transformation
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
