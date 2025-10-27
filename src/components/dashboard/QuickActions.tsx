// components/QuickActions.tsx
import React from 'react';
import { UserCog, UserCheck, Wrench, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/management/users/all')}
          className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <UserCog className="h-6 w-6 mx-auto mb-2" />
          <span className="text-sm font-medium">Manage Users</span>
        </button>
        <button
          onClick={() => navigate('/management/technicians/all')}
          className="p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <UserCheck className="h-6 w-6 mx-auto mb-2" />
          <span className="text-sm font-medium">Manage Technicians</span>
        </button>
        <button
          onClick={() => navigate('/categories/all')}
          className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Wrench className="h-6 w-6 mx-auto mb-2" />
          <span className="text-sm font-medium">Manage Categories</span>
        </button>
        <button
          onClick={() => navigate('/management/franchises/all')}
          className="p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Building2 className="h-6 w-6 mx-auto mb-2" />
          <span className="text-sm font-medium">Manage Franchise</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;