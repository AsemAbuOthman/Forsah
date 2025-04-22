import { useEffect, useState } from 'react';
import axios from 'axios'
import HomeLayout from '../layout/HomeLayout';

export default function Home() {

    const [apiData, setApiData] = useState({})

    useEffect(
        ()=>{
            const fetchData = async ()=>{

                const res = await axios('/api');
                setApiData(res.data);
            }

            fetchData();
        }, [])

    return (
        <>
        <div className='flex items-center justify-center min-h-screen  px-4'>
            <HomeLayout/>
        </div>
        </>
    )
}

