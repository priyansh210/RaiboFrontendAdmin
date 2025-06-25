import React, { useEffect } from 'react';
import SellerSidebarLayout, { useSellerSidebar } from '../../components/seller/SellerSidebarLayout';
import { BarChart3, Package, ShoppingBag, Star, Users } from 'lucide-react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SellerDashboard = () => {
  const { collapsed } = useSellerSidebar();
  const { user, isSeller } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isSeller) {
      navigate('/', { replace: true });
    }
  }, [user, isSeller, navigate]);

  return (
    <SellerSidebarLayout>
      <div className="min-h-screen bg-cream w-full py-8 px-4 sm:px-6">
        <h1 className="font-playfair text-2xl md:text-3xl text-charcoal mb-6">Seller Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-sm shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-terracotta/10 p-3 rounded-full">
                <ShoppingBag className="h-5 w-5 text-terracotta" />
              </div>
              <div>
                <p className="text-earth text-sm">Total Orders</p>
                <h3 className="text-xl font-medium text-charcoal">257</h3>
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600">↑ 12% from last month</div>
          </div>

          <div className="bg-white p-4 rounded-sm shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-terracotta/10 p-3 rounded-full">
                <Package className="h-5 w-5 text-terracotta" />
              </div>
              <div>
                <p className="text-earth text-sm">Products</p>
                <h3 className="text-xl font-medium text-charcoal">42</h3>
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600">↑ 3 new products</div>
          </div>

          <div className="bg-white p-4 rounded-sm shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-terracotta/10 p-3 rounded-full">
                <Star className="h-5 w-5 text-terracotta" />
              </div>
              <div>
                <p className="text-earth text-sm">Avg. Rating</p>
                <h3 className="text-xl font-medium text-charcoal">4.8/5</h3>
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600">↑ 0.2 from last month</div>
          </div>

          <div className="bg-white p-4 rounded-sm shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-terracotta/10 p-3 rounded-full">
                <Users className="h-5 w-5 text-terracotta" />
              </div>
              <div>
                <p className="text-earth text-sm">Customers</p>
                <h3 className="text-xl font-medium text-charcoal">129</h3>
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600">↑ 18 new customers</div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-sm shadow-sm mb-8">
          <h2 className="text-xl text-charcoal mb-4">Recent Orders</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-earth">Order ID</th>
                  <th className="text-left py-3 px-2 font-medium text-earth">Customer</th>
                  <th className="text-left py-3 px-2 font-medium text-earth">Products</th>
                  <th className="text-left py-3 px-2 font-medium text-earth">Date</th>
                  <th className="text-left py-3 px-2 font-medium text-earth">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-earth">Total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'ORD-7293', customer: 'Emma Thompson', products: 3, date: 'Apr 8, 2025', status: 'Shipped', total: '$327.49' },
                  { id: 'ORD-7292', customer: 'James Wilson', products: 2, date: 'Apr 7, 2025', status: 'Processing', total: '$129.99' },
                  { id: 'ORD-7291', customer: 'Sophia Rodriguez', products: 1, date: 'Apr 7, 2025', status: 'Delivered', total: '$259.00' },
                  { id: 'ORD-7290', customer: 'Liam Johnson', products: 4, date: 'Apr 6, 2025', status: 'Delivered', total: '$482.75' },
                  { id: 'ORD-7289', customer: 'Olivia Davis', products: 2, date: 'Apr 5, 2025', status: 'Delivered', total: '$189.50' },
                ].map((order) => (
                  <tr key={order.id} className="border-b border-taupe/10 hover:bg-linen/50">
                    <td className="py-3 px-2">{order.id}</td>
                    <td className="py-3 px-2">{order.customer}</td>
                    <td className="py-3 px-2">{order.products}</td>
                    <td className="py-3 px-2">{order.date}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-medium">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics & Products Two-Column Layout for larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales Chart - Takes 2/3 on large screens */}
          <div className="bg-white p-6 rounded-sm shadow-sm lg:col-span-2">
            <h2 className="text-xl text-charcoal mb-4">Sales Overview</h2>
            <div className="h-64 flex items-center justify-center bg-linen rounded-sm">
              <div className="flex flex-col items-center">
                <BarChart3 className="h-12 w-12 text-earth mb-3" />
                <p className="text-earth text-sm mb-1">Sales Analytics Chart</p>
                <p className="text-xs text-earth/70">Demo data visualization would appear here</p>
              </div>
            </div>
          </div>

          {/* Products Grid - Takes 1/3 on large screens */}
          <div className="bg-white p-6 rounded-sm shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-charcoal">Top Products</h2>
              <Link to="/seller/products" className="text-sm text-terracotta hover:underline">View All</Link>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Modern Armchair', category: 'Furniture', price: '$299.99', stock: 15, sold: 127 },
                { name: 'Ceramic Vase Set', category: 'Decor', price: '$79.99', stock: 32, sold: 98 },
                { name: 'Oak Coffee Table', category: 'Furniture', price: '$249.00', stock: 9, sold: 87 },
              ].map((product, index) => (
                <div key={index} className="flex items-center border border-taupe/20 rounded-sm p-3">
                  <div className="h-12 w-12 flex items-center justify-center bg-linen rounded-sm mr-3">
                    <Package className="h-5 w-5 text-earth" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-charcoal">{product.name}</h3>
                    <div className="flex justify-between">
                      <span className="text-sm text-earth">{product.category}</span>
                      <span className="text-sm font-medium">{product.price}</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">{product.sold} sold</p>
                  </div>
                </div>
              ))}

              <Link
                to="/seller/products"
                className="w-full block py-2 text-center text-sm text-terracotta hover:bg-terracotta/5 rounded-sm border border-dashed border-terracotta/30"
              >
                View All Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SellerSidebarLayout>
  );
};

export default SellerDashboard;

// Add this route redirection logic for Products
// In your App.tsx (or wherever your routes are defined), ensure:
// <Route path="/seller/inventory/products" element={<Navigate to="/seller/products" replace />} />
// This ensures the sidebar "Products" under "Inventory" redirects to the SellerProducts page.
// And make sure all dummy pages are wrapped with SellerSidebarLayout, e.g.:
// <Route path="/seller/inventory/forecast" element={<SellerSidebarLayout><Forecast /></SellerSidebarLayout>} />
