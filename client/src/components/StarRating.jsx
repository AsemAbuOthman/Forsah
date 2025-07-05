import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, StarHalf } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const StarRating = ({ maxStars = 5, allowHalf = true }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { project, proposal } = state || {};

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);  

  if (!project || !proposal) {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center">
        <p className="text-red-600 font-semibold mb-4">Missing review data. Please return to the order page.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const handleMouseMove = (e, index) => {
    if (!allowHalf) {
      setHoveredRating(index);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    setHoveredRating(mouseX < rect.width / 2 ? index - 0.5 : index);
  };

  const handleMouseLeave = () => setHoveredRating(0);
  const handleClick = (value) => {
    setRating(value);
    setShowReviewForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post('/api/review/', {
        userId: JSON.parse(localStorage.getItem('userData')).userId[0],
        receiverId: proposal.userId,
        projectId: project.projectId,
        proposalId: proposal.proposalId,
        rating,
        review,
      });

      if(res.data){
          
        
        toast.success('Review submitted successfully!', {
            style: { background: '#10B981', color: '#fff' },
        });

        navigate(`profile/${proposal.userId}`)

        setReview('');  
        setShowReviewForm(false);
      }else{

        toast.success('Review submitted successfully!', {
            style: { background: '#10B981', color: '#fff' },
        });
      }

    } catch (error) {
      toast.error('Failed to submit review. Please try again.', {
        style: { background: '#EF4444', color: '#fff' },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStar = (index) => {
    const value = hoveredRating || rating;
    const filled = value >= index;
    const halfFilled = allowHalf && value === index - 0.5;

    return (
      <div
        key={index}
        className="relative cursor-pointer p-1 transition-transform hover:scale-110"
        onMouseMove={(e) => handleMouseMove(e, index)}
        onClick={() => handleClick(index)}
      >
        {halfFilled ? (
          <StarHalf className="w-8 h-8 text-yellow-400" fill="currentColor" />
        ) : (
          <Star
            className={`w-8 h-8 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
            fill={filled ? 'currentColor' : 'none'}
          />
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Rate Your Experience</h2>
        <p className="text-gray-600">How would you rate the service?</p>
      </div>

      <div className="flex justify-center items-center mb-8" onMouseLeave={handleMouseLeave}>
        {[...Array(maxStars)].map((_, index) => renderStar(index + 1))}
      </div>

      {rating > 0 && (
        <div className="text-center mb-6">
          <p className="text-lg font-medium text-gray-700">
            You selected {rating} {rating === 1 ? 'star' : 'stars'}
          </p>
        </div>
      )}

      {showReviewForm && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
              Write your review
            </label>
            <div className="relative">
              <textarea
                id="review"
                rows={5}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:bg-white resize-none transition-all duration-200"
                placeholder="Tell us what you liked or what could be improved..."
              />
              <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                {review.length}/500
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-yellow-400 text-white rounded-lg text-sm font-medium hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StarRating;
