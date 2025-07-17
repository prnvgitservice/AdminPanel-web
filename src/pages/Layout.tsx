import React, { useState } from 'react';
import { Menu, Eye, Bell, MessageCircle, User, X } from 'lucide-react';
import Sidebar from './Sidebar';


interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 h-full
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar
          currentPage={currentPage} 
          onPageChange={onPageChange}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200/50 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center">
              <button 
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="ml-2 lg:ml-0 text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
                PRNV Services Admin
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={() => window.open('https://prnv-services.netlify.app/', '_blank')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 hidden sm:block group"
              >
                <Eye className="h-5 w-5 text-slate-600 group-hover:text-blue-600" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 group relative">
                <Bell className="h-5 w-5 text-slate-600 group-hover:text-blue-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 hidden sm:block group">
                <MessageCircle className="h-5 w-5 text-slate-600 group-hover:text-blue-600" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 group">
                <User className="h-5 w-5 text-slate-600 group-hover:text-blue-600" />
              </button>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;