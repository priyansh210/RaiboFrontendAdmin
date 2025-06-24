import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="font-playfair text-2xl text-charcoal">RAIBO</Link>
          <div className="flex gap-4">
            <Link to="/seller/login" className="text-sm text-earth hover:text-charcoal">Seller Login</Link>
            <Link to="/seller/register" className="text-sm text-earth hover:text-charcoal">Register as Seller</Link>
          </div>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        {children}
      </main>
      <footer className="bg-white border-t border-border py-4 text-center text-sm text-earth">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Raibo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
