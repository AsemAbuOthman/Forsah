import { BrowserRouter, Route, Routes, Navigate, Link } from 'react-router-dom';
import Home from '../pages/Home';
import LogIn from '../pages/LogIn';
import Dashboard from '../pages/Dashboard';
import UserProvider from '../store/UserProvider';
import ProtectedDashboardRoute from './ProtectedDashboardRoute';
import NotFound from '../pages/NotFound'
import HomeDashboardHeader from '../components/HomeDashboardHeader'
import LogOut from '../components/LogOut'
import LogInForm from '../components/LogInForm';
import Profile from '../components/Profile1';
// import Profile from '../components/ProfilePage';
import SignUp from '../pages/SignUp';
import AccountAnalytics from '../components/AccountAnalytics'
import  Settings  from '../components/Settings/Settings';


export default function Router() {
    return (
        <UserProvider>
            <BrowserRouter>

                <nav>
                    <Link to="/"></Link>
                    <Link to="/signin"></Link>
                    <Link to="/login"></Link>
                    <Link to="/logout"></Link>
                    <Link to="/dashboard"></Link>
                    <Link to="/profile"></Link>
                    <Link to="/account_analytics"></Link>
                </nav>

                <Routes>

                    <Route path='/' element={<Home />} />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/login' element={<LogInForm />} />
                    <Route path='/logout' element={<LogOut />} />

                    <Route path='/dashboard' element={
                        <ProtectedDashboardRoute>
                            <HomeDashboardHeader>
                                <Dashboard />
                            </HomeDashboardHeader>
                        </ProtectedDashboardRoute>
                    } />

                    <Route path='/profile' element={
                        <ProtectedDashboardRoute>
                            <HomeDashboardHeader>
                                <Profile />
                            </HomeDashboardHeader>
                        </ProtectedDashboardRoute>
                    } />

                    <Route path='/account_analytics' element={
                        <ProtectedDashboardRoute>
                            <HomeDashboardHeader>
                                <AccountAnalytics />
                            </HomeDashboardHeader>
                        </ProtectedDashboardRoute>
                    } />

                    <Route path='/settings' element={
                        <ProtectedDashboardRoute>
                            <HomeDashboardHeader>
                                <Settings />
                            </HomeDashboardHeader>
                        </ProtectedDashboardRoute>
                    } />


                    <Route path='*' element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </UserProvider>
    )
}
