import React, { useState } from 'react';
import { Bell, Calendar, MessageSquare, Award, ChevronRight, Clock, User, Bookmark, BarChart2, TrendingUp, AlertCircle, X, ExternalLink, CheckCircle, DollarSign } from 'lucide-react';

// Sample data for dashboard
const sampleAnnouncements = [
  {
    id: 1,
    title: "New Bidding System Launch",
    content: "We've updated our bidding system with improved visibility and faster performance. Check it out!",
    date: "2025-05-01T14:30:00Z",
    type: "update",
    isRead: false
  },
  {
    id: 2,
    title: "Upcoming Scheduled Maintenance",
    content: "The platform will be down for scheduled maintenance on May 10th from 2AM to 4AM UTC.",
    date: "2025-05-02T10:30:00Z",
    type: "maintenance",
    isRead: true
  },
  {
    id: 3,
    title: "New Skills Categories Added",
    content: "We've added 20 new skills categories including AI & Machine Learning, Blockchain, and more!",
    date: "2025-04-28T09:30:00Z",
    type: "feature",
    isRead: false
  }
];

const sampleProposals = [
  {
    id: 1,
    projectId: 23,
    projectTitle: "Excel Date Formula Adjustment",
    freelancerId: 456,
    freelancerName: "Alex Johnson",
    profileImage: "https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff",
    country: "Canada",
    bidAmount: 280,
    currency: "USD",
    coverLetter: "I have 5+ years of experience with Excel formulas and can complete this task efficiently. I've built similar date validation systems for accounting firms in the past.",
    deliveryTime: "3 days",
    rating: 4.9,
    completedProjects: 78,
    skills: ["Excel", "VBA", "Data Analysis"],
    submittedAt: "2025-05-01T14:30:00Z",
    status: "pending"
  },
  {
    id: 2,
    projectId: 24,
    projectTitle: "Grocery Store 3D Layout Design",
    freelancerId: 789,
    freelancerName: "Maria Garcia",
    profileImage: "https://ui-avatars.com/api/?name=Maria+Garcia&background=f59e0b&color=fff",
    country: "Spain",
    bidAmount: 650,
    currency: "USD",
    coverLetter: "I'm an architect with experience designing retail spaces. I've designed layouts for 15+ grocery stores and can provide a detailed 3D rendering with customer flow analysis.",
    deliveryTime: "7 days",
    rating: 4.7,
    completedProjects: 42,
    skills: ["3D Modeling", "Architecture", "AutoCAD"],
    submittedAt: "2025-05-01T16:45:00Z",
    status: "pending"
  },
  {
    id: 3,
    projectId: 25,
    projectTitle: "Logo Design for Tech Startup",
    freelancerId: 123,
    freelancerName: "David Chen",
    profileImage: "https://ui-avatars.com/api/?name=David+Chen&background=10b981&color=fff",
    country: "Singapore",
    bidAmount: 350,
    currency: "USD",
    coverLetter: "I specialize in modern, minimal logo design for tech companies. With my background in both design and tech, I understand the aesthetics that appeal to tech audiences.",
    deliveryTime: "5 days",
    rating: 4.8,
    completedProjects: 104,
    skills: ["Logo Design", "Branding", "Adobe Illustrator"],
    submittedAt: "2025-05-02T09:15:00Z",
    status: "pending"
  }
];

const sampleStats = {
  activeProjects: 4,
  pendingProposals: 12,
  completedProjects: 27,
  totalSpent: 8750
};

// Format currency with symbol
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0
  }).format(amount);
};

// Get currency symbol based on currency code
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
    BRL: 'R$',
    MXN: 'Mex$',
    RUB: '₽',
  };
  
  return symbols[currencyCode] || currencyCode;
};

// Calculate time ago
const getTimeAgo = (dateString) => {
  const now = new Date();
  const createdDate = new Date(dateString);
  const diffMs = now - createdDate;
  
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

// Announcement Card Component
const AnnouncementCard = ({ announcement, onMarkAsRead }) => {
  const getTypeStyles = (type) => {
    switch (type) {
      case 'update':
        return {
          icon: <TrendingUp className="h-5 w-5 text-violet-500" />,
          bg: 'bg-violet-50',
          border: 'border-violet-200',
          text: 'text-violet-800'
        };
      case 'maintenance':
        return {
          icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800'
        };
      case 'feature':
        return {
          icon: <CheckCircle className="h-5 w-5 text-blue-500" />,
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800'
        };
      default:
        return {
          icon: <Bell className="h-5 w-5 text-gray-500" />,
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800'
        };
    }
  };

  const styles = getTypeStyles(announcement.type);

  return (
    <div className={`${styles.bg} border ${styles.border} rounded-lg p-4 mb-3 relative ${!announcement.isRead ? 'ring-2 ring-blue-300' : ''}`}>
      {!announcement.isRead && (
        <div className="absolute top-2 right-2">
          <span className="bg-blue-500 h-2.5 w-2.5 rounded-full block"></span>
        </div>
      )}
      <div className="flex items-start">
        <div className={`rounded-full p-2 ${styles.bg} mr-3`}>
          {styles.icon}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold mb-1 ${styles.text}`}>{announcement.title}</h3>
          <p className="text-gray-600 text-sm mb-2">{announcement.content}</p>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{getTimeAgo(announcement.date)}</span>
            {!announcement.isRead && (
              <button 
                onClick={() => onMarkAsRead(announcement.id)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Proposal Card Component
const ProposalCard = ({ proposal, onAward, onChat }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Get random gradient color based on freelancer ID
  const getGradient = (id) => {
    const gradients = [
      'from-violet-500 to-purple-600',
      'from-blue-500 to-indigo-600',
      'from-green-500 to-teal-600',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-pink-600'
    ];
    
    return gradients[id % gradients.length];
  };
  
  const gradient = getGradient(proposal.freelancerId);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 hover:shadow-lg transition-shadow ">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="relative">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradient} blur-sm opacity-30 scale-110`}></div>
            <img 
              src={proposal.profileImage} 
              alt={proposal.freelancerName} 
              className="w-10 h-10 rounded-full border-2 border-white relative z-10"
            />
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{proposal.freelancerName}</h3>
              <div className="flex items-center">
                <span className="text-amber-500 text-sm font-medium mr-1">{proposal.rating}</span>
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <span>{proposal.country}</span>
              <span className="mx-2">•</span>
              <span>{proposal.completedProjects} projects</span>
            </div>
          </div>
        </div>
        
        <div className="border-l-4 border-blue-500 pl-3 py-1 mb-3">
          <span className="text-xs text-gray-500">Proposal for</span>
          <h4 className="text-sm font-semibold text-gray-800">{proposal.projectTitle}</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-blue-50 p-2 rounded-md">
            <div className="text-xs text-gray-500 mb-1">Bid Amount</div>
            <div className="text-blue-700 font-bold">
              {getCurrencySymbol(proposal.currency)} {formatCurrency(proposal.bidAmount)}
              <span className="text-xs text-gray-500 ml-1">{proposal.currency}</span>
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <div className="text-xs text-gray-500 mb-1">Delivery Time</div>
            <div className="text-gray-700 font-medium flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
              {proposal.deliveryTime}
            </div>
          </div>
        </div>
        
        <div className={`text-sm text-gray-600 ${expanded ? '' : 'line-clamp-2'}`}>
          {proposal.coverLetter}
        </div>
        
        {proposal.coverLetter.length > 120 && (
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-xs text-blue-600 hover:text-blue-800 mt-1"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
        
        <div className="mt-3 flex flex-wrap gap-2">
          {proposal.skills.map((skill, index) => (
            <span 
              key={index}
              className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50 p-3 flex items-center justify-between border-t">
        <div className="text-xs text-gray-500">
          Submitted {getTimeAgo(proposal.submittedAt)}
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => onChat(proposal.id)}
            className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors"
          >
            <MessageSquare className="h-4 w-4 mr-1.5" /> Chat
          </button>
          <button 
            onClick={() => onAward(proposal.id)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors shadow-sm"
          >
            <Award className="h-4 w-4 mr-1.5" /> Award
          </button>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon, title, value, trend, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-${color}-500`}>{icon}</span>
        {trend && (
          <span className={`text-xs font-medium ${trend.type === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-2 py-0.5 rounded-full flex items-center`}>
            {trend.type === 'up' ? '+' : '-'}{trend.value}%
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  );
};

// Main Dashboard Component
const DashboardPage = () => {
  const [announcements, setAnnouncements] = useState(sampleAnnouncements);
  const [proposals, setProposals] = useState(sampleProposals);
  
  // Handle mark announcement as read
  const handleMarkAsRead = (id) => {
    setAnnouncements(announcements.map(announcement => 
      announcement.id === id ? { ...announcement, isRead: true } : announcement
    ));
  };
  
  // Handle award proposal
  const handleAward = (id) => {
    // This would typically involve an API call
    console.log(`Awarding proposal ${id}`);
    alert(`Proposal ${id} has been awarded successfully!`);
  };
  
  // Handle chat with freelancer
  const handleChat = (id) => {
    // This would typically open a chat interface
    console.log(`Opening chat for proposal ${id}`);
    alert(`Chat window for proposal ${id} would open here`);
  };
  
  // Calculate unread announcement count
  const unreadCount = announcements.filter(a => !a.isRead).length;
  
  return (
    <div className="bg-gray-50 min-h-screen py-6 bg-gray-200">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            icon={<BarChart2 className="h-6 w-6" />} 
            title="Active Projects" 
            value={sampleStats.activeProjects}
            color="violet"
          />
          <StatsCard 
            icon={<Clock className="h-6 w-6" />} 
            title="Pending Proposals" 
            value={sampleStats.pendingProposals}
            trend={{ type: 'up', value: 12 }}
            color="amber"
          />
          <StatsCard 
            icon={<CheckCircle className="h-6 w-6" />} 
            title="Completed Projects" 
            value={sampleStats.completedProjects}
            trend={{ type: 'up', value: 8 }}
            color="green"
          />
          <StatsCard 
            icon={<DollarSign className="h-6 w-6" />} 
            title="Total Spent" 
            value={`$${formatCurrency(sampleStats.totalSpent)}`}
            color="blue"
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Announcements */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Bell className="h-5 w-5 text-violet-500 mr-2" />
                  Announcements
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </h2>
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">View all</a>
              </div>
              
              <div className="space-y-4">
                {announcements.map(announcement => (
                  <AnnouncementCard 
                    key={announcement.id} 
                    announcement={announcement}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h2>
              <div className="space-y-2">
                <a href="#" className="block px-4 py-2 rounded-md hover:bg-gray-50 text-gray-700 flex justify-between items-center">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-violet-500 mr-2" />
                    <span>View Profile</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </a>
                <a href="#" className="block px-4 py-2 rounded-md hover:bg-gray-50 text-gray-700 flex justify-between items-center">
                  <div className="flex items-center">
                    <Bookmark className="h-4 w-4 text-amber-500 mr-2" />
                    <span>Saved Projects</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </a>
                <a href="#" className="block px-4 py-2 rounded-md hover:bg-gray-50 text-gray-700 flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                    <span>Project Timeline</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </a>
                <a href="#" className="block px-4 py-2 rounded-md hover:bg-gray-50 text-gray-700 flex justify-between items-center">
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 text-green-500 mr-2" />
                    <span>Post New Project</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Right Column - Proposals */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-4 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                  New Proposals
                  <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                    {proposals.length}
                  </span>
                </h2>
                <div className="flex items-center">
                  <select className="text-sm border-gray-300 rounded-md text-gray-600 px-2 py-1 mr-2">
                    <option>Most Recent</option>
                    <option>Highest Rated</option>
                    <option>Lowest Bid</option>
                  </select>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">View all</a>
                </div>
              </div>
              
              {/* Proposals List */}
              <div className="space-y-4">
                {proposals.map(proposal => (
                  <ProposalCard 
                    key={proposal.id} 
                    proposal={proposal}
                    onAward={handleAward}
                    onChat={handleChat}
                  />
                ))}
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">View all</a>
              </div>
              
              <div className="border-l-2 border-gray-200 pl-4 py-2 ml-3 space-y-6">
                <div className="relative">
                  <div className="absolute -left-7 top-0 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
                  <div className="text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">Project Completed:</span> Logo Design for Tech Startup
                    </p>
                    <p className="text-gray-500 text-xs mt-1">2 days ago</p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-7 top-0 bg-blue-500 rounded-full w-4 h-4 border-2 border-white"></div>
                  <div className="text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">New Message:</span> from David Chen regarding Logo Design project
                    </p>
                    <p className="text-gray-500 text-xs mt-1">3 days ago</p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-7 top-0 bg-amber-500 rounded-full w-4 h-4 border-2 border-white"></div>
                  <div className="text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">Payment Made:</span> $350 to David Chen for Logo Design
                    </p>
                    <p className="text-gray-500 text-xs mt-1">3 days ago</p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-7 top-0 bg-violet-500 rounded-full w-4 h-4 border-2 border-white"></div>
                  <div className="text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">New Project Posted:</span> Excel Date Formula Adjustment
                    </p>
                    <p className="text-gray-500 text-xs mt-1">5 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;