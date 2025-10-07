import React, { useState, useEffect } from 'react';
import { Star, Plus, User, Calendar, MessageSquare, Filter, Search, RefreshCw } from 'lucide-react';
import { getCompanyReviews } from '../../api/apiMethods';
import CompanyReviewModal from './CompanyReviewModal';

interface Review {
  _id: string;
  userId?: string;
  technicianId?: string;
  role: 'user' | 'technician';
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    username: string;
  };
  technician?: {
    username: string;
  };
}

const CompanyReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [thisMonthCount, setThisMonthCount] = useState(0);

  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') as string)
    : null;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getCompanyReviews();
      
      if (response?.success && Array.isArray(response.result)) {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Calculate this month's reviews
        const monthlyCount = response.result.filter(review => {
          const reviewDate = new Date(review.createdAt);
          return (
            reviewDate.getMonth() === currentMonth &&
            reviewDate.getFullYear() === currentYear
          );
        }).length;
        
        setThisMonthCount(monthlyCount);
        setReviews(response.result);
      } else {
        setError(response?.message || 'Failed to fetch reviews');
        setReviews([]);
      }
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      setError(err.message || 'Failed to load reviews. Please try again later.');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleRefresh = () => {
    fetchReviews();
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return '0.0';
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    return distribution;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReviews = reviews.filter(review => {
    const matchesRating = filterRating ? review.rating === filterRating : true;
    const matchesSearch = searchTerm ? 
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (review.technician?.username?.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    return matchesRating && matchesSearch;
  });

  const renderStars = (rating: number, size: string = 'w-4 h-4') => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const onReviewSubmitted = () => {
    fetchReviews();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
              <span className="text-lg text-gray-600">Loading reviews...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Reviews</h1>
              <p className="text-gray-600">View all reviews</p>
            </div>
            {/* <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button> */}
              {/* {user && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Review
                </button>
              )} */}
            {/* </div> */}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600">
                <p className="font-medium">Error loading reviews</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{reviews.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900">{getAverageRating()}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">5 Star Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{getRatingDistribution()[5] || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Star className="w-6 h-6 text-green-600 fill-current" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-gray-900">{thisMonthCount}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700">Filter:</span>
              
              <select
                value={filterRating || ''}
                onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="relative">
              <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
            </div>
            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full lg:w-64"
              />
            </div> */}
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-500">
                {reviews.length === 0 
                  ? "No reviews have been submitted yet."
                  : "No reviews match your current filters."
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <div key={review._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {review.role === 'user' 
                              ? (review.reviewer?.username || 'Anonymous User')
                              : (review.reviewer?.username || 'Anonymous Technician')
                            }
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            review.role === 'user' 
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {review.role === 'user' ? 'User' : 'Technician'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <CompanyReviewModal
            showReviewModal={showReviewModal}
            setShowReviewModal={setShowReviewModal}
            user={user}
            selectedRating={selectedRating}
            comment={comment}
            setSelectedRating={setSelectedRating}
            setComment={setComment}
            onReviewSubmitted={onReviewSubmitted}
          />
        )}
      </div>
    </div>
  );
};

export default CompanyReviews;