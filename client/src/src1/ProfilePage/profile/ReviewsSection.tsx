import { Review } from "../../lib/types";
import { Button } from "../ui/button";
import { format } from "date-fns";

interface ReviewsSectionProps {
  reviews: Review[];
  onViewAllReviews?: () => void;
  isEditable?: boolean; // Changed to isEditable
}

export default function ReviewsSection({ reviews, onViewAllReviews, isEditable }: ReviewsSectionProps) {
  // Display only the first 3 reviews, or all if there are 3 or fewer
  const displayedReviews = reviews.slice(0, 3);
  const hasMoreReviews = reviews.length > 3;

  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex text-yellow-400 mb-2">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {hasHalfStar && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        ))}
        
        <span className="ml-1 text-gray-700 text-sm">{rating}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Client Reviews</h3>
      </div>
      
      {displayedReviews.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-gray-500">No reviews yet</div>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedReviews.map((review, index) => (
            <div 
              key={review.id} 
              className={`${index !== displayedReviews.length - 1 ? 'border-b border-gray-100 pb-5' : ''}`}
            >
              <div className="flex items-center mb-2">
                <img 
                  src={review.reviewerAvatar || ''} 
                  alt={review.reviewer} 
                  className="w-10 h-10 rounded-full mr-3 object-cover" 
                />
                <div>
                  <div className="font-medium text-gray-800">{review.reviewer}</div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(review.date), 'MMMM d, yyyy')}
                  </div>
                </div>
              </div>
              
              {renderStars(review.rating)}
              
              <p className="text-gray-700 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
      
      {hasMoreReviews && isEditable && (
        <div className="mt-4 text-center">
          <Button 
            variant="link" 
            className="text-blue-600 hover:text-blue-800"
            onClick={onViewAllReviews}
          >
            See all reviews ({reviews.length})
          </Button>
        </div>
      )}
    </div>
  );
}
