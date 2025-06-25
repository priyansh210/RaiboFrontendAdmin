import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CompanyService } from '../../../services/CompanyService';
import SellerSidebarLayout from '../../../components/seller/SellerSidebarLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shop } from '../../../models/internal/ShopInternalModels';
import { useAuth } from '../../../context/AuthContext';

const EditShop = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [form, setForm] = useState<Partial<Shop>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, roles } = useAuth();

  useEffect(() => {
    if (!user || !roles.includes('seller')) {
      navigate('/', { replace: true });
    }
  }, [user, roles, navigate]);

  useEffect(() => {
    if (shopId) {
      CompanyService.getShopById(shopId)
        .then((shop) => setForm(shop))
        .catch(() => setError('Shop not found'))
        .finally(() => setLoading(false));
    }
  }, [shopId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (shopId) {
        await CompanyService.updateShop(shopId, form);
        navigate('/seller/company/shops');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update shop');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SellerSidebarLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta"></div>
        </div>
      </SellerSidebarLayout>
    );
  }

  if (error) {
    return (
      <SellerSidebarLayout>
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-charcoal mb-2">{error}</h3>
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
              <CardTitle className="font-semibold text-2xl">Edit Shop</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="name" placeholder="Shop Name" value={form.name || ''} onChange={handleChange} required />
                <Input name="location" placeholder="Location" value={form.location || ''} onChange={handleChange} required />
                <Input name="owner" placeholder="Owner" value={form.owner || ''} onChange={handleChange} required />
                <Input name="contact" placeholder="Contact" value={form.contact || ''} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={form.description || ''} onChange={handleChange} className="w-full border rounded p-2" rows={3} required />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <Button type="submit" disabled={saving} className="w-full">{saving ? 'Saving...' : 'Save Changes'}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </SellerSidebarLayout>
  );
};

export default EditShop;
