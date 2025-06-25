import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '@/components/auth/AuthLayout';
import { toast } from '@/hooks/use-toast';

const SellerLogin = () => {
  const { login, googleLogin, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.redirect || '/seller/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to seller dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast({
        title: 'Login successful',
        description: 'Welcome to your seller dashboard!',
      });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Failed to login. Please check your credentials and try again.');
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await googleLogin('seller');
      toast({
        title: 'Login successful',
        description: 'Welcome to your seller dashboard!',
      });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Failed to login with Google.');
      toast({
        title: 'Login failed',
        description: 'Failed to login with Google. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="min-h-screen bg-cream py-10 flex justify-center items-center">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
          <div className="text-center mb-6">
            <h1 className="font-playfair text-3xl text-charcoal">RAIBO</h1>
            <p className="text-xs text-earth uppercase tracking-wider">Seller Portal</p>
            <h2 className="font-playfair text-2xl text-charcoal mb-2 mt-4">Seller Login</h2>
            <p className="text-earth text-sm">Access your seller dashboard</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-sm flex items-center">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-charcoal mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-3 pr-4 py-2 border border-sand focus:border-terracotta focus:outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm text-charcoal mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3 pr-4 py-2 border border-sand focus:border-terracotta focus:outline-none"
                placeholder="•••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || isLoading}
              className="w-full bg-charcoal text-white py-2 hover:bg-charcoal/90 transition-colors disabled:opacity-50"
            >
              {loading || isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <button
            onClick={handleGoogleLogin}
            disabled={loading || isLoading}
            className="w-full mt-4 border border-charcoal text-charcoal py-2 hover:bg-charcoal/5 transition-colors disabled:opacity-50"
          >
            {loading || isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-earth">
              Don't have a seller account?{' '}
              <Link to="/seller/register" className="text-terracotta hover:underline">
                Register here
              </Link>
            </p>
            <p className="text-sm text-earth mt-2">
              Are you a buyer?{' '}
              <Link to="/login" className="text-terracotta hover:underline">
                Go to Buyer Portal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SellerLogin;
