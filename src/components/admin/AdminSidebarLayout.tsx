import React, { ReactNode, useState, createContext, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Users, Package, BarChart3, Layers, LogOut, Settings } from 'lucide-react';

interface AdminSidebarLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { label: 'Dashboard', icon: <Home size={18} />, to: '/admin/dashboard' },
  { label: 'Companies', icon: <Users size={18} />, to: '/admin/dashboard#company-info' },
  { label: 'Requests', icon: <Layers size={18} />, to: '/admin/dashboard#requests' },
  { label: 'Categories', icon: <Package size={18} />, to: '/admin/dashboard#categories' },
  { label: 'Analytics', icon: <BarChart3 size={18} />, to: '/admin/dashboard#analytics' },
  { label: 'Settings', icon: <Settings size={18} />, to: '/admin/dashboard#settings' },
];

// Context for sidebar collapsed state
const AdminSidebarContext = createContext<{ collapsed: boolean; toggle: () => void }>({ collapsed: false, toggle: () => {} });

const AdminSidebarLayout: React.FC<AdminSidebarLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const sidebarWidth = collapsed ? 'w-20' : 'w-64';

  return (
    <AdminSidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed((c) => !c) }}>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <div className={`fixed z-30 inset-y-0 left-0 ${sidebarWidth} bg-white border-r border-border shadow-lg transform transition-all duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <span className={`font-bold text-lg text-primary transition-all duration-300 ${collapsed ? 'hidden md:inline-block md:text-base md:px-0' : ''}`}>Raibo Admin</span>
            <button className="md:hidden" onClick={() => setOpen(false)}><X /></button>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-2 rounded transition-colors font-medium ${location.pathname + location.hash === item.to ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/60'} ${collapsed ? 'justify-center px-2' : ''}`}
                onClick={() => setOpen(false)}
              >
                {item.icon}
                {!collapsed && item.label}
              </Link>
            ))}
            <button className={`flex items-center gap-3 px-4 py-2 rounded text-red-600 hover:bg-red-50 mt-8 font-medium ${collapsed ? 'justify-center px-2' : ''}`}>
              <LogOut size={18} />
              {!collapsed && 'Logout'}
            </button>
          </nav>
          {/* Collapse/Expand Button */}
          <button
            className={`hidden md:flex items-center justify-center w-full py-2 border-t border-border text-xs text-muted-foreground hover:bg-muted transition-colors ${collapsed ? 'justify-center' : ''}`}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? 'Expand →' : '← Collapse'}
          </button>
        </div>
        {/* Overlay for mobile */}
        {open && <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={() => setOpen(false)}></div>}
        {/* Main Content */}
        <div className={`flex-1 flex flex-col min-h-screen ml-0 transition-all duration-300 ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
          {/* Topbar for mobile */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-white sticky top-0 z-10">
            <button onClick={() => setOpen(true)}><Menu /></button>
            <span className="font-bold text-primary">Raibo Admin</span>
          </div>
          <main className="flex-1 p-4 md:p-8 bg-background">{children}</main>
        </div>
      </div>
    </AdminSidebarContext.Provider>
  );
};

export const useAdminSidebar = () => useContext(AdminSidebarContext);

export default AdminSidebarLayout;
