import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import SellerSidebarLayout from '../../../components/seller/SellerSidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { AnalyticsService } from '../../../services/AnalyticsService';
import { AnalyticsDashboard } from '../../../models/internal/AnalyticsInternalModels';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, TrendingDown, Package, ShoppingCart, DollarSign, Users } from 'lucide-react';

const Analytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const data = await AnalyticsService.getAnalyticsDashboard(user?.companyId || '');
        setAnalytics(data);
      } catch (err) {
        setError('Failed to load analytics data');
        toast({
          title: 'Error',
          description: 'Failed to load analytics data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.companyId) {
      fetchAnalytics();
    }
  }, [user]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  if (isLoading) {
    return (
      <SellerSidebarLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta"></div>
        </div>
      </SellerSidebarLayout>
    );
  }

  if (!analytics) {
    return (
      <SellerSidebarLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load analytics data</p>
          </div>
        </div>
      </SellerSidebarLayout>
    );
  }

  return (
    <SellerSidebarLayout>
      <div className="transition-all duration-300 min-h-screen bg-cream p-6">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-charcoal">Analytics Dashboard</h1>
              <p className="text-earth mt-2">
                Last updated: {analytics.lastUpdated.toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                  className="capitalize"
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-earth mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-charcoal">
                      {formatCurrency(analytics.salesAnalytics.totalRevenue)}
                    </p>
                    <div className="flex items-center mt-2">
                      {analytics.salesAnalytics.revenueGrowth >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm ${analytics.salesAnalytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(analytics.salesAnalytics.revenueGrowth)}%
                      </span>
                    </div>
                  </div>
                  <DollarSign className="w-8 h-8 text-terracotta" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-earth mb-1">Total Sales</p>
                    <p className="text-2xl font-bold text-charcoal">
                      {formatNumber(analytics.salesAnalytics.totalSales)}
                    </p>
                    <div className="flex items-center mt-2">
                      {analytics.salesAnalytics.salesGrowth >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm ${analytics.salesAnalytics.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(analytics.salesAnalytics.salesGrowth)}%
                      </span>
                    </div>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-terracotta" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-earth mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-charcoal">
                      {formatNumber(analytics.salesAnalytics.totalOrders)}
                    </p>
                    <p className="text-sm text-earth mt-2">
                      Avg: {formatCurrency(analytics.salesAnalytics.averageOrderValue)}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-terracotta" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-earth mb-1">Active Products</p>
                    <p className="text-2xl font-bold text-charcoal">
                      {analytics.productAnalytics.activeProducts}
                    </p>
                    <p className="text-sm text-earth mt-2">
                      of {analytics.productAnalytics.totalProducts} total
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-terracotta" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Chart */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl">Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.salesChart.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(value as number) : formatNumber(value as number),
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                    />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl">Revenue & Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.revenueChart.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value as number)]}
                    />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="profit" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Selling Products */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl">Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.productAnalytics.topSellingProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-cream/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-charcoal">{product.name}</p>
                          <p className="text-sm text-earth">{product.sales} sales</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-charcoal">{formatCurrency(product.revenue)}</p>
                        <p className="text-sm text-earth">#{index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl">Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.productAnalytics.categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ categoryName, percentage }) => `${categoryName} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="productCount"
                    >
                      {analytics.productAnalytics.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SellerSidebarLayout>
  );
};

export default Analytics;
