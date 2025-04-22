
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../store/UserProvider';

export default function ProtectedDashboardRoute({ children}) {
    const [userData] = useState(localStorage.getItem('authData'));
    const navigate = useNavigate();

    useEffect(() => {

        console.log('This is User Data : ', userData);

        if (!userData) {
            navigate('/login');
        }
    }, [userData, navigate]);

    if (!userData) return null;

    return children;
}
