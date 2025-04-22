import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import {UserContext} from "../store/UserProvider";

export default function LogOut() {

    const navigate = useNavigate();
    const [userData, setUserData] = useContext(UserContext);

    useEffect(
        ()=>{
            localStorage.removeItem('authData');
            setUserData(null);

            navigate('/');
    }, [])

    return null;
}
