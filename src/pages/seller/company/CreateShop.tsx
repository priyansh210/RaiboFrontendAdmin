import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyService } from '../../../services/CompanyService';
import SellerSidebarLayout from '../../../components/seller/SellerSidebarLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../../../context/AuthContext';

const CreateShop = () => {
  const [form, setForm] = useState({
    name: '',
    location: '',
    owner: '',
    contact: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, roles } = useAuth();

  useEffect(() => {
    if (!user || !roles.includes('seller')) {
      navigate('/', { replace: true });
    }
  }, [user, roles, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await CompanyService.createShop(form);
      navigate('/seller/shops');
    } catch (err: any) {
      setError(err.message || 'Failed to create shop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SellerSidebarLayout>
      <div className="min-h-screen bg-cream flex justify-center items-start py-10 px-2 sm:px-4">
        <div className="w-full max-w-2xl">
          <Card className="bg-white border-taupe/20">
            <CardHeader>
              <CardTitle className="font-semibold text-2xl">Create Shop</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="name" placeholder="Shop Name" value={form.name} onChange={handleChange} required />
                <Input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
                <Input name="owner" placeholder="Owner" value={form.owner} onChange={handleChange} required />
                <Input name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full border rounded p-2" rows={3} required />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <Button type="submit" disabled={loading} className="w-full">{loading ? 'Creating...' : 'Create Shop'}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </SellerSidebarLayout>
  );
};

export default CreateShop;
