import { useRef } from 'react';
import { format } from 'date-fns';
import { useProfile } from '../../store/ProfileContext';
import { useTheme } from '../../store/ThemeContext';
import { MapPin, Calendar, Star, DollarSign, Camera } from 'lucide-react';

export default function ProfileHeader() {
  const { activeProfile, updateProfile } = useProfile();
  const { darkMode } = useTheme();
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({
          ...activeProfile,
          image: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative p-8 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
        <div className="relative group">
          <img
            src={activeProfile.image}
            alt="Profile"
            className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-blue-600 dark:bg-blue-500 p-2 rounded-full text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
            aria-label="Change profile picture"
          >
            <Camera size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200"></div>
        </div>
        
        <div className="mt-4 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{activeProfile.name}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">{activeProfile.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <MapPin size={18} className="mr-1" />
              <span>{activeProfile.location}</span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Calendar size={18} className="mr-1" />
              <span>Joined {format(new Date(activeProfile.joinDate), 'MMM yyyy')}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-6">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-gray-900 dark:text-white font-semibold">{activeProfile.rating}</span>
              <span className="ml-1 text-gray-500 dark:text-gray-400">({activeProfile.totalReviews} reviews)</span>
            </div>
            {activeProfile.type === 'freelancer' && (
              <div className="flex items-center text-gray-900 dark:text-white">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span className="font-semibold">${activeProfile.totalEarned.toLocaleString()}</span>
                <span className="ml-1 text-gray-500 dark:text-gray-400">earned</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}