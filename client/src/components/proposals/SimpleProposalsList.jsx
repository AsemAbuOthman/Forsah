import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, AlertCircle } from 'lucide-react';
import ProposalCard from './ProposalCard';

/**
 * A simplified list of proposals for a project
 * @param {Object} props
 * @param {string} props.projectId - ID of the project
 * @param {boolean} props.isClientView - Whether viewed by client or freelancer
 * @param {string} props.apiUrl - API endpoint for proposals
 * @returns {JSX.Element}
 */
const SimpleProposalsList = ({ 
  projectId, 
  isClientView = false,
  apiUrl = '/api/proposals'
}) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


/*
  SELECT 
  proposals.proposalId,
  proposals.projectId,
  proposals.userId,
  proposals.proposalAmount,
  proposals.proposalDeadline,
  proposals.proposalDescription,
  proposals.createdAt,
  proposals.proposalStateId,
  users.firstName,
  users.lastName,
  countries.countryName,
  images.imageUrl


  FROM proposals
  INNER JOIN projects ON proposals.projectId = projects.projectId
  INNER JOIN users ON users.userId = proposals.userId
  INNER JOIN countries ON countries.countryId = users.countryId
  INNER JOIN profiles ON profiles.userId = proposals.userId
  INNER JOIN images ON profiles.profileId = images.imageableId AND images.imageableType = 'profile'

  WHERE proposals.projectId = ${}


  
*/

  // Sample data for proposal list
  const sampleProposals = [
    {
      proposalId: 1001,
      projectId:  123,
      userId: 789,
      proposalAmount: 350,
      proposalDeadline: "2023-06-15",
      proposalDescription: "Hello! I'm very experienced with Excel formulas and VBA. I've worked on many financial spreadsheets that deal with fiscal year calculations. I can fix your issue with the date formulas and ensure they account for the fiscal year differences correctly.\n\nI've attached some examples of similar work I've done in the past. I would approach this by first analyzing your current formulas, understanding the fiscal year requirements, and then implementing a solution that's both accurate and easy to maintain.\n\nLooking forward to working with you!",
      createdAt: new Date().toISOString(),
      proposalStateId: 1,
      firstName: "John",
      lastName: "Smith",
      imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
      city: "New York, USA",
      countryName: "United States",
      rating: 4.8,
      totalReviews: 57,
      totalEarned: 12500,
      projectsCompleted: 23,
      skills: ["Excel", "VBA", "Python", "Financial Analysis", "Data Visualization", "SQL", "Power BI"]
      }
  ];


  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {

        const response = await axios.get(`${apiUrl}/${projectId}`);
        setProposals(response.data.proposals || []);

        setTimeout(() => {
          setProposals(response.data.proposals);
          setLoading(false);
        }, 800); 
        
      } catch (err) {
        console.error('Error fetching proposals:', err);
        setError('Failed to load proposals. Please try again later.');
        setLoading(false);
      }
    };

    fetchProposals();
  }, [projectId]);

  // Handle chat with a freelancer
  const handleChatClick = (proposal) => {
    console.log('Chat with freelancer', proposal.freelancerId);
    alert(`Chat functionality would connect you with ${proposal.freelancer.name}`);
    // In a real application, this would open a chat with the freelancer
  };

  // Handle awarding a project to a freelancer
  const handleAwardClick = async (proposal) => {
    if (!isClientView) return;
    
    // Here you would typically show a confirmation dialog
    if (window.confirm(`Are you sure you want to award this project to ${proposal.freelancer.name}?`)) {
      try {
        // In a real application, you would make an API call
        // await axios.post(`${apiUrl}/${proposal.id}/award`, {
        //   projectId: proposal.projectId,
        //   freelancerId: proposal.freelancerId
        // });
        
        // For demo purposes, update the proposal state directly
        const updatedProposals = proposals.map(p => {
          if (p.id === proposal.id) {
            return { ...p, proposalStateId: 2 }; // 2 = Awarded
          } else {
            return p;
          }
        });
        
        setProposals(updatedProposals);
        
        alert('Project awarded successfully!');
      } catch (err) {
        console.error('Error awarding project:', err);
        alert('Failed to award project. Please try again.');
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Project Proposals</h2>
        <p className="text-gray-600">
          {isClientView 
            ? 'Review and award proposals from freelancers for your project.' 
            : 'View all proposals for this project.'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading proposals...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
            <div className="text-red-700">{error}</div>
          </div>
        </div>
      ) : proposals.length === 0 ? (
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center">
          <p className="text-yellow-700">No proposals have been submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.proposalId}
              proposal={proposal}
              isClientView={isClientView}
              onChatClick={handleChatClick}
              onAwardClick={handleAwardClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleProposalsList;