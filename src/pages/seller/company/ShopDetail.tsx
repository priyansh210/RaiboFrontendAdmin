import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Shop } from '../../../models/internal/ShopInternalModels';
import { CompanyService } from '../../../services/CompanyService';
import SellerSidebarLayout from '../../../components/seller/SellerSidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../../context/AuthContext';

const ShopDetail = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, roles } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !roles.includes('seller')) {
      navigate('/', { replace: true });
    }
  }, [user, roles, navigate]);

  useEffect(() => {
    if (shopId) {
      CompanyService.getShopById(shopId)
        .then(setShop)
        .finally(() => setLoading(false));
    }
  }, [shopId]);

  if (loading) {
    return (
      <SellerSidebarLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta"></div>
        </div>
      </SellerSidebarLayout>
    );
  }

  if (!shop) {
    return (
      <SellerSidebarLayout>
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-charcoal mb-2">Shop not found</h3>
          <Link to="/seller/company/shops">
            <Button variant="outline">Back to Shops</Button>
          </Link>
        </div>
      </SellerSidebarLayout>
    );
  }

  return (
    <SellerSidebarLayout>
      <div className="min-h-screen bg-cream flex justify-center items-start py-10 px-2 sm:px-4">
        <div className="w-full max-w-2xl">
          <Card className="bg-white border-taupe/20">
            <CardHeader>
              <CardTitle className="font-semibold text-2xl">{shop.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-sm text-gray-600">Location: {shop.location}</div>
              <div className="mb-2 text-sm text-gray-600">Owner: {shop.owner}</div>
              <div className="mb-2 text-sm text-gray-600">Contact: {shop.contact}</div>
              <div className="mb-2 text-sm text-gray-600">Description: {shop.description}</div>
              <div className="flex gap-2 mt-4">
                <Link to={`/seller/shops/${shop.id}/edit`}>
                  <Button variant="outline">Edit Shop</Button>
                </Link>
                <Link to="/seller/company/shops">
                  <Button variant="outline">Back to Shops</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SellerSidebarLayout>
  );
};

export default ShopDetail;
