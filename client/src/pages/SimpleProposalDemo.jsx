import React, { useContext, useEffect, useState } from 'react';
import ProjectProposalSystem from '../components/proposals/ProjectProposalSystem';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../store/UserProvider';

const SimpleProposalDemo = () => {
  // Toggle between client view and freelancer view for demonstration
  const [isClientView, setIsClientView] = useState(false);
  const [userData, setUserData] = useContext(UserContext);
  

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
    <div className="container mx-auto px-4 py-8 bg-gray-200">
      <div className="mb-6 ">
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

    </div>
  );
};

export default SimpleProposalDemo;