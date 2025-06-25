import React, { ReactNode, useState, createContext, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Package, ShoppingBag, Star, Users, LogOut, Settings, ChevronsLeft, 
  BarChart3, PlusSquare, FileText, Bell, HelpCircle, Truck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SellerSidebarLayoutProps {
  children: ReactNode;
}

const sidebarMenu = [
  { label: 'Dashboard', icon: <Home size={18} />, to: '/seller/dashboard' },
  {
    label: 'My Company', icon: <Users size={18} />, children: [
      { label: 'My Shops', to: '/seller/company/shops' },
      { label: 'Company Details', to: '/seller/company/details' },
      { label: 'Analytics', to: '/seller/company/analytics' },
      { label: 'KYC', to: '/seller/company/kyc' }, // Added KYC link
    ]
  },
  {
    label: 'Inventory', icon: <Package size={18} />, children: [
      { label: 'Products', to: '/seller/products' },
      { label: 'Forecast', to: '/seller/inventory/forecast' },
    ]
  },
  { label: 'Payments', icon: <BarChart3 size={18} />, to: '/seller/payments' },
  { label: 'Orders', icon: <ShoppingBag size={18} />, to: '/seller/orders' },
  { label: 'Logistics', icon: <Truck size={18} />, to: '/seller/logistics' },
  { label: 'Reviews', icon: <Star size={18} />, to: '/seller/reviews' },
  { label: 'User Account', icon: <Settings size={18} />, to: '/seller/account' },
];

const bottomMenuItems = [
  { label: 'Help & Support', icon: <HelpCircle size={18} />, to: '/seller/support' },
  { label: 'Notifications', icon: <Bell size={18} />, to: '/seller/notifications' },
  { label: 'Documentation', icon: <FileText size={18} />, to: '/seller/docs' },
];

const SellerSidebarContext = createContext<{ collapsed: boolean; toggle: () => void }>({ collapsed: false, toggle: () => {} });

const SIDEBAR_GROUPS_KEY = 'raibo_seller_sidebar_groups';

const SellerSidebarLayout: React.FC<SellerSidebarLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>(() => {
    // Load sidebar group state from localStorage
    try {
      const stored = localStorage.getItem(SIDEBAR_GROUPS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const sidebarWidth = collapsed ? 'w-20' : 'w-64';
  
  // Auto collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Persist openGroups to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(SIDEBAR_GROUPS_KEY, JSON.stringify(openGroups));
  }, [openGroups]);

  const handleLogout = () => {
    logout();
    navigate('/seller/login');
  };

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => {
      const updated = { ...prev, [label]: !prev[label] };
      localStorage.setItem(SIDEBAR_GROUPS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isActivePath = (path: string) => {
    // For products section, handle all sub-paths
    if (path === '/seller/products' && location.pathname.startsWith('/seller/products/')) {
      return true;
    }
    return location.pathname === path;
  };
  return (
    <SellerSidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed((c) => !c) }}>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar - Fixed, always visible, full height */}
        <div className={`fixed top-0 left-0 h-screen ${sidebarWidth} bg-white border-r border-border shadow-lg z-30 transition-all duration-300 ease-in-out flex flex-col`}>
          {/* Collapse/Expand Button at Top */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border relative">
            <span className={`font-bold text-lg text-primary transition-all duration-300 ${collapsed ? 'hidden md:inline-block md:text-base md:px-0' : ''}`}>Raibo Seller</span>
            <button className="md:hidden" onClick={() => setOpen(false)}><X /></button>
            <button
              className={`absolute -right-3 md:-right-4 top-1/2 -translate-y-1/2 bg-card h-6 w-6 md:h-8 md:w-8 rounded-full z-10 hover:bg-muted shadow-sm border border-border hidden md:block`}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <Menu className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
              <span className="sr-only">Toggle Sidebar</span>
            </button>
          </div>
          {/* Main Navigation */}
          <nav className="flex flex-col gap-1 p-4 flex-grow">
            {sidebarMenu.map((item) => (
              item.children ? (
                <div key={item.label}>
                  <button
                    className={`flex items-center w-full gap-3 px-4 py-2 rounded transition-colors font-medium text-left ${collapsed ? 'justify-center px-2' : ''}`}
                    onClick={() => toggleGroup(item.label)}
                  >
                    {item.icon}
                    {!collapsed && <span>{item.label}</span>}
                    {!collapsed && (
                      <span className="ml-auto">{openGroups[item.label] ? '▾' : '▸'}</span>
                    )}
                  </button>
                  {openGroups[item.label] && !collapsed && (
                    <div className="ml-8 flex flex-col gap-1 mt-1">
                      {item.children.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.to}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors font-normal hover:bg-muted/60 ${isActivePath(sub.to) ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                          onClick={() => setOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`flex items-center gap-3 px-4 py-2 rounded transition-colors font-medium ${isActivePath(item.to) ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/60'} ${collapsed ? 'justify-center px-2' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                  {!collapsed && item.label}
                </Link>
              )
            ))}
          </nav>
          {/* Sign Out at Bottom */}
          <div className="p-4 border-t border-border">
            <button 
              onClick={handleLogout}
              className={`flex items-center gap-3 px-4 py-2 rounded text-red-600 hover:bg-red-50 font-medium w-full ${collapsed ? 'justify-center px-2' : ''}`}
            >
              <LogOut size={18} />
              {!collapsed && 'Sign Out'}
            </button>
          </div>
        </div>
        {/* Overlay for mobile */}
        {open && <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={() => setOpen(false)}></div>}
        {/* Main Content - Scrollable area, margin for sidebar */}
        <div className={`flex-1 flex flex-col min-h-screen ml-0 transition-all duration-300 ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}> 
          {/* Topbar for mobile */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-white sticky top-0 z-10">
            <button onClick={() => setOpen(true)}><Menu /></button>
            <span className="font-bold text-primary">Raibo Seller</span>
          </div>
          <main className="flex-1 bg-background w-full">{children}</main>
        </div>
      </div>
    </SellerSidebarContext.Provider>
  );
};

export const useSellerSidebar = () => useContext(SellerSidebarContext);

export default SellerSidebarLayout;
