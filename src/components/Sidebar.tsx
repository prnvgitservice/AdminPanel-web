import React, { useState } from 'react';
import { 
  Home, 
  Wrench, 
  Plus, 
  List, 
  Clock, 
  Trash2, 
  XCircle, 
  CreditCard, 
  Image, 
  Video, 
  MapPin, 
  Map, 
  Settings, 
  Star, 
  Calendar, 
  Phone, 
  Tag, 
  DollarSign,
  ChevronRight,
  ChevronDown,
  Users,
  UserCheck,
  User,
  Building2,
  X
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, onClose }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Services': true,
    'User Management': true,
    'Advertisements': false,
    'Booking': false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePageChange = (page: string) => {
    onPageChange(page);
    if (onClose) {
      onClose();
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'Main' },
    
    // Services Section
    { id: 'services', label: 'Categories', icon: Wrench, section: 'Services', hasSubmenu: true },
    { id: 'all-services', label: 'All Services', icon: List, section: 'Services', isSubItem: true },
    { id: 'pending-services', label: 'Pending Services', icon: Clock, section: 'Services', isSubItem: true },
    { id: 'deleted-services', label: 'Deleted Services', icon: Trash2, section: 'Services', isSubItem: true },
    { id: 'inactive-services', label: 'Inactive Services', icon: XCircle, section: 'Services', isSubItem: true },
    // User Management Section
    { id: 'manage-users', label: 'Manage Users', icon: Users, section: 'User Management', hasSubmenu: true },
    { id: 'admin-users', label: 'Admin Users', icon: UserCheck, section: 'User Management', isSubItem: true },
    { id: 'admin', label: 'Admin', icon: User, section: 'User Management', isSubItem: true },
    { id: 'providers', label: 'Providers', icon: UserCheck, section: 'User Management', isSubItem: true },
    { id: 'users', label: 'Users', icon: Users, section: 'User Management', isSubItem: true },
    { id: 'bda', label: 'BDA', icon: Building2, section: 'User Management', isSubItem: true },
    { id: 'providers-details', label: 'Providers Details', icon: List, section: 'User Management', isSubItem: true },
  ];

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <div className="w-64 bg-white shadow-xl h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-red-500 to-red-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-red-500 font-bold text-sm sm:text-lg">P</span>
            </div>
            <div className="text-white">
              <h1 className="text-sm sm:text-lg font-bold leading-tight">PRNV</h1>
              <p className="text-xs sm:text-sm opacity-90">Services</p>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-1 text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="py-4">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section} className="mb-2">
            {section !== 'Main' && (
              <button
                onClick={() => toggleSection(section)}
                className="w-full flex items-center justify-between px-4 sm:px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
              >
                <span className="truncate">{section}</span>
                {expandedSections[section] ? (
                  <ChevronDown className="h-3 w-3 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-3 w-3 flex-shrink-0" />
                )}
              </button>
            )}
            
            {(section === 'Main' || expandedSections[section]) && (
              <div className="space-y-1">
                {items.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => handlePageChange(item.id)}
                      className={`w-full flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200 ${
                        currentPage === item.id
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-r-4 border-red-700 shadow-lg'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } ${item.isSubItem ? 'pl-8 sm:pl-12' : ''}`}
                    >
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
                      <span className="flex-1 text-left truncate text-xs sm:text-sm">{item.label}</span>
                      {item.hasSubmenu && !item.isSubItem && (
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;