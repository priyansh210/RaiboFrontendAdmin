import React, { useEffect, useState } from 'react';
import { CompanyService, Shop } from '../../../services/CompanyService';

const Shops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CompanyService.getAllShops()
      .then((data) => setShops(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading shops...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">My Shops</h2>
      {shops.length === 0 ? (
        <div>No shops found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shops.map((shop) => (
            <div key={shop.id} className="bg-white rounded shadow p-4">
              <h3 className="text-lg font-semibold mb-2">{shop.name}</h3>
              <p className="text-sm text-gray-600 mb-1">Location: {shop.location}</p>
              <p className="text-sm text-gray-600 mb-1">Owner: {shop.owner}</p>
              <p className="text-sm text-gray-600 mb-1">Contact: {shop.contact}</p>
              <p className="text-sm text-gray-600">Description: {shop.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shops;
