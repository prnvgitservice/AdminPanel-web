import React, { useEffect, useState } from 'react';
import { Filter, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ReferralProps {
  onAddReferral?: () => void;
}

interface ReferralData {
  id: string;
  referralId: string;
  referralName: string;
  mobileNumber: string;
  joinDate: string;
  address: string;
  totalReferrals: number;
}

// Mock API service function
const getAllReferrals = async () => {
  return new Promise<{ referrals: ReferralData[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        referrals: [
          {
            id: '1',
            referralId: 'REF-001',
            referralName: 'Alice Williams',
            mobileNumber: '9876543210',
            joinDate: '20-01-2024',
            address: '456 Referral Street, Mumbai, 400002',
            totalReferrals: 15
          },
          {
            id: '2',
            referralId: 'REF-002',
            referralName: 'Robert Brown',
            mobileNumber: '8765432109',
            joinDate: '28-02-2024',
            address: '789 Network Plaza, Delhi, 110002',
            totalReferrals: 23
          },
          {
            id: '3',
            referralId: 'REF-003',
            referralName: 'Jennifer Taylor',
            mobileNumber: '7654321098',
            joinDate: '15-03-2024',
            address: '321 Connection Ave, Bangalore, 560002',
            totalReferrals: 18
          },
          {
            id: '4',
            referralId: 'REF-004',
            referralName: 'Kevin Martinez',
            mobileNumber: '6543210987',
            joinDate: '12-04-2024',
            address: '654 Partner Road, Chennai, 600002',
            totalReferrals: 9
          },
          {
            id: '5',
            referralId: 'REF-005',
            referralName: 'Lisa Anderson',
            mobileNumber: '5432109876',
            joinDate: '25-05-2024',
            address: '987 Alliance Street, Pune, 411002',
            totalReferrals: 31
          }
        ]
      });
    }, 1000);
  });
};

const AllReferrals: React.FC<ReferralProps> = ({ onAddReferral }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    referralName: '',
    mobileNumber: ''
  });
  const navigate = useNavigate();

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReferrals = referrals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(referrals.length / itemsPerPage);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFilterSubmit = () => {
    console.log('Applying filters:', filters);
    setShowFilter(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Action handlers
  const handleView = (id: string) => {
    navigate(`/management/referrals/view/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/management/referrals/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this referral?')) {
      console.log(`Delete referral with ID: ${id}`);
    }
  };

  const fetchAllReferrals = async () => {
    try {
      setLoading(true);
      const response = await getAllReferrals();
      if (response?.referrals) {
        setReferrals(response.referrals);
      } else {
        setError('Invalid response format');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch referrals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReferrals();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Referrals</h1>
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button 
              onClick={onAddReferral}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 animate-in slide-in-from-top duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Referral Name</label>
                <select
                  value={filters.referralName}
                  onChange={(e) => handleFilterChange('referralName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select referral name</option>
                  {referrals.map(referral => (
                    <option key={referral.id} value={referral.referralName}>
                      {referral.referralName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile No</label>
                <select
                  value={filters.mobileNumber}
                  onChange={(e) => handleFilterChange('mobileNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Mobile No</option>
                  {referrals.map(referral => (
                    <option key={referral.id} value={referral.mobileNumber}>
                      {referral.mobileNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleFilterSubmit}
                className="px-8 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Show</label>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={16}>16</option>
                </select>
                <span className="text-sm text-gray-700">entries</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referral Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referral ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Referrals</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : currentReferrals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No referrals found
                    </td>
                  </tr>
                ) : (
                  currentReferrals.map((referral) => (
                    <tr key={referral.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{referral.referralName}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{referral.referralId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{referral.mobileNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{referral.joinDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs">
                        <div className="truncate">{referral.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {referral.totalReferrals}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEdit(referral.id)}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleView(referral.id)}
                            className="text-green-600 hover:text-green-800 transition-colors duration-150"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(referral.id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-150"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">{Math.min(indexOfLastItem, referrals.length)}</span> of{' '}
              <span className="font-medium">{referrals.length}</span> referrals
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${currentPage === 1 
                  ? 'bg-gray-200 cursor-not-allowed text-gray-500' 
                  : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'}`}
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded-md ${currentPage === index + 1 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${currentPage === totalPages 
                  ? 'bg-gray-200 cursor-not-allowed text-gray-500' 
                  : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  
};

export default AllReferrals;