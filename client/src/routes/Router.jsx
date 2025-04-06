import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import LogIn from '../pages/LogIn';

export default function Router() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/login' element={<LogIn/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}
