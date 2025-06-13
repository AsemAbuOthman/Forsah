import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import {UserContext} from "../store/UserProvider";
import axios from 'axios'

export default function LogOut() {

    const navigate = useNavigate();
    const [userData, setUserData] = useContext(UserContext);

    useEffect(()=>{
        
            let result = null;

            const signOut = async ()=>{

                result = await axios.get('/api/logout');
            }

            localStorage.removeItem('authData');
            localStorage.removeItem('userData');
            setUserData(null);

            signOut();

            console.log('result : ', result?.data.message);
            
            navigate('/');
    }, [])

    return null;
}
