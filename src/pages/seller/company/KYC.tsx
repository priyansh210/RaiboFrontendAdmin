import React, { useState } from 'react';
import { apiService } from '@/services/ApiService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import SellerSidebarLayout from '@/components/seller/SellerSidebarLayout';
import { X, Upload } from 'lucide-react';

const initialState = {
  companyName: '',
  registrationNumber: '',
  taxId: '',
  companyType: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
};

type SupportingDoc = {
  type: string;
  description: string;
  file: File | null;
};

export default function KYCPage() {
  const [form, setForm] = useState(initialState);
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);
  const [registrationDoc, setRegistrationDoc] = useState<File | null>(null);
  const [taxDoc, setTaxDoc] = useState<File | null>(null);
  const [supportingDocs, setSupportingDocs] = useState<SupportingDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompanyLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCompanyLogo(e.target.files[0]);
      setCompanyLogoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const removeCompanyLogo = () => {
    setCompanyLogo(null);
    setCompanyLogoPreview(null);
  };

  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<File | null>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setter(e.target.files[0]);
      }
    };

  const handleSupportingDocChange = (idx: number, field: keyof SupportingDoc, value: any) => {
    setSupportingDocs(prev =>
      prev.map((doc, i) => (i === idx ? { ...doc, [field]: value } : doc))
    );
  };

  const handleSupportingDocFile = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSupportingDocChange(idx, 'file', e.target.files[0]);
    }
  };

  const addSupportingDocRow = () => {
    setSupportingDocs(prev => [...prev, { type: '', description: '', file: null }]);
  };

  const removeSupportingDocRow = (idx: number) => {
    setSupportingDocs(prev => prev.filter((_, i) => i !== idx));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (companyLogo) formData.append('companyLogo', companyLogo);
      if (registrationDoc) formData.append('registrationDoc', registrationDoc);
      if (taxDoc) formData.append('taxDoc', taxDoc);
      supportingDocs.forEach((doc, idx) => {
        if (doc.file) {
          formData.append(`supportingDocs[${idx}][file]`, doc.file);
          formData.append(`supportingDocs[${idx}][type]`, doc.type);
          formData.append(`supportingDocs[${idx}][description]`, doc.description);
        }
      });

      await apiService.submitKYC(formData);
      setSuccess(true);
      toast({
        title: 'KYC Submitted',
        description: 'Your KYC has been submitted successfully.',
      });
      setForm(initialState);
      setCompanyLogo(null);
      setCompanyLogoPreview(null);
      setRegistrationDoc(null);
      setTaxDoc(null);
      setSupportingDocs([]);
    } catch (err: any) {
      setError(err.message || 'Submission failed');
      toast({
        title: 'Error',
        description: err.message || 'Submission failed',
        variant: 'destructive',
      });
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
              <CardTitle className="text-charcoal text-2xl font-bold">Seller KYC Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input id="companyName" name="companyName" value={form.companyName} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="registrationNumber">Registration Number *</Label>
                    <Input id="registrationNumber" name="registrationNumber" value={form.registrationNumber} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="taxId">Tax ID / GST Number *</Label>
                    <Input id="taxId" name="taxId" value={form.taxId} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="companyType">Company Type *</Label>
                    <select
                      id="companyType"
                      name="companyType"
                      value={form.companyType}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-md px-3 py-2 mt-1"
                    >
                      <option value="">Select</option>
                      <option value="Private">Private</option>
                      <option value="Public">Public</option>
                      <option value="Partnership">Partnership</option>
                      <option value="LLP">LLP</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input id="address" name="address" value={form.address} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" value={form.city} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" name="state" value={form.state} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="zip">Zip *</Label>
                    <Input id="zip" name="zip" value={form.zip} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input id="country" name="country" value={form.country} onChange={handleChange} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactName">Contact Person Name *</Label>
                    <Input id="contactName" name="contactName" value={form.contactName} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input id="contactEmail" name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Contact Phone *</Label>
                    <Input id="contactPhone" name="contactPhone" value={form.contactPhone} onChange={handleChange} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="companyLogo">Company Logo/Image</Label>
                  <div className="flex items-center gap-4 mt-1">
                    <Input
                      id="companyLogo"
                      type="file"
                      accept="image/*"
                      onChange={handleCompanyLogoChange}
                      className="w-auto"
                    />
                    {companyLogoPreview && (
                      <div className="relative">
                        <img
                          src={companyLogoPreview}
                          alt="Company Logo"
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={removeCompanyLogo}
                          className="absolute -top-2 -right-2"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                  {companyLogo && !companyLogoPreview && (
                    <div className="text-xs text-green-700 mt-1">{companyLogo.name}</div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="registrationDoc">Company Registration Document *</Label>
                    <Input id="registrationDoc" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange(setRegistrationDoc)} required />
                    {registrationDoc && <div className="text-xs text-green-700 mt-1">{registrationDoc.name}</div>}
                  </div>
                  <div>
                    <Label htmlFor="taxDoc">Tax Certificate *</Label>
                    <Input id="taxDoc" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange(setTaxDoc)} required />
                    {taxDoc && <div className="text-xs text-green-700 mt-1">{taxDoc.name}</div>}
                  </div>
                </div>
                <div>
                  <Label>Additional Supporting Documents</Label>
                  <div className="overflow-x-auto mt-2">
                    <table className="min-w-full border text-sm">
                      <thead>
                        <tr className="bg-taupe/10">
                          <th className="p-2 border">Type</th>
                          <th className="p-2 border">Description</th>
                          <th className="p-2 border">Document</th>
                          <th className="p-2 border"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {supportingDocs.map((doc, idx) => (
                          <tr key={idx}>
                            <td className="p-2 border">
                              <Input
                                placeholder="Type"
                                value={doc.type}
                                onChange={e => handleSupportingDocChange(idx, 'type', e.target.value)}
                                className="w-32"
                              />
                            </td>
                            <td className="p-2 border">
                              <Input
                                placeholder="Description"
                                value={doc.description}
                                onChange={e => handleSupportingDocChange(idx, 'description', e.target.value)}
                                className="w-48"
                              />
                            </td>
                            <td className="p-2 border">
                              <div className="flex items-center gap-2">
                                <Input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={e => handleSupportingDocFile(idx, e)}
                                  className="w-auto"
                                />
                                {doc.file && (
                                  <span className="text-green-700 text-xs">{doc.file.name}</span>
                                )}
                              </div>
                            </td>
                            <td className="p-2 border text-center">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeSupportingDocRow(idx)}
                              >
                                <X size={16} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={addSupportingDocRow}
                  >
                    <Upload size={16} className="mr-2" />
                    Add Document
                  </Button>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-terracotta hover:bg-umber text-white"
                  >
                    {loading ? 'Submitting...' : 'Submit KYC'}
                  </Button>
                </div>
                {success && <div className="text-green-700 mt-2">KYC submitted successfully!</div>}
                {error && <div className="text-red-700 mt-2">{error}</div>}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </SellerSidebarLayout>
  );
}
