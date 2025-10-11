import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Wrench, Plus, List, XCircle, CheckCircle, Settings, Star,
  Calendar, MapPin, ChevronRight, ChevronDown, Users,
  UserCheck, Building2, X, Package, Image, BookOpen, FileText,
  Crown, 
  MailQuestion,
  UserCog,
  Cable,
  Mail,
  Briefcase,
  UserPlus,
  User
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

// Array of menu items defining the sidebar navigation
const menuItems: MenuItem[] = [
  // Dashboard: Main landing page of the admin panel
  { key: 'dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/dashboard' },

  // Categories: Parent item for managing service categories
  { key: 'categories', label: 'Categories', icon: <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/categories' },
  // Sub-item: View all categories
  { key: 'all-categories', label: 'All Categories', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/categories/all' },
  // Sub-item: Add a new category
  { key: 'add-category', label: 'Add Category', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/categories/add' },

  // Services: Parent item for managing service categories
  { key: 'services', label: 'Services', icon: <UserCog className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/services' },
  // Sub-item: View all services
  { key: 'all-services', label: 'All Services', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/services/all' },
  // Sub-item: Add a new service
  { key: 'add-service', label: 'Add Service', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/services/add' },

  // Blogs: Separate parent item for managing blogs
  { key: 'blogs', label: 'Blogs', icon: <FileText className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/blogs' },
  { key: 'all-blogs', label: 'All Blogs', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/blogs/all' },
  { key: 'add-blog', label: 'Add Blog', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/blogs/add' },

  // Meta Info: Parent item for managing metadata (e.g., SEO or content details)
  { key: 'meta-info', label: 'Meta Info', icon: <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/meta-info' },
  // Sub-item: View all metadata entries
  { key: 'all-meta-info', label: 'All Meta Info', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/meta-info/all' },
  // Sub-item: Add new metadata
  { key: 'add-meta-info', label: 'Add Meta Info', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/meta-info/add' },

  // Subscription: Parent item for managing subscription plans
  { key: 'subscription', label: 'Subscription', icon: <Package className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/subscription' },
  // Sub-item: View all subscriptions
  { key: 'all-subscriptions', label: 'All Subscriptions', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/subscription/all' },
  // Sub-item: Add a new subscription plan
  { key: 'add-subscription', label: 'Add Subscription', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/subscription/add' },

  // Franchise Plans: Parent item for managing franchise-related plans
  { key: 'franchise-plans', label: 'Franchise Plans', icon: <FileText className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/franchise-plans' },
  // Sub-item: View all franchise plans
  { key: 'all-franchise-plans', label: 'All Plans', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/franchise-plans/all' },
  // Sub-item: Add a new franchise plan
  { key: 'add-franchise-plan', label: 'Add Plan', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/franchise-plans/add' },

  // Management: Parent item for user, technician, and franchise management
  { key: 'management', label: 'Management', icon: <Settings className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management' },
  // Sub-item: Manage users (parent for user-related actions)
  { key: 'manage-users', label: 'Manage Users', icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/users' },
  // Sub-sub-item: View all users
  { key: 'all-users', label: 'All Users', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/users/all' },
  // Sub-sub-item: Add a new user
  { key: 'add-user', label: 'Add User', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/users/add' },

  // Sub-item: Manage technicians (parent for technician-related actions)
  { key: 'manage-technicians', label: 'Manage Technicians', icon: <UserCheck className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/technicians' },
  // Sub-sub-item: View all technicians
  { key: 'all-technicians', label: 'All Technicians', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/technicians/all' },
  // Sub-sub-item: Add a new technician
  { key: 'add-technician', label: 'Add Technician', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/technicians/add' },

  // Sub-item: Manage franchises (parent for franchise-related actions)
  { key: 'manage-franchises', label: 'Manage Franchises', icon: <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/franchises' },
  // Sub-sub-item: View all franchises
  { key: 'all-franchises', label: 'All Franchises', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/franchises/all' },
  // Sub-sub-item: Add a new franchise
  { key: 'add-franchise', label: 'Add Franchise', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/franchises/add' },

  // Sub-item: Manage executives (parent for executive-related actions)
  { key: 'manage-executives', label: 'Manage Executives', icon: <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/executives' },
  // Sub-sub-item: View all executives
  { key: 'all-executives', label: 'All Executives', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/executives/all' },
  // Sub-sub-item: Add a new executive
  { key: 'add-executive', label: 'Add Executive', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/executives/add' },

  // Sub-item: Manage referrals (parent for referral-related actions)
  { key: 'manage-referrals', label: 'Manage Referrals', icon: <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/referrals' },
  // Sub-sub-item: View all referrals
  { key: 'all-referrals', label: 'All Referrals', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/referrals/all' },
  // Sub-sub-item: Add a new referral
  { key: 'add-referral', label: 'Add Referral', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/referrals/add' },

  // Areas: Parent item for managing service areas
  { key: 'areas', label: 'Areas', icon: <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/areas' },
  // Sub-item: View all areas
  { key: 'all-areas', label: 'All Areas', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/areas/all' },
  // Sub-item: Add a new area
  { key: 'add-area', label: 'Add Area', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/areas/add' },

  // Bookings: Parent item for managing bookings
  { key: 'bookings', label: 'Bookings', icon: <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/bookings' },
  // Sub-item: View all bookings
  { key: 'all-bookings', label: 'All Bookings', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/bookings/all' },
  // Sub-item: View guest (non-registered user) bookings
  { key: 'guest-bookings', label: 'Guest Bookings', icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/bookings/guest' },

  // Advertisements: Parent item for managing ads
  { key: 'advertisements', label: 'Advertisements', icon: <Image className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/advertisements' },
  // Sub-item: View all advertisements
  { key: 'all-advertisements', label: 'All Advertisements', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/advertisements/all' },
  // Sub-item: Add a new advertisement
  { key: 'add-advertisement', label: 'Add Advertisement', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/advertisements/add' },

  // Reviews: Parent item for managing user reviews
  { key: 'reviews', label: 'Reviews', icon: <Star className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/reviews' },
  // Sub-item: View all reviews
  { key: 'all-reviews', label: 'All Reviews', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/reviews/all' },

  // Enquiries: Parent item for enquiry-related actions
  { key: 'enquiries', label: 'Enquiries', icon: <MailQuestion className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/enquiries' },
  // Sub-item: View franchise requests
  { key: 'franchise-requests', label: 'Franchise Requests', icon: <Crown className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/franchise-requests' },
  // Sub-item: Get in Touch
  { key: 'get-in-touch', label: 'Get In Touch', icon: <Mail className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/get-in-touch' },

  {key: 'technician-requests', label: 'Technician Requests', icon: <User className='h-4 w-4 sm:h-5 sm:h-5' /> ,path:'/technician-requests' },
  
  // Sitemap: Parent item for managing the sitemap
  { key: 'sitemap', label: 'Sitemap', icon: <Cable className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/sitemap' },
];

const menuHierarchy: MenuHierarchy[] = [
  // Dashboard: Top-level item with no sub-items
  { key: 'dashboard', subItems: [] },

  // Categories: Parent with sub-items for managing categories
  { key: 'categories', subItems: ['all-categories', 'add-category'] },

  // Services: Parent with sub-items for managing services
  { key: 'services', subItems: ['all-services', 'add-service'] },

  // Blogs: Separate parent with sub-items for managing blogs
  { key: 'blogs', subItems: ['all-blogs', 'add-blog'] },

  // Meta Info: Parent with sub-items for managing metadata
  { key: 'meta-info', subItems: ['all-meta-info', 'add-meta-info'] },

  // Subscription: Parent with sub-items for managing subscriptions
  { key: 'subscription', subItems: ['all-subscriptions', 'add-subscription'] },

  // Franchise Plans: Parent with sub-items for managing franchise plans
  { key: 'franchise-plans', subItems: ['all-franchise-plans', 'add-franchise-plan'] },

  // Management: Parent with nested sub-items for users, technicians, franchises, executives, and referrals
  { key: 'management', subItems: [
    'manage-users', 'all-users', 'add-user', // User management sub-items
    'manage-technicians', 'all-technicians', 'add-technician', // Technician management sub-items
    'manage-franchises', 'all-franchises', 'add-franchise', // Franchise management sub-items
    'manage-executives', 'all-executives', 'add-executive', // Executive management sub-items
    'manage-referrals', 'all-referrals', 'add-referral' // Referral management sub-items
  ]},

  // Areas: Parent with sub-items for managing service areas
  { key: 'areas', subItems: ['all-areas', 'add-area'] },

  // Bookings: Parent with sub-items for managing bookings
  { key: 'bookings', subItems: ['all-bookings', 'guest-bookings'] },

  // Enquiries: Parent with sub-items for enquiry-related actions
  { key: 'enquiries', subItems: ['franchise-requests', 'get-in-touch' ,'technician-requests'] },

  // Reviews: Parent with sub-item for managing reviews
  { key: 'reviews', subItems: ['all-reviews'] },

  // Advertisements: Parent with sub-items for managing ads
  { key: 'advertisements', subItems: ['all-advertisements', 'add-advertisement'] },

  // Sitemap: Parent item for managing the sitemap
  { key: 'sitemap', subItems: [] },
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
                    const isNestedParent = ['manage-users', 'manage-technicians', 'manage-franchises', 'manage-executives', 'manage-referrals'].includes(subItem?.key || '');
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
// import {
//   Home, Wrench, Plus, List, XCircle, CheckCircle, Settings, Star,
//   Calendar, MapPin, ChevronRight, ChevronDown, Users,
//   UserCheck, Building2, X, Package, Image, BookOpen, FileText,
//   Crown, 
//   MailQuestion,
//   UserCog,
//   Cable,
//   Mail
// } from 'lucide-react';

// interface MenuItem {
//   key: string;
//   label: string;
//   icon: React.ReactNode;
//   path: string;
// }

// interface MenuHierarchy {
//   key: string;
//   subItems: string[];
// }

// interface SidebarProps {
//   onClose?: () => void;
// }

// // Array of menu items defining the sidebar navigation
// const menuItems: MenuItem[] = [
//   // Dashboard: Main landing page of the admin panel
//   { key: 'dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/dashboard' },

//   // Categories: Parent item for managing service categories
//   { key: 'categories', label: 'Categories', icon: <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/categories' },
//   // Sub-item: View all categories
//   { key: 'all-categories', label: 'All Categories', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/categories/all' },
//   // Sub-item: Add a new category
//   { key: 'add-category', label: 'Add Category', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/categories/add' },

//   // Services: Parent item for managing service categories
//   { key: 'services', label: 'Services', icon: <UserCog className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/services' },
//   // Sub-item: View all services
//   { key: 'all-services', label: 'All Services', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/services/all' },
//   // Sub-item: Add a new service
//   { key: 'add-service', label: 'Add Service', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/services/add' },

//   // Blogs: Separate parent item for managing blogs
//   { key: 'blogs', label: 'Blogs', icon: <FileText className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/blogs' },
//   { key: 'all-blogs', label: 'All Blogs', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/blogs/all' },
//   { key: 'add-blog', label: 'Add Blog', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/blogs/add' },

//   // Meta Info: Parent item for managing metadata (e.g., SEO or content details)
//   { key: 'meta-info', label: 'Meta Info', icon: <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/meta-info' },
//   // Sub-item: View all metadata entries
//   { key: 'all-meta-info', label: 'All Meta Info', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/meta-info/all' },
//   // Sub-item: Add new metadata
//   { key: 'add-meta-info', label: 'Add Meta Info', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/meta-info/add' },

//   // Subscription: Parent item for managing subscription plans
//   { key: 'subscription', label: 'Subscription', icon: <Package className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/subscription' },
//   // Sub-item: View all subscriptions
//   { key: 'all-subscriptions', label: 'All Subscriptions', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/subscription/all' },
//   // Sub-item: Add a new subscription plan
//   { key: 'add-subscription', label: 'Add Subscription', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/subscription/add' },

//   // Franchise Plans: Parent item for managing franchise-related plans
//   { key: 'franchise-plans', label: 'Franchise Plans', icon: <FileText className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/franchise-plans' },
//   // Sub-item: View all franchise plans
//   { key: 'all-franchise-plans', label: 'All Plans', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/franchise-plans/all' },
//   // Sub-item: Add a new franchise plan
//   { key: 'add-franchise-plan', label: 'Add Plan', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/franchise-plans/add' },

//   // Management: Parent item for user, technician, and franchise management
//   { key: 'management', label: 'Management', icon: <Settings className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management' },
//   // Sub-item: Manage users (parent for user-related actions)
//   { key: 'manage-users', label: 'Manage Users', icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/users' },
//   // Sub-sub-item: View all users
//   { key: 'all-users', label: 'All Users', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/users/all' },
//   // Sub-sub-item: Add a new user
//   { key: 'add-user', label: 'Add User', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/users/add' },

//   // Sub-item: Manage technicians (parent for technician-related actions)
//   { key: 'manage-technicians', label: 'Manage Technicians', icon: <UserCheck className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/technicians' },
//   // Sub-sub-item: View all technicians
//   { key: 'all-technicians', label: 'All Technicians', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/technicians/all' },
//   // Sub-sub-item: Add a new technician
//   { key: 'add-technician', label: 'Add Technician', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/technicians/add' },

//   // Sub-item: Manage franchises (parent for franchise-related actions)
//   { key: 'manage-franchises', label: 'Manage Franchises', icon: <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/franchises' },
//   // Sub-sub-item: View all franchises
//   { key: 'all-franchises', label: 'All Franchises', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/franchises/all' },
//   // Sub-sub-item: Add a new franchise
//   { key: 'add-franchise', label: 'Add Franchise', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/management/franchises/add' },

//   // Areas: Parent item for managing service areas
//   { key: 'areas', label: 'Areas', icon: <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/areas' },
//   // Sub-item: View all areas
//   { key: 'all-areas', label: 'All Areas', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/areas/all' },
//   // Sub-item: Add a new area
//   { key: 'add-area', label: 'Add Area', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/areas/add' },

//   // Bookings: Parent item for managing bookings
//   { key: 'bookings', label: 'Bookings', icon: <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/bookings' },
//   // Sub-item: View all bookings
//   { key: 'all-bookings', label: 'All Bookings', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/bookings/all' },
//   // Sub-item: View guest (non-registered user) bookings
//   { key: 'guest-bookings', label: 'Guest Bookings', icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/bookings/guest' },

//   // Advertisements: Parent item for managing ads
//   { key: 'advertisements', label: 'Advertisements', icon: <Image className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/advertisements' },
//   // Sub-item: View all advertisements
//   { key: 'all-advertisements', label: 'All Advertisements', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/advertisements/all' },
//   // Sub-item: Add a new advertisement
//   { key: 'add-advertisement', label: 'Add Advertisement', icon: <Plus className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/advertisements/add' },

//   // Reviews: Parent item for managing user reviews
//   { key: 'reviews', label: 'Reviews', icon: <Star className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/reviews' },
//   // Sub-item: View all reviews
//   { key: 'all-reviews', label: 'All Reviews', icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/reviews/all' },

//   // Enquiries: Parent item for enquiry-related actions
//   { key: 'enquiries', label: 'Enquiries', icon: <MailQuestion className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/enquiries' },
//   // Sub-item: View franchise requests
//   { key: 'franchise-requests', label: 'Franchise Requests', icon: <Crown className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/franchise-requests' },
//   // Sub-item: Get in Touch
//   { key: 'get-in-touch', label: 'Get In Touch', icon: <Mail className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/get-in-touch' },
  
//   // Sitemap: Parent item for managing the sitemap
//   { key: 'sitemap', label: 'Sitemap', icon: <Cable className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/sitemap' },
// ];

// const menuHierarchy: MenuHierarchy[] = [
//   // Dashboard: Top-level item with no sub-items
//   { key: 'dashboard', subItems: [] },

//   // Categories: Parent with sub-items for managing categories
//   { key: 'categories', subItems: ['all-categories', 'add-category'] },

//   // Services: Parent with sub-items for managing services
//   { key: 'services', subItems: ['all-services', 'add-service'] },

//   // Blogs: Separate parent with sub-items for managing blogs
//   { key: 'blogs', subItems: ['all-blogs', 'add-blog'] },

//   // Meta Info: Parent with sub-items for managing metadata
//   { key: 'meta-info', subItems: ['all-meta-info', 'add-meta-info'] },

//   // Subscription: Parent with sub-items for managing subscriptions
//   { key: 'subscription', subItems: ['all-subscriptions', 'add-subscription'] },

//   // Franchise Plans: Parent with sub-items for managing franchise plans
//   { key: 'franchise-plans', subItems: ['all-franchise-plans', 'add-franchise-plan'] },

//   // Management: Parent with nested sub-items for users, technicians, and franchises
//   { key: 'management', subItems: [
//     'manage-users', 'all-users', 'add-user', // User management sub-items
//     'manage-technicians', 'all-technicians', 'add-technician', // Technician management sub-items
//     'manage-franchises', 'all-franchises', 'add-franchise' // Franchise management sub-items
//   ]},

//   // Areas: Parent with sub-items for managing service areas
//   { key: 'areas', subItems: ['all-areas', 'add-area'] },

//   // Bookings: Parent with sub-items for managing bookings
//   { key: 'bookings', subItems: ['all-bookings', 'guest-bookings'] },

//   // Enquiries: Parent with sub-items for enquiry-related actions
//   { key: 'enquiries', subItems: ['franchise-requests', 'get-in-touch'] },

//   // Reviews: Parent with sub-item for managing reviews
//   { key: 'reviews', subItems: ['all-reviews'] },

//   // Advertisements: Parent with sub-items for managing ads
//   { key: 'advertisements', subItems: ['all-advertisements', 'add-advertisement'] },

//   // Sitemap: Parent item for managing the sitemap
//   { key: 'sitemap', subItems: [] },
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
//         {menuHierarchy.map((parent) => {
//           const parentItem = menuItems.find(item => item.key === parent.key);
//           const hasSubItems = parent.subItems.length > 0;
//           const isActive = location.pathname === parentItem?.path;

//           if (!parentItem) return null;

//           return (
//             <div key={parent.key} className="mb-2">
//               {hasSubItems ? (
//                 <button
//                   onClick={() => toggleMenu(parent.key)}
//                   className="w-full flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200 group text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:translate-x-1"
//                 >
//                   <div className="p-1 rounded-lg mr-2 sm:mr-3 group-hover:bg-blue-100">
//                     {parentItem.icon}
//                   </div>
//                   <span className="flex-1 text-left truncate text-xs sm:text-sm font-medium">{parentItem.label}</span>
//                   {openMenus[parent.key] ? (
//                     <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 group-hover:text-blue-600" />
//                   ) : (
//                     <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 group-hover:text-blue-600" />
//                   )}
//                 </button>
//               ) : (
//                 <Link
//                   to={parentItem.path}
//                   className={`w-full flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200 group ${
//                     isActive
//                       ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-r-4 border-blue-700 shadow-lg transform translate-x-1'
//                       : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:translate-x-1'
//                   }`}
//                   onClick={onClose}
//                 >
//                   <div className={`p-1 rounded-lg mr-2 sm:mr-3 transition-all duration-200 ${
//                     isActive ? 'bg-white/20' : 'group-hover:bg-blue-100'
//                   }`}>
//                     {parentItem.icon}
//                   </div>
//                   <span className="flex-1 text-left truncate text-xs sm:text-sm font-medium">{parentItem.label}</span>
//                 </Link>
//               )}

//               {hasSubItems && openMenus[parent.key] && (
//                 <div className="space-y-1">
//                   {parent.subItems.map((subKey) => {
//                     const subItem = menuItems.find(item => item.key === subKey);
//                     const isNestedParent = ['manage-users', 'manage-technicians', 'manage-franchises'].includes(subItem?.key || '');
//                     const nestedSubItems = isNestedParent ? getNestedSubItems(subItem?.key || '') : [];
//                     const isSubActive = location.pathname === subItem?.path;

//                     if (!subItem) return null;

//                     return (
//                       <div key={subItem.key}>
//                         {isNestedParent ? (
//                           <button
//                             onClick={() => toggleMenu(subItem.key)}
//                             className={`w-full flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200 group ${
//                               isSubActive
//                                 ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-r-4 border-blue-700 shadow-lg transform translate-x-1'
//                                 : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:translate-x-1'
//                             } pl-8 sm:pl-12`}
//                           >
//                             <div className={`p-1 rounded-lg mr-2 sm:mr-3 transition-all duration-200 ${
//                               isSubActive ? 'bg-white/20' : 'group-hover:bg-blue-100'
//                             }`}>
//                               {subItem.icon}
//                             </div>
//                             <span className="flex-1 text-left truncate text-xs sm:text-sm font-medium">{subItem.label}</span>
//                             {openMenus[subItem.key] ? (
//                               <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-200 ${
//                                 isSubActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
//                               }`} />
//                             ) : (
//                               <ChevronRight className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-200 ${
//                                 isSubActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
//                               }`} />
//                             )}
//                           </button>
//                         ) : (
//                           <Link
//                             to={subItem.path}
//                             className={`w-full flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200 group ${
//                               isSubActive
//                                 ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-r-4 border-blue-700 shadow-lg transform translate-x-1'
//                                 : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:translate-x-1'
//                             } pl-8 sm:pl-12`}
//                             onClick={onClose}
//                           >
//                             <div className={`p-1 rounded-lg mr-2 sm:mr-3 transition-all duration-200 ${
//                               isSubActive ? 'bg-white/20' : 'group-hover:bg-blue-100'
//                             }`}>
//                               {subItem.icon}
//                             </div>
//                             <span className="flex-1 text-left truncate text-xs sm:text-sm font-medium">{subItem.label}</span>
//                           </Link>
//                         )}

//                         {isNestedParent && openMenus[subItem.key] && (
//                           <div className="space-y-1">
//                             {nestedSubItems.map((nestedItem) => {
//                               const isNestedActive = location.pathname === nestedItem.path;
//                               return (
//                                 <Link
//                                   key={nestedItem.key}
//                                   to={nestedItem.path}
//                                   className={`w-full flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200 group ${
//                                     isNestedActive
//                                       ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-r-4 border-blue-700 shadow-lg transform translate-x-1'
//                                       : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:translate-x-1'
//                                   } pl-12 sm:pl-16`}
//                                   onClick={onClose}
//                                 >
//                                   <div className={`p-1 rounded-lg mr-2 sm:mr-3 transition-all duration-200 ${
//                                     isNestedActive ? 'bg-white/20' : 'group-hover:bg-blue-100'
//                                   }`}>
//                                     {nestedItem.icon}
//                                   </div>
//                                   <span className="flex-1 text-left truncate text-xs sm:text-sm font-medium">{nestedItem.label}</span>
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