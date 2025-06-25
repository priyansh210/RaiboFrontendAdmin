import React, { useEffect, useState } from 'react';
import { CompanyService } from '../../../services/CompanyService';
import { Shop } from '../../../models/internal/ShopInternalModels';
import SellerSidebarLayout, { useSellerSidebar } from '../../../components/seller/SellerSidebarLayout';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Shops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { collapsed } = useSellerSidebar();
  const { user, roles } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !roles.includes('seller')) {
      navigate('/', { replace: true });
    }
  }, [user, roles, navigate]);

  useEffect(() => {
    CompanyService.getAllShops()
      .then((data) => setShops(data))
      .finally(() => setLoading(false));
  }, []);

  const filteredShops = shops.filter((shop) =>
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SellerSidebarLayout>
      <div className="transition-all duration-300 min-h-screen bg-cream flex justify-center items-start py-10 px-2 sm:px-4">
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Shops</h2>
            <Link to="/seller/shops/create">
              <Button variant="outline" className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white">
                + Add New Shop
              </Button>
            </Link>
          </div>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search shops..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {/* Shops Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta"></div>
            </div>
          ) : filteredShops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShops.map((shop) => (
                <Card key={shop.id} className="bg-white border-taupe/20 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="font-semibold">{shop.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 text-sm text-gray-600">Location: {shop.location}</div>
                    <div className="mb-2 text-sm text-gray-600">Owner: {shop.owner}</div>
                    <div className="mb-2 text-sm text-gray-600">Contact: {shop.contact}</div>
                    <div className="mb-2 text-sm text-gray-600 line-clamp-2">Description: {shop.description}</div>
                    <div className="flex justify-end gap-2">
                      <Link to={`/seller/shops/${shop.id}`}>
                        <Button variant="outline" size="sm" className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white flex items-center gap-1">
                          <Eye size={14} />
                          View Details
                        </Button>
                      </Link>
                      <Link to={`/seller/shops/${shop.id}/edit`}>
                        <Button variant="outline" size="sm" className="border-taupe text-taupe hover:bg-taupe hover:text-white flex items-center gap-1">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-charcoal mb-2">No shops found</h3>
              <p className="text-earth mb-6">
                {searchQuery ? 'Try adjusting your search terms' : 'You have not added any shops yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </SellerSidebarLayout>
  );
};

export default Shops;
