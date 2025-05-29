import { BrowserRouter, Route, Routes, Navigate, Link } from 'react-router-dom';
import { Toaster } from "../src1/ProfilePage/ui/toaster";
import { Toaster as Sonner } from "../src1/ProfilePage/ui/toaster";
import { TooltipProvider } from "../src1/ProfilePage/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PayPalScriptProvider } from '@paypal/react-paypal-js';


import Home from '../pages/Home';
import LogIn from '../pages/LogIn';
import Dashboard from '../pages/Dashboard';
import UserProvider from '../store/UserProvider';
import ProtectedDashboardRoute from './ProtectedDashboardRoute';
import NotFound from '../pages/NotFound'
import HomeDashboardHeader from '../components/HomeDashboardHeader'
import LogInForm from '../components/LogInForm';
import Profile from "../src1/ProfilePage";
import SignUp from '../pages/SignUp';
import AccountAnalytics from '../components/AccountAnalytics'
import Settings  from '../components/Settings/Settings';
import ProjectsPageEnhanced from '../pages/ProjectsPageEnhanced';
import DashboardPage from '../pages/DashboardPage';
import FavoriteFreelancersGrid from '../pages/FavoriteFreelancersGrid';
import FreelancersDirectoryPage from '../pages/FreelancersDirectoryPage';
import MessagingPage from '../pages/MessagingPage';
import PostProjectPage from '../pages/PostProjectPage';
import DashboardHeader from "../components/Dashborad/DashboardHeader";
import SimpleProposalDemo from '../pages/SimpleProposalDemo';
import LogOut from '../components/LogOut';
import SocketProvider from '../components/messaging/WebSocketProvider';
import PaymentPage from '../components/payment/PaymentPage';
import ProjectsTable from '../components/ProjectsTable';
import StarRating from '../components/StarRating';
import ForgotPasswordForm from '../components/ForgetPasswordForm';
import TransactionHistory from '../components/TransactionHistory';
import ProposalsTable from '../components/ProposalsTable';

const queryClient = new QueryClient();

export default function Router() {

    return (

        <UserProvider>

        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
            <Toaster />
            <Sonner />

            <BrowserRouter>

                <nav>
                    <Link to="/"></Link>
                    <Link to="/signin"></Link>
                    <Link to="/login"></Link>
                    <Link to="/forgot_password"></Link>
                    <Link to="/dashboard"></Link>
                    <Link to="/profile"></Link>
                    <Link to="/profile/:id"></Link>
                    <Link to="/account_analytics"></Link>
                    <Link to="/projects"></Link>
                    <Link to="/freelancers"></Link>
                    <Link to="/messages"></Link>
                    <Link to="/messages/:id"></Link>
                    <Link to="/dashboard_page"></Link>
                    <Link to="/favorite_page"></Link>
                    <Link to="/post_project"></Link>
                    <Link to="/projects"></Link>
                    <Link to="/proposals"></Link>
                    <Link to="/payment"></Link>
                    <Link to="/projects_table"></Link>
                    <Link to="/rating"></Link>
                    <Link to="/transaction_history"></Link>
                    <Link to="/proposals_table"></Link>
                </nav>

                <Routes>

                    <Route path='/' element={<Home />} />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/login' element={<LogInForm />} />
                    <Route path='/logout' element={<LogOut />} />
                    <Route path="/forgot_password" element={<ForgotPasswordForm />} />

                    <Route path='/proposals_table' element={                   
                        <ProtectedDashboardRoute>
                            <HomeDashboardHeader>
                                <DashboardHeader/>
                                    <ProposalsTable />
                            </HomeDashboardHeader>
                        </ProtectedDashboardRoute>} />

                    <Route path='/transaction_history' element={                   
                        <ProtectedDashboardRoute>
                            <HomeDashboardHeader>
                                <TransactionHistory />
                            </HomeDashboardHeader>
                        </ProtectedDashboardRoute>} />

                    <Route path='/projects_table' element={                   
                        <ProtectedDashboardRoute>
                            <HomeDashboardHeader>
                                <DashboardHeader/>
                                    <ProjectsTable userId={JSON.parse(localStorage.getItem('userData'))?.userId[0]} />
                            </HomeDashboardHeader>
                        </ProtectedDashboardRoute>} />

                    <Route path='/payment' element={
                        <ProtectedDashboardRoute>
                            <HomeDashboardHeader>
                                <PayPalScriptProvider
                                            options={{
                                                "client-id": "ATcqLOuVAn00dc9WhEM9rOe7AfLx812cYA9nSTzwyGZ1EVTfifGDprLlaSOXxKQMw0NWjKYi0q6sNNlz", // Replace this with your sandbox or live ID
                                                currency: "USD",
                                                intent: "capture",
                                            }}
                                            >
                                    <PaymentPage />
                                </PayPalScriptProvider>
                            </HomeDashboardHeader>
                        </ProtectedDashboardRoute>
                        } />

                    <Route path='/messages' element={
                        <ProtectedDashboardRoute>
                            <HomeDashboardHeader>
                                <DashboardHeader/>
                                <SocketProvider>
                                    <MessagingPage />
                                </SocketProvider>
                            </HomeDashboardHeader>
                        </ProtectedDashboardRoute>
                    } />

                    <Route path='/messages/:id' element={
                        <ProtectedDashboardRoute>
                            <HomeDashboardHeader>
                                <DashboardHeader/>
                                <SocketProvider>
                                    <MessagingPage />
                                </SocketProvider>
                            </HomeDashboardHeader>
                        </ProtectedDashboardRoute>
                    } />


                    <Route path='/projects' element={
                        <ProtectedDashboardRoute>
                            <HomeDashboardHeader>
                                <ProjectsPageEnhanced />
                            </HomeDashboardHeader>
                        </ProtectedDashboardRoute>
                    } />

                    <Route path='/proposals' element={
                        <ProtectedDashboardRoute>
                            <HomeDashboardHeader>
                                <SimpleProposalDemo />
                            </HomeDashboardHeader>
                        </ProtectedDashboardRoute>
                    } />

                    <Route path='/proposals:projectData' element={
                        <ProtectedDashboardRoute>
                            <HomeDashboardHeader>
                                <SimpleProposalDemo />
                            </HomeDashboardHeader>
                        </ProtectedDashboardRoute>
                    } />

                    <Route path='/freelancers' element={
                        <ProtectedDashboardRoute>
                            <HomeDashboardHeader>
                                <FreelancersDirectoryPage />
                            </HomeDashboardHeader>
                        </ProtectedDashboardRoute>
                    } />

                    <Route path='/dashboard' element={
                        <ProtectedDashboardRoute>
                            <HomeDashboardHeader>
                                <Dashboard/>
                            </HomeDashboardHeader>
                        </ProtectedDashboardRoute>
                    } />

                    <Route path='/favorite_page' element={
                        <ProtectedDashboardRoute>
                            <HomeDashboardHeader>
                                <DashboardHeader/>
                                <FavoriteFreelancersGrid />
                            </HomeDashboardHeader>  
                        </ProtectedDashboardRoute>
                    } />

                    <Route path='/dashboard_page' element={
                        <ProtectedDashboardRoute>
                            <HomeDashboardHeader>
                                <DashboardHeader/>
                                    <DashboardPage />
                            </HomeDashboardHeader>
                        </ProtectedDashboardRoute>
                    } />

                    <Route 
                        path='/profile/:id' 
                        element={
                            <HomeDashboardHeader>
                                <Profile />
                            </HomeDashboardHeader>
                        } 
                    />
                    
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

                    <Route path='/post_project' element={
                        <ProtectedDashboardRoute>
                            <HomeDashboardHeader>
                                <PostProjectPage />
                            </HomeDashboardHeader>
                        </ProtectedDashboardRoute>
                    } />

                    <Route path='*' element={<NotFound />} />
                </Routes>
            </BrowserRouter>
            </TooltipProvider>
            </QueryClientProvider>
        </UserProvider>
    )
}
