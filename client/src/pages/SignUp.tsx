
import React, { useState, useEffect } from 'react';
import { Loader2, ArrowLeft, ArrowRight, X, Calendar, DollarSign, Tag, CheckCircle, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import { useToast } from '../src1/hooks/use-toast';
import ImageUploader from '../components/ImageUploader';
import axios from 'axios';

// Placeholder data for development (typically would come from API)
const roles = [
    { value: 1, label: 'Freelancer' },
    { value: 2, label: 'Client' },
];

const languages = [ 
    { value: 1, label: 'English' },
    { value: 2, label: 'Spanish' },
    { value: 3, label: 'French' },
    { value: 4, label: 'German' },
    { value: 5, label: 'Arabic' },
];

// Define interfaces for our form data and errors
interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    username: string;
    roleId: number;
    countryId: SelectOption | null;
    city: string;
    zipCode: string;
    phone: string;
    currencyId: SelectOption | null;
    dateOfBirth: string;
    profileDescription: string;
    interests: SelectOption[] | null;
    imageUrl: string | null;
    professionalTitle: string;
    hourlyRate: string;
    languageId: SelectOption | null;
};

interface SelectOption {
value: string | number;
label: string;
code?: string;
}

interface ErrorState {
email?: string;
password?: string;
confirmPassword?: string;
username?: string;
countryId?: string;
currencyId?: string;
dateOfBirth?: string;
profileDescription?: string;
interests?: string;
zipCode?: string;
professionalTitle?: string;
hourlyRate?: string;
languageId?: string;
}

const SignUp = () => {
const navigate = useNavigate();
const { toast } = useToast();
const [step, setStep] = useState(1);
const totalSteps = 8;

const [isLoading, setIsLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    username: '',
    roleId: 1,
    countryId: null,
    city: '',
    zipCode: '',
    phone: '',
    currencyId: null,
    dateOfBirth: '',
    profileDescription: '',
    interests: null,
    imageUrl: null,
    professionalTitle: '',
    hourlyRate: '',
    languageId: null
});

const [progresspercent, setProgresspercent] = useState(0);
const [errors, setErrors] = useState<ErrorState>({});
const [countries, setCountries] = useState<SelectOption[]>([]);
const [currencies, setCurrencies] = useState<SelectOption[]>([]);
const [categories, setCategories] = useState<SelectOption[]>([]);

const today = new Date();
const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
const minDateStr = minAgeDate.toISOString().split("T")[0];

useEffect(() => {
    const fetchCountries = async () => {
    try {

        const res = await axios.get('/api/countries');
        setCountries(res.data[0]);
    } catch (error) {
        console.error("Failed to fetch countries:", error);
        setCountries([]);
    }
    };

    const fetchCurrencies = async () => {
    try {
        // Mock currencies
        const res =  await axios.get('/api/currencies');

        setCurrencies(res.data[0]);
    } catch (error) {
        console.error("Failed to fetch currencies:", error);
        setCurrencies([]);
    }
    };

    const fetchCategories = async () => {
    try {
        // Mock categories
        const res = await axios.get('/api/categories');
        setCategories(res.data[0]);
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
    }
    };

    fetchCountries();
    fetchCurrencies();
    fetchCategories();
}, []);

const handleImageChange = (downloadUrl: string | null) => {
    setFormData(prev => ({
        ...prev,
        imageUrl: downloadUrl
    }));
};

const validateStep = () => {
    const newErrors: ErrorState = {};

    if (step === 1) {
        if (!formData.email) {
            newErrors.email = 'Email is required *';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format *';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required *';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters *';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
            newErrors.password = 'Password must include uppercase, lowercase, number, and special character *';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password *';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match *';
        }
    }

    if (step === 2) {
        if (!formData.username) {
            newErrors.username = 'Username is required *';
        }
    }
    
    // Step 3 (Name) is optional - no validation needed
    if (step === 3) {
        return true;
    }

    if (step === 4) {
        if (!formData.countryId) {
            newErrors.countryId = 'Country is required *';
        }
        
        if (!formData.zipCode) {
            newErrors.zipCode = 'Zip code is required *';
        }
    }
    
    if (step === 5) {
        if (!formData.currencyId) {
            newErrors.currencyId = 'Currency is required *';
        }
        
        if (!formData.languageId) {
            newErrors.languageId = 'Language is required *';
        }
    }
    
    if (step === 6) {
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required *';
        }
    }
    
    // Step 7 (Profile Photo) is optional - no validation needed
    if (step === 7) {
        return true;
    }
    
    if (step === 8) {
        if (!formData.professionalTitle) {
            newErrors.professionalTitle = 'Professional title is required *';
        }
        
        if (!formData.hourlyRate) {
            newErrors.hourlyRate = 'Hourly rate is required *';
        } else if (isNaN(Number(formData.hourlyRate)) || Number(formData.hourlyRate) <= 0) {
            newErrors.hourlyRate = 'Please enter a valid hourly rate *';
        }

        if (!formData.profileDescription) {
            newErrors.profileDescription = 'Description is required *';
        } else if (formData.profileDescription.length < 100) {
            newErrors.profileDescription = 'Description must be at least 100 characters *';
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
    ...prev,
    [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof ErrorState]) {
    setErrors({
        ...errors,
        [name]: ''
    });
    }
};

const togglePassword = () => {
    setShowPassword(!showPassword);
};

const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
};

const nextStep = () => {
    if (validateStep()) {
    setStep(step + 1);
    }
};

const prevStep = () => {
    setStep(step - 1);
};

const skipStep = () => {
    // Only allow skipping steps 3 (Name) and 7 (Image upload)
    if (step === 3 || step === 7) {
        setStep(step + 1);
    } else {
        toast({
            title: "Required Step",
            description: "This step contains required information and cannot be skipped.",
            variant: "destructive"
        });
    }
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep()) {
    toast({
        title: "Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
    });
    return;
    }
    
    setIsLoading(true);
    
    try {
    // Fix TypeScript error by creating a proper copy
    const dataToSubmit = {
        ...formData,
        interests: formData.interests || []
    };
    
    console.log('DataToSubmit : ', dataToSubmit);
    
    const res = await axios.post('/api/signup', dataToSubmit);
    
    if(res){

        setTimeout(() => {
            toast({
            title: "Success",
            description: "Account created successfully!",
            });
            
            navigate('/login');
        }, 1500);
    }else{

        toast({
            title: "Feild",
            description: "Somthing wrong plz try again!",
            });
    }
    
    } catch (error) {
    console.error("Signup error:", error);
    toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
    });
    } finally {
    setIsLoading(false);
    }
};

const renderStep = () => {
    switch (step) {
    case 1:
        return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Step 1: Account Credentials <span className="text-red-500">*</span></h2>
            
            <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 mt-1 block w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-orange-300'} px-3 py-2 focus:ring-0 focus:ring-orange-400 focus:border-orange-400 `}
                    placeholder="your.email@example.com"
                />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1 ml-2">{errors.email}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 mt-1 block w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-orange-300'} px-3 py-2 focus:ring-0 focus:ring-orange-400 focus:border-orange-400`}
                    placeholder="Create a strong password"
                />
                <button 
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1 ml-2">{errors.password}</p>}
                <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters with uppercase, lowercase, number, and special character</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 pr-10 mt-1 block w-full rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-orange-300'} px-3 py-2 focus:ring-0 focus:ring-orange-400 focus:border-orange-400`}
                    placeholder="Confirm your password"
                />
                <button 
                    type="button"
                    onClick={toggleConfirmPassword}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-2">{errors.confirmPassword}</p>}
            </div>
            </div>
        </div>
        );
        
    case 2:
        return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Step 2: Username & Role <span className="text-red-500">*</span></h2>
            
            <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                Username <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`pl-10 mt-1 block w-full rounded-lg border ${errors.username ? 'border-red-500' : 'border-orange-300'} px-3 py-2 focus:ring-0 focus:ring-orange-400 focus:border-orange-400`}
                    placeholder="Choose a unique username"
                />
                </div>
                {errors.username && <p className="text-red-500 text-xs mt-1 ml-2">{errors.username}</p>}
                <p className="text-xs text-gray-500 mt-1">Username is required and must be unique</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Role <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                {roles.map((role) => (
                    <div 
                    key={role.value} 
                    className={`cursor-pointer border rounded-lg p-4 text-center ${
                        formData.roleId === role.value 
                        ? 'bg-orange-100 border-orange-400 text-orange-700' 
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, role: role.value as number }))}
                    >
                    <span className="block font-medium">{role.label}</span>
                    <span className="text-xs text-gray-500 mt-1">
                        {role.value === 1 ? "Offer your services to clients" : "Hire freelancers for projects"}
                    </span>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </div>
        );
        
    case 3:
        return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Step 3: Personal Information <span className="text-gray-400">(optional)</span></h2>
            
            <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <div className="relative mt-1">
                    <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-orange-300 px-3 py-2 focus:ring-0 focus:ring-orange-400 focus:border-orange-400"
                    placeholder="Your first name"
                    />
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <div className="relative mt-1">
                    <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-orange-300 px-3 py-2 focus:ring-0 focus:ring-orange-400 focus:border-orange-400"
                    placeholder="Your last name"
                    />
                </div>
                </div>
            </div>
            <p className="text-sm text-gray-500 italic">This step is optional. You can skip it if you prefer.</p>
            </div>
        </div>
        );
        
    case 4:
        return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Step 4: Location <span className="text-red-500">*</span></h2>
            
            <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                Country <span className="text-red-500">*</span>
                </label>
                <Select
                options={countries}
                value={formData.countryId}    
                onChange={(value) => {
                    setFormData(prev => ({ ...prev, countryId: value }));
                    if (errors.countryId) {
                    setErrors({...errors, countryId: ''});
                    }
                }}
                placeholder="Select your countryId"
                className={errors.countryId ? 'border-red-500' : ''}
                isLoading={countries.length === 0}
                styles={{
                    control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused ? 'rgb(249, 115, 22)' : 'rgb(249, 115, 22, 0.4)',
                    borderRadius: '0.5rem',
                    }),
                }}
                />
                {errors.countryId && <p className="text-red-500 text-xs mt-1 ml-2">{errors.countryId}</p>}
                <p className="text-xs text-gray-500 mt-1">Country selection is required</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700">City <span className="text-gray-400">(optional)</span></label>
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-orange-300 px-3 py-2 focus:ring-0 focus:ring-orange-400 focus:border-orange-400"
                    placeholder="Your city"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700">
                    Zip Code <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-lg border ${errors.zipCode ? 'border-red-500' : 'border-orange-300'} px-3 py-2 focus:ring-0 focus:ring-orange-400 focus:border-orange-400`}
                    placeholder="Your postal/zip code"
                />
                {errors.zipCode && <p className="text-red-500 text-xs mt-1 ml-2">{errors.zipCode}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Phone <span className="text-gray-400">(optional)</span></label>
                <PhoneInput
                country={formData.countryId?.code?.toLowerCase() || undefined}
                value={formData.phone}
                onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
                containerClass="!w-full"
                inputClass="!w-full !h-full !py-2 !border-orange-300 !rounded-lg"
                dropdownClass="!border-orange-300"
                />
            </div>
            </div>
        </div>
        );
        
    case 5:
        return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Step 5: Preferences <span className="text-red-500">*</span></h2>
            
            <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                Currency <span className="text-red-500">*</span>
                </label>
                <Select
                options={currencies}
                value={formData.currencyId}
                onChange={(value) => {
                    setFormData(prev => ({ ...prev, currencyId: value }));
                    if (errors.currencyId) {
                    setErrors({...errors, currencyId: ''});
                    }
                }}
                placeholder="Select your preferred currency"
                className={errors.currencyId ? 'border-red-500' : ''}
                styles={{
                    control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused ? 'rgb(249, 115, 22)' : 'rgb(249, 115, 22, 0.4)',
                    borderRadius: '0.5rem',
                    }),
                }}
                />
                {errors.currencyId && <p className="text-red-500 text-xs mt-1 ml-2">{errors.currencyId}</p>}
                <p className="text-xs text-gray-500 mt-1">Currency selection is required</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                Language <span className="text-red-500">*</span>
                </label>
                <Select
                options={languages}
                value={formData.languageId }
                onChange={(value) => {
                    setFormData(prev => ({ ...prev, languageId: value }));
                    if (errors.languageId) {
                    setErrors({...errors, languageId: ''});
                    }
                }}
                placeholder="Select your preferred language"
                className={errors.languageId ? 'border-red-500' : ''}
                styles={{
                    control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused ? 'rgb(249, 115, 22)' : 'rgb(249, 115, 22, 0.4)',
                    borderRadius: '0.5rem',
                    }),
                }}
                />
                {errors.languageId && <p className="text-red-500 text-xs mt-1 ml-2">{errors.languageId}</p>}
                <p className="text-xs text-gray-500 mt-1">Language selection is required</p>
            </div>
            </div>
        </div>
        );
        
    case 6:
        return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Step 6: Date of Birth <span className="text-red-500">*</span></h2>
            
            <div className="space-y-4">
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">
                Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    max={minDateStr}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.dateOfBirth ? 'border-red-500' : 'border-orange-300'} focus:border-orange-500 focus:ring-orange-500`}
                />
                </div>
                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1 ml-2">{errors.dateOfBirth}</p>}
                <p className="text-xs text-gray-500 mt-1">You must be at least 18 years old. Date of birth is required.</p>
            </div>
            </div>
        </div>
        );

    case 7:
        return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Step 7: Profile Photo <span className="text-gray-400">(optional)</span></h2>
            
            <div className="space-y-4">
            <div>
            <ImageUploader 
                onChange={handleImageChange}
                storagePath="profile-pictures/" // Optional custom path
                />
                <p className="text-xs text-gray-500 mt-3 text-center">Upload a profile picture (optional)</p>
            </div>
            <p className="text-sm text-gray-500 italic">Profile photo is optional. You can skip this step if you prefer.</p>
            </div>
        </div>
        );
        
    case 8:
        return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Step 8: Professional Details & Summary <span className="text-red-500">*</span></h2>
            
            <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                Professional Title <span className="text-red-500">*</span>
                </label>
                <input
                type="text"
                name="professionalTitle"
                value={formData.professionalTitle}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border ${errors.professionalTitle ? 'border-red-500' : 'border-orange-300'} px-3 py-2 focus:ring-0 focus:ring-orange-400 focus:border-orange-400`}
                placeholder="e.g., Senior Web Developer"
                />
                {errors.professionalTitle && <p className="text-red-500 text-xs mt-1 ml-2">{errors.professionalTitle}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                Hourly Rate ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.hourlyRate ? 'border-red-500' : 'border-orange-300'} focus:ring-0 focus:ring-orange-400 focus:border-orange-400`}
                    placeholder="Your hourly rate"
                    min="0"
                    step="0.01"
                />
                </div>
                {errors.hourlyRate && <p className="text-red-500 text-xs mt-1 ml-2">{errors.hourlyRate}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Interests/Categories <span className="text-gray-400">(optional)</span></label>
                <Select
                options={categories}
                isMulti
                value={formData.interests}
                onChange={(value) => setFormData(prev => ({ ...prev, interests: value as SelectOption[] }))}
                styles={{
                    control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused ? 'rgb(249, 115, 22)' : 'rgb(249, 115, 22, 0.4)',
                    borderRadius: '0.5rem',
                    }),
                }}
                placeholder="Select categories you're interested in"
                />
                <p className="text-xs text-gray-500 mt-1">Select categories you're interested in</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                About Me <span className="text-red-500">*</span>
                </label>
                <textarea
                name="profileDescription"
                value={formData.profileDescription}
                onChange={handleChange}
                rows={4}
                className={`mt-1 block w-full rounded-lg border ${errors.profileDescription ? 'border-red-500' : 'border-orange-300'} px-3 py-2 focus:ring-0 focus:ring-orange-400 focus:border-orange-400`}
                placeholder="Tell us about yourself, your skills, experience, and what you're looking for..."
                />
                {errors.profileDescription && <p className="text-red-500 text-xs mt-1 ml-2">{errors.profileDescription}</p>}
                <p className="text-xs text-gray-500 mt-1">Minimum 100 characters</p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-4">Sign Up Summary</h3>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
                <div className="space-y-4 text-gray-700">
                    <div className="grid grid-cols-3 gap-4 items-center pb-3 border-b border-gray-100">
                    <span className="font-medium text-gray-500 col-span-1">Username:</span> 
                    <span className="col-span-2 font-semibold text-gray-800">{formData.username || 'Not provided'}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 items-center pb-3 border-b border-gray-100">
                    <span className="font-medium text-gray-500 col-span-1">Email:</span> 
                    <span className="col-span-2 text-gray-800">{formData.email}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 items-center pb-3 border-b border-gray-100">
                    <span className="font-medium text-gray-500 col-span-1">Role:</span> 
                    <span className="col-span-2 text-gray-800">{formData.roleId === 1 ? 'Freelancer' : 'Client'}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 items-center pb-3 border-b border-gray-100">
                    <span className="font-medium text-gray-500 col-span-1">Country:</span> 
                    <span className="col-span-2 text-gray-800">{formData.countryId ? formData.countryId.label : 'Not provided'}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 items-center pb-3 border-b border-gray-100">
                    <span className="font-medium text-gray-500 col-span-1">Professional:</span> 
                    <span className="col-span-2 text-gray-800">{formData.professionalTitle || 'Not provided'}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 items-center pb-3 border-b border-gray-100">
                    <span className="font-medium text-gray-500 col-span-1">Rate:</span> 
                    <span className="col-span-2 text-gray-800">${formData.hourlyRate}/hour</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 items-start">
                    <span className="font-medium text-gray-500 col-span-1">Interests:</span> 
                    <div className="col-span-2">
                        {formData.interests && formData.interests.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {formData.interests.map(interest => (
                            <span key={interest.value} className="inline-block px-2 py-1 bg-orange-50 text-orange-700 rounded text-sm">
                                {interest.label}
                            </span>
                            ))}
                        </div>
                        ) : (
                        <span className="text-gray-400 italic">No interests selected</span>
                        )}
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        );
        
    default:
        return null;
    }
};

return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto shadow-xl">
        <div className="bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
            <img className="mx-auto w-16" src="/icon_light.svg" alt="Logo" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Forsah Community</h2>
            <p className="text-gray-600">Create your account and start your journey</p>
        </div>
        
        {/* Progress bar */}
        <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
            <div 
                className="bg-orange-400  h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
            </div>
            
            <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-500">Account Setup</span>
            <span className="text-sm text-gray-500">Step {step} of {totalSteps}</span>
            </div>
        </div>

        <form onSubmit={step === totalSteps ? handleSubmit : (e) => e.preventDefault()}>
            {renderStep()}
            
            <div className="mt-8 flex justify-between">
            {step > 1 ? (
                <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition-shadow"
                >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
                </button>
            ) : (
                <div>{/* Empty div to maintain spacing */}</div>
            )}
            
            <div className="flex gap-2">
                {(step === 3 || step === 7) && (
                <button
                    type="button"
                    onClick={skipStep}
                    className="px-6 py-3 border border-orange-300 rounded-lg bg-white text-orange-500 hover:bg-orange-50 shadow-sm transition-shadow"
                >
                    Skip this step
                </button>
                )}
                
                {step < totalSteps ? (
                <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg text-white hover:from-orange-600 hover:to-yellow-600 shadow-sm transition-all"
                >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                ) : (
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:from-orange-600 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                    <span className="flex items-center">
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                        Creating Account...
                    </span>
                    ) : (
                    <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Create Account
                    </>
                    )}
                </button>
                )}
            </div>
            </div>
        </form>

        <div className="mt-6 text-center">
            <p className="text-gray-600">
            Already have an account?{' '}
            <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-orange-600 hover:text-orange-800 font-medium"
            >
                Log in
            </button>
            </p>
        </div>
        </div>
    </div>
    </div>
);
};

export default SignUp;
