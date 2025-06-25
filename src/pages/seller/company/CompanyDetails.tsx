import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import SellerSidebarLayout from '../../../components/seller/SellerSidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { CompanyService } from '../../../services/CompanyService';
import { apiService } from '../../../services/ApiService';

const editableFields = [
  'name',
  'address',
  'locationLink',
  'description',
  'profilePhoto',
];

const CompanyDetails = () => {
  const { user, roles } = useAuth();
  const [form, setForm] = useState({
    name: '',
    profilePhoto: '',
    address: '',
    locationLink: '',
    description: '',
    code: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<typeof form>(form);
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    // Fetch company details (dummy for now)
    const fetchCompany = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with real API call
        const company = await CompanyService.getCompanyDetails(user?.companyId || '');
        setForm({
          name: company.name,
          profilePhoto: company.profilePhoto || '',
          address: company.address || '',
          locationLink: company.locationLink || '',
          description: company.description || '',
          code: company.code || user?.companyId || '',
        });
        setFieldValues({
          name: company.name,
          profilePhoto: company.profilePhoto || '',
          address: company.address || '',
          locationLink: company.locationLink || '',
          description: company.description || '',
          code: company.code || user?.companyId || '',
        });
      } catch (err) {
        setError('Failed to load company details');
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.companyId) fetchCompany();
  }, [user]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFieldValues({ ...fieldValues, [e.target.name]: e.target.value });
  };

  const handlePhotoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setPendingPhotoFile(files[0]);
      // Show preview immediately
      setFieldValues((prev) => ({ ...prev, profilePhoto: URL.createObjectURL(files[0]) }));
      toast({ title: 'Profile photo ready to save' });
    }
  };

  const handleFieldSave = async (field: string) => {
    setIsSubmitting(true);
    setError('');
    try {
      let value = fieldValues[field as keyof typeof fieldValues];
      if (field === 'profilePhoto' && pendingPhotoFile) {
        // Upload image only on save
        const url = await apiService.uploadImage(pendingPhotoFile);
        value = url;
        setPendingPhotoFile(null);
      }
      await CompanyService.updateCompanyDetails(user?.companyId || '', {
        [field]: value,
      });
      setForm((prev) => ({ ...prev, [field]: value }));
      setFieldValues((prev) => ({ ...prev, [field]: value }));
      setEditingField(null);
      toast({ title: 'Company details updated' });
    } catch (err) {
      setError('Failed to update company details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldCancel = (field: string) => {
    setFieldValues((prev) => ({ ...prev, [field]: form[field as keyof typeof form] }));
    setPendingPhotoFile(null);
    setEditingField(null);
  };

  if (isLoading) {
    return (
      <SellerSidebarLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta"></div>
        </div>
      </SellerSidebarLayout>
    );
  }

  return (
    <SellerSidebarLayout>
      <div className="transition-all duration-300 min-h-screen bg-cream flex justify-center items-start py-10 px-2 sm:px-4">
        <div className="w-full max-w-2xl">
          <Card className="bg-white border-taupe/20">
            <CardHeader>
              <CardTitle className="font-semibold text-2xl">Company Details</CardTitle>
            </CardHeader>
            <CardContent>
              {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-sm">{error}</div>}
              <form className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <img
                    src={editingField === 'profilePhoto' ? fieldValues.profilePhoto : form.profilePhoto || '/placeholder.svg'}
                    alt="Company Profile"
                    className="w-24 h-24 rounded-full object-cover border mb-2"
                  />
                  {editingField === 'profilePhoto' ? (
                    <>
                      <input type="file" accept="image/*" onChange={handlePhotoInput} />
                      <div className="flex gap-2 mt-2">
                        <Button type="button" size="sm" onClick={() => handleFieldSave('profilePhoto')} disabled={isSubmitting}>
                          {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => handleFieldCancel('profilePhoto')}>Cancel</Button>
                      </div>
                    </>
                  ) : (
                    <Button type="button" size="sm" variant="outline" onClick={() => setEditingField('profilePhoto')}>Edit Photo</Button>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-charcoal mb-1">Company Name</label>
                  <div className="flex gap-2 items-center">
                    <Input
                      name="name"
                      value={fieldValues.name}
                      onChange={handleFieldChange}
                      disabled={editingField !== 'name'}
                      required
                    />
                    {editingField === 'name' ? (
                      <>
                        <Button type="button" size="sm" onClick={() => handleFieldSave('name')} disabled={isSubmitting}>
                          {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => handleFieldCancel('name')}>Cancel</Button>
                      </>
                    ) : (
                      <Button type="button" size="sm" variant="outline" onClick={() => setEditingField('name')}>Edit</Button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-charcoal mb-1">Company Code</label>
                  <Input name="code" value={form.code} disabled />
                </div>
                <div>
                  <label className="block text-sm text-charcoal mb-1">Address</label>
                  <div className="flex gap-2 items-center">
                    <Input
                      name="address"
                      value={fieldValues.address}
                      onChange={handleFieldChange}
                      disabled={editingField !== 'address'}
                    />
                    {editingField === 'address' ? (
                      <>
                        <Button type="button" size="sm" onClick={() => handleFieldSave('address')} disabled={isSubmitting}>
                          {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => handleFieldCancel('address')}>Cancel</Button>
                      </>
                    ) : (
                      <Button type="button" size="sm" variant="outline" onClick={() => setEditingField('address')}>Edit</Button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-charcoal mb-1">Location Link</label>
                  <div className="flex gap-2 items-center">
                    <Input
                      name="locationLink"
                      value={fieldValues.locationLink}
                      onChange={handleFieldChange}
                      disabled={editingField !== 'locationLink'}
                    />
                    {editingField === 'locationLink' ? (
                      <>
                        <Button type="button" size="sm" onClick={() => handleFieldSave('locationLink')} disabled={isSubmitting}>
                          {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => handleFieldCancel('locationLink')}>Cancel</Button>
                      </>
                    ) : (
                      <Button type="button" size="sm" variant="outline" onClick={() => setEditingField('locationLink')}>Edit</Button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-charcoal mb-1">Description</label>
                  <div className="flex gap-2 items-center">
                    <textarea
                      name="description"
                      value={fieldValues.description}
                      onChange={handleFieldChange}
                      disabled={editingField !== 'description'}
                      className="w-full border rounded p-2"
                      rows={3}
                    />
                    {editingField === 'description' ? (
                      <>
                        <Button type="button" size="sm" onClick={() => handleFieldSave('description')} disabled={isSubmitting}>
                          {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => handleFieldCancel('description')}>Cancel</Button>
                      </>
                    ) : (
                      <Button type="button" size="sm" variant="outline" onClick={() => setEditingField('description')}>Edit</Button>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </SellerSidebarLayout>
  );
};

export default CompanyDetails;
