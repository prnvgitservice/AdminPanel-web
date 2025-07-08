import React, { useState } from 'react';
import { Filter, Download, Calendar } from 'lucide-react';

const ProvidersDetails: React.FC = () => {
  const [filters, setFilters] = useState({
    providerName: '',
    subscriptionType: '',
    paymentFromDate: '',
    paymentToDate: '',
    joiningFromDate: '',
    joiningToDate: '',
    nextRenewalDate: ''
  });

  const providersData = [
    {
      id: 1,
      dateOfJoining: '2024-05-28',
      providerName: 'VENKATESH THANNIRU',
      paymentType: 'Paid',
      plan: 'BASIC PLAN',
      amountPaid: 3540,
      bdaWalletAddedAmount: 1200,
      amountUsed: 4720,
      amountBalance: 2321,
      nextRenewalDate: '2024-06-28'
    }
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFilterSubmit = () => {
    console.log('Applying filters:', filters);
  };

  const handleDownloadExcel = () => {
    console.log('Downloading Excel...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Providers Details</h1>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Filter Panel */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider Name</label>
              <select
                value={filters.providerName}
                onChange={(e) => handleFilterChange('providerName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select provider name</option>
                <option value="venkatesh">VENKATESH THANNIRU</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Type</label>
              <select
                value={filters.subscriptionType}
                onChange={(e) => handleFilterChange('subscriptionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select Subscription Type</option>
                <option value="basic">Basic Plan</option>
                <option value="premium">Premium Plan</option>
                <option value="enterprise">Enterprise Plan</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment (From Date)</label>
              <div className="relative">
                <input
                  type="date"
                  value={filters.paymentFromDate}
                  onChange={(e) => handleFilterChange('paymentFromDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment (To Date)</label>
              <div className="relative">
                <input
                  type="date"
                  value={filters.paymentToDate}
                  onChange={(e) => handleFilterChange('paymentToDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Joining (From Date)</label>
              <div className="relative">
                <input
                  type="date"
                  value={filters.joiningFromDate}
                  onChange={(e) => handleFilterChange('joiningFromDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Joining (To Date)</label>
              <div className="relative">
                <input
                  type="date"
                  value={filters.joiningToDate}
                  onChange={(e) => handleFilterChange('joiningToDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Next Renewal Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={filters.nextRenewalDate}
                  onChange={(e) => handleFilterChange('nextRenewalDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleFilterSubmit}
              className="px-8 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors duration-200"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Download Button */}
        <div className="mb-6">
          <button
            onClick={handleDownloadExcel}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Excel
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Show</span>
                <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span className="text-sm text-gray-600">entries</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Search:</span>
                <input 
                  type="text" 
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-full sm:w-auto"
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Joining</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PLAN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BDA Wallet + Prnv Added Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Renewal Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {providersData.map((provider) => (
                  <tr key={provider.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{provider.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{provider.dateOfJoining}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{provider.providerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{provider.paymentType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{provider.plan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{provider.amountPaid}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{provider.bdaWalletAddedAmount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{provider.amountUsed}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{provider.amountBalance}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{provider.nextRenewalDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded hover:from-blue-600 hover:to-blue-700 transition-colors duration-150">
                        Renew Plan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvidersDetails;