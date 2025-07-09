import React from 'react';
import { Users, UserCheck, Wrench, CreditCard, TrendingUp, MapPin, Eye, ExternalLink, Building2, UserCog } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Technicians', value: '87', icon: UserCog, color: 'bg-gradient-to-r from-blue-500 to-blue-600', change: '+8%' },
    { label: 'Total Users', value: '38', icon: Users, color: 'bg-gradient-to-r from-emerald-500 to-emerald-600', change: '+12%' },
    { label: 'Total Categories', value: '226', icon: Wrench, color: 'bg-gradient-to-r from-purple-500 to-purple-600', change: '+15%' },
    { label: 'Revenue', value: '₹333,957', icon: CreditCard, color: 'bg-gradient-to-r from-amber-500 to-amber-600', change: '+23%' },
    { label: 'Total Franchise', value: '15', icon: Building2, color: 'bg-gradient-to-r from-indigo-500 to-indigo-600', change: '+5%' },
  ];

  const recentBookings = [
    { id: 1, name: 'MOKILA SHANKER YADHAV', date: '05 Aug 2024', service: 'Hardware Service', status: 'Completed', price: '₹1500' },
    { id: 2, name: 'Surla Raju', date: '05 Aug 2024', service: 'AC Service', status: 'In Progress', price: '₹2500' },
    { id: 3, name: 'INDRA RAM', date: '03 Aug 2024', service: 'Repair Service', status: 'Cancelled', price: '₹0' },
    { id: 4, name: 'Pujari Chandan', date: '02 Aug 2024', service: 'Plumbing Service', status: 'Completed', price: '₹800' },
    { id: 5, name: 'JAMES GANDHALA', date: '10 Jul 2024', service: 'Electrical Service', status: 'Pending', price: '₹1200' },
  ];

  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', users: 65, revenue: 28000, bookings: 45 },
    { month: 'Feb', users: 78, revenue: 32000, bookings: 52 },
    { month: 'Mar', users: 90, revenue: 45000, bookings: 68 },
    { month: 'Apr', users: 81, revenue: 38000, bookings: 61 },
    { month: 'May', users: 95, revenue: 52000, bookings: 75 },
    { month: 'Jun', users: 110, revenue: 61000, bookings: 89 },
  ];

  const categoryData = [
    { name: 'AC Services', value: 35, color: '#3B82F6' },
    { name: 'Plumbing', value: 25, color: '#10B981' },
    { name: 'Electrical', value: 20, color: '#8B5CF6' },
    { name: 'Cleaning', value: 15, color: '#F59E0B' },
    { name: 'Others', value: 5, color: '#EF4444' },
  ];

  const handleViewWebsite = () => {
    window.open('https://prnv-services.netlify.app/', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Welcome Admin!
            </h1>
            <p className="text-slate-600 mt-2">Here's what's happening with your business today.</p>
          </div>
          <button
            onClick={handleViewWebsite}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Eye className="h-5 w-5 mr-2" />
            View Website
            <ExternalLink className="h-4 w-4 ml-2" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`${stat.color} p-3 rounded-xl shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl sm:text-3xl font-bold text-slate-800">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-emerald-600 text-sm font-semibold">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {stat.change}
                  </div>
                  <p className="text-xs text-slate-500">vs last month</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Revenue Trend</h2>
              <div className="flex items-center text-emerald-600 text-sm font-semibold">
                <TrendingUp className="h-4 w-4 mr-1" />
                +23% this month
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="url(#revenueGradient)" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                />
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bookings Chart */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Monthly Bookings</h2>
              <div className="flex items-center text-blue-600 text-sm font-semibold">
                <TrendingUp className="h-4 w-4 mr-1" />
                +15% growth
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar dataKey="bookings" fill="url(#bookingsGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Categories & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Categories Pie Chart */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Service Categories</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Areas Map */}
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Service Areas</h2>
              <div className="flex items-center text-blue-600 text-sm font-semibold">
                <MapPin className="h-4 w-4 mr-1" />
                12 Active Locations
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl h-64 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
              <div className="text-center z-10">
                <MapPin className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Interactive Map</h3>
                <p className="text-slate-600 text-sm">Service coverage across major cities</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'].map((city) => (
                    <span key={city} className="px-3 py-1 bg-white/80 text-slate-700 rounded-full text-xs font-medium">
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-sm font-medium text-white">
                              {booking.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{booking.name}</div>
                            <div className="text-sm text-slate-500">{booking.date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{booking.service}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : booking.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : booking.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <UserCog className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Manage Users</span>
              </button>
              <button className="p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <UserCheck className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Manage Technicians</span>
              </button>
              <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <Wrench className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Manage Categories</span>
              </button>
              <button 
                onClick={handleViewWebsite}
                className="p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Building2 className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Manage Franchise</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;