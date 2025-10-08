import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Folder, 
  Users, 
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const AdminSidebar = ({ isCollapsed, onToggle, activeSection, onSectionChange }) => {
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const menuItems = [
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Check if mobile screen
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse on mobile
      if (window.innerWidth < 768 && !isCollapsed) {
        onToggle();
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isCollapsed, onToggle]);

  // Generate initials from user name
  const getUserInitials = () => {
    if (userData.name) {
      return userData.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Handle menu item click (mobile)
  const handleMenuItemClick = (itemId) => {
    onSectionChange(itemId);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Mobile sidebar overlay
  const MobileOverlay = () => (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
      onClick={() => setMobileOpen(false)}
    />
  );

  // Sidebar content
  const SidebarContent = () => (
    <div className={`bg-gray-900 h-full border-lime-400 border border-l-0 border-t-0 text-white transition-all duration-300 flex flex-col ${
      isMobile ? 'w-64' : isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {(!isCollapsed || isMobile) && (
            <div>
              <h1 className="text-lg md:text-xl font-bold">Admin Panel</h1>
              <p className="text-gray-400 text-xs md:text-sm">Welcome back!</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            {isMobile ? (
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={onToggle}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* User Info */}
      {(!isCollapsed || isMobile) && (
        <div className="p-4 md:p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
              {userData.avatar ? (
                <img 
                  src={`http://localhost:8000/storage/${userData.avatar}`} 
                  className="w-full h-full object-cover" 
                  alt="User avatar" 
                />
              ) : (
                <span className="text-sm md:text-lg font-bold">{getUserInitials()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm md:text-base truncate">{userData.name || 'User'}</h3>
              <p className="text-gray-400 text-xs md:text-sm truncate">{userData.email || 'No email'}</p>
              <p className="text-gray-500 text-xs capitalize">{userData.role || 'user'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed User Info (Desktop only) */}
      {isCollapsed && !isMobile && (
        <div className="p-3 border-b border-gray-700 flex justify-center">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
            {userData.avatar ? (
              <img 
                src={`http://localhost:8000/storage/${userData.avatar}`} 
                className="w-full h-full object-cover" 
                alt="User avatar" 
              />
            ) : (
              <span className="text-xs md:text-sm font-bold">{getUserInitials().charAt(0)}</span>
            )}
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 md:p-4">
        <ul className="space-y-1 md:space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 md:px-4 md:py-3 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-[#550cdc] text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  {(!isCollapsed || isMobile) && (
                    <span className="text-sm md:text-base">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
          {!isCollapsed && !isMobile && (
            <li>
            <button onClick={()=>{
              window.location.href = '/';
            }}
            className='bg-[#550cdc] hover:bg-cyan-500 text-white w-full flex items-center space-x-3 px-3 py-2 md:px-4 md:py-3 rounded-lg transition-all duration-200 '
            >
               Client Space
            </button>
          </li>
          )}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 md:p-4 border-t border-gray-700">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 md:px-4 md:py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          {(!isCollapsed || isMobile) && (
            <span className="text-sm md:text-base">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && mobileOpen && <MobileOverlay />}

      {/* Sidebar */}
      {isMobile ? (
        <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <SidebarContent />
        </div>
      ) : (
        <div className="relative">
          {/* Desktop Sidebar - Absolutely positioned */}
          <div className={`absolute top-0 left-0 h-full z-30 transition-all duration-300 ${
            isCollapsed ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
          }`}>
            <SidebarContent />
          </div>
          
          {/* Collapsed Sidebar - Always visible but doesn't affect layout */}
          <div className={`absolute top-0 left-0 h-full z-30 transition-all duration-300 ${
            isCollapsed ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          }`}>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;