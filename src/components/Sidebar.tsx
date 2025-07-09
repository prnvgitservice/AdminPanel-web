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
  X,
  Edit,
  CheckCircle,
  Package
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, onClose }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Categories': true,
    'Subscription': false,
    'Management': false,
    'Areas': false,
    'Bookings': false,
    'Reviews': false,
    'Advertisements': false
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
    
    // Categories Section
    { id: 'categories', label: 'Categories', icon: Wrench, section: 'Categories', hasSubmenu: true },
    { id: 'all-categories', label: 'All Categories', icon: List, section: 'Categories', isSubItem: true },
    { id: 'add-category', label: 'Add Category', icon: Plus, section: 'Categories', isSubItem: true },
    { id: 'active-categories', label: 'Active Categories', icon: CheckCircle, section: 'Categories', isSubItem: true },
    { id: 'inactive-categories', label: 'Inactive Categories', icon: XCircle, section: 'Categories', isSubItem: true },
    { id: 'deleted-categories', label: 'Deleted Categories', icon: Trash2, section: 'Categories', isSubItem: true },

    // Subscription Section
    { id: 'subscription', label: 'Subscription', icon: Package, section: 'Subscription', hasSubmenu: true },
    { id: 'all-subscriptions', label: 'All Subscriptions', icon: List, section: 'Subscription', isSubItem: true },
    { id: 'add-subscription', label: 'Add Subscription', icon: Plus, section: 'Subscription', isSubItem: true },
    { id: 'edit-subscription', label: 'Edit Subscription', icon: Edit, section: 'Subscription', isSubItem: true },
    { id: 'deleted-subscriptions', label: 'Deleted Subscriptions', icon: Trash2, section: 'Subscription', isSubItem: true },

    // Management Section
    { id: 'management', label: 'Management', icon: Settings, section: 'Management', hasSubmenu: true },
    
    // Manage Users
    { id: 'manage-users', label: 'Manage Users', icon: Users, section: 'Management', hasSubmenu: true, isSubItem: true },
    { id: 'all-users', label: 'All Users', icon: List, section: 'Management', isSubItem: true, parentId: 'manage-users' },
    { id: 'add-user', label: 'Add User', icon: Plus, section: 'Management', isSubItem: true, parentId: 'manage-users' },
    { id: 'edit-user', label: 'Edit User', icon: Edit, section: 'Management', isSubItem: true, parentId: 'manage-users' },
    { id: 'delete-user', label: 'Delete User', icon: Trash2, section: 'Management', isSubItem: true, parentId: 'manage-users' },
    { id: 'admin-created-users', label: 'Admin Created Users', icon: UserCheck, section: 'Management', isSubItem: true, parentId: 'manage-users' },

    // Manage Technicians
    { id: 'manage-technicians', label: 'Manage Technicians', icon: UserCheck, section: 'Management', hasSubmenu: true, isSubItem: true },
    { id: 'all-technicians', label: 'All Technicians', icon: List, section: 'Management', isSubItem: true, parentId: 'manage-technicians' },
    { id: 'add-technician', label: 'Add Technician', icon: Plus, section: 'Management', isSubItem: true, parentId: 'manage-technicians' },
    { id: 'edit-technician', label: 'Edit Technician', icon: Edit, section: 'Management', isSubItem: true, parentId: 'manage-technicians' },
    { id: 'delete-technician', label: 'Delete Technician', icon: Trash2, section: 'Management', isSubItem: true, parentId: 'manage-technicians' },
    { id: 'admin-created-technicians', label: 'Admin Created Technicians', icon: UserCheck, section: 'Management', isSubItem: true, parentId: 'manage-technicians' },

    // Manage Franchises
    { id: 'manage-franchises', label: 'Manage Franchises', icon: Building2, section: 'Management', hasSubmenu: true, isSubItem: true },
    { id: 'all-franchises', label: 'All Franchises', icon: List, section: 'Management', isSubItem: true, parentId: 'manage-franchises' },
    { id: 'add-franchise', label: 'Add Franchise', icon: Plus, section: 'Management', isSubItem: true, parentId: 'manage-franchises' },
    { id: 'edit-franchise', label: 'Edit Franchise', icon: Edit, section: 'Management', isSubItem: true, parentId: 'manage-franchises' },
    { id: 'delete-franchise', label: 'Delete Franchise', icon: Trash2, section: 'Management', isSubItem: true, parentId: 'manage-franchises' },
    { id: 'admin-created-franchises', label: 'Admin Created Franchises', icon: Building2, section: 'Management', isSubItem: true, parentId: 'manage-franchises' },

    // Areas Section
    { id: 'areas', label: 'Areas', icon: MapPin, section: 'Areas', hasSubmenu: true },
    { id: 'all-areas', label: 'All Areas', icon: List, section: 'Areas', isSubItem: true },
    { id: 'add-area', label: 'Add Area', icon: Plus, section: 'Areas', isSubItem: true },
    { id: 'edit-area', label: 'Edit Area', icon: Edit, section: 'Areas', isSubItem: true },
    { id: 'delete-area', label: 'Delete Area', icon: Trash2, section: 'Areas', isSubItem: true },

    // Bookings Section
    { id: 'bookings', label: 'Bookings', icon: Calendar, section: 'Bookings', hasSubmenu: true },
    { id: 'all-bookings', label: 'All Bookings', icon: List, section: 'Bookings', isSubItem: true },
    { id: 'guest-bookings', label: 'Guest Bookings', icon: Users, section: 'Bookings', isSubItem: true },

    // Reviews Section
    { id: 'reviews', label: 'Reviews', icon: Star, section: 'Reviews', hasSubmenu: true },
    { id: 'all-reviews', label: 'All Reviews', icon: List, section: 'Reviews', isSubItem: true },

    // Advertisements Section
    { id: 'advertisements', label: 'Advertisements', icon: Image, section: 'Advertisements', hasSubmenu: true },
    { id: 'all-advertisements', label: 'All Advertisements', icon: List, section: 'Advertisements', isSubItem: true },
    { id: 'add-advertisement', label: 'Add Advertisement', icon: Plus, section: 'Advertisements', isSubItem: true },
    { id: 'edit-advertisement', label: 'Edit Advertisement', icon: Edit, section: 'Advertisements', isSubItem: true },
    { id: 'delete-advertisement', label: 'Delete Advertisement', icon: Trash2, section: 'Advertisements', isSubItem: true },
  ];

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <div className="w-64 bg-white/95 backdrop-blur-md shadow-2xl h-full overflow-y-auto border-r border-slate-200/50">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-800 to-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm sm:text-lg">P</span>
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
                className="w-full flex items-center justify-between px-4 sm:px-6 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-all duration-200"
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
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-r-4 border-blue-700 shadow-lg transform translate-x-1'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'
                      } ${item.isSubItem ? (item.parentId ? 'pl-12 sm:pl-16' : 'pl-8 sm:pl-12') : ''}`}
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