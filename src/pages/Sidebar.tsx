import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

const Sidebar = ({ currentPage, onPageChange, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePageChange = (id) => {
    onPageChange(id);
    if (onClose) onClose();
  };

  const menu = [
    {
      id: 'categories',
      label: 'Categories',
      children: [
        { id: 'all-categories', label: 'All Categories' },
        { id: 'add-category', label: 'Add Category' },
        { id: 'active-categories', label: 'Active Categories' },
        { id: 'inactive-categories', label: 'Inactive Categories' },
        { id: 'deleted-categories', label: 'Deleted Categories' },
      ],
    },
    {
      id: 'subscription',
      label: 'Subscription',
      children: [
        { id: 'all-subscriptions', label: 'All Subscriptions' },
        { id: 'add-subscription', label: 'Add Subscription' },
        { id: 'deleted-subscriptions', label: 'Deleted Subscriptions' },
      ],
    },
    {
      id: 'management',
      label: 'Management',
      children: [
        {
          id: 'manage-users',
          label: 'Manage Users',
          children: [
            { id: 'all-users', label: 'All Users' },
            { id: 'add-user', label: 'Add User' },
            { id: 'admin-created-users', label: 'Admin Created Users' },
          ],
        },
        {
          id: 'manage-technicians',
          label: 'Manage Technicians',
          children: [
            { id: 'all-technicians', label: 'All Technicians' },
            { id: 'add-technician', label: 'Add Technician' },
            { id: 'admin-created-technicians', label: 'Admin Created Technicians' },
          ],
        },
        {
          id: 'manage-franchises',
          label: 'Manage Franchises',
          children: [
            { id: 'all-franchises', label: 'All Franchises' },
            { id: 'add-franchise', label: 'Add Franchise' },
            { id: 'admin-created-franchises', label: 'Admin Created Franchises' },
          ],
        },
      ],
    },
  ];

  const renderMenu = (items, level = 0) => {
    return items.map((item) => {
      const isExpanded = expandedSections[item.id];
      const isActive = currentPage === item.id;

      return (
        <div key={item.id} className={`ml-${level * 2} mb-1`}>
          <button
            onClick={() => (item.children ? toggleSection(item.id) : handlePageChange(item.id))}
            className={`flex items-center w-full px-4 py-2 rounded-md transition-all duration-200 group
              ${isActive
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md font-semibold'
                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
              }
            `}
          >
            {item.children && (
              <span className="mr-2">
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
            )}
            <span>{item.label}</span>
          </button>

          {item.children && isExpanded && (
            <div className="mt-1">{renderMenu(item.children, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-60 h-screen fixed left-0 top-0 bg-white border-r border-gray-200 px-2 py-4">
      <div className="px-4 pb-2 font-bold text-xl text-slate-800">
        <span className="text-blue-700">PRNV</span> Services
      </div>
      <div className="mt-4 overflow-y-auto h-[calc(100vh-80px)] pr-2">
        {renderMenu(menu)}
      </div>
    </div>
  );
};

export default Sidebar;
