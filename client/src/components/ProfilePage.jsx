import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '../store/ThemeContext';
import { ProfileProvider } from '../store/ProfileContext';
import Profile from './NewProfile/Profile';


function ProfilePage() {
    return (
        <ThemeProvider>
            <ProfileProvider>
                <Profile />
            </ProfileProvider>
        </ThemeProvider>
    );
}

export default ProfilePage;

