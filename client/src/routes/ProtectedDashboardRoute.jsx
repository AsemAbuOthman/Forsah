
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../store/UserProvider';

export default function ProtectedDashboardRoute({ children}) {
    const [userData] = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {

        if (!userData && !localStorage.getItem('authData')) {
            
            navigate('/login');
        }
    }, [userData, navigate]);

    console.log('ProtectedDashboardRoute : ', userData);

    if (!userData) return null;

    return children;
}
