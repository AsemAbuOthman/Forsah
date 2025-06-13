// UserContext.js
import { createContext, useState, useEffect } from 'react';

export  const UserContext = createContext();

export default function UserProvider({ children }) {
    
    const [userData, setUserData] = useState(() => {
        // Load user data from localStorage if available
        const savedUser = localStorage.getItem('userData');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (userData) {
            localStorage.setItem('userData', JSON.stringify(userData));
        } else {
            localStorage.removeItem('userData');
        }
    }, [userData]);
    
    return (
        <UserContext.Provider value={[userData, setUserData]}>
        {children}
        </UserContext.Provider>
    );
}
