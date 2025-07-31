import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

function AllReviews() {
  const [page, setPage] = useState(0);
  const reviewsPerPage = 3;

  // Dummy reviews data for UI display
  const [reviews, setReviews] = useState([
    {
      name: "Soujanya",
      role: "Frontend Developer",
      rating: 5,
      comment: "Excellent service! Highly recommended.",
    },
    {
      name: "Rahul",
      role: "Software Engineer",
      rating: 4,
      comment: "Very professional and prompt response.",
    },
    {
      name: "Priya",
      role: "Project Manager",
      rating: 5,
      comment: "Customer support was outstanding.",
    },
    {
      name: "Kiran",
      role: "Full Stack Developer",
      rating: 3,
      comment: "Good experience but can be improved.",
    },
    {
      name: "Aarav",
      role: "UX Designer",
      rating: 4,
      comment: "Loved the overall design and communication.",
    },
    {
      name: "Sneha",
      role: "HR Manager",
      rating: 5,
      comment: "They understood our needs perfectly!",
    },
  ]);

  // Uncomment this for API integration
  // const fetchCompanyReviews = async () => {
  //   try {
  //     const response = await getComp();
  //     if (response?.success) {
  //       const data = response.result;
  //       console.log('Company reviews fetched successfully:', response);
  //       setReviews(data);
  //     } else {
  //       console.log('Error:', response);
  //     }
  //   } catch (error) {
  //     console.log('Error fetching company reviews:', error);
  //   }
  // };

  const pageCount = Math.ceil(reviews.length / reviewsPerPage);

  useEffect(() => {
    // fetchCompanyReviews(); // Keep commented for UI-only
  }, []);

  useEffect(() => {
    if (pageCount <= 1) return;
    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % pageCount);
    }, 3000);
    return () => clearInterval(interval);
  }, [pageCount]);

  const start = page * reviewsPerPage;
  const reviewsToShow = reviews.slice(start, start + reviewsPerPage);

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="flex flex-wrap justify-center gap-6">
        {reviewsToShow.map((item, index) => (
          <div
            className="bg-white p-4 rounded-lg shadow-md text-center w-72"
            key={index}
          >
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A9.003 9.003 0 0112 15a9.003 9.003 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="font-semibold text-lg">{item?.name || 'Customer'}</h3>
            <p className="text-gray-500 text-sm mb-2 capitalize">({item?.role})</p>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={i < item?.rating ? "#facc15" : "none"}
                  stroke={i < item?.rating ? "#facc15" : "#d1d5db"}
                />
              ))}
            </div>
            <p className="text-gray-700 text-sm">{item.comment}</p>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-6 w-full space-x-2">
        {Array.from({ length: pageCount }).map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === page ? 'bg-blue-600' : 'bg-gray-300'}`}
            type="button"
            aria-label={`Go to review page ${idx + 1}`}
            style={{ pointerEvents: 'none' }}
          />
        ))}
      </div>
    </div>
  );
}

export default AllReviews;
