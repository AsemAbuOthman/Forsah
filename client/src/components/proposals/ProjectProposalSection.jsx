import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MessageCircle, 
  Award, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import ProjectProposalForm from './ProjectProposalForm';
import ProposalsList from './ProposalsList';

// Create mock CSS if react-tabs is not installed
const reactTabsStyles = `
.react-tabs {
  width: 100%;
}
.react-tabs__tab-list {
  display: flex;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
}
.react-tabs__tab {
  list-style: none;
  padding: 0.75rem 1rem;
  cursor: pointer;
  margin-right: 0.5rem;
  border-bottom: 2px solid transparent;
}
.react-tabs__tab--selected {
  border-bottom: 2px solid #2563eb;
  color: #2563eb;
  font-weight: 500;
}
.react-tabs__tab-panel {
  display: none;
}
.react-tabs__tab-panel--selected {
  display: block;
}
`;

/**
 * Comprehensive project proposal section component that includes both
 * proposal submission form and proposals list with chat and award functionality
 * 
 * @param {Object} props - Component props
 * @param {Object} props.project - Project details
 * @param {number} props.freelancerId - ID of the current freelancer
 * @param {boolean} props.isClientView - Whether the component is being viewed by the client (project owner)
 * @param {string} props.apiUrl - Base API URL for proposals endpoints
 * @returns {JSX.Element} - Rendered component
 */
const ProjectProposalSection = ({ 
  project, 
  freelancerId, 
  isClientView = false,
  apiUrl = '/api/proposals' 
}) => {
  // State for proposals data
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(1); // Start with proposals tab (index 1) active for demo
  const [hasSubmittedProposal, setHasSubmittedProposal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Demo data for the proposals list
  const demoProposals = [
    {
      id: 1001,
      projectId: project?.id,
      freelancerId: 789,
      bidAmount: 350,
      estimatedDeliveryTime: "2023-06-15",
      coverLetter: "Hello! I'm very experienced with Excel formulas and VBA. I've worked on many financial spreadsheets that deal with fiscal year calculations. I can fix your issue with the date formulas and ensure they account for the fiscal year differences correctly.\n\nI've attached some examples of similar work I've done in the past. I would approach this by first analyzing your current formulas, understanding the fiscal year requirements, and then implementing a solution that's both accurate and easy to maintain.\n\nLooking forward to working with you!",
      createdAt: new Date().toISOString(),
      proposalStateId: 1,
      freelancer: {
        id: 789,
        name: "John Smith",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        location: "New York, USA",
        country: "United States",
        city: "New York",
        joinedDate: new Date("2021-06-15").toISOString(),
        rating: 4.8,
        totalReviews: 57,
        totalEarned: 12500,
        projectsCompleted: 23,
        bio: "I'm a financial data analyst with over 5 years of experience in Excel, VBA, and data visualization. I specialize in building automated financial reports and dashboards for businesses.",
        skills: ["Excel", "VBA", "Python", "Financial Analysis", "Data Visualization", "SQL", "Power BI"]
      }
    },
    {
      id: 1002,
      projectId: project?.id,
      freelancerId: 790,
      bidAmount: 275,
      estimatedDeliveryTime: "2023-06-10",
      coverLetter: "I have extensive experience working with Excel formulas and fiscal year calculations. I can help you adjust your formulas to properly account for fiscal year differences.\n\nMy approach would be to first understand your specific fiscal year requirements, then analyze the current formulas that are causing issues. I would then implement a solution that ensures accurate date calculations regardless of fiscal year boundaries.\n\nI've successfully completed similar projects in the past for accounting firms and financial departments. I'm confident I can deliver a clean and efficient solution for your needs.",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      proposalStateId: 1,
      freelancer: {
        id: 790,
        name: "Emily Johnson",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        location: "Chicago, USA",
        country: "United States",
        city: "Chicago",
        joinedDate: new Date("2020-03-10").toISOString(),
        rating: 4.9,
        totalReviews: 84,
        totalEarned: 18750,
        projectsCompleted: 36,
        bio: "Excel and financial data expert with a background in accounting. I help businesses streamline their financial reporting processes and fix complex spreadsheet issues.",
        skills: ["Excel", "Financial Reporting", "VBA", "Accounting", "Data Analysis", "QuickBooks", "Financial Modeling"]
      }
    },
    {
      id: 1003,
      projectId: project?.id,
      freelancerId: 791,
      bidAmount: 425,
      estimatedDeliveryTime: "2023-06-20",
      coverLetter: "Hello there! I specialize in complex Excel formula development and optimization, particularly for financial applications. Your project caught my attention because I've worked on several similar fiscal year calculation issues.\n\nI have a strong background in financial spreadsheet development and can help ensure your date formulas properly account for fiscal year boundaries. I would approach this by implementing robust formulas that handle edge cases and maintain accuracy regardless of the date range.\n\nI can also provide documentation and explanations for the solution so you understand how it works and can maintain it in the future.",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      proposalStateId: 1,
      freelancer: {
        id: 791,
        name: "Michael Chen",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        location: "San Francisco, USA",
        country: "United States",
        city: "San Francisco",
        joinedDate: new Date("2019-11-05").toISOString(),
        rating: 4.7,
        totalReviews: 42,
        totalEarned: 22300,
        projectsCompleted: 28,
        bio: "Former financial analyst turned freelance Excel consultant. I help businesses solve complex spreadsheet problems and develop automated reporting solutions.",
        skills: ["Excel", "VBA", "Financial Analysis", "Data Modeling", "Power Query", "Power BI", "Macros"]
      }
    },
    {
      id: 1004,
      projectId: project?.id,
      freelancerId: 792,
      bidAmount: 325,
      estimatedDeliveryTime: "2023-06-12",
      coverLetter: "I noticed your project requires expertise in Excel date formulas and fiscal year calculations. This is exactly my area of expertise, as I've worked extensively with financial institutions that operate on varied fiscal calendars.\n\nMy background in accounting software development gives me a unique perspective on handling date calculations in Excel. I can analyze your current formulas, identify the issues, and implement solutions that account for all fiscal year peculiarities.\n\nI'm confident I can deliver an accurate, efficient solution within your timeline and budget.",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      proposalStateId: 1,
      freelancer: {
        id: 792,
        name: "Priya Sharma",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        location: "Bangalore, India",
        country: "India",
        city: "Bangalore",
        joinedDate: new Date("2022-01-15").toISOString(),
        rating: 4.6,
        totalReviews: 29,
        totalEarned: 9800,
        projectsCompleted: 17,
        bio: "Financial software developer with a passion for building efficient, user-friendly Excel solutions. I specialize in automating financial processes and solving complex calculation issues.",
        skills: ["Excel", "VBA", "Financial Software", "Data Analysis", "Automation", "Power BI", "Financial Reporting"]
      }
    },
    {
      id: 1005,
      projectId: project?.id,
      freelancerId: 793,
      bidAmount: 380,
      estimatedDeliveryTime: "2023-06-18",
      coverLetter: "As a former accountant who now specializes in Excel development, I understand both the financial concepts and technical aspects of your project. I've helped several clients solve similar fiscal year calculation issues in Excel.\n\nI would start by examining your current formulas and understanding the specific fiscal year requirements that need to be addressed. Then, I would develop and implement a robust solution that not only fixes the current issues but is also flexible enough to accommodate any future changes in your fiscal year structure.\n\nI pride myself on delivering solutions that are not just technically sound but also easy for non-technical users to understand and maintain.",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
      proposalStateId: 1,
      freelancer: {
        id: 793,
        name: "David Wilson",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
        location: "London, UK",
        country: "United Kingdom",
        city: "London",
        joinedDate: new Date("2019-05-22").toISOString(),
        rating: 4.9,
        totalReviews: 68,
        totalEarned: 25400,
        projectsCompleted: 42,
        bio: "Certified accountant turned Excel specialist. I combine financial expertise with technical skills to create powerful spreadsheet solutions for complex business needs.",
        skills: ["Excel", "Accounting", "Financial Modeling", "VBA", "Data Analysis", "XERO", "QuickBooks"]
      }
    }
  ];

  // Fetch proposals for the project
  useEffect(() => {
    const fetchProposals = async () => {
      if (!project?.id) return;
      
      setLoading(true);
      try {
        // In a real application, you would fetch from the API
        // const response = await axios.get(`${apiUrl}?projectId=${project.id}`);
        // setProposals(response.data || []);
        
        // For demo purposes, use the demo data
        setTimeout(() => {
          // Update project ID in demo data to match current project
          const updatedProposals = demoProposals.map(proposal => ({
            ...proposal,
            projectId: project.id
          }));
          
          console.log("Setting proposals with demo data:", updatedProposals);
          setProposals(updatedProposals);
          
          // Check if current freelancer has already submitted a proposal
          if (freelancerId) {
            const hasSubmitted = updatedProposals.some(
              (proposal) => proposal.freelancerId === freelancerId
            );
            setHasSubmittedProposal(hasSubmitted);
          }
          
          setLoading(false);
        }, 800); // Simulate loading delay
        
      } catch (err) {
        console.error('Error fetching proposals:', err);
        setError('Failed to load proposals. Please try again later.');
        setLoading(false);
      }
    };

    fetchProposals();
  }, [project?.id, freelancerId, refreshKey]);

  // Handle successful proposal submission
  const handleProposalSuccess = (proposalData) => {
    // In a real application, the response from the API would include the new proposal
    // For demo, we'll just add it to our proposals array
    const newProposal = {
      ...proposalData,
      id: 1004, // In a real app, this would be generated by the server
      createdAt: new Date().toISOString(),
      proposalStateId: 1,
      freelancer: {
        id: freelancerId,
        name: "Your Name",
        avatar: null,
        location: "Your Location",
        rating: 5.0,
        totalReviews: 0,
        skills: ["Excel", "VBA", "Data Analysis"]
      }
    };
    
    setProposals(prev => [...prev, newProposal]);
    
    // Switch to the proposals tab
    setActiveTab(1);
    
    // Mark that this freelancer has submitted a proposal
    setHasSubmittedProposal(true);
  };

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
        //   projectId: project.id,
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
    <div className="max-w-4xl mx-auto">
      {/* Add the CSS for react-tabs if needed */}
      <style>{reactTabsStyles}</style>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">{project?.title}</h1>
          <p className="text-gray-600 mt-1">{project?.description}</p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {project?.requiredSkills?.map((skill) => (
              <span 
                key={skill} 
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Budget</p>
              <p className="text-lg font-semibold text-green-700">
                ${project?.minBudget} - ${project?.maxBudget}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Deadline</p>
              <p className="text-lg font-semibold text-orange-700">
                {project?.deadline && new Date(project.deadline).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Proposals</p>
              <p className="text-lg font-semibold text-blue-700">
                {proposals.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
            <TabList className="react-tabs__tab-list">
              {!isClientView && (
                <Tab 
                  className={`react-tabs__tab ${activeTab === 0 ? 'react-tabs__tab--selected' : ''}`}
                  disabled={hasSubmittedProposal}
                >
                  Submit Proposal
                </Tab>
              )}
              <Tab className={`react-tabs__tab ${activeTab === (isClientView ? 0 : 1) ? 'react-tabs__tab--selected' : ''}`}>
                Proposals ({proposals.length})
              </Tab>
            </TabList>
            
            {!isClientView && (
              <TabPanel className={`react-tabs__tab-panel ${activeTab === 0 ? 'react-tabs__tab-panel--selected' : ''}`}>
                {hasSubmittedProposal ? (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800">You've already submitted a proposal</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          You have already submitted a proposal for this project. You can view your proposal in the Proposals tab.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ProjectProposalForm 
                    project={project}
                    freelancerId={freelancerId}
                    onSuccess={handleProposalSuccess}
                    apiUrl={apiUrl}
                  />
                )}
              </TabPanel>
            )}
            
            <TabPanel className={`react-tabs__tab-panel ${activeTab === (isClientView ? 0 : 1) ? 'react-tabs__tab-panel--selected' : ''}`}>
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
              ) : (
                <ProposalsList
                  proposals={proposals}
                  project={project}
                  isClientView={isClientView}
                  onChatClick={handleChatClick}
                  onAwardClick={handleAwardClick}
                />
              )}
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// A simplified version of the Tabs component if react-tabs is not available
const SimpleTabs = ({ children, selectedIndex = 0, onSelect }) => {
  const [activeIndex, setActiveIndex] = React.useState(selectedIndex);
  
  React.useEffect(() => {
    setActiveIndex(selectedIndex);
  }, [selectedIndex]);
  
  const handleSelect = (index) => {
    setActiveIndex(index);
    if (onSelect) {
      onSelect(index);
    }
  };
  
  // Process children to add selected prop to the right tab and panel
  const processedChildren = React.Children.map(children, (child) => {
    if (!child || !child.type) return null;
    
    if (child.type.displayName === 'TabList') {
      // For TabList, process its Tab children
      const tabList = React.cloneElement(child, {
        children: React.Children.map(child.props.children, (tab, index) => {
          if (!tab || !tab.type || tab.type.displayName !== 'Tab') return tab;
          
          // Pass selected prop and onClick handler to each Tab
          return React.cloneElement(tab, {
            selected: index === activeIndex,
            onClick: () => handleSelect(index)
          });
        })
      });
      
      return tabList;
    } 
    else if (child.type.displayName === 'TabPanel') {
      // For TabPanels, get their index in the original array
      const index = React.Children.toArray(children)
        .filter(c => c && c.type && c.type.displayName === 'TabPanel')
        .indexOf(child);
      
      // Pass selected prop to the panel
      return React.cloneElement(child, {
        selected: index === activeIndex
      });
    }
    
    return child;
  });
  
  return (
    <div className="react-tabs">
      {processedChildren}
    </div>
  );
};

const SimpleTab = ({ children, selected, ...props }) => {
  return (
    <li 
      className={`react-tabs__tab ${selected ? 'react-tabs__tab--selected' : ''}`}
      {...props}
    >
      {children}
    </li>
  );
};

const SimpleTabList = ({ children }) => {
  return (
    <ul className="react-tabs__tab-list">
      {children}
    </ul>
  );
};

const SimpleTabPanel = ({ children, selected }) => {
  // If selected is undefined, default to false
  const isSelected = selected === true;
  
  return (
    <div className={`react-tabs__tab-panel ${isSelected ? 'react-tabs__tab-panel--selected' : ''}`}>
      {children}
    </div>
  );
};

// Set display names for simplified components
SimpleTabs.displayName = 'Tabs';
SimpleTab.displayName = 'Tab';
SimpleTabList.displayName = 'TabList';
SimpleTabPanel.displayName = 'TabPanel';

// Use simplified components as react-tabs is not available
const Tabs = SimpleTabs;
const Tab = SimpleTab;
const TabList = SimpleTabList;
const TabPanel = SimpleTabPanel;

export default ProjectProposalSection;