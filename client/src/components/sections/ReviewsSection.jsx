import { useState } from 'react';
import { format } from 'date-fns';
import { Star, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function ReviewsSection({ reviews }) {
  const { showSuccessToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  const reviewsPerPage = 2;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  
  const paginatedReviews = showAllReviews 
    ? reviews 
    : reviews.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage);
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      
      // Scroll to the top of the reviews section
      const element = document.getElementById('reviews');
      if (element) {
        const headerOffset = 88;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };
  
  return (
    <section id="reviews" className="p-6 md:p-8 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Client Reviews <span className="text-gray-500 dark:text-gray-400">({reviews.length})</span>
        </h2>
        
        <button
          onClick={() => {
            showSuccessToast("Coming soon: Request client reviews");
          }}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
        >
          <MessageSquare size={16} className="mr-1" />
          <span className="text-sm">Request Review</span>
        </button>
      </div>
      
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <Star size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No reviews yet</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Complete projects and ask clients to leave reviews
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {paginatedReviews.map(review => (
              <div key={review.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 transition-colors duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{review.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400">{format(new Date(review.date), 'PP')}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-4">{review.comment}</p>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Project: {review.projectTitle}</p>
              </div>
            ))}
          </div>
          
          {/* Pagination controls */}
          {reviews.length > reviewsPerPage && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                {showAllReviews ? 'Show paginated view' : 'Show all reviews'}
              </button>
              
              {!showAllReviews && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-1.5 rounded-full ${
                      currentPage === 1
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-1.5 rounded-full ${
                      currentPage === totalPages
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    aria-label="Next page"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}