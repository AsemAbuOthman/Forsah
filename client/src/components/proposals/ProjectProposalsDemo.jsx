import React from 'react';
import ProjectProposalSection from './ProjectProposalSection';

// Sample project data for demo purposes
const sampleProject = {
  id: 123,
  title: "Excel Date Formula Adjustment",
  description: "I need help adjusting Excel date formulas for a financial spreadsheet. The current formulas are not accounting for fiscal year differences.",
  minBudget: 200,
  maxBudget: 500,
  deadline: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(), // 14 days from now
  requiredSkills: ["Excel", "VBA", "Data Analysis"],
  userId: 456, // Project owner ID
  createdAt: new Date().toISOString(),
  projectStateId: 1
};

// Sample freelancer ID for demo purposes
const currentFreelancerId = 789;

/**
 * Demo page to showcase the project proposals component
 */
const ProjectProposalsDemo = () => {
  // Toggle between client view and freelancer view for demonstration
  const [isClientView, setIsClientView] = React.useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-end">
        <div className="inline-flex items-center p-1 border rounded-md bg-white shadow-sm">
          <button
            onClick={() => setIsClientView(false)}
            className={`px-4 py-2 text-sm font-medium rounded ${
              !isClientView 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Freelancer View
          </button>
          <button
            onClick={() => setIsClientView(true)}
            className={`px-4 py-2 text-sm font-medium rounded ${
              isClientView 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Client View
          </button>
        </div>
      </div>

      <ProjectProposalSection
        project={sampleProject}
        freelancerId={isClientView ? null : currentFreelancerId}
        isClientView={isClientView}
      />
      
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-medium text-yellow-800">Demo Notes</h3>
        <p className="text-yellow-700 mt-2">
          This is a demo of the project proposals component. In a real application, you would:
        </p>
        <ul className="list-disc ml-6 mt-2 text-yellow-700 space-y-1">
          <li>Fetch the actual project data from your API</li>
          <li>Get the current user's ID from your authentication system</li>
          <li>Configure API endpoints for proposal submission and retrieval</li>
          <li>Implement real chat and award functionality</li>
        </ul>
        <p className="text-yellow-700 mt-2">
          Toggle between "Freelancer View" and "Client View" to see how the component behaves for different user types.
        </p>
      </div>
    </div>
  );
};

export default ProjectProposalsDemo;