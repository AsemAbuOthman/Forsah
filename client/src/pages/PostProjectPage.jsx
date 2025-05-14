import React from 'react';
import { useLocation } from 'wouter';
import PostProjectForm from '../components/projects/PostProjectForm';

/**
 * Project posting page that uses the PostProjectForm component
 */
const PostProjectPage = () => {
  const [, setLocation] = useLocation();

  // Handle successful project creation
  const handleSuccess = (projectData) => {
    // Navigate to projects list after successful submission
    setTimeout(() => {
      setLocation('/projects');
    }, 3000); // Delay navigation to allow the user to see the success message
  };

  return <PostProjectForm onSuccess={handleSuccess} />;
};

export default PostProjectPage;