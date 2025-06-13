import { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { ModalType, Portfolio, Certification, Experience, Education, Skill, User } from "../lib/types";
import { 
  getUserProfile, 
  getUserSkills, 
  getUserPortfolios, 
  getUserCertifications, 
  getUserExperiences, 
  getUserEducations, 
  getUserReviews
} from "../lib/api";
import { UserContext } from '../../store/UserProvider';
import { Loader2 } from "lucide-react";

// Components
import ProfileHeader from "../ProfilePage/profile/ProfileHeader";
import AboutSection from "../ProfilePage/profile/AboutSection";
import PortfolioSection from "../ProfilePage/profile/PortfolioSection";
import CertificationsSection from "../ProfilePage/profile/CertificationsSection";
import ExperienceSection from "../ProfilePage/profile/ExperienceSection";
import EducationSection from "../ProfilePage/profile/EducationSection";
import SkillsSection from "../ProfilePage/profile/SkillsSection";
import ReviewsSection from "../ProfilePage/profile/ReviewsSection";

// Modals
import { EditProfileModal } from "../ProfilePage/modals/EditProfileModal";
import { EditAboutModal } from "../ProfilePage/modals/EditAboutModal";
import { EditPortfolioModal } from "../ProfilePage/modals/EditPortfolioModal";
import { EditCertificationModal } from "../ProfilePage/modals/EditCertificationModal";
import { EditExperienceModal } from "../ProfilePage/modals/EditExperienceModal";
import { EditEducationModal } from "../ProfilePage/modals/EditEducationModal";
import { EditSkillsModal } from "../ProfilePage/modals/EditSkillsModal";
import { ViewPortfolioModal } from "../ProfilePage/modals/ViewPortfolioModal";
import { ViewCertificationModal } from "../ProfilePage/modals/ViewCertificationModal";
import SwitchProfileModal from "../ProfilePage/modals/SwitchProfileModal";
import CreateProfileModal from "../ProfilePage/modals/CreateProfileModal";

export default function Profile({ DEFAULT_USER_ID = -1 }) {
  // Modal state
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | undefined>(undefined);
  const [selectedCertification, setSelectedCertification] = useState<Certification | undefined>(undefined);
  const [selectedExperience, setSelectedExperience] = useState<Experience | undefined>(undefined);
  const [selectedEducation, setSelectedEducation] = useState<Education | undefined>(undefined);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string | undefined>(undefined);
  const [userProfiles, setUserProfiles] = useState<User[]>([]);
  const [userData] = useContext(UserContext);
  const [isEditable, setIsEditable] = useState(false);

  // Determine if profile is editable
  useEffect(() => {
    const profileUserId = DEFAULT_USER_ID === -1 ? userData?.userId : DEFAULT_USER_ID;
    setIsEditable(profileUserId === userData?.userId);
  }, [DEFAULT_USER_ID, userData?.userId]);

  // Fetch user data
  const profileUserId = DEFAULT_USER_ID === -1 ? userData?.userId : DEFAULT_USER_ID;
  const { data: user, isLoading: isUserLoading, refetch } = useQuery({
    queryKey: [`/api/users/${profileUserId}`], 
    queryFn: () => getUserProfile(profileUserId),
    enabled: !!profileUserId
  });

  // Fetch related data
  const { data: skills = [], isLoading: isSkillsLoading } = useQuery({
    queryKey: [`/api/users/${profileUserId}/skills`],
    queryFn: () => getUserSkills(profileUserId),
    enabled: !!profileUserId
  });

  const { data: portfolios = [], isLoading: isPortfoliosLoading, refetch: refetchPortfolios } = useQuery({
    queryKey: [`/api/users/${profileUserId}/portfolios`],
    queryFn: () => getUserPortfolios(profileUserId),
  });

  const { data: certifications = [], isLoading: isCertificationsLoading, refetch: refetchCertifications } = useQuery({
    queryKey: [`/api/users/${profileUserId}/certifications`],
    queryFn: () => getUserCertifications(profileUserId),
    enabled: !!profileUserId
  });

  const { data: experiences = [], isLoading: isExperiencesLoading, refetch: refetchExperiences } = useQuery({
    queryKey: [`/api/users/${profileUserId}/experiences`],
    queryFn: () => getUserExperiences(profileUserId),
    enabled: !!profileUserId
  });

  const { data: educations = [], isLoading: isEducationsLoading, refetch: refetchEducations  } = useQuery({
    queryKey: [`/api/users/${profileUserId}/educations`],
    queryFn: () => getUserEducations(profileUserId),
    enabled: !!profileUserId
  });

  const { data: reviews = [], isLoading: isReviewsLoading } = useQuery({
    queryKey: [`/api/users/${profileUserId}/reviews`],
    queryFn: () => getUserReviews(profileUserId),
    enabled: !!profileUserId
  });

  // Loading state
  if (isUserLoading || isSkillsLoading || isPortfoliosLoading || 
      isCertificationsLoading || isExperiencesLoading || 
      isEducationsLoading || isReviewsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-20 w-20 text-amber-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-200">
      {/* Header Banner */}
      <div className="gradient-blue h-48 relative">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold pt-6">Profile</h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 -mt-16 pb-20">
        {/* Profile Header */}
        <ProfileHeader 
          user={user} 
          onEdit={isEditable ? () => setActiveModal('editProfile') : undefined}
          onSwitchProfile={isEditable ? handleOpenSwitchProfile : undefined}
          isEditable={isEditable}
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
                onEdit={isEditable ? () => setActiveModal('editAbout') : undefined} 
                isEditable={isEditable}
              />
            </div>

            {/* Portfolio */}
            <div id="portfolio">
            <PortfolioSection
              portfolios={portfolios}
              isEditable={isEditable}
              onAddPortfolio={isEditable ? () => {
                  setSelectedPortfolio(undefined);
                  setActiveModal('editPortfolio');
                } : undefined}
              onEditPortfolio={(p) => {
                setSelectedPortfolio(p);
                setActiveModal('editPortfolio');
              }}
              onViewDetails={(p) => {
                setSelectedPortfolio(p);
                setActiveModal('viewPortfolio');
              }}
              refetchPortfolios={refetchPortfolios}
            />
            </div>

            {/* Certifications */}
            <div id="certifications">
              <CertificationsSection 
                certifications={certifications}
                isEditable={isEditable}
                onAddCertification={isEditable ? () => {
                  setSelectedCertification(undefined);
                  setActiveModal('editCertification');
                } : undefined}
                onEditCertification={isEditable ? (certification) => {
                  setSelectedCertification(certification);
                  setActiveModal('editCertification');
                } : undefined}
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
                isEditable={isEditable}
                onAddExperience={isEditable ? () => {
                  setSelectedExperience(undefined);
                  setActiveModal('editExperience');
                } : undefined}
                onEditExperience={isEditable ? (experience) => {
                  setSelectedExperience(experience);
                  setActiveModal('editExperience');
                } : undefined}
              />
            </div>

            {/* Education */}
            <div id="education">
              <EducationSection
                educations={educations}
                isEditable={isEditable}
                onAddEducation={isEditable ? () => {
                  setSelectedExperience(undefined);
                  setActiveModal('editEducation');
                } : undefined}
                onEditEducation={(e) => {
                  setSelectedEducation(e);
                  setActiveModal('editEducation');
                }}

                refetchEducations={refetchEducations}
              />
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Skills */}
            <SkillsSection 
              skills={skills}
              isEditable={isEditable}
              onEditSkills={isEditable ? () => setActiveModal('editSkills') : undefined}
            />

            {/* Reviews */}
            <ReviewsSection 
              reviews={reviews}
              isEditable={isEditable}
            />
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
          onEdit={isEditable ? () => {
            setActiveModal('editPortfolio');
          } : undefined}
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
          onEdit={isEditable ? () => {
            setActiveModal('editCertification');
          } : undefined}
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