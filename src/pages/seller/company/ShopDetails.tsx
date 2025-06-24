import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SellerSidebarLayout from '../../../components/seller/SellerSidebarLayout';
import { CompanyService } from '../../../services/CompanyService';
import { Shop } from '../../../models/internal/ShopInternalModels';
import { Button } from '@/components/ui/button';

const ShopDetails = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shopId) {
      CompanyService.getAllShops()
        .then((shops) => setShop(shops.find((s) => s.id === shopId) || null))
        .finally(() => setLoading(false));
    }
  }, [shopId]);

  return (
    <SellerSidebarLayout>
      <div className="max-w-2xl mx-auto p-8">
        <Link to="/seller/shops">
          <Button variant="outline" className="mb-4">&larr; Back to Shops</Button>
        </Link>
        {loading ? (
          <div>Loading shop details...</div>
        ) : shop ? (
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-2xl font-bold mb-2">{shop.name}</h2>
            <div className="mb-2 text-gray-700">Location: {shop.location}</div>
            <div className="mb-2 text-gray-700">Owner: {shop.owner}</div>
            <div className="mb-2 text-gray-700">Contact: {shop.contact}</div>
            <div className="mb-2 text-gray-700">Description: {shop.description}</div>
            {/* Add more details or actions here */}
          </div>
        ) : (
          <div>Shop not found.</div>
        )}
      </div>
    </SellerSidebarLayout>
  );
};

export default ShopDetails;
