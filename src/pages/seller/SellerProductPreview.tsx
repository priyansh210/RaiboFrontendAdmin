import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Send } from 'lucide-react';
import SellerSidebarLayout, { useSellerSidebar } from '../../components/seller/SellerSidebarLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import ProductPreview from '@/components/ProductPreview';
import CommentSystem from '@/components/CommentSystem';
import { apiService } from '@/services/ApiService';
import { adminService } from '@/services/AdminService';
import { Product } from '@/models/internal/Product';
import { ProductComment } from '@/models/internal/ProductComments';
import { ProductMapper } from '@/mappers/ProductMapper';
import { ExternalProductResponse } from '@/models/external/ProductModels';

const SellerProductPreview: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resubmitDialog, setResubmitDialog] = useState(false);
  const [resubmitMessage, setResubmitMessage] = useState('');
  const { collapsed } = useSellerSidebar();

  useEffect(() => {
    if (productId) {
      fetchProductAndComments();
    }
  }, [productId]);

  const fetchProductAndComments = async () => {
    if (!productId) return;
    
    setIsLoading(true);
    try {
      // Get product data using apiService
      const productResponse = await apiService.getProductById(productId);
      const productData = ProductMapper.mapExternalToProduct(productResponse as ExternalProductResponse);
      
      // Get comments using adminService (reusing the API)
      const commentsData = await adminService.getProductComments(productId);
      
      setProduct(productData);
      setComments(commentsData);
    } catch (error) {
      console.error('Failed to fetch product data:', error);
      toast({
        title: "Error",
        description: "Failed to load product data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (content: string, commentType?: string, parentId?: string) => {
    if (!productId) return;
    
    try {
      if (parentId) {
        await apiService.replyToComment(parentId, content);
      } else {
        await apiService.addComment(productId, content, 'Product', 'external');
      }
      
      // Refresh comments
      await fetchProductAndComments();
      
      toast({
        title: "Success",
        description: "Response added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add response",
        variant: "destructive",
      });
    }
  };

  const handleResubmit = async () => {
    if (!productId) return;
    
    try {
      // Add seller's resubmission message as a comment
      if (resubmitMessage.trim()) {
        await apiService.addComment(productId, `Resubmission: ${resubmitMessage}`, 'Product', 'external');
      }
      
      // In a real implementation, this would trigger a resubmission workflow
      // For now, we'll just show a success message
      toast({
        title: "Success",
        description: "Product resubmitted for review",
      });
      
      setResubmitDialog(false);
      setResubmitMessage('');
      navigate('/seller/products');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resubmit product",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading product preview...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">Product not found</div>
      </div>
    );
  }

  return (
    <SellerSidebarLayout>
      <div className="transition-all duration-300 min-h-screen bg-cream py-10 px-2 sm:px-4">
        <div className="container mx-auto max-w-6xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/seller/products')}
            className="mb-6 flex items-center gap-2 hover:bg-taupe/10"
          >
            <ArrowLeft size={16} /> Back to Products
          </Button>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta"></div>
            </div>
          ) : product ? (
            <>
              <div className="bg-white rounded-lg shadow-sm mb-8">
                <ProductPreview product={product} userRole="seller" />
              </div>
              
              {/* Product comments/review section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <CommentSystem 
                  comments={comments} 
                  productId={productId!} 
                  userRole="seller"
                  onAddComment={(text) => console.log('Add comment', text)} 
                />
              </div>
              
              {/* Resubmit dialog */}
              <Dialog open={resubmitDialog} onOpenChange={setResubmitDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Resubmit Product for Approval</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please provide additional information about the changes you've made to address the reviewer's concerns.
                  </p>
                  <Textarea 
                    value={resubmitMessage} 
                    onChange={(e) => setResubmitMessage(e.target.value)}
                    placeholder="Explain what changes you've made to address the rejection reasons..."
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setResubmitDialog(false)}>Cancel</Button>
                    <Button onClick={handleResubmit} disabled={!resubmitMessage.trim()}>
                      <Send size={16} className="mr-2" /> Resubmit
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="text-center py-12">
              <Eye size={64} className="mx-auto text-taupe mb-4" />
              <h3 className="text-xl font-medium text-charcoal mb-2">Product not found</h3>
              <p className="text-earth mb-6">The product you're looking for doesn't exist or has been removed.</p>
            </div>
          )}
        </div>
      </div>
    </SellerSidebarLayout>
  );
};

export default SellerProductPreview;
