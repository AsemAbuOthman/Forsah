import React, { useState, useEffect } from 'react';
import {
  Heart, Star, MapPin, Clock, MessageSquare, User, Briefcase,
  ChevronDown, Filter, Search, X, DollarSign, Award, Check, Shield, Plus
} from 'lucide-react';
import axios from 'axios';

// Helper functions
const getCurrencySymbol = (currencyId) => {
  const symbols = {
    1: '$', // USD
    2: '€', // EUR
    3: '£', // GBP
    // Add more currency IDs as needed
  };
  
  return symbols[currencyId] || '$';
};

const getFormattedDate = (dateString) => {
  if (!dateString) return "Not specified";

  const date = new Date(dateString);

  const day = date.getDate(); // 1-31
  const year = date.getFullYear(); // full year

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = monthNames[date.getMonth()];

  const longFormat = ` - ${day}  ${monthName}, ${year}`; // e.g. 1, January, 2000

  return longFormat;

};


const FreelancerCard = ({ freelancer, onToggleFavorite, onHire }) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Generate accent colors based on freelancer ID
  const getAccentColor = (id) => {
    const colors = [
      {primary: 'indigo', soft: 'rgba(99, 102, 241, 0.05)'},
      {primary: 'blue', soft: 'rgba(59, 130, 246, 0.05)'},
      {primary: 'amber', soft: 'rgba(245, 158, 11, 0.05)'},
      {primary: 'emerald', soft: 'rgba(16, 185, 129, 0.05)'},
      {primary: 'rose', soft: 'rgba(244, 63, 94, 0.05)'}
    ];
    
    return colors[id % colors.length];
  };
  
  const accentColor = getAccentColor(freelancer.userId);
  
  // Calculate rating and reviews (using placeholder values since they're not in your data)
  const rating = 4.5; // Default rating
  const reviews = 10; // Default number of reviews
  const jobSuccess = 90; // Default job success percentage
  const projectsCompleted = 15; // Default projects completed

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.01] relative flex flex-col md:flex-row"
      style={{
        boxShadow: isHovering 
          ? `0 20px 25px -5px ${accentColor.soft}, 0 10px 10px -5px ${accentColor.soft}` 
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Favorite button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(freelancer.userId);
        }}
        className={`absolute right-3 top-3 z-10 p-2 rounded-full shadow-sm ${
          freelancer.isFavorite ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-white text-gray-400 border border-gray-200'
        } transition-all focus:outline-none hover:bg-gray-50 hover:scale-110`}
        aria-label={freelancer.isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart className={`h-5 w-5 ${freelancer.isFavorite ? 'fill-current' : ''}`} />
      </button>
      
      {/* Left Section: Profile Info */}
      <div className="p-4 md:w-1/4 border-b md:border-b-0 md:border-r border-gray-100">
        <div className="flex flex-col items-center text-center">
          {/* Avatar with badges */}
          <div className="relative mb-2">
            <div className="h-16 w-16 rounded-full border-2 border-white overflow-hidden shadow-md">
              <img 
                src={freelancer.profileImage?.imageUrl || 'https://ui-avatars.com/api/?name='+freelancer.firstName+'+'+freelancer.lastName} 
                alt={`${freelancer.firstName} ${freelancer.lastName}`} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Badges - using placeholder values */}
            <div className="absolute -bottom-1 -right-1 flex">
              <div className="bg-white rounded-full p-0.5 mr-1">
                <div className="bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  <Check className="h-2.5 w-2.5" />
                </div>
              </div>
              <div className="bg-white rounded-full p-0.5">
                <div className="bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  <Award className="h-2.5 w-2.5" />
                </div>
              </div>
            </div>
          </div>
          
          {/* User info */}
          <div className="text-gray-800 mb-2">
            <h3 className="font-bold text-lg">{freelancer.firstName} {freelancer.lastName}</h3>
            <p className="text-gray-500 text-sm">@{freelancer.username}</p>
          </div>
          
          {/* Rating and location */}
          <div className="flex items-center justify-center text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-amber-500 mr-1" />
              <span className="font-medium mr-1">{rating}</span>
              <span className="mr-1">({reviews})</span>
            </div>
            <span className="mx-1">•</span>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{freelancer.city || 'Location not specified'}</span>
            </div>
          </div>
        
          {/* Hourly rate */}
          <div className="w-full mb-2 bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p className="text-sm text-blue-600 font-medium uppercase tracking-wide">Hourly Rate</p>
            <p className="text-2xl font-bold text-gray-800">
              {getCurrencySymbol(freelancer.currencyId)}{freelancer.hourlyRate}
              <span className="text-sm text-gray-500 ml-1">USD</span>
            </p>
            
            <div className="mt-2">
              <div className="flex justify-between items-center text-sm text-gray-700 mb-1">
                <span>Success Rate</span>
                <span className="font-medium">{jobSuccess}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500"
                  style={{ width: `${jobSuccess}%`, height: '100%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Middle Section: Details */}
      <div className="p-4 md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-gray-100">
        {/* Specialties */}
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Professional Title</h4>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
              {freelancer.professionalTitle || 'Developer'}
            </span>
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">About</h4>
          <p className={`text-sm text-gray-700 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
            {freelancer.profile?.profileDescription || 'No description provided.'}
          </p>
          
          {freelancer.profile?.profileDescription?.length > 100 && (
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="text-sm text-blue-600 hover:text-blue-800 mt-2 font-medium"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
        
        {/* Stats */}
        <div className="flex items-center mt-auto space-x-4 text-sm text-gray-700">
          <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg">
            <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
            <span className="font-medium">{projectsCompleted} projects</span>
          </div>
          <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg">
            <Clock className="h-4 w-4 mr-2 text-blue-500" />
            <span className="font-medium">Joined {getFormattedDate(freelancer.createdAt[0])}</span>
          </div>
        </div>
      </div>
      
      {/* Right Section: Actions */}
      <div className="p-4 md:w-1/4 flex items-center">
        <div className="w-full flex flex-col gap-2">
          <button 
            className="w-full bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-3 rounded-lg flex items-center justify-center transition-colors text-sm font-medium"
            onClick={() => window.location.href = `/profile/${freelancer.userId}`}
          >
            <User className="h-4 w-4 mr-2 text-blue-500" /> View Profile
          </button>
          <button 
            className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2 px-3 rounded-lg flex items-center justify-center transition-colors text-sm font-medium shadow-sm"
            onClick={() => onHire(freelancer.userId)}
          >
            <MessageSquare className="h-4 w-4 mr-2" /> Hire Now
          </button>
        </div>
      </div>
    </div>
  );
};

// FreelancerFilters Component (unchanged from your original)
const FreelancerFilters = ({ 
  searchValue, 
  onSearchChange, 
  onFilterChange, 
  onSortChange, 
  selectedSort,
  selectedSpecialties,
  onSpecialtiesChange,
  rateRange,
  onRateRangeChange,
  onClearAll
}) => {
  // Expandable filter sections
  const [expandedSection, setExpandedSection] = useState('');
  const [minRate, setMinRate] = useState(rateRange ? rateRange.min.toString() : '0');
  const [maxRate, setMaxRate] = useState(rateRange ? rateRange.max.toString() : '100');
  const [sliderValue, setSliderValue] = useState(rateRange ? rateRange.max : 50);
  
  // Ensure selectedSpecialties is an array
  const specialtiesArray = selectedSpecialties || [];
  
  // Handle specialty checkbox change
  const handleSpecialtyChange = (specialty) => {
    const newSpecialties = [...specialtiesArray];
    
    if (newSpecialties.includes(specialty)) {
      const index = newSpecialties.indexOf(specialty);
      newSpecialties.splice(index, 1);
    } else {
      newSpecialties.push(specialty);
    }
    
    onSpecialtiesChange(newSpecialties);
  };
  
  // Handle rate range changes
  const handleRateRangeChange = () => {
    const min = parseInt(minRate) || 0;
    const max = parseInt(maxRate) || 100;
    onRateRangeChange({ min, max });
  };
  
  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    setMaxRate(value.toString());
    // Update rate range after a short delay
    setTimeout(() => {
      handleRateRangeChange();
    }, 500);
  };
  
  // Apply all filters together
  const applyAllFilters = () => {
    handleRateRangeChange();
    onFilterChange();
  };
  
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-100 ">
      {/* Header */}
      <div className="bg-blue-50 p-4 border-b border-blue-100">
        <h3 className="text-lg font-bold text-gray-800">Filter Freelancers</h3>
        <p className="text-sm text-gray-600">Refine your results to find the perfect match</p>
      </div>
      
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-blue-500" />
          </div>
          <input
            type="text"
            placeholder="Search by name, skill or location..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
          {searchValue && (
            <button
              onClick={() => {
                onSearchChange('');
                // Apply filter immediately
                setTimeout(() => onFilterChange(), 10);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Filter Sections */}
      <div className="p-4">
        {/* Sort Options */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('sort')}
            className="flex justify-between items-center w-full text-left font-medium text-gray-800 hover:text-blue-600 bg-gray-50 p-3 rounded-lg border border-gray-200"
          >
            <div className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-blue-500" />
              <span className="text-base">Sort By</span>
            </div>
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${expandedSection === 'sort' ? 'transform rotate-180' : ''}`} />
          </button>
          
          {expandedSection === 'sort' && (
            <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'rating', label: 'Highest Rating' },
                  { value: 'hourlyRate', label: 'Lowest Rate' },
                  { value: 'reviews', label: 'Most Reviews' },
                  { value: 'lastActive', label: 'Recently Active' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center py-2 px-3 cursor-pointer hover:bg-gray-50 rounded-lg">
                    <input
                      type="radio"
                      name="sort"
                      value={option.value}
                      checked={selectedSort === option.value}
                      onChange={() => onSortChange(option.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-base text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Specialties Filter */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('specialties')}
            className="flex justify-between items-center w-full text-left font-medium text-gray-800 hover:text-blue-600 bg-gray-50 p-3 rounded-lg border border-gray-200"
          >
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-blue-500" />
              <span className="text-base">Specialties</span>
            </div>
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${expandedSection === 'specialties' ? 'transform rotate-180' : ''}`} />
          </button>
          
          {expandedSection === 'specialties' && (
            <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Selected: {specialtiesArray.length}</span>
                {specialtiesArray.length > 0 && (
                  <button 
                    onClick={() => {
                      // Clear specialties directly in parent component
                      // This will trigger useEffect in parent and show all favorites
                      onSpecialtiesChange([]);
                      onFilterChange(); // Optional since useEffect handles it, but added for redundancy
                    }}
                    className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center"
                  >
                    <X className="h-3.5 w-3.5 mr-1" /> Clear specialties
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {['UI/UX Design', 'React', 'Node.js', 'Content Writing', 'DevOps', 'Data Science', 'Marketing', 'Mobile Development'].map((specialty) => (
                  <label key={specialty} className="flex items-center py-2 px-3 cursor-pointer hover:bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={specialtiesArray.includes(specialty)}
                      onChange={() => handleSpecialtyChange(specialty)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="ml-2 text-base text-gray-700">{specialty}</span>
                  </label>
                ))}
              </div>
              <button className="mt-3 text-blue-600 hover:text-blue-800 font-medium flex items-center">
                <Plus className="h-4 w-4 mr-1" /> Show more specialties
              </button>
            </div>
          )}
        </div>
        
        {/* Rate Range Filter */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('rate')}
            className="flex justify-between items-center w-full text-left font-medium text-gray-800 hover:text-blue-600 bg-gray-50 p-3 rounded-lg border border-gray-200"
          >
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
              <span className="text-base">Hourly Rate</span>
            </div>
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${expandedSection === 'rate' ? 'transform rotate-180' : ''}`} />
          </button>
          
          {expandedSection === 'rate' && (
            <div className="mt-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex justify-between text-sm text-gray-600 w-1/2">
                  <span>$0</span>
                  <span>$100+</span>
                </div>
                {(parseInt(minRate) > 0 || parseInt(maxRate) < 100) && (
                  <button 
                    onClick={() => {
                      // Reset local rate values
                      setMinRate('0');
                      setMaxRate('100');
                      setSliderValue(100);
                      
                      // Reset parent rate range and trigger filter update
                      onRateRangeChange({ min: 0, max: 100 });
                      // This will now be handled by the useEffect since rateRange changed
                    }}
                    className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center"
                  >
                    <X className="h-3.5 w-3.5 mr-1" /> Reset rate
                  </button>
                )}
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              
              <div className="flex space-x-4 mt-4">
                <div className="w-1/2">
                  <label className="block text-sm text-gray-700 mb-1 font-medium">Minimum ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={minRate}
                    onChange={(e) => setMinRate(e.target.value)}
                    onBlur={handleRateRangeChange}
                    placeholder="0"
                    className="w-full p-2 text-base border-2 border-gray-200 rounded-lg"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm text-gray-700 mb-1 font-medium">Maximum ($)</label>
                  <input
                    type="number"
                    value={maxRate}
                    onChange={(e) => setMaxRate(e.target.value)}
                    onBlur={handleRateRangeChange}
                    placeholder="100+"
                    className="w-full p-2 text-base border-2 border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Filters Control Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={onFilterChange}
            className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center text-base font-medium shadow-sm"
          >
            <Filter className="h-5 w-5 mr-2" />
            Apply Filters
          </button>
          
          {/* Show clear button only when there are active filters */}
          {(searchValue || selectedSort !== 'rating' || specialtiesArray.length > 0 || parseInt(minRate) > 0 || parseInt(maxRate) < 100) && (
            <button
              onClick={() => {
                // Reset local state
                setMinRate('0');
                setMaxRate('100'); 
                setSliderValue(100);
                
                // Reset parent state and trigger handler
                onSpecialtiesChange([]);
                onSortChange('rating');
                onSearchChange('');
                // Special direct handler for when Clear All is clicked
                onClearAll();
              }}
              className="py-3 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center justify-center text-base font-medium"
            >
              <X className="h-5 w-5 mr-2" />
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Main FavoriteFreelancersGrid component - Updated for new data structure
const FavoriteFreelancersGrid = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('rating');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [rateRange, setRateRange] = useState({ min: 0, max: 100 });
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFavoriteFreelancers = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.userId) {
          console.error('User data not found in localStorage');
          return;
        }
        
        const userId = Array.isArray(userData.userId) ? userData.userId[0] : userData.userId;
        const res = await axios.get(`/api/users/favourite/${userId}`);
        
        if (res.data.users) {
          // Add isFavorite flag to each freelancer
          const freelancersWithFavoriteFlag = res.data.users.map(f => ({
            ...f,
            isFavorite: true // Since these are all favorites from the API
          }));
          
          setFreelancers(freelancersWithFavoriteFlag);
          setFilteredFreelancers(freelancersWithFavoriteFlag);
        }
      } catch (error) {
        console.error('Error fetching favorite freelancers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteFreelancers();
  }, []);

  // Effect to filter and sort freelancers
  useEffect(() => {
    if (freelancers.length === 0) return;
    
    let result = [...freelancers].filter(f => f.isFavorite);
    
    // Apply search filter if query exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(f => 
        `${f.firstName} ${f.lastName}`.toLowerCase().includes(query) || 
        f.username.toLowerCase().includes(query) ||
        (f.city && f.city.toLowerCase().includes(query)) ||
        (f.professionalTitle && f.professionalTitle.toLowerCase().includes(query)) ||
        (f.profile?.profileDescription && f.profile.profileDescription.toLowerCase().includes(query))
      );
    }
    
    // Apply rate range filter
    if (rateRange.min > 0 || rateRange.max < 100) {
      result = result.filter(f => 
        f.hourlyRate >= rateRange.min && f.hourlyRate <= rateRange.max
      );
    }
    
    // Apply specialties filter
    if (selectedSpecialties.length > 0) {
      result = result.filter(f => 
        f.professionalTitle && selectedSpecialties.some(s => 
          f.professionalTitle.toLowerCase().includes(s.toLowerCase())
        )
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'rating':
        // Using placeholder rating since it's not in your data
        result.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
        break;
      case 'hourlyRate':
        result.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'reviews':
        // Using placeholder reviews count
        result.sort((a, b) => (b.reviews || 10) - (a.reviews || 10));
        break;
      case 'lastActive':
        result.sort((a, b) => new Date(b.createdAt[0]) - new Date(a.createdAt[0]));
        break;
      default:
        break;
    }
    
    // Reset to page 1 when filters or sort changes
    setCurrentPage(1);
    setFilteredFreelancers(result);
  }, [freelancers, searchQuery, sortOption, rateRange, selectedSpecialties]);
  
  // Handle toggling favorites
  const handleToggleFavorite = async (userId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.userId) {
        console.error('User data not found in localStorage');
        return;
      }
      
      const currentUserId = Array.isArray(userData.userId) ? userData.userId[0] : userData.userId[0];
      
      // Call API to remove from favorites
      const res = await axios.delete(`/api/favourite/${currentUserId}/${userId}`);
      
      if(res.data.success){

        // Update local state
        setFreelancers(freelancers.filter(f => f.userId !== userId));
        setFilteredFreelancers(filteredFreelancers.filter(f => f.userId !== userId));
      }
      
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  
  // Handle hiring a freelancer
  const handleHire = (userId) => {
    console.log(`Opening hire dialog for freelancer ${userId}`);
    alert(`You're about to hire freelancer with ID ${userId}`);
  };
  
  // Empty state component when no freelancers are found
  const EmptyState = () => (
    <div className="bg-white p-8 rounded-xl shadow-md text-center">
      <div className="flex justify-center mb-4">
        <Heart className="h-16 w-16 text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">No favorites found</h3>
      <p className="text-gray-500 mb-4">You haven't added any freelancers to your favorites list yet, or none match your current filters.</p>
      <div className="flex justify-center gap-4">
        <button 
          onClick={() => {
            setSearchQuery('');
            setSortOption('rating');
            setSelectedSpecialties([]);
            setRateRange({ min: 0, max: 100 });
          }}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          Clear filters
        </button>
        <button 
          onClick={() => window.location.href = '/freelancers'}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Find freelancers
        </button>
      </div>
    </div>
  );
  
  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Favorite Freelancers</h1>
          <p className="text-gray-600">
            Manage your list of favorite professionals and quickly get in touch when you need their services.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <FreelancerFilters 
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              onFilterChange={() => {}} // Not needed since we use useEffect
              onSortChange={setSortOption}
              selectedSort={sortOption}
              selectedSpecialties={selectedSpecialties}
              onSpecialtiesChange={setSelectedSpecialties}
              rateRange={rateRange}
              onRateRangeChange={setRateRange}
              onClearAll={() => {
                setSearchQuery('');
                setSortOption('rating');
                setSelectedSpecialties([]);
                setRateRange({ min: 0, max: 100 });
              }}
            />
            
            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <h3 className="font-medium text-gray-700 mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-red-500" /> In Favorites
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {freelancers.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-blue-500" /> Verified
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {freelancers.filter(f => f.verified).length}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg. Hourly Rate</span>
                    <span className="text-sm font-semibold text-gray-800">
                      ${freelancers.length > 0 ? 
                        Math.round(
                          freelancers.reduce((sum, f) => sum + f.hourlyRate, 0) / 
                          freelancers.length
                        ) : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Freelancer Grid */}
          <div className="w-full lg:w-3/4">
            {filteredFreelancers.length > 0 ? (
              <div className="space-y-6">
                {filteredFreelancers
                  .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
                  .map(freelancer => (
                    <FreelancerCard 
                      key={freelancer.userId}
                      freelancer={freelancer}
                      onToggleFavorite={handleToggleFavorite}
                      onHire={handleHire}
                    />
                  ))}
              </div>
            ) : (
              <EmptyState />
            )}
            
            {/* Pagination */}
            {filteredFreelancers.length > 0 && (
              <div className="flex flex-col items-center mt-10">
                {/* Show posts count */}
                <div className="text-sm text-gray-600 mb-4">
                  Showing {
                    currentPage * postsPerPage > filteredFreelancers.length 
                      ? filteredFreelancers.length - ((currentPage - 1) * postsPerPage) 
                      : postsPerPage
                  } of {filteredFreelancers.length} freelancers
                  {filteredFreelancers.length > postsPerPage && 
                    ` (Page ${currentPage} of ${Math.ceil(filteredFreelancers.length / postsPerPage)})`
                  }
                </div>
                
                <nav className="flex flex-wrap items-center justify-center">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded mr-1 ${
                      currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {/* Generate page buttons */}
                  {Array.from({ length: Math.min(5, Math.ceil(filteredFreelancers.length / postsPerPage)) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button 
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum                        )}
                        className={`px-3 py-1 rounded mx-1 ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {/* Ellipsis for many pages */}
                  {Math.ceil(filteredFreelancers.length / postsPerPage) > 5 && (
                    <span className="px-2 py-1">...</span>
                  )}
                  
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(p + 1, Math.ceil(filteredFreelancers.length / postsPerPage)))}
                    disabled={currentPage === Math.ceil(filteredFreelancers.length / postsPerPage)}
                    className={`px-3 py-1 rounded ml-1 ${
                      currentPage === Math.ceil(filteredFreelancers.length / postsPerPage)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteFreelancersGrid;