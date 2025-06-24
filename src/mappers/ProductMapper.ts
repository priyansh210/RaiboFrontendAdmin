import { boolean } from 'zod';
import { ExternalProductDetailSellerResponse, ExternalProductResponse } from '../models/external/ProductModels';
import { Product, ProductDetailSeller } from '../models/internal/Product';
import { ProductSummary } from '../models/internal/Product';

export class ProductMapper {

  static mapExternalProductToProductCard(external: ExternalProductResponse): ProductSummary {
    return {
      _id: external._id,
      name: external.name,
      description: external.description,
      price: external.price,
      categoryName: external.category_id?.name ?? '',
      companyName: external.company_id?.name ?? '',
      tags: [], // You can map tags if available in external
      imageUrls: external.imageUrls && external.imageUrls.length > 0 ? external.imageUrls : external.images,
      isLikedByUser: external.isLikedByUser, // Set based on user interaction if available
      likesCount: external.likesCount ?? 0, // Or use another field if available
      commentsCount: external.comments.length ?? 0, // Or use another field if available
    };
  }

  static mapExternalProductListToProductCardList(externals: ExternalProductResponse[]): ProductSummary[] {
    return externals.map(ProductMapper.mapExternalProductToProductCard);
  }

  static mapExternalToProduct(external: ExternalProductResponse): Product {
    if (!external || !external._id || !external.name || !external.company_id) {
      throw new Error('Invalid external product response');
    }

    const imageUrls = external.imageUrls || [];
    const displayImage = imageUrls.length > 0 ? imageUrls[0] : '';

    return {
      id: external._id,
      name: external.name,
      description: external.description || '',
      price: external.price || 0,
      quantity: external.quantity || 0,
      category: {
        id: external.category_id._id,
        name: external.category_id.name,
      },
      company: {
        id: external.company_id._id,
        name: external.company_id.name,
        email: external.company_id.email,
        address: external.company_id.address,
      },
      images: external.imageUrls, // Legacy field
      imageUrls, // New field for storing image URLs
      displayImage, // First image from imageUrls
      discount: external.discount || 0,
      discountValidUntil: external.discount_valid_until ? new Date(external.discount_valid_until) : null,
      averageRating: external.average_rating || 0,
      totalRatings: external.total_ratings || 0,
      version: external.__v || 0,
      interactions: this.generateInteractions(external.isLikedByUser, external.likesCount),
      userPreferences: this.generateDefaultUserPreferences(),
      // Add dummy values for display properties
      featured: Math.random() > 0.8, // 20% chance of being featured
      new: Math.random() > 0.7, // 30% chance of being new
      bestSeller: Math.random() > 0.8, // 20% chance of being bestseller
      // Legacy compatibility
      brand: external.company_id.name,
      colors: this.generateDefaultUserPreferences().preferredColors,
      subcategory: external.category_id.name,
    };
  }

  static mapProductsArrayFromExternal(externals: ExternalProductResponse[]): Product[] {
    return externals.map(external => this.mapExternalToProduct(external));
  }

  static mapExternalProductDetailSellerToInternal(external: ExternalProductDetailSellerResponse): ProductDetailSeller {
    return {
      id: external._id,
      name: external.name,
      description: external.description,
      price: external.price,
      quantity: external.quantity,
      category: {
        id: external.category?._id || '',
        name: external.category?.name || '',
      },
      company: {
        id: external.company?._id || '',
        name: external.company?.name || '',
        email: external.company?.email || '',
        address: external.company?.address || '',
      },
      images: external.images || [],
      imageUrls: external.imageUrls || [],
      displayImage: external.displayImage,
      discount: external.discount,
      discountValidUntil: external.discountValidUntil ? new Date(external.discountValidUntil) : null,
      averageRating: external.averageRating,
      totalRatings: external.totalRatings,
      version: external.version,
      interactions: external.interactions,
      userPreferences: external.userPreferences,
      featured: external.featured,
      new: external.new,
      bestSeller: external.bestSeller,
      brand: external.brand,
      colors: external.colors,
      subcategory: external.subcategory,
      status: external.status,
      rejectionReason: external.rejectionReason,
      createdAt: new Date(external.createdAt),
      updatedAt: new Date(external.updatedAt),
      salesCount: external.salesCount,
      viewsCount: external.viewsCount,
      isActive: external.isActive,
      model3dUrl: external.model3dUrl,
      featureMap: external.featureMap,
    };
  }
  private static generateInteractions(userHasLiked: boolean = false, likesCount: number = 0) {
    return {
      likes: likesCount,
      shares: Math.floor(Math.random() * 100) + 5,
      comments: [],
      userHasLiked: userHasLiked,
      userHasShared: false,
    };
  }

  private static generateDefaultUserPreferences() {
    const colors = [
      { name: 'Natural', code: '#F5E6D3' },
      { name: 'Charcoal', code: '#2C2C2C' },
      { name: 'White', code: '#FFFFFF' },
      { name: 'Brown', code: '#8B4513' },
    ];

    return {
      preferredColors: colors.slice(0, Math.floor(Math.random() * 3) + 1),
      preferredQuantity: 1,
    };
  }
}
