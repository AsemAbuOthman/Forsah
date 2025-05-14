import { useEffect } from 'react';
import HomeLayout from '../layout/HomeLayout';
import { useNavigate } from 'react-router-dom';

export default function Home() {

    const navigate = useNavigate();

    useEffect(
        ()=>{

            const routeDashboard = () => {
                navigate('/login')
            };

            localStorage.getItem('userData') ? routeDashboard() : null;
        }, [])

    return (
        <>
        <div className='flex items-center justify-center min-h-screen  px-4'>
            <HomeLayout/>
        </div>
        </>
    )
}

