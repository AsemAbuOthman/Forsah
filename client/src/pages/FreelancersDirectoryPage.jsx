import React, { useState, useEffect } from 'react';
import { Filter, Search, Heart, Shield, Award, X, Plus, ChevronDown, DollarSign, Star, MapPin, Calendar, MessageCircle, Briefcase, ExternalLink, User } from 'lucide-react';
import { Link } from 'wouter';
import axios from 'axios';
// // Sample freelancers data (will be replaced with API call later)

// Filter Component
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
  const [sliderValue, setSliderValue] = useState(rateRange ? rateRange.max : 100);
  
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
                      onSpecialtiesChange([]);
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
                      
                      // Reset parent rate range
                      onRateRangeChange({ min: 0, max: 100 });
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
                
                // Reset parent state
                onSpecialtiesChange([]);
                onSortChange('rating');
                onSearchChange('');
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

// Freelancer Card Component with profile link and contact button
const FreelancerCard = ({ freelancer, onToggleFavorite, onContact }) => {
  const { 
    userId, 
    imageUrl, 
    fullName, 
    username, 
    professionalTitle, 
    hourlyRate, 
    rating, 
    reviews,
    countryId, 
    city,
    skills, 
    verified, 
    topRated, 
    isFavorite,
    lastActive,
    profileDescription
  } = freelancer;
  
  const formatLastActive = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };
  
  const handleCardClick = () => {
    window.location.href = `/profile/${userId}`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-blue-200 "
      onClick={handleCardClick}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/5 flex flex-col items-center mb-4 md:mb-0">
            <div className="relative flex flex-col items-center">
              <img 
                src={imageUrl || `https://ui-avatars.com/api/?name=${fullName.replace(' ', '+')}&background=random`}
                alt={fullName}
                className="w-16 h-16 rounded-full object-cover mb-1 shadow-md border-2 border-white"
              />
              <div className="text-center text-lg font-bold">{fullName}</div>
              <div className="text-gray-500 text-sm">@{username}</div>
              
              <div className="flex items-center justify-center gap-2 mt-1">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-gray-800 ml-1">{rating}</span>
                  <span className="text-gray-500 text-xs ml-1">({reviews})</span>
                </div>
                
                <div className="text-gray-500 text-xs flex items-center">
                  <MapPin className="w-3 h-3 mr-1" /> {countryId}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md w-full mt-3 shadow-sm border border-blue-100">
                <div className="text-xs text-blue-700 uppercase font-medium tracking-wide">HOURLY RATE</div>
                <div className="text-xl font-bold text-blue-900">${hourlyRate} <span className="text-gray-500 text-xs">USD</span></div>
                
                <div className="mt-2">
                  <div className="text-sm flex justify-between">
                    <span className="font-medium text-gray-700">Success Rate</span>
                    <span className="font-bold text-blue-800">{Math.floor(80 + rating * 2)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" 
                      style={{ width: `${Math.floor(80 + rating * 2)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:flex-1 md:pl-4 border-l border-gray-100">
            <div className="mb-3 mt-1">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm border border-blue-200 hover:bg-blue-200 transition-colors">
                    {skill.skillName}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-2">
              <h4 className="text-sm font-medium text-gray-500 mb-1">About</h4>
              <p className="text-gray-700 line-clamp-2 text-base">{profileDescription}</p>
              <button 
                className="text-blue-600 text-sm font-medium mt-1 hover:text-blue-800 focus:outline-none flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/profile/${userId}`;
                }}
              >
                Show more
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            
            <div className="flex justify-end mb-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(userId);
                }}
                className="p-2 rounded-full hover:bg-gray-50 transition-colors"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-300'}`} />
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between mt-4 border-t pt-4 border-gray-100">
              <div className="flex gap-4 text-gray-500 mb-3 sm:mb-0">
                <div className="flex items-center text-sm">
                  <Briefcase className="w-4 h-4 mr-1 text-blue-600" /> 
                  <span>{Math.floor(Math.random() * 200)} projects</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-1 text-blue-600" /> 
                  <span>Active {formatLastActive(lastActive)}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link 
                  onClick={handleCardClick}
                  className="py-2 px-4 border border-blue-200 bg-white text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium flex items-center transition-colors shadow-sm"
                >
                  <User className="w-4 h-4 mr-2" /> View Profile
                </Link>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onContact(userId);
                  }}
                  className="py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md text-sm font-medium flex items-center transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 mr-2" /> Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const FreelancersDirectoryPage = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('rating');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [rateRange, setRateRange] = useState({ min: 0, max: 100 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const postsPerPage = 10;

  // Handler functions
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setCurrentPage(1);
  };

  const handleSpecialtiesChange = (specialties) => {
    setSelectedSpecialties(specialties);
    setCurrentPage(1);
  };

  const handleRateRangeChange = (range) => {
    setRateRange(range);
    setCurrentPage(1);
  };

  const handleToggleFavorite = async (id) => {

    const res = await axios.post(`/api/users/favorite/`, {userId : localStorage.getItem('userId'), freelancerId: id});

    setFreelancers(prev => prev.map(f => 
      f.userId === id ? { ...f, isFavorite: !f.isFavorite } : f
    ));
    setFilteredFreelancers(prev => prev.map(f => 
      f.userId === id ? { ...f, isFavorite: !f.isFavorite } : f
    ));
  };

  const handleContact = (id) => {
    console.log(`Contacting freelancer with ID: ${id}`);
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSortOption('rating');
    setSelectedSpecialties([]);
    setRateRange({ min: 0, max: 100 });
    setCurrentPage(1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredFreelancers.length / postsPerPage)) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Fetch freelancers data
  useEffect(() => {
    const fetchFreelancers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/freelancers/?page=${currentPage}`);
        const result = response.data;
        
        if (result) {
          const transformedFreelancers = result.users.map(user => ({
            userId: user.userId,
            imageUrl: user.profileImage?.imageUrl,
            fullName: `${user.firstName} ${user.lastName}`,
            username: user.username,
            professionalTitle: user.professionalTitle || 'Freelancer',
            hourlyRate: user.hourlyRate || Math.floor(Math.random() * 50) + 20,
            rating: (Math.random() * 1 + 4).toFixed(1), // Random rating 4.0-5.0
            reviews: Math.floor(Math.random() * 100) + 10, // Random reviews
            countryId: user.countryId || 'Unknown',
            city: user.city || 'Unknown',
            skills: user.skills || [],
            verified: Math.random() > 0.3, // 70% chance verified
            topRated: Math.random() > 0.7, // 30% chance top rated
            isFavorite: false,
            lastActive: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
            profileDescription: user.profile?.profileDescription || 'No bio provided'
          }));
          
          setFreelancers(transformedFreelancers);
          setFilteredFreelancers(transformedFreelancers);
          setTotalUsers(result.totalUsers);
        }
      } catch (error) {
        console.error('Error fetching freelancers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFreelancers();
  }, [currentPage]);

  // Filter and sort freelancers
  useEffect(() => {
    if (isLoading) return;
    
    let result = [...freelancers];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(f => 
        f.fullName.toLowerCase().includes(query) || 
        f.username.toLowerCase().includes(query) ||
        // (f.countryId && f.countryId.toLowerCase().includes(query)) ||
        (f.city && f.city.toLowerCase().includes(query)) ||
        (f.professionalTitle && f.professionalTitle.toLowerCase().includes(query)) ||
        (f.profileDescription && f.profileDescription.toLowerCase().includes(query)) ||
        (f.skills && f.skills.some(s => s.skillName.toLowerCase().includes(query)))
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
        f.skills && f.skills.some(s => selectedSpecialties.includes(s.skillName))
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'hourlyRate':
        result.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'reviews':
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'lastActive':
        result.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
        break;
      default:
        break;
    }
    
    setFilteredFreelancers(result);
  }, [freelancers, searchQuery, sortOption, rateRange, selectedSpecialties, isLoading]);

  const LoadingState = () => (
    <div className="flex justify-center items-center h-64 ">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  const EmptyState = () => (
    <div className="bg-white p-8 rounded-xl shadow-md text-center">
      <div className="flex justify-center mb-4">
        <Search className="h-16 w-16 text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">No freelancers found</h3>
      <p className="text-gray-500 mb-4">We couldn't find any freelancers matching your current filters.</p>
      <div className="flex justify-center gap-4">
        <button 
          onClick={handleClearAllFilters}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          Clear filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen bg-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Header and search bar (keep this part exactly as in your original code) */}
        
        {/* Main content */}
        {isLoading ? (
          <LoadingState />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div id="filters" className="w-full lg:w-1/4">
              <FreelancerFilters 
                searchValue={searchQuery}
                onSearchChange={handleSearch}
                onSortChange={handleSortChange}
                selectedSort={sortOption}
                selectedSpecialties={selectedSpecialties}
                onSpecialtiesChange={handleSpecialtiesChange}
                rateRange={rateRange}
                onRateRangeChange={handleRateRangeChange}
                onClearAll={handleClearAllFilters}
              />
              
              {/* Stats Card */}
              <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-blue-500" /> Total Freelancers
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {totalUsers}
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
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Award className="h-4 w-4 mr-2 text-amber-500" /> Top Rated
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {freelancers.filter(f => f.topRated).length}
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
            
            {/* Freelancer List */}
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
                        onContact={handleContact}
                      />
                    ))}
                </div>
              ) : (
                <EmptyState />
              )}
              
              {/* Pagination */}
              {filteredFreelancers.length > 0 && (
                <div className="flex flex-col items-center mt-10">
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
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded mr-1 ${
                        currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white border border-gray-300 text-gray-600 hover:bg-purple-50'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, Math.ceil(filteredFreelancers.length / postsPerPage)) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button 
                          key={pageNum}
                          onClick={() => handlePageClick(pageNum)}
                          className={`px-3 py-1 rounded mx-1 ${
                            currentPage === pageNum
                              ? 'bg-purple-600 text-white' 
                              : 'bg-white border border-gray-300 text-gray-600 hover:bg-purple-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    {Math.ceil(filteredFreelancers.length / postsPerPage) > 5 && (
                      <>
                        <span className="px-2 text-gray-500 mx-1">...</span>
                        <button 
                          onClick={() => handlePageClick(Math.ceil(filteredFreelancers.length / postsPerPage))}
                          className="px-3 py-1 rounded mx-1 bg-white border border-gray-300 text-gray-600 hover:bg-purple-50"
                        >
                          {Math.ceil(filteredFreelancers.length / postsPerPage)}
                        </button>
                      </>
                    )}
                    
                    <button 
                      onClick={handleNextPage}
                      disabled={currentPage === Math.ceil(filteredFreelancers.length / postsPerPage)}
                      className={`px-3 py-1 rounded ml-1 ${
                        currentPage === Math.ceil(filteredFreelancers.length / postsPerPage)
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white border border-gray-300 text-gray-600 hover:bg-purple-50'
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancersDirectoryPage;