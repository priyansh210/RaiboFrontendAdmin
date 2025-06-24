import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Package, Star, Eye } from 'lucide-react';
import SellerSidebarLayout, { useSellerSidebar } from '../../components/seller/SellerSidebarLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../models/internal/Product';
import { productService } from '../../services/ProductService';
import { apiService } from '@/services/ApiService';
import { toast } from '@/hooks/use-toast';

const SellerProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { isSeller, user } = useAuth();
  const navigate = useNavigate();
  const { collapsed } = useSellerSidebar();

  useEffect(() => {
    if (!isSeller) {
      navigate('/');
      return;
    }

    const loadProducts = async () => {
      try {
        const allProducts = await productService.fetchProducts();
        // For now, show all products since we don't have seller filtering implemented
        // In a real app, you would filter by seller ID from the API
        setProducts(allProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [isSeller, navigate]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Simulating a delete operation
        // await apiService.deleteProduct(productId);
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
        toast({
          title: "Success",
          description: "Product deleted successfully",
          variant: "default",
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <SellerSidebarLayout>
      <div className="transition-all duration-300 min-h-screen bg-cream flex justify-center items-start py-10 px-2 sm:px-4">
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Products</h1>
            <Link to="/seller/products/add">
              <Button className="gap-2">
                <Plus size={16} /> Add Product
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="bg-white border-taupe/20 hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="aspect-square relative overflow-hidden rounded-t-lg">
                      <img
                        src={product.imageUrls[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        {product.featured && (
                          <Badge className="bg-terracotta text-white">Featured</Badge>
                        )}
                        {product.new && (
                          <Badge className="bg-olive text-white">New</Badge>
                        )}
                        {product.bestSeller && (
                          <Badge className="bg-umber text-white">Best Seller</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-charcoal line-clamp-1">{product.name}</h3>
                      <span className="text-terracotta font-semibold">${product.price}</span>
                    </div>
                    
                    <p className="text-earth text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-earth mb-4">
                      <span>Category: {product.category.name}</span>
                      <span>Stock: {product.quantity}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center">
                        <Star size={14} className="text-yellow-500 mr-1" />
                        <span>{product.averageRating.toFixed(1)} ({product.totalRatings})</span>
                      </div>
                      <div className="flex items-center">
                        <Eye size={14} className="text-earth mr-1" />
                        <span>{product.interactions.likes}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/seller/products/edit/${product.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-terracotta text-terracotta hover:bg-terracotta hover:text-white">
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-taupe mb-4" />
              <h3 className="text-xl font-medium text-charcoal mb-2">No products found</h3>
              <p className="text-earth mb-6">
                {searchQuery ? 'Try adjusting your search terms' : 'Start by adding your first product'}
              </p>
              <Link to="/seller/products/add">
                <Button className="bg-terracotta hover:bg-umber text-white">
                  <Plus size={16} className="mr-2" />
                  Add New Product
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </SellerSidebarLayout>
  );
};

export default SellerProducts;
