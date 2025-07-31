import { useState, useRef } from 'react';
import { Star } from 'lucide-react';
import { getCompanyReviews } from '../api/apiMethods';

interface ReviewModalProps {
  user: AuthenticatedUser | null;
  selectedRating: number;
  comment: string;
  setSelectedRating: (val: number) => void;
  setComment: (val: string) => void;
  setShowReviewModal: (val: boolean) => void;
  showReviewModal: boolean;
}

interface ReviewData {
  [key: string]: string | number;
  role: string;
  rating: number;
  comment: string;
}

interface AuthenticatedUser {
  id: string;
  role: 'user' | 'technician';
  name?: string;
  username?: string;
}

interface User {
  id: string;
  role: 'user' | 'technician';
  username: string;
}

const CompanyReviewModal: React.FC<ReviewModalProps> = ({
  showReviewModal,
  setShowReviewModal,
  selectedRating,
  comment,
  setSelectedRating,
  setComment,
  user,
}) => {
  const reviewModalRef = useRef<HTMLDivElement>(null);

  const localUser: User | null = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') as string)
    : null;

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

    if (!localUser || !localUser.id || !localUser.role) {
      alert('User information is missing. Please log in.');
      return;
    }

    const reviewData: ReviewData = {
      [localUser.role === 'user' ? 'userId' : 'technicianId']: localUser.id,
      role: localUser.role,
      rating: selectedRating,
      comment: comment,
    };

    try {
      const response = await getCompanyReviews(reviewData);
      if (response) {
        console.log('Review submitted successfully!');
        setShowReviewModal(false);
        setSelectedRating(0);
        setComment('');
      } else {
        console.error('Failed to submit review:', response.statusText);
        alert('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  if (!showReviewModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
      onClick={handleBackgroundClick}
      onTouchStart={handleBackgroundClick}
    >
      <div
        ref={reviewModalRef}
        className="bg-white p-6 rounded-lg shadow-lg w-96 animate-fade-in"
      >
        <h2 className="text-lg font-medium mb-4 text-gray-700 text-center">
          💥 Boom! Review Time!
        </h2>
        <form onSubmit={handleReviewSubmit} className="flex flex-col">
          <p className="text-sm font-medium mb-2 text-gray-700">Name</p>
          <input
            type="text"
            className="p-2 border border-gray-300 rounded-lg mb-4"
            value={localUser?.username || 'Anonymous'}
            readOnly
          />
          <p className="text-sm font-medium mb-2 text-gray-700">Rating</p>
          <div className="flex justify-center space-x-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-12 h-12 cursor-pointer transition-colors ${
                  star <= selectedRating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
                onClick={() => setSelectedRating(star)}
              />
            ))}
          </div>
          <p className="text-sm font-medium mb-2 text-gray-700">Comment</p>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            rows={4}
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyReviewModal;
