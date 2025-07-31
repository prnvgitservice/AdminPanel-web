import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Wrench, Plus, List, XCircle, CheckCircle, Settings, Star,
  Calendar, MapPin, ChevronRight, ChevronDown, Users,
  UserCheck, Building2, X, Package, Image, BookOpen, FileText
} from 'lucide-react';

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface MenuHierarchy {
  key: string;
  subItems: string[];
}

interface SidebarProps {
  onClose?: () => void;
}

const menuItems: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/dashboard' },
  { key: 'categories', label: 'Categories', icon: <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/categories' },
  { key: 'all-categories', label: 'All Categories', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/categories/all' },
  { key: 'add-category', label: 'Add Category', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/categories/add' },
  { key: 'active-categories', label: 'Active Categories', icon: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/categories/active' },
  { key: 'inactive-categories', label: 'Inactive Categories', icon: <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/categories/inactive' },
  { key: 'meta-info', label: 'Meta Info', icon: <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/meta-info' },
  { key: 'all-meta-info', label: 'All Meta Info', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/meta-info/all' },
  { key: 'add-meta-info', label: 'Add Meta Info', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/meta-info/add' },
  { key: 'subscription', label: 'Subscription', icon: <Package className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/subscription' },
  { key: 'all-subscriptions', label: 'All Subscriptions', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/subscription/all' },
  { key: 'add-subscription', label: 'Add Subscription', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/subscription/add' },
  
  // Franchise Plans Section
  { key: 'franchise-plans', label: 'Franchise Plans', icon: <FileText className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/franchise-plans' },
  { key: 'all-franchise-plans', label: 'All Plans', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/franchise-plans/all' },
  { key: 'add-franchise-plan', label: 'Add Plan', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/franchise-plans/add' },

  { key: 'management', label: 'Management', icon: <Settings className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management' },
  { key: 'manage-users', label: 'Manage Users', icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/users' },
  { key: 'all-users', label: 'All Users', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/users/all' },
  { key: 'add-user', label: 'Add User', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/users/add' },
  { key: 'admin-created-users', label: 'Admin Created Users', icon: <UserCheck className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/users/admin-created' },
  { key: 'manage-technicians', label: 'Manage Technicians', icon: <UserCheck className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/technicians' },
  { key: 'all-technicians', label: 'All Technicians', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/technicians/all' },
  { key: 'add-technician', label: 'Add Technician', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/technicians/add' },
  { key: 'admin-created-technicians', label: 'Admin Created Technicians', icon: <UserCheck className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/technicians/admin-created' },
  { key: 'manage-franchises', label: 'Manage Franchises', icon: <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/franchises' },
  { key: 'all-franchises', label: 'All Franchises', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/franchises/all' },
  { key: 'add-franchise', label: 'Add Franchise', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/franchises/add' },
  { key: 'admin-created-franchises', label: 'Admin Created Franchises', icon: <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/franchises/admin-created' },
  { key: 'areas', label: 'Areas', icon: <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/areas' },
  { key: 'all-areas', label: 'All Areas', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/areas/all' },
  { key: 'add-area', label: 'Add Area', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/areas/add' },
  { key: 'bookings', label: 'Bookings', icon: <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/bookings' },
  { key: 'all-bookings', label: 'All Bookings', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/bookings/all' },
  { key: 'guest-bookings', label: 'Guest Bookings', icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/bookings/guest' },
  { key: 'advertisements', label: 'Advertisements', icon: <Image className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/advertisements' },
  { key: 'all-advertisements', label: 'All Advertisements', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/advertisements/all' },
  { key: 'add-advertisement', label: 'Add Advertisement', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/advertisements/add' },
  { key: 'reviews', label: 'Reviews', icon: <Star className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/reviews' },
  { key: 'all-reviews', label: 'All Reviews', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/reviews/all' },
];

const menuHierarchy: MenuHierarchy[] = [
  { key: 'dashboard', subItems: [] },
  { key: 'categories', subItems: ['all-categories', 'add-category', 'active-categories', 'inactive-categories'] },
  { key: 'meta-info', subItems: ['all-meta-info', 'add-meta-info'] },
  { key: 'subscription', subItems: ['all-subscriptions', 'add-subscription'] },
  { key: 'franchise-plans', subItems: ['all-franchise-plans', 'add-franchise-plan'] },
  { key: 'management', subItems: [
    'manage-users', 'all-users', 'add-user', 'admin-created-users',
    'manage-technicians', 'all-technicians', 'add-technician', 'admin-created-technicians',
    'manage-franchises', 'all-franchises', 'add-franchise', 'admin-created-franchises'
  ]},
  { key: 'areas', subItems: ['all-areas', 'add-area'] },
  { key: 'bookings', subItems: ['all-bookings', 'guest-bookings'] },
  { key: 'reviews', subItems: ['all-reviews'] },
  { key: 'advertisements', subItems: ['all-advertisements', 'add-advertisement'] },
];

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const location = useLocation();

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getNestedSubItems = (parentKey: string): MenuItem[] => {
    return menuItems.filter(item => item.key.startsWith(parentKey) && item.key !== parentKey);
  };

  return (
    <div className="w-64 bg-white/95 backdrop-blur-md shadow-2xl h-full flex flex-col border-r border-slate-200/50">
      {/* Header */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-800 to-slate-700">
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

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuHierarchy.map((parent) => {
          const parentItem = menuItems.find(item => item.key === parent.key);
          const hasSubItems = parent.subItems.length > 0;
          const isActive = location.pathname === parentItem?.path;

          if (!parentItem) return null;

          return (
            <div key={parent.key} className="mb-2">
              {hasSubItems ? (
                <button
                  onClick={() => toggleMenu(parent.key)}
                  className="w-full flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200 group text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:translate-x-1"
                >
                  <div className="p-1 rounded-lg mr-2 sm:mr-3 group-hover:bg-blue-100">
                    {parentItem.icon}
                  </div>
                  <span className="flex-1 text-left truncate text-xs sm:text-sm font-medium">{parentItem.label}</span>
                  {openMenus[parent.key] ? (
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 group-hover:text-blue-600" />
                  ) : (
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 group-hover:text-blue-600" />
                  )}
                </button>
              ) : (
                <Link
                  to={parentItem.path}
                  className={`w-full flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-r-4 border-blue-700 shadow-lg transform translate-x-1'
                      : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:translate-x-1'
                  }`}
                  onClick={onClose}
                >
                  <div className={`p-1 rounded-lg mr-2 sm:mr-3 transition-all duration-200 ${
                    isActive ? 'bg-white/20' : 'group-hover:bg-blue-100'
                  }`}>
                    {parentItem.icon}
                  </div>
                  <span className="flex-1 text-left truncate text-xs sm:text-sm font-medium">{parentItem.label}</span>
                </Link>
              )}

              {hasSubItems && openMenus[parent.key] && (
                <div className="space-y-1">
                  {parent.subItems.map((subKey) => {
                    const subItem = menuItems.find(item => item.key === subKey);
                    const isNestedParent = ['manage-users', 'manage-technicians', 'manage-franchises'].includes(subItem?.key || '');
                    const nestedSubItems = isNestedParent ? getNestedSubItems(subItem?.key || '') : [];
                    const isSubActive = location.pathname === subItem?.path;

                    if (!subItem) return null;

                    return (
                      <div key={subItem.key}>
                        {isNestedParent ? (
                          <button
                            onClick={() => toggleMenu(subItem.key)}
                            className={`w-full flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200 group ${
                              isSubActive
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-r-4 border-blue-700 shadow-lg transform translate-x-1'
                                : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:translate-x-1'
                            } pl-8 sm:pl-12`}
                          >
                            <div className={`p-1 rounded-lg mr-2 sm:mr-3 transition-all duration-200 ${
                              isSubActive ? 'bg-white/20' : 'group-hover:bg-blue-100'
                            }`}>
                              {subItem.icon}
                            </div>
                            <span className="flex-1 text-left truncate text-xs sm:text-sm font-medium">{subItem.label}</span>
                            {openMenus[subItem.key] ? (
                              <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-200 ${
                                isSubActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                              }`} />
                            ) : (
                              <ChevronRight className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-200 ${
                                isSubActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                              }`} />
                            )}
                          </button>
                        ) : (
                          <Link
                            to={subItem.path}
                            className={`w-full flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200 group ${
                              isSubActive
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-r-4 border-blue-700 shadow-lg transform translate-x-1'
                                : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:translate-x-1'
                            } pl-8 sm:pl-12`}
                            onClick={onClose}
                          >
                            <div className={`p-1 rounded-lg mr-2 sm:mr-3 transition-all duration-200 ${
                              isSubActive ? 'bg-white/20' : 'group-hover:bg-blue-100'
                            }`}>
                              {subItem.icon}
                            </div>
                            <span className="flex-1 text-left truncate text-xs sm:text-sm font-medium">{subItem.label}</span>
                          </Link>
                        )}

                        {isNestedParent && openMenus[subItem.key] && (
                          <div className="space-y-1">
                            {nestedSubItems.map((nestedItem) => {
                              const isNestedActive = location.pathname === nestedItem.path;
                              return (
                                <Link
                                  key={nestedItem.key}
                                  to={nestedItem.path}
                                  className={`w-full flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200 group ${
                                    isNestedActive
                                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-r-4 border-blue-700 shadow-lg transform translate-x-1'
                                      : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:translate-x-1'
                                  } pl-12 sm:pl-16`}
                                  onClick={onClose}
                                >
                                  <div className={`p-1 rounded-lg mr-2 sm:mr-3 transition-all duration-200 ${
                                    isNestedActive ? 'bg-white/20' : 'group-hover:bg-blue-100'
                                  }`}>
                                    {nestedItem.icon}
                                  </div>
                                  <span className="flex-1 text-left truncate text-xs sm:text-sm font-medium">{nestedItem.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 border-t border-slate-200/50 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="text-center">
          <p className="text-xs text-slate-500">© 2024 PRNV Services</p>
          <p className="text-xs text-slate-400">Admin Dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;