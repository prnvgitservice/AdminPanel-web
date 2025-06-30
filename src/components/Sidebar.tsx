import React from 'react';
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
  Users,
  UserCheck,
  User
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'Main' },
    { id: 'services', label: 'Services', icon: Wrench, section: 'Services', hasSubmenu: true },
    { id: 'add-service', label: 'Add Services', icon: Plus, section: 'Services', isSubItem: true },
    { id: 'all-services', label: 'All Services', icon: List, section: 'Services', isSubItem: true },
    { id: 'pending-services', label: 'Pending Services', icon: Clock, section: 'Services', isSubItem: true },
    { id: 'deleted-services', label: 'Deleted Services', icon: Trash2, section: 'Services', isSubItem: true },
    { id: 'inactive-services', label: 'Inactive Services', icon: XCircle, section: 'Services', isSubItem: true },
    { id: 'payments', label: 'Payments', icon: CreditCard, section: 'Services', isSubItem: true },
    { id: 'work-gallery', label: 'All Work Gallery', icon: Image, section: 'Services', isSubItem: true },
    { id: 'video-gallery', label: 'All Video Gallery', icon: Video, section: 'Services', isSubItem: true },
    { id: 'manage-users', label: 'Manage Users', icon: Users, section: 'User Management', hasSubmenu: true },
    { id: 'admin-users', label: 'Admin Users', icon: UserCheck, section: 'User Management', isSubItem: true },
    { id: 'admin', label: 'Admin', icon: User, section: 'User Management', isSubItem: true },
    { id: 'providers', label: 'Providers', icon: UserCheck, section: 'User Management', isSubItem: true },
    { id: 'users', label: 'Users', icon: Users, section: 'User Management', isSubItem: true },
  ];

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <div className="w-64 bg-white shadow-lg h-screen overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-bold text-gray-800">PRNV Services</span>
        </div>
      </div>
      
      <nav className="mt-6">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section} className="mb-6">
            <h3 className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {section}
            </h3>
            
            {items.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                    currentPage === item.id
                      ? 'bg-red-500 text-white border-r-4 border-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } ${item.isSubItem ? 'pl-12' : ''}`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.hasSubmenu && !item.isSubItem && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;