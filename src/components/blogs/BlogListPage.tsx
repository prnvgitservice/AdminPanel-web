import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "./BlogCard";
import { blogPosts } from "./blogData";
import { BlogPost } from "./types";
import { Link } from "react-router-dom";

const BlogListPage: React.FC = () => {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const handleBlogClick = (post: BlogPost) => {
    navigate(`/blog/${post.id}`, { state: post });
  };

  // Auto-scroll logic
  useEffect(() => {
    if (isPaused || !scrollContainerRef.current) return;

    const scrollInterval = setInterval(() => {
      const container = scrollContainerRef.current!;
      const cardWidth = 350 + 24; // card width + gap
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (scrollPosition >= maxScroll) {
        // Reset to start when reaching the end
        container.scrollTo({ left: 0, behavior: "smooth" });
        setScrollPosition(0);
      } else {
        // Scroll one card at a time
        container.scrollBy({ left: cardWidth, behavior: "smooth" });
        setScrollPosition((prev) => prev + cardWidth);
      }
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(scrollInterval);
  }, [scrollPosition, isPaused]);

  // Update scroll position state
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current || !scrollContainerRef.current) return;

    const touchEndX = e.touches[0].clientX;
    const diffX = touchStartX.current - touchEndX;
    scrollContainerRef.current.scrollBy({ left: diffX, behavior: "smooth" });
    touchStartX.current = touchEndX;
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
    setTimeout(() => setIsPaused(false), 2000); // Resume auto-scroll after 2s
  };

  return (
    <div
      className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative text-center flex justify-between items-center max-w-3xl mb-6">
          <div className="flex items-center">
            <span className="w-1 h-12 bg-gradient-to-b from-pink-500 to-purple-500 mr-4"></span>
            <h1 className="text-4xl font-bold text-gray-900">
              Blogs
            </h1>
          </div>
          <Link
            to="/blogs/all"
            className="text-4xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            View All
          </Link>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide gap-6 pb-8 px-4 snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {blogPosts.map((post, index) => (
            <div
              key={post.id}
              className="flex-shrink-0 w-[350px] snap-start transition-transform duration-300 hover:scale-105"
            >
              <BlogCard post={post} onClick={handleBlogClick} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;