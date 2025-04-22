// UserContext.js
import { createContext, useState } from 'react';

export  const UserContext = createContext();

export default function UserProvider({ children }) {
    const [userData, setUserData] = useState(null);


    return (
        <UserContext.Provider value={[userData, setUserData]}>
        {children}
        </UserContext.Provider>
    );
}