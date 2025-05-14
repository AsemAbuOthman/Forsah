import React, { useState, useEffect } from 'react';
import { Heart, Star, MapPin, Clock, MessageSquare, User, Briefcase, 
  Award, ChevronRight, Filter, Search, X, MoreHorizontal, DollarSign } from 'lucide-react';

// Sample data for favorite freelancers
const sampleFreelancers = [
  {
    id: 1,
    username: 'alexdesign',
    fullName: 'Alex Rodriguez',
    profileImage: 'https://ui-avatars.com/api/?name=Alex+Rodriguez&background=5046e5&color=fff',
    rating: 4.9,
    reviews: 134,
    country: 'United States',
    hourlyRate: 45,
    currency: 'USD',
    specialties: ['UI/UX Design', 'Wireframing', 'Prototyping'],
    description: 'Senior UI/UX designer with 8+ years of experience creating intuitive interfaces. Specialized in mobile apps and SaaS products.',
    jobSuccess: 97,
    projectsCompleted: 189,
    lastActive: '2025-05-01T14:30:00Z',
    isFavorite: true
  },
  {
    id: 2,
    username: 'codemaster',
    fullName: 'Sarah Chen',
    profileImage: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=0ea5e9&color=fff',
    rating: 4.7,
    reviews: 98,
    country: 'Canada',
    hourlyRate: 55,
    currency: 'USD',
    specialties: ['React', 'Node.js', 'Full Stack'],
    description: 'Full stack developer with focus on React and Node.js. Love building sleek, scalable web applications with modern tooling.',
    jobSuccess: 94,
    projectsCompleted: 126,
    lastActive: '2025-05-02T10:15:00Z',
    isFavorite: true
  },
  {
    id: 3,
    username: 'contentqueen',
    fullName: 'Emma Johnson',
    profileImage: 'https://ui-avatars.com/api/?name=Emma+Johnson&background=f59e0b&color=fff',
    rating: 4.8,
    reviews: 76,
    country: 'United Kingdom',
    hourlyRate: 35,
    currency: 'GBP',
    specialties: ['Content Writing', 'SEO', 'Copywriting'],
    description: 'Content strategist and writer with expertise in SaaS, technology, and finance sectors. SEO-optimized content that drives traffic and conversions.',
    jobSuccess: 98,
    projectsCompleted: 153,
    lastActive: '2025-05-01T18:45:00Z',
    isFavorite: true
  },
  {
    id: 4,
    username: 'devops_guru',
    fullName: 'Michael Patel',
    profileImage: 'https://ui-avatars.com/api/?name=Michael+Patel&background=10b981&color=fff',
    rating: 4.9,
    reviews: 112,
    country: 'India',
    hourlyRate: 40,
    currency: 'USD',
    specialties: ['DevOps', 'AWS', 'Docker'],
    description: 'DevOps engineer specializing in cloud infrastructure, CI/CD pipelines, and container orchestration. AWS certified solutions architect.',
    jobSuccess: 96,
    projectsCompleted: 138,
    lastActive: '2025-05-02T08:30:00Z',
    isFavorite: true
  },
  {
    id: 5,
    username: 'data_scientist',
    fullName: 'Julia Kim',
    profileImage: 'https://ui-avatars.com/api/?name=Julia+Kim&background=ec4899&color=fff',
    rating: 4.6,
    reviews: 89,
    country: 'South Korea',
    hourlyRate: 60,
    currency: 'USD',
    specialties: ['Data Science', 'Machine Learning', 'Python'],
    description: 'Data scientist with experience in predictive modeling, NLP, and computer vision. Former researcher at Seoul National University.',
    jobSuccess: 92,
    projectsCompleted: 105,
    lastActive: '2025-05-01T22:10:00Z',
    isFavorite: true
  }
];

// Currency symbol helper function
const getCurrencySymbol = (currencyCode) => {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    INR: '₹',
    CNY: '¥',
    KRW: '₩',
    BRL: 'R$',
  };
  
  return symbols[currencyCode] || currencyCode;
};

// Format time ago helper function
const getTimeAgo = (dateString) => {
  const now = new Date();
  const lastActive = new Date(dateString);
  const diffMs = now - lastActive;
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
};

// FreelancerCard Component
const FreelancerCard = ({ freelancer, onToggleFavorite, onHire }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Color theme based on freelancer id
  const getThemeColor = (id) => {
    const themes = [
      {
        primary: 'indigo',
        accent: 'violet',
        border: 'border-indigo-100',
        headerGradient: 'from-indigo-500 to-violet-500',
        ratingBg: 'bg-indigo-500'
      },
      {
        primary: 'blue',
        accent: 'sky',
        border: 'border-blue-100',
        headerGradient: 'from-blue-500 to-sky-500',
        ratingBg: 'bg-blue-500'
      },
      {
        primary: 'amber',
        accent: 'orange',
        border: 'border-amber-100',
        headerGradient: 'from-amber-500 to-orange-500',
        ratingBg: 'bg-amber-500'
      },
      {
        primary: 'emerald',
        accent: 'green',
        border: 'border-emerald-100',
        headerGradient: 'from-emerald-500 to-green-500',
        ratingBg: 'bg-emerald-500'
      },
      {
        primary: 'pink',
        accent: 'rose',
        border: 'border-pink-100',
        headerGradient: 'from-pink-500 to-rose-500',
        ratingBg: 'bg-pink-500'
      }
    ];
    
    return themes[id % themes.length];
  };
  
  const theme = getThemeColor(freelancer.id);
  
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${theme.border} hover:shadow-xl transition-all duration-300`}>
      {/* Header with favorite button */}
      <div className={`p-4 bg-gradient-to-r ${theme.headerGradient} relative`}>
        <button 
          onClick={() => onToggleFavorite(freelancer.id)}
          className={`absolute right-3 top-3 p-2 rounded-full ${freelancer.isFavorite ? 'bg-white text-red-500' : 'bg-white/30 text-white'} transition-colors focus:outline-none`}
          aria-label={freelancer.isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-5 w-5 ${freelancer.isFavorite ? 'fill-current' : ''}`} />
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden">
              <img 
                src={freelancer.profileImage} 
                alt={freelancer.fullName} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
              <div className={`${theme.ratingBg} text-white text-xs font-bold rounded-full flex items-center justify-center w-6 h-6`}>
                {freelancer.rating}
              </div>
            </div>
          </div>
          
          <div className="text-white">
            <h3 className="font-bold text-lg">{freelancer.fullName}</h3>
            <p className="text-white/80 text-sm">@{freelancer.username}</p>
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className="p-4">
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Star className="h-4 w-4 text-yellow-500 mr-1" />
          <span className="font-medium mr-1">{freelancer.rating}</span>
          <span className="mr-2">({freelancer.reviews} reviews)</span>
          <span className="mx-2">•</span>
          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
          <span>{freelancer.country}</span>
          <span className="mx-2">•</span>
          <Clock className="h-4 w-4 text-gray-400 mr-1" />
          <span>Active {getTimeAgo(freelancer.lastActive)}</span>
        </div>
        
        <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg">
          <div>
            <p className="text-xs text-gray-500">Hourly Rate</p>
            <p className="text-xl font-bold text-gray-800">
              {getCurrencySymbol(freelancer.currency)}{freelancer.hourlyRate}
              <span className="text-xs text-gray-500 ml-1">{freelancer.currency}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Job Success</p>
            <div className="flex items-center">
              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                <div className={`h-full ${theme.ratingBg}`} style={{ width: `${freelancer.jobSuccess}%` }}></div>
              </div>
              <span className="text-sm font-semibold">{freelancer.jobSuccess}%</span>
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Specialties</h4>
          <div className="flex flex-wrap gap-2">
            {freelancer.specialties.map((specialty, index) => {
              // Determine colors for each specialty based on index
              const colors = [
                "bg-blue-100 text-blue-700",
                "bg-emerald-100 text-emerald-700",
                "bg-violet-100 text-violet-700",
                "bg-amber-100 text-amber-700",
                "bg-rose-100 text-rose-700"
              ];
              return (
                <span 
                  key={index} 
                  className={`${colors[index % colors.length]} text-xs px-2.5 py-1 rounded-full`}
                >
                  {specialty}
                </span>
              );
            })}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">About</h4>
          <p className={`text-sm text-gray-600 ${expanded ? '' : 'line-clamp-2'}`}>
            {freelancer.description}
          </p>
          
          {freelancer.description.length > 100 && (
            <button 
              onClick={() => setExpanded(!expanded)} 
              className={`text-xs text-blue-600 hover:text-blue-800 mt-1`}
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t border-gray-100 px-4 py-3 flex justify-between items-center bg-gray-50">
        <div className="flex items-center text-sm text-gray-500">
          <Briefcase className="h-4 w-4 mr-1" />
          <span>{freelancer.projectsCompleted} projects</span>
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 text-sm px-3 py-1.5 rounded-lg flex items-center transition-colors"
            onClick={() => window.location.href = `/freelancer/${freelancer.id}`}
          >
            <User className="h-4 w-4 mr-1.5" /> Profile
          </button>
          <button 
            className={`bg-gradient-to-r ${theme.headerGradient} text-white text-sm px-3 py-1.5 rounded-lg flex items-center shadow-sm`}
            onClick={() => onHire(freelancer.id)}
          >
            <MessageSquare className="h-4 w-4 mr-1.5" /> Hire
          </button>
        </div>
      </div>
    </div>
  );
};

// FilterBar component
const FilterBar = ({ onFilterChange, onSearch, onSort }) => {
  const [query, setQuery] = useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Search bar */}
        <div className="flex-1">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-blue-500">
              <input
                type="text"
                placeholder="Search by name, skill or location..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full py-2 px-4 focus:outline-none text-gray-700"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    onSearch('');
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 flex items-center"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
        
        {/* Sort dropdown */}
        <div className="flex-shrink-0 w-full md:w-48">
          <select 
            onChange={(e) => onSort(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          >
            <option value="rating">Highest Rating</option>
            <option value="hourlyRate">Lowest Rate</option>
            <option value="reviews">Most Reviews</option>
            <option value="lastActive">Recently Active</option>
          </select>
        </div>
        
        {/* Filter button */}
        <div className="flex-shrink-0">
          <button 
            onClick={() => onFilterChange()}
            className="w-full md:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// EmptyState component
const EmptyState = ({ onClearFilters }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">
        <Heart className="h-16 w-16 text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">No favorites found</h3>
      <p className="text-gray-500 mb-4">You haven't added any freelancers to your favorites list yet.</p>
      <div className="flex justify-center gap-4">
        <button 
          onClick={onClearFilters}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          Clear filters
        </button>
        <button 
          onClick={() => window.location.href = '/search'}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Find freelancers
        </button>
      </div>
    </div>
  );
};

// Main FavoriteFreelancers component
const FavoriteFreelancersPage = () => {
  const [freelancers, setFreelancers] = useState(sampleFreelancers);
  const [filteredFreelancers, setFilteredFreelancers] = useState(sampleFreelancers);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('rating');
  
  // Effect to filter and sort freelancers
  useEffect(() => {
    let result = [...freelancers].filter(f => f.isFavorite);
    
    // Apply search filter if query exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(f => 
        f.fullName.toLowerCase().includes(query) || 
        f.username.toLowerCase().includes(query) ||
        f.country.toLowerCase().includes(query) ||
        f.specialties.some(s => s.toLowerCase().includes(query))
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
  }, [freelancers, searchQuery, sortOption]);
  
  // Handle toggling favorites
  const handleToggleFavorite = (id) => {
    setFreelancers(freelancers.map(f => 
      f.id === id ? { ...f, isFavorite: !f.isFavorite } : f
    ));
  };
  
  // Handle hiring a freelancer
  const handleHire = (id) => {
    // This would typically open a chat or create a job offer
    console.log(`Opening hire dialog for freelancer ${id}`);
    alert(`You're about to hire freelancer with ID ${id}`);
  };
  
  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  
  // Handle filter change
  const handleFilterChange = () => {
    // This would typically open a filter dialog
    console.log('Opening filter dialog');
    alert('Filter options would appear here');
  };
  
  // Handle sort change
  const handleSortChange = (option) => {
    setSortOption(option);
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSortOption('rating');
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Favorite Freelancers</h1>
          <p className="text-gray-600">
            Manage your favorite freelancers and quickly get in touch with them when you need their services.
          </p>
        </div>
        
        {/* Filter bar */}
        <FilterBar 
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onSort={handleSortChange}
        />
        
        {/* Freelancer grid */}
        {filteredFreelancers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {filteredFreelancers.map(freelancer => (
              <FreelancerCard 
                key={freelancer.id}
                freelancer={freelancer}
                onToggleFavorite={handleToggleFavorite}
                onHire={handleHire}
              />
            ))}
          </div>
        ) : (
          <EmptyState onClearFilters={handleClearFilters} />
        )}
        
        {/* Pagination */}
        {filteredFreelancers.length > 0 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-600 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 rounded bg-blue-500 text-white">1</button>
              <button className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-600 hover:bg-gray-50">2</button>
              <button className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-600 hover:bg-gray-50">3</button>
              <span className="px-2 text-gray-500">...</span>
              <button className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-600 hover:bg-gray-50">10</button>
              <button className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-600 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteFreelancersPage;