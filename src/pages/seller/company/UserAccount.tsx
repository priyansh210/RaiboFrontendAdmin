import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import SellerSidebarLayout from '../../../components/seller/SellerSidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const UserAccount = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      // TODO: Add API call to update user profile
      setIsEditing(false);
      toast({ title: 'Profile updated' });
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SellerSidebarLayout>
      <div className="transition-all duration-300 min-h-screen bg-cream flex justify-center items-start py-10 px-2 sm:px-4">
        <div className="w-full max-w-2xl">
          <Card className="bg-white border-taupe/20">
            <CardHeader>
              <CardTitle className="font-semibold text-2xl">User Account</CardTitle>
            </CardHeader>
            <CardContent>
              {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-sm">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-charcoal mb-1">First Name</label>
                  <Input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm text-charcoal mb-1">Last Name</label>
                  <Input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm text-charcoal mb-1">Email</label>
                  <Input
                    name="email"
                    value={form.email}
                    disabled
                  />
                </div>
                <div className="flex gap-4 justify-end">
                  {isEditing ? (
                    <>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </SellerSidebarLayout>
  );
};

export default UserAccount;
