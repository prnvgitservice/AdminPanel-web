import React, { useState } from 'react';
import {
  Home, Wrench, Plus, List, XCircle, Settings, Star,
  Calendar, MapPin, ChevronRight, ChevronDown, Users,
  UserCheck, Building2, X, CheckCircle, Package, Image, LucideIcon,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onClose?: () => void;
}

interface SectionToggleProps {
  section: string;
  expanded: boolean;
  onToggle: (section: string) => void;
  Icon: LucideIcon;
}

const SectionToggle: React.FC<SectionToggleProps> = ({ section, expanded, onToggle, Icon }) => (
  <button
    onClick={() => onToggle(section)}
    className="w-full flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200 group text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:translate-x-1"
  >
    <div className="p-1 rounded-lg mr-2 sm:mr-3 group-hover:bg-blue-100">
      <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-slate-500 group-hover:text-blue-600" />
    </div>
    <span className="flex-1 text-left truncate text-xs sm:text-sm font-medium">{section}</span>
    {expanded ? (
      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 group-hover:text-blue-600" />
    ) : (
      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 group-hover:text-blue-600" />
    )}
  </button>
);

// Section to Icon mapping
const sectionMeta: Record<string, { icon: LucideIcon }> = {
  Categories: { icon: Wrench },
  MetaInfo: { icon: BookOpen },
  Subscription: { icon: Package },
  Management: { icon: Settings },
  Areas: { icon: MapPin },
  Bookings: { icon: Calendar },
  Reviews: { icon: Star },
  Advertisements: { icon: Image },
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, onClose }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Categories: true,
    MetaInfo: false,
    Subscription: false,
    Management: false,
    Areas: false,
    Bookings: false,
    Reviews: false,
    Advertisements: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePageChange = (page: string) => {
    onPageChange(page);
    if (onClose) onClose();
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'Main' },
    { id: 'categories', label: 'Categories', icon: Wrench, section: 'Categories', hasSubmenu: true },
    { id: 'all-categories', label: 'All Categories', icon: List, section: 'Categories', isSubItem: true },
    { id: 'add-category', label: 'Add Category', icon: Plus, section: 'Categories', isSubItem: true },
    { id: 'active-categories', label: 'Active Categories', icon: CheckCircle, section: 'Categories', isSubItem: true },
    { id: 'inactive-categories', label: 'Inactive Categories', icon: XCircle, section: 'Categories', isSubItem: true },
    { id: 'deleted-categories', label: 'Deleted Categories', icon: XCircle, section: 'Categories', isSubItem: true },

    { id: 'meta-info', label: 'Meta Info', icon: BookOpen, section: 'MetaInfo', hasSubmenu: true },
    { id: 'all-meta-info', label: 'All Meta Info', icon: List, section: 'MetaInfo', isSubItem: true },
    { id: 'add-meta-info', label: 'Add Meta Info', icon: Plus, section: 'MetaInfo', isSubItem: true },

    { id: 'subscription', label: 'Subscription', icon: Package, section: 'Subscription', hasSubmenu: true },
    { id: 'all-subscriptions', label: 'All Subscriptions', icon: List, section: 'Subscription', isSubItem: true },
    { id: 'add-subscription', label: 'Add Subscription', icon: Plus, section: 'Subscription', isSubItem: true },
    { id: 'deleted-subscriptions', label: 'Deleted Subscriptions', icon: XCircle, section: 'Subscription', isSubItem: true },

    { id: 'management', label: 'Management', icon: Settings, section: 'Management', hasSubmenu: true },
    { id: 'manage-users', label: 'Manage Users', icon: Users, section: 'Management', hasSubmenu: true, isSubItem: true },
    { id: 'all-users', label: 'All Users', icon: List, section: 'Management', isSubItem: true, parentId: 'manage-users' },
    { id: 'add-user', label: 'Add User', icon: Plus, section: 'Management', isSubItem: true, parentId: 'manage-users' },
    { id: 'admin-created-users', label: 'Admin Created Users', icon: UserCheck, section: 'Management', isSubItem: true, parentId: 'manage-users' },

    { id: 'manage-technicians', label: 'Manage Technicians', icon: UserCheck, section: 'Management', hasSubmenu: true, isSubItem: true },
    { id: 'all-technicians', label: 'All Technicians', icon: List, section: 'Management', isSubItem: true, parentId: 'manage-technicians' },
    { id: 'add-technician', label: 'Add Technician', icon: Plus, section: 'Management', isSubItem: true, parentId: 'manage-technicians' },
    { id: 'admin-created-technicians', label: 'Admin Created Technicians', icon: UserCheck, section: 'Management', isSubItem: true, parentId: 'manage-technicians' },

    { id: 'manage-franchises', label: 'Manage Franchises', icon: Building2, section: 'Management', hasSubmenu: true, isSubItem: true },
    { id: 'all-franchises', label: 'All Franchises', icon: List, section: 'Management', isSubItem: true, parentId: 'manage-franchises' },
    { id: 'add-franchise', label: 'Add Franchise', icon: Plus, section: 'Management', isSubItem: true, parentId: 'manage-franchises' },
    { id: 'admin-created-franchises', label: 'Admin Created Franchises', icon: Building2, section: 'Management', isSubItem: true, parentId: 'manage-franchises' },

    { id: 'areas', label: 'Areas', icon: MapPin, section: 'Areas', hasSubmenu: true },
    { id: 'all-areas', label: 'All Areas', icon: List, section: 'Areas', isSubItem: true },
    { id: 'add-area', label: 'Add Area', icon: Plus, section: 'Areas', isSubItem: true },

    { id: 'bookings', label: 'Bookings', icon: Calendar, section: 'Bookings', hasSubmenu: true },
    { id: 'all-bookings', label: 'All Bookings', icon: List, section: 'Bookings', isSubItem: true },
    { id: 'guest-bookings', label: 'Guest Bookings', icon: Users, section: 'Bookings', isSubItem: true },

    { id: 'reviews', label: 'Reviews', icon: Star, section: 'Reviews', hasSubmenu: true },
    { id: 'all-reviews', label: 'All Reviews', icon: List, section: 'Reviews', isSubItem: true },

    { id: 'advertisements', label: 'Advertisements', icon: Image, section: 'Advertisements', hasSubmenu: true },
    { id: 'all-advertisements', label: 'All Advertisements', icon: List, section: 'Advertisements', isSubItem: true },
    { id: 'add-advertisement', label: 'Add Advertisement', icon: Plus, section: 'Advertisements', isSubItem: true },
  ];

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

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
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section} className="mb-2">
            {section !== 'Main' && sectionMeta[section] && (
              <SectionToggle
                section={section}
                expanded={expandedSections[section]}
                onToggle={toggleSection}
                Icon={sectionMeta[section].icon}
              />
            )}

            {(section === 'Main' || expandedSections[section]) && (
              <div className="space-y-1">
                {items.map(item => {
                    if (item.hasSubmenu && !item.isSubItem) return null;
                    return(
                  <div key={item.id}>
                    <button
                      onClick={() => handlePageChange(item.id)}
                      className={`w-full flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200 group ${
                        currentPage === item.id
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-r-4 border-blue-700 shadow-lg transform translate-x-1'
                          : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:translate-x-1'
                      } ${item.isSubItem ? (item.parentId ? 'pl-12 sm:pl-16' : 'pl-8 sm:pl-12') : ''}`}
                    >
                      <div className={`p-1 rounded-lg mr-2 sm:mr-3 transition-all duration-200 ${
                        currentPage === item.id
                          ? 'bg-white/20'
                          : 'group-hover:bg-blue-100'
                      }`}>
                        <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-all duration-200 ${
                          currentPage === item.id
                            ? 'text-white'
                            : 'text-slate-500 group-hover:text-blue-600'
                        }`} />
                      </div>
                      <span className="flex-1 text-left truncate text-xs sm:text-sm font-medium">{item.label}</span>
                      {item.hasSubmenu && !item.isSubItem && (
                        <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 transition-all duration-200 ${
                          currentPage === item.id
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-blue-600'
                        }`} />
                      )}
                    </button>
                  </div>
                    )
})}
              </div>
            )}
          </div>
        ))}
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
