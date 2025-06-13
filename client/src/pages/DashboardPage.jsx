import React, { useState, useEffect } from 'react';
import { 
  Bell, Calendar, MessageSquare, Award, ChevronRight, 
  Clock, User, Bookmark, BarChart2, TrendingUp, 
  AlertCircle, CheckCircle, DollarSign, Star, Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardPage = ({ currentUser = JSON.parse(localStorage.getItem('userData')) }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    activeProjects: 12,
    pendingProposals: 4,
    completedProjects: 50,
    totalSpent: 9409
  });

  // Fetch proposals and stats on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch proposals
        const proposalsResponse = await axios.get(`/api/recommended/${currentUser.userId[0]}`);
        if (!proposalsResponse.data.success) {
          throw new Error(proposalsResponse.error);
        }
        setProposals(proposalsResponse.data.proposals);
        
        // Fetch stats (you would implement this service)
        // const statsResponse = await axios.get.getUserStats(currentUser.id);
        // setStats(statsResponse.data);
        
      } catch (err) {
        setError(err.message);
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser.userId[0]]);

  // Handle awarding a proposal
  const handleAward = async (proposalId) => {
    // try {
    //   const response = await ProposalService.awardProposal(proposalId);
    //   if (response.success) {
    //     setProposals(proposals.filter(p => p.id !== proposalId));
    //     // Show success notification
    //   } else {
    //     throw new Error(response.error);
    //   }
    // } catch (err) {
    //   setError(err.message);
    // }
  };

  // Handle starting a chat
  const handleChat = (freelancerId) => {
    navigate(`/messages`);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg mx-4 my-8">
        <p>Error loading dashboard: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-red-100 rounded-md hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {currentUser.firstName + ' ' + currentUser.lastName}! Here's what's happening with your projects.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<BarChart2 className="h-6 w-6 text-indigo-500" />}
            title="Active Projects"
            value={stats.activeProjects}
            trend="up"
          />
          <StatCard 
            icon={<Clock className="h-6 w-6 text-amber-500" />}
            title="Pending Proposals"
            value={stats.pendingProposals}
            trend="up"
          />
          <StatCard 
            icon={<CheckCircle className="h-6 w-6 text-green-500" />}
            title="Completed Projects"
            value={stats.completedProjects}
            trend="up"
          />
          <StatCard 
            icon={<DollarSign className="h-6 w-6 text-blue-500" />}
            title="Total Spent"
            value={formatCurrency(stats.totalSpent)}
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Proposals Section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                  New Proposals
                </h2>
                <div className="flex items-center space-x-2">
                  <select className="text-sm border-gray-300 rounded-md">
                    <option>Most Recent</option>
                    <option>Highest Rated</option>
                    <option>Lowest Bid</option>
                  </select>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    View All
                  </button>
                </div>
              </div>

              {proposals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-24 w-24 text-gray-400">
                    <MessageSquare className="h-full w-full" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No new proposals
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You don't have any pending proposals right now.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <ProposalCard
                      key={proposal.proposalId}
                      proposal={proposal}
                      onAward={() => handleAward(proposal.proposalId)}
                      onChat={() => handleChat(proposal.freelancerId)}
                      formatCurrency={formatCurrency}
                      getTimeAgo={getTimeAgo}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/post_project')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
                >
                  <span>Post New Project</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button onClick={() => navigate('/messages')} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100">
                  <span>View Messages</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100">
                  <span>Project Timeline</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <ActivityItem 
                  icon={<Award className="h-5 w-5 text-green-500" />}
                  title="Project Awarded"
                  description="Logo Design for Tech Startup"
                  time="2 hours ago"
                />
                <ActivityItem 
                  icon={<MessageSquare className="h-5 w-5 text-blue-500" />}
                  title="New Message"
                  description="From David Chen"
                  time="1 day ago"
                />
                <ActivityItem 
                  icon={<CheckCircle className="h-5 w-5 text-purple-500" />}
                  title="Project Completed"
                  description="Website Redesign"
                  time="3 days ago"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, trend }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="rounded-full p-3 bg-gray-50">
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-medium bg-green-50 text-green-600 px-2 py-1 rounded-full">
            +5.2%
          </span>
        )}
      </div>
      <h3 className="text-gray-500 text-sm mt-4">{title}</h3>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
};

// Proposal Card Component
const ProposalCard = ({ proposal, onAward, onChat, formatCurrency, getTimeAgo }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img
            onClick={() => navigate(`/profile/${proposal.userId}`)}
            src={proposal.imageUrl}
            alt={proposal.firstName + ' ' + proposal.lastName}
            className="hover:cursor-pointer h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 hover:cursor-pointer" onClick={() => navigate(`/profile/${proposal.userId}`)}>
              {proposal.firstName + ' ' + proposal.lastName}
              <br/>
              <span className="text-xs font-small text-gray-500 hover:text-blue-600 hover:cursor-pointer" onClick={() => navigate(`/profile/${proposal.userId}`)}>
                {'@' + proposal.username}
              </span>
            </h3>
            <div className="flex items-center text-sm text-amber-500">
              <Star className="h-4 w-4 fill-current mr-1" />
              {proposal.rating}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {proposal.countryName} • {proposal.completedProjects} projects
          </p>
          
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-900">
              {proposal.projectTitle}
            </h4>
            <p className={`text-sm text-gray-600 mt-1 ${expanded ? '' : 'line-clamp-2'}`}>
              {proposal.proposalDescription}
            </p>
            {proposal.proposalDescription.length > 100 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-blue-600 hover:text-blue-800 mt-1"
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-2 rounded-md">
              <p className="text-xs text-gray-500">Bid Amount</p>
              <p className="font-medium text-blue-700">
                {formatCurrency(proposal.proposalAmount)}
              </p>
            </div>
            <div className="bg-gray-50 p-2 rounded-md">
              <p className="text-xs text-gray-500">Delivery Time</p>
              <p className="font-medium text-gray-700 flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                {proposal.proposalDeadline}
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Submitted {getTimeAgo(proposal.createdAt)}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={onChat}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
              >
                Chat
              </button>
              <button
                onClick={onAward}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Award
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Activity Item Component
const ActivityItem = ({ icon, title, description, time }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 mt-0.5">
        <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
};

export default DashboardPage;