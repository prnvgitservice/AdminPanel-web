import { useState, useRef } from 'react';
import { Star } from 'lucide-react';
import { createCompanyReview } from '../../api/apiMethods';

interface ReviewModalProps {
  showReviewModal: boolean;
  setShowReviewModal: (show: boolean) => void;
  user: AuthenticatedUser | null;
  selectedRating: number;
  comment: string;
  setSelectedRating: (val: number) => void;
  setComment: (val: string) => void;
  onReviewSubmitted?: () => void;
}

interface AuthenticatedUser {
  id: string;
  role: 'user' | 'technician';
  username?: string;
}

const CompanyReviewModal: React.FC<ReviewModalProps> = ({ 
  showReviewModal, 
  setShowReviewModal, 
  user,
  selectedRating,
  comment,
  setSelectedRating,
  setComment,
  onReviewSubmitted
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const reviewModalRef = useRef<HTMLDivElement>(null);

  const handleBackgroundClick = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (e.target === e.currentTarget) {
      setShowReviewModal(false);
      setSelectedRating(0);
      setComment('');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || !user.id || !user.role) {
      alert('User information is missing. Please log in.');
      return;
    }

    if (!selectedRating || selectedRating === 0) {
      alert('Please select a rating.');
      return;
    }

    if (!comment.trim()) {
      alert('Please enter a comment.');
      return;
    }

    setIsSubmitting(true);

    // Prepare data according to backend structure
    const reviewData = {
      [user.role === 'user' ? 'userId' : 'technicianId']: user.id,
      role: user.role,
      rating: selectedRating,
      comment: comment.trim(),
    };

    try {
      const response = await createCompanyReview(reviewData);
      
      // Handle backend response structure
      if (response?.success) {
        alert('Thank you for your review!');
        setShowReviewModal(false);
        setSelectedRating(0);
        setComment('');
        onReviewSubmitted?.();
      } else {
        throw new Error(response?.message || 'Failed to submit review');
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      const errorMessage = error?.response?.data?.message || 
                         error?.message || 
                         'An error occurred. Please try again later.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showReviewModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleBackgroundClick}
      onTouchStart={handleBackgroundClick}
    >
      <div
        ref={reviewModalRef}
        className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md animate-fade-in"
      >
        <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">
          💥 Share Your Experience!
        </h2>
        
        <form onSubmit={handleReviewSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              value={user?.username || 'Anonymous'}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-gray-700">
              Rating *
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 transition-all duration-200 ${
                      star <= selectedRating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {selectedRating > 0 && (
              <p className="text-center text-sm text-gray-600 mt-2">
                {selectedRating === 1 && "Poor"}
                {selectedRating === 2 && "Fair"}
                {selectedRating === 3 && "Good"}
                {selectedRating === 4 && "Very Good"}
                {selectedRating === 5 && "Excellent"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Comment *
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={4}
              placeholder="Tell us about your experience with our services..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/500 characters
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowReviewModal(false);
                setSelectedRating(0);
                setComment('');
              }}
              className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedRating || !comment.trim()}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyReviewModal;