import { useState } from 'react';
import { format } from 'date-fns';
import { Star, ChevronRight } from 'lucide-react';
import { useProfile } from '../../../store/ProfileContext';
import { useTheme } from '../../../store/ThemeContext';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

export default function ReviewsSection({ id }) {
  const { reviews } = useProfile();
  const { darkMode } = useTheme();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const openReviewModal = (review) => {
    setSelectedReview(review);
    setShowReviewModal(true);
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 2);

  return (
    <section id={id} className={`p-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
      <div className="section-title">
        <h2>Client Reviews ({reviews.length})</h2>
      </div>
      <div className="space-y-6">
        {displayedReviews.map(review => (
          <div 
            key={review.id} 
            className={`rounded-lg p-6 transition-all duration-300 ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
            } cursor-pointer`}
            onClick={() => openReviewModal(review)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-white dark:border-gray-700"
                />
                <div>
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {review.name}
                  </h3>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {format(new Date(review.date), 'PP')}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < review.rating 
                        ? 'text-yellow-400 fill-current' 
                        : (darkMode ? 'text-gray-500' : 'text-gray-300')
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {review.comment.length > 150 ? review.comment.substring(0, 150) + '...' : review.comment}
            </p>
            <div className="mt-2 flex justify-between items-center">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Project: {review.projectTitle}
              </p>
              <ChevronRight className={darkMode ? 'text-gray-400' : 'text-gray-500'} size={18} />
            </div>
          </div>
        ))}

        {reviews.length > 2 && (
          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="mx-auto"
            >
              {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
            </Button>
          </div>
        )}

        {reviews.length === 0 && (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>No reviews yet. Completed projects will show client reviews here.</p>
          </div>
        )}
      </div>

      {/* Review Detail Modal */}
      <Modal 
        isOpen={showReviewModal} 
        onClose={() => setShowReviewModal(false)}
        title="Review Details"
      >
        {selectedReview && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={selectedReview.image}
                alt={selectedReview.name}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedReview.name}
                </h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Reviewed on {format(new Date(selectedReview.date), 'PPPP')}
                </p>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < selectedReview.rating 
                          ? 'text-yellow-400 fill-current' 
                          : (darkMode ? 'text-gray-500' : 'text-gray-300')
                      }`}
                    />
                  ))}
                  <span className={`ml-2 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedReview.rating}.0
                  </span>
                </div>
              </div>
            </div>

            <div className={`border-t border-b py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h4 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Project: {selectedReview.projectTitle}
              </h4>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {selectedReview.comment}
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowReviewModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}