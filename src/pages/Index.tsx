import React from 'react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();

//   React.useEffect(() => {
//     const timer = setTimeout(() => {
//       navigate('/seller/login');
//     }, 3000);
//     return () => clearTimeout(timer);
//   }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8">
      <h1 className="text-4xl font-bold mb-4 text-primary">Welcome to Raibo Admin & Seller Panel</h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-xl">
        Manage your products, orders, and business with ease. Please login as a seller or admin to continue.
      </p>
      <div className="flex flex-col md:flex-row gap-4">
        <button onClick={() => navigate('/seller/login')} className="px-6 py-3 rounded-lg bg-primary text-white font-semibold">Seller Login</button>
        <button onClick={() => navigate('/admin/login')} className="px-6 py-3 rounded-lg bg-secondary text-primary font-semibold">Admin Login</button>
      </div>
      <div className="mt-12 w-full max-w-2xl">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">About Us</h2>
          <p className="text-muted-foreground">
            Raibo is a platform for sellers and admins to manage their e-commerce business efficiently. We provide tools for product management, order tracking, analytics, and more.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
          <p className="text-muted-foreground mb-2">For support or inquiries, email us at <a href="mailto:support@raibo.com" className="text-primary underline">support@raibo.com</a></p>
          <p className="text-muted-foreground">Or call us at <span className="text-primary font-medium">+1-800-RAIBO</span></p>
        </section>
      </div>
    </div>
  );
};

export default Index;
