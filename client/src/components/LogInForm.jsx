import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '../src1/hooks/use-toast';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { UserContext } from "../store/UserProvider";

const LogInForm = () => {
const navigate = useNavigate();
const { toast } = useToast();
const [showPassword, setShowPassword] = useState(false);
const [rememberMe, setRememberMe] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [isGoogleLoading, setIsGoogleLoading] = useState(false);
const [formErrors, setFormErrors] = useState({ email: '', password: '' });
const [userData, setUserData] = useContext(UserContext);

useEffect(() => {
    const checkAuth = async () => {
    const authData = localStorage.getItem('authData');

    if (authData) {
        try {
        setIsLoading(true);
        const res = await axios.post('/api/login', JSON.parse(authData));
        setUserData(res.data?.user);
        if (res) {
            toast({
            title: "Welcome back!",
            description: "You have been automatically logged in",
            });
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
}, [navigate, toast]);

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
    } else if (formData.password.length < 8) {
    errors.password = "Password must be at least 6 characters";
    isValid = false;
    }

    setFormErrors(errors);
    return isValid;
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = {
    email: e.target.email.value,
    password: e.target.password.value
    };
    
    if (!validateForm(formData)) {
    setIsLoading(false);
    return;
    }

    try {
    const res = await axios.post('/api/login', formData);
    setUserData(res.data?.user);

    if(res.data?.user){
        if (rememberMe) {
        localStorage.setItem('authData', JSON.stringify(formData));
        } else {
        localStorage.removeItem('authData');
        }

        toast({
        title: "Welcome back!",
        description: "You have been successfully logged in",
        });

        navigate('/dashboard');
    }
    } catch (err) {
    console.error(err);
    toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive"
    });
    } finally {
    setIsLoading(false);
    }
};

const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
    setIsGoogleLoading(true);
    try {
        const { access_token } = tokenResponse;
        const res = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${access_token}` } }
        );

        const getMyIP = await axios.get('https://api.ipify.org?format=json');
        console.log('User IP:', getMyIP.data.ip);

        const params = new URLSearchParams({
            ip: getMyIP.data.ip,
            email: res.data.email,
            name: res.data.name,
            picture: res.data.picture,
            sub: res.data.sub,
            locale: res.data.locale,
            given_name: res.data.given_name,
            family_name: res.data.family_name
        });

        const userRes = await axios.post(`/api/login/google?${params}`);

        setUserData(userRes.data?.user);
        localStorage.setItem('authData', userRes.data?.user);

        toast({
        title: `Welcome, ${res.data.name}!`,
        description: 'Google login successful',
        });

        navigate('/dashboard');

    } catch (error) {
        console.error('Google login error:', error);
        toast({
        title: 'Error',
        description: 'Google login failed. Please try again.',
        variant: 'destructive',
        });
    } finally {
        setIsGoogleLoading(false);
    }
    },
    onError: () => {
    toast({
        title: 'Error',
        description: 'Google login failed. Please try again.',
        variant: 'destructive',
    });
    setIsGoogleLoading(false);
    },
});

return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-gray-100 to-indigo-50 px-4">
    {isLoading && !localStorage.getItem('authData') ? (
        <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin h-12 w-12 text-violet-600" />
        <p className="text-violet-700">Checking your session...</p>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center w-full max-w-lg gap-8 p-8 md:p-10 rounded-2xl shadow-xl bg-white">
        <div className="flex flex-col items-center gap-4">
            <img className="w-44" src="/icon_light.png" alt="Logo" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
            Sign in to your account
            </h1>
        </div>

        <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="flex items-center justify-center gap-3 w-full py-3 px-5 rounded-lg border border-gray-300 hover:border-gray-400 transition disabled:opacity-70"
        >
            {isGoogleLoading ? (
            <Loader2 className="animate-spin h-5 w-5 text-violet-600" />
            ) : (
            <>
                <img className="w-5" alt="Google icon" src="https://www.svgrepo.com/show/475656/google-color.svg" />
                <span className="text-sm font-medium">Continue with Google</span>
            </>
            )}
        </button>

        <div className="flex items-center w-full text-gray-400 text-sm">
            <hr className="flex-grow border-gray-300" />
            <span className="px-4">OR</span>
            <hr className="flex-grow border-gray-300" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                type="email"
                name="email"
                required
                placeholder="your.email@example.com"
                className={`w-full pl-10 pr-4 py-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none  focus:ring-violet-500 focus:border-violet-500`}
                />
            </div>
            {formErrors.email && <p className="text-red-500 text-xs mt-1 ml-2">{formErrors.email}</p>}
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder="Enter your password"
                className={`w-full pl-10 pr-10 py-3 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none  focus:ring-violet-500 focus:border-violet-500`}
                />
                <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-violet-600"
                >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" 
                />
                <span>Remember me</span>
            </label>
            <button
                type="button"
                onClick={() => navigate('/forgot_password')}
                className="text-violet-600 hover:text-violet-800 hover:underline"
            >
                Forgot password?
            </button>
            </div>

            <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-semibold text-lg transition hover:from-violet-700 hover:to-indigo-600 disabled:opacity-70"
            >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" />
                Logging in...
                </span>
            ) : (
                "Log In"
            )}
            </button>

            <div className="text-sm text-center pt-4">
            Don't have an account?{' '}
            <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-violet-600 hover:text-violet-800 font-medium hover:underline"
            >
                Sign Up
            </button>
            </div>
        </form>
        </div>
    )}
    </div>
);
};

export default LogInForm;