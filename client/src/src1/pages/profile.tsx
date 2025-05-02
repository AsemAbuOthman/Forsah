import { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { DEFAULT_USER_ID } from "../lib/constants";
import { ModalType, Portfolio, Certification, Experience, Education, Skill, User } from "../lib/types";
import { 
  getUserProfile, 
  getUserSkills, 
  getUserPortfolios, 
  getUserCertifications, 
  getUserExperiences, 
  getUserEducations, 
  getUserReviews,
  getUserProfiles
} from "../lib/api";
import {UserContext} from '../../store/UserProvider';


// Components
import ProfileHeader from "../ProfilePage/profile/ProfileHeader";
import AboutSection from "../ProfilePage/profile/AboutSection";
import PortfolioSection from "../ProfilePage/profile/PortfolioSection";
import CertificationsSection from "../ProfilePage/profile/CertificationsSection";
import ExperienceSection from "../ProfilePage/profile/ExperienceSection";
import EducationSection from "../ProfilePage/profile/EducationSection";
import SkillsSection from "../ProfilePage/profile/SkillsSection";
import ReviewsSection from "../ProfilePage/profile/ReviewsSection";

// Components
import Navigation from "../ProfilePage/Navigation";

// Modals
import { EditProfileModal } from "../ProfilePage/modals/EditProfileModal";
import { EditAboutModal } from "../ProfilePage/modals/EditAboutModal";
import { EditPortfolioModal } from "../ProfilePage/modals/EditPortfolioModal";
import { EditCertificationModal } from "../ProfilePage/modals/EditCertificationModal";
import { EditExperienceModal } from "../ProfilePage/modals/EditExperienceModal";
import { EditEducationModal } from "../ProfilePage/modals/EditEducationModal";
import { EditSkillsModal } from "../ProfilePage/modals/EditSkillsModal";
import { ViewPortfolioModal } from "../ProfilePage//modals/ViewPortfolioModal";
import { ViewCertificationModal } from "../ProfilePage/modals/ViewCertificationModal";
import SwitchProfileModal from "../ProfilePage/modals/SwitchProfileModal";
import CreateProfileModal from "../ProfilePage/modals/CreateProfileModal";
import axios from "axios";
import { data } from "react-router-dom";

export default function Profile() {
  // Modal state
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | undefined>(undefined);
  const [selectedCertification, setSelectedCertification] = useState<Certification | undefined>(undefined);
  const [selectedExperience, setSelectedExperience] = useState<Experience | undefined>(undefined);
  const [selectedEducation, setSelectedEducation] = useState<Education | undefined>(undefined);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string | undefined>(undefined);
  const [userProfiles, setUserProfiles] = useState<User[]>([]);
  const [userData, setUserData] = useContext(UserContext);
  // let DEFAULT_USER_ID = userData.userId;
  console.log(userData);
  
  
  // Fetch user data
  
  const { data: user, isLoading: isUserLoading , refetch} = useQuery({
    queryKey: [`/api/users/${DEFAULT_USER_ID}`], 
    queryFn: () => getUserProfile(DEFAULT_USER_ID)
  });
  
  useEffect(() => {
    refetch();
  }, [userData]);
  
  // Fetch user profiles
  // const { data: profiles = [] } = useQuery({
  //   queryKey: [`/api/users/${DEFAULT_USER_ID}/profiles`],
  //   queryFn: () => getUserProfile(DEFAULT_USER_ID),
  //   enabled: !!user && !user.userId
  // });
  
  // Store user profiles in state
  // useEffect(() => {
  //   if (profiles?.length > 0) {
  //     setUserProfiles(profiles);
  //   }
  // }, [profiles]);

  // Fetch skills


  const { data: skills = [], isLoading: isSkillsLoading } = useQuery({
    queryKey: [`/api/users/${DEFAULT_USER_ID}/skills`],
    queryFn: () => getUserSkills(DEFAULT_USER_ID),
    enabled: !!user
  });


  // Fetch portfolios
  const { data: portfolios = [], isLoading: isPortfoliosLoading } = useQuery({
    queryKey: [`/api/users/${DEFAULT_USER_ID}/portfolios`],
    queryFn: () => getUserPortfolios(DEFAULT_USER_ID),
    enabled: !!user
  });

  // Fetch certifications
  const { data: certifications = [], isLoading: isCertificationsLoading } = useQuery({
    queryKey: [`/api/users/${DEFAULT_USER_ID}/certifications`],
    queryFn: () => getUserCertifications(DEFAULT_USER_ID),
    enabled: !!user
  });

  // Fetch experiences
  const { data: experiences = [], isLoading: isExperiencesLoading } = useQuery({
    queryKey: [`/api/users/${DEFAULT_USER_ID}/experiences`],
    queryFn: () => getUserExperiences(DEFAULT_USER_ID),
    enabled: !!user
  });

  // Fetch educations
  const { data: educations = [], isLoading: isEducationsLoading } = useQuery({
    queryKey: [`/api/users/${DEFAULT_USER_ID}/educations`],
    queryFn: () => getUserEducations(DEFAULT_USER_ID),
    enabled: !!user
  });


  // Fetch reviews
  const { data: reviews = [], isLoading: isReviewsLoading } = useQuery({
    queryKey: [`/api/users/${DEFAULT_USER_ID}/reviews`],
    queryFn: () => getUserReviews(DEFAULT_USER_ID),
    enabled: !!user
  });

  // Loading state
  // if (isUserLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
  //         <p className="mt-4 text-gray-600">Loading profile...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Error state
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="mt-4 text-xl font-bold text-gray-800">Profile Not Found</h1>
          <p className="mt-2 text-gray-600">We couldn't load the user profile. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Modal handlers
  const closeModal = () => setActiveModal(null);
  
  const handleOpenSwitchProfile = () => {
    setActiveModal('switchProfile');
  };
  
  const handleOpenCreateProfile = () => {
    setActiveModal('createProfile');
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      {/* {user && <Navigation user={user} />} */}
      
      {/* Header Banner */}
      <div className="gradient-blue h-48 relative">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold pt-6">Profile</h1>
          {/* <div className="flex space-x-2 pt-6">
            <button className="bg-white text-primary px-4 py-1 rounded-md font-medium text-sm">Edit Profile</button>
            <button className="bg-transparent text-white border border-white px-4 py-1 rounded-md font-medium text-sm">Dashboard</button>
          </div> */}
        </div>
      </div>


      {/* Profile Content */}
      <div className="container mx-auto px-4 -mt-16 pb-20">
        {/* Profile Header */}
        <ProfileHeader 
          user={
            user 
          } 
          onEdit={() => setActiveModal('editProfile')}
          onSwitchProfile={handleOpenSwitchProfile}
        />

        {/* Profile Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap border-b border-gray-200">
            <button 
              className="mr-4 py-2 px-1 text-blue-600 border-b-2 border-blue-600 font-medium"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              About
            </button>
            <button 
              className="mr-4 py-2 px-1 text-gray-500 hover:text-gray-700"
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Portfolio
            </button>
            <button 
              className="mr-4 py-2 px-1 text-gray-500 hover:text-gray-700"
              onClick={() => document.getElementById('certifications')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Certifications
            </button>
            <button 
              className="mr-4 py-2 px-1 text-gray-500 hover:text-gray-700"
              onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Experience
            </button>
            <button 
              className="mr-4 py-2 px-1 text-gray-500 hover:text-gray-700"
              onClick={() => document.getElementById('education')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Education
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* About Me */}
            <div id="about">
              <AboutSection 
                user={user} 
                onEdit={() => setActiveModal('editAbout')} 
              />
            </div>

            {/* Portfolio */}
            <div id="portfolio">
              <PortfolioSection 
                portfolios={portfolios} 
                onAddPortfolio={() => {
                  setSelectedPortfolio(undefined);
                  setActiveModal('editPortfolio');
                }}
                onEditPortfolio={(portfolio) => {
                  setSelectedPortfolio(portfolio);
                  setActiveModal('editPortfolio');
                }}
                onViewDetails={(portfolio) => {
                  setSelectedPortfolio(portfolio);
                  setActiveModal('viewPortfolio');
                }}
              />
            </div>

            {/* Certifications */}
            <div id="certifications">
              <CertificationsSection 
                certifications={certifications}
                onAddCertification={() => {
                  setSelectedCertification(undefined);
                  setActiveModal('editCertification');
                }}
                onEditCertification={(certification) => {
                  setSelectedCertification(certification);
                  setActiveModal('editCertification');
                }}
                onViewCertification={(certification) => {
                  setSelectedCertification(certification);
                  setActiveModal('viewCertification');
                }}
              />
            </div>

            {/* Experience */}
            <div id="experience">
              <ExperienceSection 
                experiences={experiences}
                onAddExperience={() => {
                  setSelectedExperience(undefined);
                  setActiveModal('editExperience');
                }}
                onEditExperience={(experiences) => {
                  setSelectedExperience(experiences);
                  setActiveModal('editExperience');
                }}
              />
            </div>

            {/* Education */}
            <div id="education">
              <EducationSection 
                educations={educations}
                onAddEducation={() => {
                  setSelectedEducation(undefined);
                  setActiveModal('editEducation');
                }}
                onEditEducation={(education) => {
                  setSelectedEducation(education);
                  setActiveModal('editEducation');
                }}
              />
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Skills */}
            <SkillsSection 
              skills={skills}
              onEditSkills={() => setActiveModal('editSkills')}
            />

            {/* Reviews */}
            {/* <ReviewsSection 
              reviews={reviews}
              onViewAllReviews={() => {
                // In a real app, this would navigate to a reviews page or show a modal
                console.log("View all reviews");
              }}
            /> */}
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'editProfile' && user && (
        <EditProfileModal
          user={user}
          isOpen={true}
          onClose={closeModal}
        />
      )}

      {activeModal === 'editAbout' && user && (
        <EditAboutModal
          user={user}
          isOpen={true}
          onClose={closeModal}
        />
      )}

      {activeModal === 'editPortfolio' && (
        <EditPortfolioModal
          portfolio={selectedPortfolio}
          isOpen={true}
          onClose={closeModal}
        />
      )}

      {activeModal === 'viewPortfolio' && selectedPortfolio && (
        <ViewPortfolioModal
          portfolio={selectedPortfolio}
          isOpen={true}
          onClose={closeModal}
          onEdit={() => {
            setActiveModal('editPortfolio');
          }}
        />
      )}

      {activeModal === 'editCertification' && (
        <EditCertificationModal
          certification={selectedCertification}
          isOpen={true}
          onClose={closeModal}
        />
      )}

      {activeModal === 'viewCertification' && selectedCertification && (
        <ViewCertificationModal
          certification={selectedCertification}
          isOpen={true}
          onClose={closeModal}
          onEdit={() => {
            setActiveModal('editCertification');
          }}
        />
      )}

      {activeModal === 'editExperience' && (
        <EditExperienceModal
          experience={selectedExperience}
          isOpen={true}
          onClose={closeModal}
        />
      )}

      {activeModal === 'editEducation' && (
        <EditEducationModal
          education={selectedEducation}
          isOpen={true}
          onClose={closeModal}
        />
      )}

      {activeModal === 'editSkills' && (
        <EditSkillsModal
          skills={skills}
          isOpen={true}
          onClose={closeModal}
        />
      )}

      {activeModal === 'switchProfile' && user && (
        <SwitchProfileModal
          isOpen={true}
          onClose={closeModal}
          currentUser={user}
          profiles={userProfiles}
          onOpenCreateProfile={handleOpenCreateProfile}
        />
      )}

      {activeModal === 'createProfile' && user && (
        <CreateProfileModal
          isOpen={true}
          onClose={closeModal}
          userId={user.userId}
        />
      )}
    </div>
  );
}
