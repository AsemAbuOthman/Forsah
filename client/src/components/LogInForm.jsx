import { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useGoogleLogin } from '@react-oauth/google';
import {UserContext} from "../store/UserProvider";
import { ClipLoader } from 'react-spinners';    
import { Toaster, toast } from 'react-hot-toast';

export default function LogInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [userData, setUserData] = useContext(UserContext);
    const [formErrors, setFormErrors] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const authData = localStorage.getItem('authData');
    
            if (authData) {
                try {
                    setIsLoading(true);
                    const res = await axios.post('/api/login', JSON.parse(authData));

                    if (res.data) {
                        setUserData(res.data); 
                        toast.success("Welcome back!");
                        navigate('/dashboard');
                    }
                } catch (err) {
                    console.error('Auto login failed:', err);
                    localStorage.removeItem('authData');
                } finally {
                    setIsLoading(false);
                }
            }
        };  
    
        checkAuth();
    }, [navigate, setUserData]);
    
    const validateForm = (formData) => {
        const errors = {};
        let isValid = true;

        if (!formData.email) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Please enter a valid email address";
            isValid = false;
        }

        if (!formData.password) {
            errors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const formData = Object.fromEntries(new FormData(e.target).entries());
        
        if (!validateForm(formData)) {
            setIsLoading(false);
            return;
        }

        try {
            const res = await axios.post('/api/login', formData);
    
            if (res.data) {
                if (rememberMe) {
                    localStorage.setItem('authData', JSON.stringify(formData));
                } else {
                    localStorage.removeItem('authData');
                }

                setUserData(res.data);
                toast.success("Login successful!");
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            if (err.response) {
                if (err.response.status === 401) {
                    toast.error("Invalid email or password");
                } else {
                    toast.error("Login failed. Please try again later.");
                }
            } else {
                toast.error("Network error. Please check your connection.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (credentialResponse) => {
            setIsGoogleLoading(true);
            try {
                const response = await axios.post('/api/auth/google', {
                    token: credentialResponse.access_token
                });

                if (response.data) {
                    setUserData(response.data.user);
                    localStorage.removeItem('authData'); // Don't store Google auth in local storage
                    toast.success("Google login successful!");
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error('Google login error:', error);
                toast.error("Google login failed. Please try again.");
            } finally {
                setIsGoogleLoading(false);
            }
        },
        onError: () => {
            toast.error("Google login failed. Please try again.");
            setIsGoogleLoading(false);
        }
    });

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />

            <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 bg-gradient-to-br from-orange-50 to-yellow-50">
                {isLoading && !userData ? (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <ClipLoader color="#F97316" size={60} />
                        <p className="text-amber-600">Checking your session...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full max-w-lg gap-10 p-8 md:p-10 rounded-2xl shadow-xl bg-white text-gray-800">
                        <div className="flex flex-col items-center gap-6">
                            <img className="w-16" src="/icon_light.svg" alt="Logo" />
                            <h1 className="text-xl md:w-120 text-center font-bold bg-gradient-to-r from-red-400 to-amber-500 bg-clip-text text-transparent">
                                Sign in to your account 
                            </h1>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoading}
                            className="flex items-center justify-center gap-3 w-full py-2 px-5 rounded-full border border-gray-300 hover:border-gray-400 transition disabled:opacity-70"
                        >
                            {isGoogleLoading ? (
                                <ClipLoader color="#F97316" size={20} />
                            ) : (
                                <>
                                    <img className="w-6" alt="Google icon" src="https://www.svgrepo.com/show/475656/google-color.svg" />
                                    <span className="text-sm font-medium">Continue with Google</span>
                                </>
                            )}
                        </button>

                        <div className="flex items-center w-full text-gray-400 text-sm">
                            <hr className="flex-grow border-gray-300" />
                            <span className="px-2">OR</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full text-sm">
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="Email"
                                    className={`w-full p-3 px-5 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-full focus:outline-none focus:shadow-[0px_0px_15px_0px_rgba(150,50,25,0.4)]`}
                                />
                                {formErrors.email && <p className="text-red-500 text-xs mt-1 ml-2">{formErrors.email}</p>}
                            </div>
                            
                            <div>
                                <div className="relative w-full">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        placeholder="Password"
                                        className={`w-full p-3 px-5 pr-12 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-full focus:outline-none focus:shadow-[0px_0px_15px_0px_rgba(150,50,25,0.4)]`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-600"
                                    >
                                        <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'} text-xl`}></i>
                                    </button>
                                </div>
                                {formErrors.password && <p className="text-red-500 text-xs mt-1 ml-2">{formErrors.password}</p>}
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)} 
                                        className="form-checkbox rounded text-amber-600" 
                                    />
                                    <span>Remember me</span>
                                </label>
                                <a href="/forgot-password" className="hover:underline text-amber-600">
                                    Forgot password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 rounded-full bg-gradient-to-tl from-[#ff0000fd] via-yellow-400 to-amber-600 text-white font-semibold text-lg transition transform hover:-translate-y-1 disabled:opacity-70 disabled:transform-none"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <ClipLoader color="#fff" size={20} />
                                        Logging in...
                                    </span>
                                ) : (
                                    "Log In"
                                )}
                            </button>

                            <hr className="border-gray-200" />

                            <span className="text-sm text-center">
                                Don't have an account?{' '}
                                <a href="/signup" className="text-amber-600 hover:underline">
                                    Sign Up
                                </a>
                            </span>
                        </form>
                    </div>
                )}
            </div>
        </>
    )
}