import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Wrench, Plus, List, XCircle, CheckCircle, Settings, Star,
  Calendar, MapPin, ChevronRight, ChevronDown, Users,
  UserCheck, Building2, X, Package, Image, BookOpen
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
  { key: 'deleted-categories', label: 'Deleted Categories', icon: <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/categories/deleted' },
  { key: 'meta-info', label: 'Meta Info', icon: <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/meta-info' },
  { key: 'all-meta-info', label: 'All Meta Info', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/meta-info/all' },
  { key: 'add-meta-info', label: 'Add Meta Info', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/meta-info/add' },
  { key: 'subscription', label: 'Subscription', icon: <Package className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/subscription' },
  { key: 'all-subscriptions', label: 'All Subscriptions', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/subscription/all' },
  { key: 'add-subscription', label: 'Add Subscription', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/subscription/add' },
  { key: 'deleted-subscriptions', label: 'Deleted Subscriptions', icon: <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/subscription/deleted' },
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
  { key: 'reviews', label: 'Reviews', icon: <Star className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/reviews' },
  { key: 'all-reviews', label: 'All Reviews', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/reviews/all' },
  { key: 'advertisements', label: 'Advertisements', icon: <Image className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/advertisements' },
  { key: 'all-advertisements', label: 'All Advertisements', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/advertisements/all' },
  { key: 'add-advertisement', label: 'Add Advertisement', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/advertisements/add' },
];

const menuHierarchy: MenuHierarchy[] = [
  { key: 'dashboard', subItems: [] },
  { key: 'categories', subItems: ['all-categories', 'add-category', 'active-categories', 'inactive-categories'] },
  { key: 'meta-info', subItems: ['all-meta-info', 'add-meta-info'] },
  { key: 'subscription', subItems: ['all-subscriptions', 'add-subscription', 'deleted-subscriptions'] },
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
// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { ChevronDown, ChevronRight, LayoutDashboard, Wrench, List, PlusSquare, CheckCircle, XCircle, BookOpen, Package, Settings, Users, UserCheck, Building2, MapPin, Calendar, Star, Image, X } from 'lucide-react';

// interface MenuItem {
//   key: string;
//   label: string;
//   icon: React.ReactNode;
//   path: string; // Added path for routing
// }

// interface MenuHierarchy {
//   key: string;
//   subItems: string[];
// }

// interface SidebarProps {
//   onClose?: () => void;
// }

// const menuItems: MenuItem[] = [
//   { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
//   { key: 'categories', label: 'Categories', icon: <Wrench size={20} />, path: '/categories' },
//   { key: 'all-categories', label: 'All Categories', icon: <List size={20} />, path: '/categories/all' },
//   { key: 'add-category', label: 'Add Category', icon: <PlusSquare size={20} />, path: '/categories/add' },
//   { key: 'active-categories', label: 'Active Categories', icon: <CheckCircle size={20} />, path: '/categories/active' },
//   { key: 'inactive-categories', label: 'Inactive Categories', icon: <XCircle size={20} />, path: '/categories/inactive' },
//   { key: 'meta-info', label: 'Meta Info', icon: <BookOpen size={20} />, path: '/meta-info' },
//   { key: 'all-meta-info', label: 'All Meta Info', icon: <List size={20} />, path: '/meta-info/all' },
//   { key: 'add-meta-info', label: 'Add Meta Info', icon: <PlusSquare size={20} />, path: '/meta-info/add' },
//   { key: 'subscription', label: 'Subscription', icon: <Package size={20} />, path: '/subscription' },
//   { key: 'all-subscriptions', label: 'All Subscriptions', icon: <List size={20} />, path: '/subscription/all' },
//   { key: 'add-subscription', label: 'Add Subscription', icon: <PlusSquare size={20} />, path: '/subscription/add' },
//   { key: 'management', label: 'Management', icon: <Settings size={20} />, path: '/management' },
//   { key: 'manage-users', label: 'Manage Users', icon: <Users size={20} />, path: '/management/users' },
//   { key: 'all-users', label: 'All Users', icon: <List size={20} />, path: '/management/users/all' },
//   { key: 'add-user', label: 'Add User', icon: <PlusSquare size={20} />, path: '/management/users/add' },
//   { key: 'admin-created-users', label: 'Admin Created Users', icon: <UserCheck size={20} />, path: '/management/users/admin-created' },
//   { key: 'manage-technicians', label: 'Manage Technicians', icon: <UserCheck size={20} />, path: '/management/technicians' },
//   { key: 'all-technicians', label: 'All Technicians', icon: <List size={20} />, path: '/management/technicians/all' },
//   { key: 'add-technician', label: 'Add Technician', icon: <PlusSquare size={20} />, path: '/management/technicians/add' },
//   { key: 'admin-created-technicians', label: 'Admin Created Technicians', icon: <UserCheck size={20} />, path: '/management/technicians/admin-created' },
//   { key: 'manage-franchises', label: 'Manage Franchises', icon: <Building2 size={20} />, path: '/management/franchises' },
//   { key: 'all-franchises', label: 'All Franchises', icon: <List size={20} />, path: '/management/franchises/all' },
//   { key: 'add-franchise', label: 'Add Franchise', icon: <PlusSquare size={20} />, path: '/management/franchises/add' },
//   { key: 'admin-created-franchises', label: 'Admin Created Franchises', icon: <Building2 size={20} />, path: '/management/franchises/admin-created' },
//   { key: 'areas', label: 'Areas', icon: <MapPin size={20} />, path: '/areas' },
//   { key: 'all-areas', label: 'All Areas', icon: <List size={20} />, path: '/areas/all' },
//   { key: 'add-area', label: 'Add Area', icon: <PlusSquare size={20} />, path: '/areas/add' },
//   { key: 'bookings', label: 'Bookings', icon: <Calendar size={20} />, path: '/bookings' },
//   { key: 'all-bookings', label: 'All Bookings', icon: <List size={20} />, path: '/bookings/all' },
//   { key: 'guest-bookings', label: 'Guest Bookings', icon: <Users size={20} />, path: '/bookings/guest' },
//   { key: 'reviews', label: 'Reviews', icon: <Star size={20} />, path: '/reviews' },
//   { key: 'all-reviews', label: 'All Reviews', icon: <List size={20} />, path: '/reviews/all' },
//   { key: 'advertisements', label: 'Advertisements', icon: <Image size={20} />, path: '/advertisements' },
//   { key: 'all-advertisements', label: 'All Advertisements', icon: <List size={20} />, path: '/advertisements/all' },
//   { key: 'add-advertisement', label: 'Add Advertisement', icon: <PlusSquare size={20} />, path: '/advertisements/add' },
// ];

// const menuHierarchy: MenuHierarchy[] = [
//   { key: 'dashboard', subItems: [] },
//   { key: 'categories', subItems: ['all-categories', 'add-category', 'active-categories', 'inactive-categories'] },
//   { key: 'meta-info', subItems: ['all-meta-info', 'add-meta-info'] },
//   { key: 'subscription', subItems: ['all-subscriptions', 'add-subscription'] },
//   { key: 'management', subItems: [
//     'manage-users', 'all-users', 'add-user', 'admin-created-users',
//     'manage-technicians', 'all-technicians', 'add-technician', 'admin-created-technicians',
//     'manage-franchises', 'all-franchises', 'add-franchise', 'admin-created-franchises'
//   ]},
//   { key: 'areas', subItems: ['all-areas', 'add-area'] },
//   { key: 'bookings', subItems: ['all-bookings', 'guest-bookings'] },
//   { key: 'reviews', subItems: ['all-reviews'] },
//   { key: 'advertisements', subItems: ['all-advertisements', 'add-advertisement'] },
// ];

// const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
//   const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
//   const location = useLocation();

//   const toggleMenu = (key: string) => {
//     setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const getNestedSubItems = (parentKey: string): MenuItem[] => {
//     return menuItems.filter(item => item.key.startsWith(parentKey) && item.key !== parentKey);
//   };

//   return (
//     <div className="w-64 h-full bg-gray-800 text-white flex flex-col">
//       {/* Header */}
//       <div className="flex-shrink-0 p-4 sm:p-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-800 to-slate-700">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
//               <span className="text-white font-bold text-sm sm:text-lg">P</span>
//             </div>
//             <div className="text-white">
//               <h1 className="text-sm sm:text-lg font-bold leading-tight">PRNV</h1>
//               <p className="text-xs sm:text-sm opacity-90">Services</p>
//             </div>
//           </div>
//           {onClose && (
//             <button
//               onClick={onClose}
//               className="lg:hidden p-1 text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-colors"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Menu Content */}
//       <nav className="flex-1 overflow-y-auto">
//         {menuHierarchy.map((parent) => {
//           const parentItem = menuItems.find(item => item.key === parent.key);
//           const hasSubItems = parent.subItems.length > 0;
//           const isActive = location.pathname === parentItem?.path;

//           if (!parentItem) return null;

//           return (
//             <div key={parent.key}>
//               <div
//                 className={`flex items-center p-4 cursor-pointer transition-colors duration-200 ${
//                   isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
//                 }`}
//                 onClick={() => hasSubItems && toggleMenu(parent.key)}
//               >
//                 {hasSubItems ? (
//                   <>
//                     {parentItem.icon}
//                     <span className="ml-3">{parentItem.label}</span>
//                   </>
//                 ) : (
//                   <Link
//                     to={parentItem.path}
//                     className="flex items-center w-full"
//                     onClick={onClose}
//                   >
//                     {parentItem.icon}
//                     <span className="ml-3">{parentItem.label}</span>
//                   </Link>
//                 )}
//                 {hasSubItems && (
//                   <span className="ml-auto">
//                     {openMenus[parent.key] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
//                   </span>
//                 )}
//               </div>
//               {hasSubItems && openMenus[parent.key] && (
//                 <div className="ml-4">
//                   {parent.subItems.map((subKey) => {
//                     const subItem = menuItems.find(item => item.key === subKey);
//                     const isNestedParent = ['manage-users', 'manage-technicians', 'manage-franchises'].includes(subItem?.key || '');
//                     const nestedSubItems = isNestedParent ? getNestedSubItems(subItem?.key || '') : [];
//                     const isSubActive = location.pathname === subItem?.path;

//                     if (!subItem) return null;

//                     return (
//                       <div key={subItem.key}>
//                         <div
//                           className={`flex items-center p-4 cursor-pointer transition-colors duration-200 ${
//                             isSubActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
//                           }`}
//                           onClick={() => isNestedParent && toggleMenu(subItem.key)}
//                         >
//                           {isNestedParent ? (
//                             <>
//                               {subItem.icon}
//                               <span className="ml-3">{subItem.label}</span>
//                             </>
//                           ) : (
//                             <Link
//                               to={subItem.path}
//                               className="flex items-center w-full"
//                               onClick={onClose}
//                             >
//                               {subItem.icon}
//                               <span className="ml-3">{subItem.label}</span>
//                             </Link>
//                           )}
//                           {isNestedParent && (
//                             <span className="ml-auto">
//                               {openMenus[subItem.key] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
//                             </span>
//                           )}
//                         </div>
//                         {isNestedParent && openMenus[subItem.key] && (
//                           <div className="ml-4">
//                             {nestedSubItems.map((nestedItem) => {
//                               const isNestedActive = location.pathname === nestedItem.path;
//                               return (
//                                 <Link
//                                   key={nestedItem.key}
//                                   to={nestedItem.path}
//                                   className={`flex items-center p-4 cursor-pointer transition-colors duration-200 ${
//                                     isNestedActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
//                                   }`}
//                                   onClick={onClose}
//                                 >
//                                   {nestedItem.icon}
//                                   <span className="ml-3">{nestedItem.label}</span>
//                                 </Link>
//                               );
//                             })}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </nav>

//       {/* Footer */}
//       <div className="flex-shrink-0 p-4 border-t border-slate-200/50 bg-gradient-to-r from-slate-50 to-slate-100">
//         <div className="text-center">
//           <p className="text-xs text-slate-500">© 2024 PRNV Services</p>
//           <p className="text-xs text-slate-400">Admin Dashboard</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
// import React, { useState } from 'react';
// import { ChevronDown, ChevronRight, LayoutDashboard, Wrench, List, PlusSquare, CheckCircle, XCircle, BookOpen, Package, Settings, Users, UserCheck, Building2, MapPin, Calendar, Star, Image, X } from 'lucide-react';

// interface MenuItem {
//   key: string;
//   label: string;
//   icon: React.ReactNode;
// }

// interface MenuHierarchy {
//   key: string;
//   subItems: string[];
// }

// interface SidebarProps {
//   onClose?: () => void;
// }

// const menuItems: MenuItem[] = [
//   { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
//   { key: 'categories', label: 'Categories', icon: <Wrench size={20} /> },
//   { key: 'all-categories', label: 'All Categories', icon: <List size={20} /> },
//   { key: 'add-category', label: 'Add Category', icon: <PlusSquare size={20} /> },
//   { key: 'active-categories', label: 'Active Categories', icon: <CheckCircle size={20} /> },
//   { key: 'inactive-categories', label: 'Inactive Categories', icon: <XCircle size={20} /> },
//   { key: 'meta-info', label: 'Meta Info', icon: <BookOpen size={20} /> },
//   { key: 'all-meta-info', label: 'All Meta Info', icon: <List size={20} /> },
//   { key: 'add-meta-info', label: 'Add Meta Info', icon: <PlusSquare size={20} /> },
//   { key: 'subscription', label: 'Subscription', icon: <Package size={20} /> },
//   { key: 'all-subscriptions', label: 'All Subscriptions', icon: <List size={20} /> },
//   { key: 'add-subscription', label: 'Add Subscription', icon: <PlusSquare size={20} /> },
//   { key: 'management', label: 'Management', icon: <Settings size={20} /> },
//   { key: 'manage-users', label: 'Manage Users', icon: <Users size={20} /> },
//   { key: 'all-users', label: 'All Users', icon: <List size={20} /> },
//   { key: 'add-user', label: 'Add User', icon: <PlusSquare size={20} /> },
//   { key: 'admin-created-users', label: 'Admin Created Users', icon: <UserCheck size={20} /> },
//   { key: 'manage-technicians', label: 'Manage Technicians', icon: <UserCheck size={20} /> },
//   { key: 'all-technicians', label: 'All Technicians', icon: <List size={20} /> },
//   { key: 'add-technician', label: 'Add Technician', icon: <PlusSquare size={20} /> },
//   { key: 'admin-created-technicians', label: 'Admin Created Technicians', icon: <UserCheck size={20} /> },
//   { key: 'manage-franchises', label: 'Manage Franchises', icon: <Building2 size={20} /> },
//   { key: 'all-franchises', label: 'All Franchises', icon: <List size={20} /> },
//   { key: 'add-franchise', label: 'Add Franchise', icon: <PlusSquare size={20} /> },
//   { key: 'admin-created-franchises', label: 'Admin Created Franchises', icon: <Building2 size={20} /> },
//   { key: 'areas', label: 'Areas', icon: <MapPin size={20} /> },
//   { key: 'all-areas', label: 'All Areas', icon: <List size={20} /> },
//   { key: 'add-area', label: 'Add Area', icon: <PlusSquare size={20} /> },
//   { key: 'bookings', label: 'Bookings', icon: <Calendar size={20} /> },
//   { key: 'all-bookings', label: 'All Bookings', icon: <List size={20} /> },
//   { key: 'guest-bookings', label: 'Guest Bookings', icon: <Users size={20} /> },
//   { key: 'reviews', label: 'Reviews', icon: <Star size={20} /> },
//   { key: 'all-reviews', label: 'All Reviews', icon: <List size={20} /> },
//   { key: 'advertisements', label: 'Advertisements', icon: <Image size={20} /> },
//   { key: 'all-advertisements', label: 'All Advertisements', icon: <List size={20} /> },
//   { key: 'add-advertisement', label: 'Add Advertisement', icon: <PlusSquare size={20} /> },
// ];

// const menuHierarchy: MenuHierarchy[] = [
//   { key: 'dashboard', subItems: [] },
//   { key: 'categories', subItems: ['all-categories', 'add-category', 'active-categories', 'inactive-categories'] },
//   { key: 'meta-info', subItems: ['all-meta-info', 'add-meta-info'] },
//   { key: 'subscription', subItems: ['all-subscriptions', 'add-subscription'] },
//   { key: 'management', subItems: [
//     'manage-users', 'all-users', 'add-user', 'admin-created-users',
//     'manage-technicians', 'all-technicians', 'add-technician', 'admin-created-technicians',
//     'manage-franchises', 'all-franchises', 'add-franchise', 'admin-created-franchises'
//   ]},
//   { key: 'areas', subItems: ['all-areas', 'add-area'] },
//   { key: 'bookings', subItems: ['all-bookings', 'guest-bookings'] },
//   { key: 'reviews', subItems: ['all-reviews'] },
//   { key: 'advertisements', subItems: ['all-advertisements', 'add-advertisement'] },
// ];

// const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
//   const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

//   const toggleMenu = (key: string) => {
//     setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const getNestedSubItems = (parentKey: string): MenuItem[] => {
//     return menuItems.filter(item => item.key.startsWith(parentKey) && item.key !== parentKey);
//   };

//   return (
//     <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
//       {/* Header */}
//       <div className="flex-shrink-0 p-4 sm:p-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-800 to-slate-700">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
//               <span className="text-white font-bold text-sm sm:text-lg">P</span>
//             </div>
//             <div className="text-white">
//               <h1 className="text-sm sm:text-lg font-bold leading-tight">PRNV</h1>
//               <p className="text-xs sm:text-sm opacity-90">Services</p>
//             </div>
//           </div>
//           {onClose && (
//             <button
//               onClick={onClose}
//               className="lg:hidden p-1 text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-colors"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Menu Content */}
//       <nav className="flex-1 overflow-y-auto">
//         {menuHierarchy.map((parent) => {
//           const parentItem = menuItems.find(item => item.key === parent.key);
//           const hasSubItems = parent.subItems.length > 0;

//           if (!parentItem) return null;

//           return (
//             <div key={parent.key}>
//               <div
//                 className="flex items-center p-4 hover:bg-gray-700 cursor-pointer"
//                 onClick={() => hasSubItems && toggleMenu(parent.key)}
//               >
//                 {parentItem.icon}
//                 <span className="ml-3">{parentItem.label}</span>
//                 {hasSubItems && (
//                   <span className="ml-auto">
//                     {openMenus[parent.key] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
//                   </span>
//                 )}
//               </div>
//               {hasSubItems && openMenus[parent.key] && (
//                 <div className="ml-4">
//                   {parent.subItems.map((subKey) => {
//                     const subItem = menuItems.find(item => item.key === subKey);
//                     const isNestedParent = ['manage-users', 'manage-technicians', 'manage-franchises'].includes(subItem?.key || '');
//                     const nestedSubItems = isNestedParent ? getNestedSubItems(subItem?.key || '') : [];

//                     if (!subItem) return null;

//                     return (
//                       <div key={subItem.key}>
//                         <div
//                           className="flex items-center p-4 hover:bg-gray-700 cursor-pointer"
//                           onClick={() => isNestedParent && toggleMenu(subItem.key)}
//                         >
//                           {subItem.icon}
//                           <span className="ml-3">{subItem.label}</span>
//                           {isNestedParent && (
//                             <span className="ml-auto">
//                               {openMenus[subItem.key] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
//                             </span>
//                           )}
//                         </div>
//                         {isNestedParent && openMenus[subItem.key] && (
//                           <div className="ml-4">
//                             {nestedSubItems.map((nestedItem) => (
//                               <div
//                                 key={nestedItem.key}
//                                 className="flex items-center p-4 hover:bg-gray-700 cursor-pointer"
//                               >
//                                 {nestedItem.icon}
//                                 <span className="ml-3">{nestedItem.label}</span>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </nav>

//       {/* Footer */}
//       <div className="flex-shrink-0 p-4 border-t border-slate-200/50 bg-gradient-to-r from-slate-50 to-slate-100">
//         <div className="text-center">
//           <p className="text-xs text-slate-500">© 2024 PRNV Services</p>
//           <p className="text-xs text-slate-400">Admin Dashboard</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
// import React, { useState } from 'react';
// import {
//   Home, Wrench, Plus, List, XCircle, Settings, Star,
//   Calendar, MapPin, ChevronRight, ChevronDown, Users,
//   UserCheck, Building2, X, CheckCircle, Package, Image, LucideIcon,
//   BookOpen
// } from 'lucide-react';

// interface SidebarProps {
//   currentPage: string;
//   onPageChange: (page: string) => void;
//   onClose?: () => void;
// }

// interface SectionToggleProps {
//   section: string;
//   expanded: boolean;
//   onToggle: (section: string) => void;
//   Icon: LucideIcon;
// }

// const SectionToggle: React.FC<SectionToggleProps> = ({ section, expanded, onToggle, Icon }) => (
//   <button
//     onClick={() => onToggle(section)}
//     className="w-full flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200 group text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:translate-x-1"
//   >
//     <div className="p-1 rounded-lg mr-2 sm:mr-3 group-hover:bg-blue-100">
//       <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-slate-500 group-hover:text-blue-600" />
//     </div>
//     <span className="flex-1 text-left truncate text-xs sm:text-sm font-medium">{section}</span>
//     {expanded ? (
//       <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 group-hover:text-blue-600" />
//     ) : (
//       <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 group-hover:text-blue-600" />
//     )}
//   </button>
// );

// // Section to Icon mapping
// const sectionMeta: Record<string, { icon: LucideIcon }> = {
//   Categories: { icon: Wrench },
//   MetaInfo: { icon: BookOpen },
//   Subscription: { icon: Package },
//   Management: { icon: Settings },
//   Areas: { icon: MapPin },
//   Bookings: { icon: Calendar },
//   Reviews: { icon: Star },
//   Advertisements: { icon: Image },
// };

// const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, onClose }) => {
//   const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
//     Categories: true,
//     MetaInfo: false,
//     Subscription: false,
//     Management: false,
//     Areas: false,
//     Bookings: false,
//     Reviews: false,
//     Advertisements: false
//   });

//   const toggleSection = (section: string) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const handlePageChange = (page: string) => {
//     onPageChange(page);
//     if (onClose) onClose();
//   };

//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'Main' },
//     { id: 'categories', label: 'Categories', icon: Wrench, section: 'Categories', hasSubmenu: true },
//     { id: 'all-categories', label: 'All Categories', icon: List, section: 'Categories', isSubItem: true },
//     { id: 'add-category', label: 'Add Category', icon: Plus, section: 'Categories', isSubItem: true },
//     { id: 'active-categories', label: 'Active Categories', icon: CheckCircle, section: 'Categories', isSubItem: true },
//     { id: 'inactive-categories', label: 'Inactive Categories', icon: XCircle, section: 'Categories', isSubItem: true },
//     // { id: 'deleted-categories', label: 'Deleted Categories', icon: XCircle, section: 'Categories', isSubItem: true },

//     { id: 'meta-info', label: 'Meta Info', icon: BookOpen, section: 'MetaInfo', hasSubmenu: true },
//     { id: 'all-meta-info', label: 'All Meta Info', icon: List, section: 'MetaInfo', isSubItem: true },
//     { id: 'add-meta-info', label: 'Add Meta Info', icon: Plus, section: 'MetaInfo', isSubItem: true },

//     { id: 'subscription', label: 'Subscription', icon: Package, section: 'Subscription', hasSubmenu: true },
//     { id: 'all-subscriptions', label: 'All Subscriptions', icon: List, section: 'Subscription', isSubItem: true },
//     { id: 'add-subscription', label: 'Add Subscription', icon: Plus, section: 'Subscription', isSubItem: true },
//     // { id: 'deleted-subscriptions', label: 'Deleted Subscriptions', icon: XCircle, section: 'Subscription', isSubItem: true },

//     { id: 'management', label: 'Management', icon: Settings, section: 'Management', hasSubmenu: true },
//     { id: 'manage-users', label: 'Manage Users', icon: Users, section: 'Management', hasSubmenu: true, isSubItem: true },
//     { id: 'all-users', label: 'All Users', icon: List, section: 'Management', isSubItem: true, parentId: 'manage-users' },
//     { id: 'add-user', label: 'Add User', icon: Plus, section: 'Management', isSubItem: true, parentId: 'manage-users' },
//     { id: 'admin-created-users', label: 'Admin Created Users', icon: UserCheck, section: 'Management', isSubItem: true, parentId: 'manage-users' },

//     { id: 'manage-technicians', label: 'Manage Technicians', icon: UserCheck, section: 'Management', hasSubmenu: true, isSubItem: true },
//     { id: 'all-technicians', label: 'All Technicians', icon: List, section: 'Management', isSubItem: true, parentId: 'manage-technicians' },
//     { id: 'add-technician', label: 'Add Technician', icon: Plus, section: 'Management', isSubItem: true, parentId: 'manage-technicians' },
//     { id: 'admin-created-technicians', label: 'Admin Created Technicians', icon: UserCheck, section: 'Management', isSubItem: true, parentId: 'manage-technicians' },

//     { id: 'manage-franchises', label: 'Manage Franchises', icon: Building2, section: 'Management', hasSubmenu: true, isSubItem: true },
//     { id: 'all-franchises', label: 'All Franchises', icon: List, section: 'Management', isSubItem: true, parentId: 'manage-franchises' },
//     { id: 'add-franchise', label: 'Add Franchise', icon: Plus, section: 'Management', isSubItem: true, parentId: 'manage-franchises' },
//     { id: 'admin-created-franchises', label: 'Admin Created Franchises', icon: Building2, section: 'Management', isSubItem: true, parentId: 'manage-franchises' },

//     { id: 'areas', label: 'Areas', icon: MapPin, section: 'Areas', hasSubmenu: true },
//     { id: 'all-areas', label: 'All Areas', icon: List, section: 'Areas', isSubItem: true },
//     { id: 'add-area', label: 'Add Area', icon: Plus, section: 'Areas', isSubItem: true },

//     { id: 'bookings', label: 'Bookings', icon: Calendar, section: 'Bookings', hasSubmenu: true },
//     { id: 'all-bookings', label: 'All Bookings', icon: List, section: 'Bookings', isSubItem: true },
//     { id: 'guest-bookings', label: 'Guest Bookings', icon: Users, section: 'Bookings', isSubItem: true },

//     { id: 'reviews', label: 'Reviews', icon: Star, section: 'Reviews', hasSubmenu: true },
//     { id: 'all-reviews', label: 'All Reviews', icon: List, section: 'Reviews', isSubItem: true },

//     { id: 'advertisements', label: 'Advertisements', icon: Image, section: 'Advertisements', hasSubmenu: true },
//     { id: 'all-advertisements', label: 'All Advertisements', icon: List, section: 'Advertisements', isSubItem: true },
//     { id: 'add-advertisement', label: 'Add Advertisement', icon: Plus, section: 'Advertisements', isSubItem: true },
//   ];

//   const groupedItems = menuItems.reduce((acc, item) => {
//     if (!acc[item.section]) acc[item.section] = [];
//     acc[item.section].push(item);
//     return acc;
//   }, {} as Record<string, typeof menuItems>);

//   return (
//     <div className="w-64 bg-white/95 backdrop-blur-md shadow-2xl h-full flex flex-col border-r border-slate-200/50">
//       {/* Header */}
//       <div className="flex-shrink-0 p-4 sm:p-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-800 to-slate-700">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
//               <span className="text-white font-bold text-sm sm:text-lg">P</span>
//             </div>
//             <div className="text-white">
//               <h1 className="text-sm sm:text-lg font-bold leading-tight">PRNV</h1>
//               <p className="text-xs sm:text-sm opacity-90">Services</p>
//             </div>
//           </div>
//           {onClose && (
//             <button
//               onClick={onClose}
//               className="lg:hidden p-1 text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-colors"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Nav Items */}
//       <nav className="flex-1 overflow-y-auto py-4">
//         {Object.entries(groupedItems).map(([section, items]) => (
//           <div key={section} className="mb-2">
//             {section !== 'Main' && sectionMeta[section] && (
//               <SectionToggle
//                 section={section}
//                 expanded={expandedSections[section]}
//                 onToggle={toggleSection}
//                 Icon={sectionMeta[section].icon}
//               />
//             )}

//             {(section === 'Main' || expandedSections[section]) && (
//               <div className="space-y-1">
//                 {items.map(item => {
//                     if (item.hasSubmenu && !item.isSubItem) return null;
//                     return(
//                   <div key={item.id}>
//                     <button
//                       onClick={() => handlePageChange(item.id)}
//                       className={`w-full flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200 group ${
//                         currentPage === item.id
//                           ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-r-4 border-blue-700 shadow-lg transform translate-x-1'
//                           : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:translate-x-1'
//                       } ${item.isSubItem ? (item.parentId ? 'pl-12 sm:pl-16' : 'pl-8 sm:pl-12') : ''}`}
//                     >
//                       <div className={`p-1 rounded-lg mr-2 sm:mr-3 transition-all duration-200 ${
//                         currentPage === item.id
//                           ? 'bg-white/20'
//                           : 'group-hover:bg-blue-100'
//                       }`}>
//                         <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-all duration-200 ${
//                           currentPage === item.id
//                             ? 'text-white'
//                             : 'text-slate-500 group-hover:text-blue-600'
//                         }`} />
//                       </div>
//                       <span className="flex-1 text-left truncate text-xs sm:text-sm font-medium">{item.label}</span>
//                       {item.hasSubmenu && !item.isSubItem && (
//                         <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 transition-all duration-200 ${
//                           currentPage === item.id
//                             ? 'text-white'
//                             : 'text-slate-400 group-hover:text-blue-600'
//                         }`} />
//                       )}
//                     </button>
//                   </div>
//                     )
// })}
//               </div>
//             )}
//           </div>
//         ))}
//       </nav>

//       {/* Footer */}
//       <div className="flex-shrink-0 p-4 border-t border-slate-200/50 bg-gradient-to-r from-slate-50 to-slate-100">
//         <div className="text-center">
//           <p className="text-xs text-slate-500">© 2024 PRNV Services</p>
//           <p className="text-xs text-slate-400">Admin Dashboard</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


// import React, { useState } from 'react';
// import { 
//   Home, 
//   Wrench, 
//   Plus, 
//   List, 
//   XCircle, 
//   Settings, 
//   Star, 
//   Calendar, 
//   MapPin,
//   ChevronRight,
//   ChevronDown,
//   Users,
//   UserCheck,
//   Building2,
//   X,
//   CheckCircle,
//   Package,
//   Image
// } from 'lucide-react';
// interface SidebarProps {
//   currentPage: string;
//   onPageChange: (page: string) => void;
//   onClose?: () => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, onClose }) => {
//   const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
//     'Categories': true,
//     'Subscription': false,
//     'Management': false,
//     'Areas': false,
//     'Bookings': false,
//     'Reviews': false,
//     'Advertisements': false
//   });

//   const toggleSection = (section: string) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//       }));
//   };

//   const handlePageChange = (page: string) => {
//     onPageChange(page);
//     if (onClose) {
//       onClose();
//     }

//      };

//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'Main' },
    
//     // Categories Section
//     { id: 'categories', label: 'Categories', icon: Wrench, section: 'Categories', hasSubmenu: true },
//     { id: 'all-categories', label: 'All Categories', icon: List, section: 'Categories', isSubItem: true },
//     { id: 'add-category', label: 'Add Category', icon: Plus, section: 'Categories', isSubItem: true },
//     { id: 'active-categories', label: 'Active Categories', icon: CheckCircle, section: 'Categories', isSubItem: true },
//     { id: 'inactive-categories', label: 'Inactive Categories', icon: XCircle, section: 'Categories', isSubItem: true },
//     { id: 'deleted-categories', label: 'Deleted Categories', icon: XCircle, section: 'Categories', isSubItem: true },

//     // Subscription Section
//     { id: 'subscription', label: 'Subscription', icon: Package, section: 'Subscription', hasSubmenu: true },
//     { id: 'all-subscriptions', label: 'All Subscriptions', icon: List, section: 'Subscription', isSubItem: true },
//     { id: 'add-subscription', label: 'Add Subscription', icon: Plus, section: 'Subscription', isSubItem: true },
//     { id: 'deleted-subscriptions', label: 'Deleted Subscriptions', icon: XCircle, section: 'Subscription', isSubItem: true },

//     // Management Section
//     { id: 'management', label: 'Management', icon: Settings, section: 'Management', hasSubmenu: true },
    
//     // Manage Users
//     { id: 'manage-users', label: 'Manage Users', icon: Users, section: 'Management', hasSubmenu: true, isSubItem: true },
//     { id: 'all-users', label: 'All Users', icon: List, section: 'Management', isSubItem: true, parentId: 'manage-users' },
//     { id: 'add-user', label: 'Add User', icon: Plus, section: 'Management', isSubItem: true, parentId: 'manage-users' },
//     { id: 'admin-created-users', label: 'Admin Created Users', icon: UserCheck, section: 'Management', isSubItem: true, parentId: 'manage-users' },

//     // Manage Technicians
//     { id: 'manage-technicians', label: 'Manage Technicians', icon: UserCheck, section: 'Management', hasSubmenu: true, isSubItem: true },
//     { id: 'all-technicians', label: 'All Technicians', icon: List, section: 'Management', isSubItem: true, parentId: 'manage-technicians' },
//     { id: 'add-technician', label: 'Add Technician', icon: Plus, section: 'Management', isSubItem: true, parentId: 'manage-technicians' },
//     { id: 'admin-created-technicians', label: 'Admin Created Technicians', icon: UserCheck, section: 'Management', isSubItem: true, parentId: 'manage-technicians' },

//     // Manage Franchises
//     { id: 'manage-franchises', label: 'Manage Franchises', icon: Building2, section: 'Management', hasSubmenu: true, isSubItem: true },
//     { id: 'all-franchises', label: 'All Franchises', icon: List, section: 'Management', isSubItem: true, parentId: 'manage-franchises' },
//     { id: 'add-franchise', label: 'Add Franchise', icon: Plus, section: 'Management', isSubItem: true, parentId: 'manage-franchises' },
//     { id: 'admin-created-franchises', label: 'Admin Created Franchises', icon: Building2, section: 'Management', isSubItem: true, parentId: 'manage-franchises' },

//     // Areas Section
//     { id: 'areas', label: 'Areas', icon: MapPin, section: 'Areas', hasSubmenu: true },
//     { id: 'all-areas', label: 'All Areas', icon: List, section: 'Areas', isSubItem: true },
//     { id: 'add-area', label: 'Add Area', icon: Plus, section: 'Areas', isSubItem: true },

//     // Bookings Section
//     { id: 'bookings', label: 'Bookings', icon: Calendar, section: 'Bookings', hasSubmenu: true },
//     { id: 'all-bookings', label: 'All Bookings', icon: List, section: 'Bookings', isSubItem: true },
//     { id: 'guest-bookings', label: 'Guest Bookings', icon: Users, section: 'Bookings', isSubItem: true },

//     // Reviews Section
//     { id: 'reviews', label: 'Reviews', icon: Star, section: 'Reviews', hasSubmenu: true },
//     { id: 'all-reviews', label: 'All Reviews', icon: List, section: 'Reviews', isSubItem: true },

//     // Advertisements Section
//     { id: 'advertisements', label: 'Advertisements', icon: Image, section: 'Advertisements', hasSubmenu: true },
//     { id: 'all-advertisements', label: 'All Advertisements', icon: List, section: 'Advertisements', isSubItem: true },
//     { id: 'add-advertisement', label: 'Add Advertisement', icon: Plus, section: 'Advertisements', isSubItem: true },
//     ];

//   const groupedItems = menuItems.reduce((acc, item) => {
//     if (!acc[item.section]) {
//       acc[item.section] = [];
//     }
//     acc[item.section].push(item);
//     return acc;
//   }, {} as Record<string, typeof menuItems>);

//   return (
//     <div className="w-64 bg-white/95 backdrop-blur-md shadow-2xl h-full flex flex-col border-r border-slate-200/50">
//       {/* Header - Fixed */}
//       <div className="flex-shrink-0 p-4 sm:p-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-800 to-slate-700">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
//               <span className="text-white font-bold text-sm sm:text-lg">P</span>
//             </div>
//             <div className="text-white">
//               <h1 className="text-sm sm:text-lg font-bold leading-tight">PRNV</h1>
//               <p className="text-xs sm:text-sm opacity-90">Services</p>
//             </div>
//           </div>
//           {onClose && (
//             <button 
//               onClick={onClose}
//               className="lg:hidden p-1 text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-colors"
//             >
//               <X className="h-5 w-5" />
//             </button>
//             )}
//         </div>
//       </div>
      
    
//       <nav className="flex-1 overflow-y-auto py-4  ">
//         {Object.entries(groupedItems).map(([section, items]) => (
//           <div key={section} className="mb-2">
//             {section !== 'Main' && (
//               <button
//                 onClick={() => toggleSection(section)}
//                 className="w-full flex items-center justify-between px-4 sm:px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 hover:bg-slate-50/50 transition-all duration-200 group"
//               >
//                 <span className="truncate">{section}</span>
//                 <div className="transform transition-transform duration-200 group-hover:scale-110">
//                   {expandedSections[section] ? (
//                     <ChevronDown className="h-3 w-3 flex-shrink-0" />
//                   ) : (
//                     <ChevronRight className="h-3 w-3 flex-shrink-0" />
//                   )}
//                 </div>
//               </button>
//             )}
            
//             {(section === 'Main' || expandedSections[section]) && (
//               <div className="space-y-1">
//                 {items.map((item) => (
//                   <div key={item.id}>
//                     <button
//                       onClick={() => handlePageChange(item.id)}
//                       className={`w-full flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200 group ${
//                         currentPage === item.id
//                           ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-r-4 border-blue-700 shadow-lg transform translate-x-1'
//                           : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:translate-x-1'
//                       } ${item.isSubItem ? (item.parentId ? 'pl-12 sm:pl-16' : 'pl-8 sm:pl-12') : ''}`}
//                     >
//                       <div className={`p-1 rounded-lg mr-2 sm:mr-3 transition-all duration-200 ${
//                         currentPage === item.id 
//                           ? 'bg-white/20' 
//                           : 'group-hover:bg-blue-100'
//                       }`}>
//                         <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-all duration-200 ${
//                           currentPage === item.id 
//                             ? 'text-white' 
//                             : 'text-slate-500 group-hover:text-blue-600'
//                         }`} />
//                       </div>
//                       <span className="flex-1 text-left truncate text-xs sm:text-sm font-medium">
//                         {item.label}
//                       </span>
//                       {item.hasSubmenu && !item.isSubItem && (
//                         <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 transition-all duration-200 ${
//                           currentPage === item.id 
//                             ? 'text-white' 
//                             : 'text-slate-400 group-hover:text-blue-600'
//                         }`} />
//                       )}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </nav>

       
//       <div className="flex-shrink-0 p-4 border-t border-slate-200/50 bg-gradient-to-r from-slate-50 to-slate-100">
//         <div className="text-center">
//           <p className="text-xs text-slate-500">© 2024 PRNV Services</p>
//           <p className="text-xs text-slate-400">Admin Dashboard</p>
//         </div>
//         </div>
//     </div>
//   );
// };

// export default Sidebar;
