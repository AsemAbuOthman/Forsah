import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Clock, DollarSign, User, Tag, MapPin, Globe, Search, X, Filter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch (error) {
    return dateString;
  }
};

const formatcode = (amount, code = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0
  }).format(amount);
};

const getTimeAgo = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return 'Invalid date';
  const createdDate = new Date(dateString.replace(' ', 'T'));
  if (isNaN(createdDate.getTime())) return 'Invalid date';

  const now = new Date();
  const diffMs = now - createdDate;
  if (diffMs < 0) return 'Just now';

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  const yearDiff = now.getFullYear() - createdDate.getFullYear();
  const monthDiff = now.getMonth() - createdDate.getMonth();
  const dayDiff = now.getDate() - createdDate.getDate();
  let diffMonths = yearDiff * 12 + monthDiff;
  if (dayDiff < 0) diffMonths--;

  const diffYears = Math.floor(diffMonths / 12);

  if (diffSeconds < 10) return 'Just now';
  if (diffSeconds < 60) return `${diffSeconds} second${diffSeconds !== 1 ? 's' : ''} ago`;
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
  return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
};

const getSkillColor = (skill) => {
  const hash = skill.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const colors = [
    "bg-violet-100 text-violet-800",
    "bg-amber-100 text-amber-800", 
    "bg-blue-100 text-blue-800",
    "bg-orange-100 text-orange-800",
    "bg-yellow-100 text-yellow-800",
    "bg-rose-100 text-rose-800",
    "bg-teal-100 text-teal-800"
  ];
  return colors[Math.abs(hash) % colors.length];
};

const ProjectCard = ({ project }) => {

  const navigate = useNavigate();

  const getAccentColor = (id) => {
    switch(id % 5) {
      case 0: return { primary: 'border-violet-500 text-violet-700', light: 'bg-violet-50', dark: 'bg-violet-500 text-white', gradient: 'from-violet-500 to-purple-600', hover: 'hover:bg-violet-600' };
      case 1: return { primary: 'border-amber-500 text-amber-700', light: 'bg-amber-50', dark: 'bg-amber-500 text-white', gradient: 'from-amber-500 to-orange-500', hover: 'hover:bg-amber-600' };
      case 2: return { primary: 'border-blue-500 text-blue-700', light: 'bg-blue-50', dark: 'bg-blue-500 text-white', gradient: 'from-blue-500 to-indigo-500', hover: 'hover:bg-blue-600' };
      case 3: return { primary: 'border-rose-500 text-rose-700', light: 'bg-rose-50', dark: 'bg-rose-500 text-white', gradient: 'from-rose-500 to-pink-500', hover: 'hover:bg-rose-600' };
      case 4: return { primary: 'border-teal-500 text-teal-700', light: 'bg-teal-50', dark: 'bg-teal-500 text-white', gradient: 'from-teal-500 to-emerald-500', hover: 'hover:bg-teal-600' };
      default: return { primary: 'border-gray-500 text-gray-700', light: 'bg-gray-50', dark: 'bg-gray-500 text-white', gradient: 'from-gray-500 to-gray-600', hover: 'hover:bg-gray-600' };
    }
  };
  
  const colors = getAccentColor(project.projectId);
  const colorName = colors.primary.split('-')[1].split('-')[0];
  
  return (
    <div onClick={() => navigate('/proposals', { state: { projectData: project } })} className={`bg-gray-100 rounded-xl transition-all duration-300 overflow-hidden cursor-pointer hover:translate-x-4 hover:scale-105 shadow-xl hover:shadow-2xl`} 
          style={{
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            ['--hover-shadow-color']: `var(--${colorName}-300)`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 20px 40px 0 rgba(var(--${colorName}-rgb), 0.3)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
          }}>
      <div className="p-5">
        <div className="mb-4">
          <h3 className={`text-xl font-bold text-gray-800 border-l-4 pl-3 py-1 ${colors.primary.split(' ')[0]}`}>
            {project.projectTitle}
          </h3>
        </div>
        
        <div className="flex flex-wrap items-center justify-between mb-3 text-xs text-gray-500">
          <div className="flex items-center">
            <span className={`${colors.light} ${colors.primary} px-2 py-0.5 rounded mr-2 font-mono`}>#{project.projectId}</span>
            <Clock className="h-3 w-3 mx-1 text-gray-400" />
            <span>{getTimeAgo(project.createdAt)}</span>
          </div>
          <div className="flex items-center mt-2 sm:mt-0">
            <Globe className="h-3 w-3 mr-1 text-gray-400" />
            <span>{project.language}</span>
            <span className="mx-2">•</span>
            <MapPin className="h-3 w-3 mr-1 text-gray-400" />
            <span>{project.countryName}</span>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 text-sm line-clamp-3"><span className="break-words">{project.projectDescription}</span></p>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className={`${colors.light} p-3 rounded-lg mb-3 shadow-2xl`}>
              <h4 className="text-xs uppercase font-semibold mb-1 text-gray-700">Budget</h4>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs">Range:</span>
                <span className={`text-xl font-bold ${colors.primary.split(' ')[1]}`}>
                  {project.symbol != '?' ? project.symbol : project.code} {formatcode(project.minBudget)} - {formatcode(project.maxBudget)} <span className="text-xs text-gray-500 ml-1">{project.code}</span>
                </span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg shadow-md">
              <h4 className="text-xs uppercase font-semibold mb-2 text-gray-700">Deadline</h4>
              <div className="flex items-center">
                <Calendar className={`h-4 w-4 mr-2 ${colors.primary.split(' ')[1]}`} />
                <span className="text-base font-medium text-gray-800">{formatDate(project.projectDeadline)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white p-3 rounded-lg h-full border border-gray-100 shadow-md">
              <h4 className="text-xs uppercase font-semibold mb-2 text-gray-700">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:scale-105">
                    {typeof skill === 'object' ? skill.skillName : skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <div className="flex items-center text-gray-500 text-xs">
            <User className="h-3 w-3 mr-1" />
            <span>Client ID: {project.userId}</span>
          </div>
          <button onClick={()=> navigate('/proposals', { state: { projectData: project } })} className={`bg-gradient-to-r ${colors.gradient} ${colors.hover} text-white rounded-full px-4 py-1.5 font-bold text-sm transition-colors duration-300 shadow-md cursor-pointer`}>
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative ">
      <div className="flex shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-3 flex items-center justify-center">
          <Search className="text-white h-5 w-5" />
        </div>
        <input
          type="text"
          placeholder="Search projects by title, skills or location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-4 pr-20 py-3 w-full border-0 focus:ring-2 focus:ring-violet-300 focus:outline-none text-gray-700"
        />
        <div className="absolute right-0 h-full flex items-center pr-1">
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); onSearch(''); }}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 mx-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md hover:shadow-md transition-all mx-1"
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>
    </form>
  );
};

const Filters = ({ filters, setFilters, allProjects }) => {
  const countries = [...new Set(allProjects.map(p => p.countryName))].map(c => ({ label: c, value: c }));
  const languages = [...new Set(allProjects.map(p => p.language))].map(l => ({ label: l, value: l }));
  const currencies = [...new Set(allProjects.map(p => p.code))].map(c => ({ label: c, value: c }));
  
  const allSkills = [...new Set(allProjects.flatMap(p => 
    p.skills.map(s => typeof s === 'object' ? s.skillName : s)
  ))].sort();
  
  const skills = allSkills.map(s => ({ label: s, value: s }));
  const projectStates = [
    { label: 'Open', value: 'Open' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' }
  ];
  
  const handleCheckboxChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: prev[filterName].includes(value)
        ? prev[filterName].filter(v => v !== value)
        : [...prev[filterName], value]
    }));
  };
  
  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const clearFilters = () => {
    setFilters({
      skills: [],
      countries: [],
      languages: [],
      currencies: [],
      projectStates: [],
      minBudget: '',
      maxBudget: ''
    });
  };
  
  const getFilterColor = (title) => {
    switch(title) {
      case 'Project Status': return { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800', accent: 'text-violet-600' };
      case 'Budget Range': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', accent: 'text-blue-600' };
      case 'Skills': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', accent: 'text-blue-600' };
      case 'countryName': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', accent: 'text-blue-600' };
      case 'Language': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', accent: 'text-blue-600' };
      case 'code': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', accent: 'text-blue-600' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800', accent: 'text-gray-600' };
    }
  };

  const FilterAccordion = ({ title, children }) => {
    const colors = getFilterColor(title);
    const [isOpen, setIsOpen] = useState(true);
    
    return (
      <div className={`rounded-md overflow-hidden mb-3 ${colors.border} border`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex justify-between items-center w-full text-left font-medium p-2 ${colors.bg} ${colors.text}`}
        >
          {title}
          <ChevronDown className={`h-4 w-4 transition-transform ${colors.accent} ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>
        {isOpen && <div className="p-3 space-y-2 bg-white">{children}</div>}
      </div>
    );
  };

  const CheckboxGroup = ({ options, selected, onChange, colors }) => (
    <div className="space-y-1.5">
      {options.map((option) => (
        <label key={option.value} className="flex items-center text-sm hover:bg-gray-50 p-1 rounded cursor-pointer">
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={() => onChange(option.value)}
            className={`rounded border-gray-300 ${colors?.accent || 'text-violet-600'} shadow-sm focus:ring-2 focus:ring-opacity-50 mr-2`}
          />
          <span className="truncate">{option.label}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4  ">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Filters</h3>
        <button onClick={clearFilters} className="text-sm bg-rose-50 text-rose-600 hover:bg-rose-100 px-2 py-1 rounded-md transition-colors duration-150">
          Clear All
        </button>
      </div>

      <FilterAccordion title="Budget Range">
        <div className="space-y-2">
          <div>
            <label className="block text-sm text-blue-700 mb-1">Min Budget</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-blue-500">$</span>
              <input
                type="number"
                name="minBudget"
                placeholder="Minimum"
                value={filters.minBudget}
                onChange={handleRangeChange}
                className="w-full pl-6 pr-3 py-2 border border-blue-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-blue-700 mb-1">Max Budget</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-blue-500">$</span>
              <input
                type="number"
                name="maxBudget"
                placeholder="Maximum"
                value={filters.maxBudget}
                onChange={handleRangeChange}
                className="w-full pl-6 pr-3 py-2 border border-blue-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </FilterAccordion>
      
      <FilterAccordion title="Skills">
        <div className="max-h-40 overflow-y-auto pr-2 space-y-1.5 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50">
          <CheckboxGroup
            options={skills}
            selected={filters.skills}
            onChange={(value) => handleCheckboxChange('skills', value)}
            colors={getFilterColor('Skills')}
          />
        </div>
      </FilterAccordion>
      
      <FilterAccordion title="countryName">
        <div className="max-h-36 overflow-y-auto pr-2">
          <CheckboxGroup
            options={countries}
            selected={filters.countries}
            onChange={(value) => handleCheckboxChange('countries', value)}
            colors={getFilterColor('countryName')}
          />
        </div>
      </FilterAccordion>
      
      <FilterAccordion title="Language">
        <CheckboxGroup
          options={languages}
          selected={filters.languages}
          onChange={(value) => handleCheckboxChange('languages', value)}
          colors={getFilterColor('Language')}
        />
      </FilterAccordion>
      
      <FilterAccordion title="code">
        <CheckboxGroup
          options={currencies}
          selected={filters.currencies}
          onChange={(value) => handleCheckboxChange('currencies', value)}
          colors={getFilterColor('code')}
        />
      </FilterAccordion>
    </div>
  );
};

const ProjectsPageEnhanced = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    skills: [],
    countries: [],
    languages: [],
    currencies: [],
    projectStates: [],
    minBudget: '',
    maxBudget: ''
  });
  const [sortOption, setSortOption] = useState('newest');
  const postsPerPage = 10;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/projects/`, {
          params: {
            page: currentPage,
            limit: postsPerPage,
            search: searchQuery,
            skills: filters.skills,
            countries: filters.countries,
            languages: filters.languages,
            currencies: filters.currencies,
            projectStates: filters.projectStates,
            minBudget: filters.minBudget,
            maxBudget: filters.maxBudget,
            sort: sortOption
          }
        });
        
        const projectsData = response.data?.projects || [];
        const totalCount = response.data?.totalProjects || 0;

        setProjects(projectsData);
        setFilteredProjects(projectsData);
        setTotalPages(Math.ceil(totalCount / postsPerPage));
        
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
}, [currentPage, searchQuery, filters, sortOption]);


  useEffect(() => {
    if (!projects.length) return;
    
    let result = [...projects];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(project => 
        project.projectTitle.toLowerCase().includes(query) ||
        project.projectDescription.toLowerCase().includes(query) ||
        project.skills.some(skill => 
          (typeof skill === 'object' ? skill.skillName : skill).toLowerCase().includes(query)
        )
      );
    }
    
    if (filters.skills.length > 0) {
      result = result.filter(project => 
        filters.skills.some(filterSkill => 
          project.skills.some(projectSkill => 
            (typeof projectSkill === 'object' ? projectSkill.skillName : projectSkill) === filterSkill
          )
        )
      );
    }
    
    if (filters.countries.length > 0) {
      result = result.filter(project => filters.countries.includes(project.countryName));
    }
    
    if (filters.languages.length > 0) {
      result = result.filter(project => filters.languages.includes(project.language));
    }
    
    if (filters.currencies.length > 0) {
      result = result.filter(project => filters.currencies.includes(project.code));
    }
    
    if (filters.projectStates.length > 0) {
      result = result.filter(project => filters.projectStates.includes(project.projectStateType));
    }
    
    if (filters.minBudget) {
      result = result.filter(project => project.maxBudget >= Number(filters.minBudget));
    }
    
    if (filters.maxBudget) {
      result = result.filter(project => project.minBudget <= Number(filters.maxBudget));
    }
    
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'budget-high':
        result.sort((a, b) => b.maxBudget - a.maxBudget);
        break;
      case 'budget-low':
        result.sort((a, b) => a.minBudget - b.minBudget);
        break;
      case 'deadline':
        result.sort((a, b) => new Date(a.projectDeadline) - new Date(b.projectDeadline));
        break;
      default:
        break;
    }
    
    setFilteredProjects(result);
    setTotalPages(Math.ceil(result.length / postsPerPage));
    setCurrentPage(1);
  }, [projects, filters, sortOption]);

  const handleSortChange = (e) => setSortOption(e.target.value);
  const handleSearch = (query) => setSearchQuery(query);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }

    return (
      <div className="flex justify-center mt-8 items-center ">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-l-md border border-gray-200 text-sm font-medium flex items-center ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-violet-600 hover:bg-violet-50'
          }`}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => goToPage(1)}
              className="px-4 py-2 bg-white text-violet-600 border border-gray-200 text-sm font-medium"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium">
                ...
              </span>
            )}
          </>
        )}

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
          const pageNum = startPage + i;
          return (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`px-4 py-2 border border-gray-200 text-sm font-medium ${
                pageNum === currentPage
                  ? 'bg-violet-600 text-white'
                  : 'bg-white text-violet-600 hover:bg-violet-50'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium">
                ...
              </span>
            )}
            <button
              onClick={() => goToPage(totalPages)}
              className="px-4 py-2 bg-white text-violet-600 border border-gray-200 text-sm font-medium"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-r-md border border-gray-200 text-sm font-medium flex items-center ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-violet-600 hover:bg-violet-50'
          }`}
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </button>

        <div className="text-gray-500 text-sm ml-4">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 bg-gray-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 text-center bg-gradient-to-r from-violet-500 to-blue-500 text-white py-8 rounded-lg shadow-md">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Find Perfect Projects</h1>
          <p className="max-w-2xl mx-auto text-violet-100">Discover and apply to the best freelance projects that match your skills and experience.</p>
        </div>
        
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/5">
            <Filters filters={filters} setFilters={setFilters} allProjects={projects} />
            
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-4 mt-4 text-white shadow-md">
              <h3 className="text-lg font-medium mb-2">Looking for Work?</h3>
              <p className="text-amber-50 text-sm mb-3">Create a profile to showcase your skills and get personalized project recommendations.</p>
              <button className="w-full bg-white text-amber-600 hover:bg-amber-50 font-medium py-2 px-4 rounded-md transition-colors duration-300">
                Sign Up as Freelancer
              </button>
            </div>
          </div>
          
          <div className="lg:w-4/5">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row justify-between items-center">
              <div className="mb-3 md:mb-0">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  {loading ? (
                    <span className="inline-flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading projects...
                    </span>
                  ) : (
                    <span className="text-violet-800">
                      <span className="text-2xl font-bold mr-2">{filteredProjects.length}</span> 
                      Projects Found
                    </span>
                  )}
                </h2>
                <p className="text-gray-600 text-sm">Based on your current filters</p>
              </div>
              
              <div className="relative">
                <label className="block text-xs text-violet-600 mb-1">Sort By:</label>
                <select 
                  className="bg-violet-50 border border-violet-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none pr-8"
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="budget-high">Highest Budget</option>
                  <option value="budget-low">Lowest Budget</option>
                  <option value="deadline">Deadline (Soonest)</option>
                </select>
                <ChevronDown className="absolute right-2 top-7 h-4 w-4 text-violet-500 pointer-events-none" />
              </div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 gap-4 animate-pulse">
                {[...Array(3)].map((_, i) => {
                  const colorName = i % 5 === 0 ? 'violet' : 
                                i % 5 === 1 ? 'amber' : 
                                i % 5 === 2 ? 'blue' : 
                                i % 5 === 3 ? 'rose' : 'teal';
                  
                  return (
                    <div key={i} className="bg-white rounded-lg shadow-xl p-5" 
                        style={{boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'}}>
                      <div className="mb-4">
                        <div className={`h-7 bg-gray-200 rounded-md w-3/4 border-l-4 border-${colorName}-500 pl-3`}></div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className={`h-5 w-16 bg-${colorName}-100 rounded-md mr-2`}></div>
                          <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
                        </div>
                        <div className="h-4 w-28 bg-gray-200 rounded-md"></div>
                      </div>
                      
                      <div className="space-y-1.5 mb-4">
                        <div className="h-3 bg-gray-200 rounded-md w-full"></div>
                        <div className="h-3 bg-gray-200 rounded-md w-full"></div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-3">
                          <div className={`h-20 bg-${colorName}-50 rounded-lg shadow-md`}></div>
                        </div>
                        <div className="h-20 bg-white rounded-lg flex flex-wrap gap-2 p-2 border border-gray-100 shadow-md">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-5 w-16 rounded-full bg-blue-100"></div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
                        <div className={`h-6 w-24 rounded-full bg-gradient-to-r from-${colorName}-500 to-${
                          colorName === 'violet' ? 'purple' : 
                          colorName === 'amber' ? 'orange' : 
                          colorName === 'blue' ? 'indigo' : 
                          colorName === 'rose' ? 'pink' : 'emerald'
                        }-500`}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-violet-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-violet-500" />
                </div>
                <h3 className="text-xl font-medium text-violet-800 mb-2">No Projects Found</h3>
                <p className="text-gray-600 mb-4">We couldn't find any projects matching your current filters.</p>
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={() => {
                      setFilters({
                        skills: [],
                        countries: [],
                        languages: [],
                        currencies: [],
                        projectStates: [],
                        minBudget: '',
                        maxBudget: ''
                      });
                      setSearchQuery('');
                    }}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 shadow-md flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" /> Clear All Filters
                  </button>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="bg-white border border-violet-300 text-violet-700 hover:bg-violet-50 font-medium py-2 px-4 rounded-md transition-colors duration-300"
                  >
                    Try Different Search
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredProjects
                  .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
                  .map(project => (
                    <ProjectCard key={project.projectId} project={project} />
                  ))
                }
              </div>
            )}
            
            {filteredProjects.length > 0 && renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPageEnhanced;