import React, { useContext, useEffect, useState } from 'react';
import ProjectProposalSystem from '../components/proposals/ProjectProposalSystem';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../store/UserProvider';
/**
 * Demo page that showcases the project proposal system
 * with toggle between client and freelancer views
 */
const SimpleProposalDemo = () => {
  // Toggle between client view and freelancer view for demonstration
  const [isClientView, setIsClientView] = useState(false);
  const [userData, setUserData] = useContext(UserContext);
  
  // Sample freelancer ID - in a real app this would come from authentication
  // const sampleFreelancerId = '12345';
  
  // Sample project data for demo
  // const sampleProject = {
  //   projectId: "123",
  //   projectTitle: "Animation of Trifold Pamphlet Folding",
  //   projectDescription: "I need an animation of my trifold pamphlet folding. The animation should resemble realistic paper folding and showcase my product information.",
  //   minBudget: 0,
  //   maxBudget: 0,
  //   projectDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
  //   skills: ["Animation", "After Effects", "Graphic Design", "3D Animation"],
  //   complexity: "Intermediate"
  // };

  const location = useLocation();

  const sampleProject = location.state?.projectData;
  console.log('sampleProject : ', sampleProject);
  console.log('sampleFreelancerId : ', userData?.userId[0]);

  useEffect(()=>{

    if(userData.userId[0] === sampleProject.userId)
      setIsClientView(prevState => true);

  }, [sampleProject])


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{sampleProject.projectTitle}</h1>
        
        {/* View Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-sm font-medium text-gray-700 mr-2">
              Currently viewing as:
            </span>
            <span className="font-medium text-blue-600">
              {isClientView ? 'Client' : 'Freelancer'}
            </span>
          </div>
          
          {/* <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setIsClientView(false)}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                !isClientView 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Freelancer View
            </button>
            <button
              onClick={() => setIsClientView(true)}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                isClientView 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Client View
            </button>
          </div> */}
        </div>
      </div>
      
      {/* Project Proposal System */}
      <ProjectProposalSystem
        project={sampleProject}
        freelancerId={isClientView ? -1 : userData.userId[0]}
        isClientView={isClientView}
      />
      
      {/* Documentation */}
      <div className="mt-16 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-lg font-bold text-yellow-800 mb-2">
          💡 About This Component
        </h2>
        <p className="text-yellow-700 mb-3">
          This demo uses sample data to showcase how the proposal system works. In a real application:
        </p>
        <ul className="list-disc ml-6 space-y-2 text-yellow-700">
          <li>Project data would be fetched from your database</li>
          <li>The freelancer ID would come from your authentication system</li>
          <li>Proposals would be stored and retrieved from your database</li>
          <li>Form submissions would be validated on the server</li>
          <li>The chat functionality would connect to your real messaging system</li>
          <li>Awarded projects would update their status in your database</li>
        </ul>
        
        <div className="mt-4 pt-4 border-t border-yellow-200">
          <h3 className="font-medium text-yellow-800 mb-2">Component Features:</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-yellow-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Proposal submission form with validation
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Proposal listing with freelancer details
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Different views for clients and freelancers
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Project awarding functionality
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Chat initiation with freelancers
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Responsive design for all screen sizes
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimpleProposalDemo;