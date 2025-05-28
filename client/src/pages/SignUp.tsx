import React, { useState, useEffect } from 'react';
import { Loader2, ArrowLeft, ArrowRight, X, Calendar, DollarSign, Tag, CheckCircle, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import { useToast } from '../src1/hooks/use-toast';
import ImageUploader from '../components/ImageUploader';
import axios from 'axios';

// Custom styled components for better organization
const FormCard = ({ children }: { children: React.ReactNode }) => (
<div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
    {children}
</div>
);

const FormSection = ({ children }: { children: React.ReactNode }) => (
<div className="space-y-6">{children}</div>
);

const FormTitle = ({ children, step }: { children: React.ReactNode, step: number }) => (
<div className="flex items-center gap-3 mb-6">
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-medium">
    {step}
    </div>
    <h2 className="text-2xl font-bold text-gray-800">{children}</h2>
</div>
);

const FormField = ({ label, children, error, optional = false }: { 
label: string, 
children: React.ReactNode, 
error?: string, 
optional?: boolean 
}) => (
<div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
    {label} {!optional && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
</div>
);

// Placeholder data for development
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

// Define interfaces
interface SelectOption {
value: string | number;
label: string;
code?: string;
}

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

const [errors, setErrors] = useState<ErrorState>({});
const [countries, setCountries] = useState<SelectOption[]>([]);
const [currencies, setCurrencies] = useState<SelectOption[]>([]);
const [categories, setCategories] = useState<SelectOption[]>([]);

const today = new Date();
const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
const minDateStr = minAgeDate.toISOString().split("T")[0];


const togglePassword = () => {
    setShowPassword(!showPassword);
};

const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
};

useEffect(() => {
    const fetchData = async () => {
    try {
        const [countriesRes, currenciesRes, categoriesRes] = await Promise.all([
        axios.get('/api/countries'),
        axios.get('/api/currencies'),
        axios.get('/api/categories')
        ]);
        
        setCountries(countriesRes.data[0]);
        setCurrencies(currenciesRes.data[0]);
        setCategories(categoriesRes.data[0]);
    } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
        title: "Error",
        description: "Failed to load required data. Please refresh the page.",
        variant: "destructive"
        });
    }
    };

    fetchData();
}, [toast]);

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
        newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
        newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
        newErrors.password = 'Include uppercase, lowercase, number and special character';
    }

    if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
    }
    }

    if (step === 2) {
    if (!formData.username) {
        newErrors.username = 'Username is required';
    }
    }
    
    if (step === 4) {
    if (!formData.countryId) {
        newErrors.countryId = 'Country is required';
    }
    
    if (!formData.zipCode) {
        newErrors.zipCode = 'Zip code is required';
    }
    }
    
    if (step === 5) {
    if (!formData.currencyId) {
        newErrors.currencyId = 'Currency is required';
    }
    
    if (!formData.languageId) {
        newErrors.languageId = 'Language is required';
    }
    }
    
    if (step === 6) {
    if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required';
    }
    }
    
    if (step === 8) {
    if (!formData.professionalTitle) {
        newErrors.professionalTitle = 'Professional title is required';
    }
    
    if (!formData.hourlyRate) {
        newErrors.hourlyRate = 'Hourly rate is required';
    } else if (isNaN(Number(formData.hourlyRate))) {
        newErrors.hourlyRate = 'Must be a valid number';
    } else if (Number(formData.hourlyRate) <= 0) {
        newErrors.hourlyRate = 'Must be greater than 0';
    }

    if (!formData.profileDescription) {
        newErrors.profileDescription = 'Description is required';
    } else if (formData.profileDescription.length < 100) {
        newErrors.profileDescription = 'Must be at least 100 characters';
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

const nextStep = () => {
    if (validateStep()) {
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const skipStep = () => {
    if (step === 3 || step === 7) {
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const dataToSubmit = {
        ...formData,
        interests: formData.interests || []
    };
    
    const res = await axios.post('/api/signup', dataToSubmit);
    
    if(res) {
        toast({
        title: "Success",
        description: "Account created successfully!",
        });
        
        setTimeout(() => navigate('/login'), 1500);
    } else {
        toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
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
        <FormSection>
            <FormTitle step={1}>Account Credentials</FormTitle>
            
            <div className="space-y-5">
            <FormField label="Email" error={errors.email}>
                <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-3 py-2.5 focus:ring-2 focus:ring-orange-200 focus:border-orange-400`}
                    placeholder="your.email@example.com"
                />
                </div>
            </FormField>

            <FormField label="Password" error={errors.password}>
                <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} px-3 py-2.5 focus:ring-2 focus:ring-orange-200 focus:border-orange-400`}
                    placeholder="Create a strong password"
                />
                <button 
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                Must be 8+ characters with uppercase, lowercase, number and special character
                </p>
            </FormField>

            <FormField label="Confirm Password" error={errors.confirmPassword}>
                <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 pr-10 w-full rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} px-3 py-2.5 focus:ring-2 focus:ring-orange-200 focus:border-orange-400`}
                    placeholder="Confirm your password"
                />
                <button 
                    type="button"
                    onClick={toggleConfirmPassword}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                </div>
            </FormField>
            </div>
        </FormSection>
        );
        
    case 2:
        return (
        <FormSection>
            <FormTitle step={2}>Username & Role</FormTitle>
            
            <div className="space-y-5">
            <FormField label="Username" error={errors.username}>
                <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`pl-10 w-full rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'} px-3 py-2.5 focus:ring-2 focus:ring-orange-200 focus:border-orange-400`}
                    placeholder="Choose a unique username"
                />
                </div>
            </FormField>

            <FormField label="Role">
                <div className="grid grid-cols-2 gap-4">
                {roles.map((role) => (
                    <div 
                    key={role.value} 
                    className={`cursor-pointer border rounded-xl p-4 transition-all ${
                        formData.roleId === role.value 
                        ? 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-300 shadow-sm' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, roleId: role.value as number }))}
                    >
                    <div className={`font-medium ${
                        formData.roleId === role.value ? 'text-orange-600' : 'text-gray-700'
                    }`}>
                        {role.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {role.value === 1 ? "Offer your services to clients" : "Hire freelancers for projects"}
                    </div>
                    </div>
                ))}
                </div>
            </FormField>
            </div>
        </FormSection>
        );
        
    case 3:
        return (
        <FormSection>
            <FormTitle step={3}>Personal Information <span className="text-sm font-normal text-gray-500">(optional)</span></FormTitle>
            
            <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <FormField label="First Name" optional>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                    placeholder="Your first name"
                />
                </FormField>

                <FormField label="Last Name" optional>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                    placeholder="Your last name"
                />
                </FormField>
            </div>
            <p className="text-sm text-gray-500 italic">You can skip this step if you prefer</p>
            </div>
        </FormSection>
        );
        
    case 4:
        return (
        <FormSection>
            <FormTitle step={4}>Location</FormTitle>
            
            <div className="space-y-5">
            <FormField label="Country" error={errors.countryId}>
                <Select
                options={countries}
                value={formData.countryId}    
                onChange={(value) => {
                    setFormData(prev => ({ ...prev, countryId: value }));
                    if (errors.countryId) {
                    setErrors({...errors, countryId: ''});
                    }
                }}
                placeholder="Select your country"
                className="basic-single"
                classNamePrefix="select"
                isLoading={countries.length === 0}
                styles={{
                    control: (base) => ({
                    ...base,
                    borderColor: errors.countryId ? '#ef4444' : '#d1d5db',
                    minHeight: '44px',
                    '&:hover': {
                        borderColor: '#d1d5db'
                    },
                    '&:focus-within': {
                        borderColor: '#f97316',
                        boxShadow: '0 0 0 2px rgba(249, 115, 22, 0.2)'
                    }
                    }),
                    option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected 
                        ? '#f97316' 
                        : isFocused 
                        ? '#ffedd5' 
                        : undefined,
                    color: isSelected ? 'white' : undefined,
                    })
                }}
                />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
                <FormField label="City" optional>
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                    placeholder="Your city"
                />
                </FormField>

                <FormField label="Zip Code" error={errors.zipCode}>
                <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${errors.zipCode ? 'border-red-500' : 'border-gray-300'} px-3 py-2.5 focus:ring-2 focus:ring-orange-200 focus:border-orange-400`}
                    placeholder="Your postal/zip code"
                />
                </FormField>
            </div>

            <FormField label="Phone" optional>
                <PhoneInput
                country={formData.countryId?.code?.toLowerCase() || undefined}
                value={formData.phone}
                onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
                containerClass="!w-full"
                inputClass="!w-full !h-[44px] !py-2 !border-gray-300 !rounded-lg focus:!border-orange-400 focus:!ring-2 focus:!ring-orange-200"
                dropdownClass="!border-gray-200 !rounded-lg !shadow-lg"
                buttonClass="!border-gray-300 hover:!border-gray-400 !rounded-l-lg"
                />
            </FormField>
            </div>
        </FormSection>
        );
        
    case 5:
        return (
        <FormSection>
            <FormTitle step={5}>Preferences</FormTitle>
            
            <div className="space-y-5">
            <FormField label="Currency" error={errors.currencyId}>
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
                className="basic-single"
                classNamePrefix="select"
                styles={{
                    control: (base) => ({
                    ...base,
                    borderColor: errors.currencyId ? '#ef4444' : '#d1d5db',
                    minHeight: '44px',
                    '&:focus-within': {
                        borderColor: '#f97316',
                        boxShadow: '0 0 0 2px rgba(249, 115, 22, 0.2)'
                    }
                    }),
                    option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected 
                        ? '#f97316' 
                        : isFocused 
                        ? '#ffedd5' 
                        : undefined,
                    color: isSelected ? 'white' : undefined,
                    })
                }}
                />
            </FormField>

            <FormField label="Language" error={errors.languageId}>
                <Select
                options={languages}
                value={formData.languageId}
                onChange={(value) => {
                    setFormData(prev => ({ ...prev, languageId: value }));
                    if (errors.languageId) {
                    setErrors({...errors, languageId: ''});
                    }
                }}
                placeholder="Select your preferred language"
                className="basic-single"
                classNamePrefix="select"
                styles={{
                    control: (base) => ({
                    ...base,
                    borderColor: errors.languageId ? '#ef4444' : '#d1d5db',
                    minHeight: '44px',
                    '&:focus-within': {
                        borderColor: '#f97316',
                        boxShadow: '0 0 0 2px rgba(249, 115, 22, 0.2)'
                    }
                    }),
                    option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected 
                        ? '#f97316' 
                        : isFocused 
                        ? '#ffedd5' 
                        : undefined,
                    color: isSelected ? 'white' : undefined,
                    })
                }}
                />
            </FormField>
            </div>
        </FormSection>
        );
        
    case 6:
        return (
        <FormSection>
            <FormTitle step={6}>Date of Birth</FormTitle>
            
            <div className="space-y-5">
            <FormField label="Date of Birth" error={errors.dateOfBirth}>
                <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    max={minDateStr}
                    className={`w-full pl-10 rounded-lg border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} px-3 py-2.5 focus:ring-2 focus:ring-orange-200 focus:border-orange-400`}
                />
                </div>
                <p className="text-xs text-gray-500 mt-1">You must be at least 18 years old</p>
            </FormField>
            </div>
        </FormSection>
        );

    case 7:
        return (
        <FormSection>
            <FormTitle step={7}>Profile Photo <span className="text-sm font-normal text-gray-500">(optional)</span></FormTitle>
            
            <div className="space-y-5">
            <div className="flex justify-center">
                <ImageUploader 
                onChange={handleImageChange}
                storagePath="profile-pictures/"
                />
            </div>
            <p className="text-sm text-gray-500 italic text-center">You can skip this step if you prefer</p>
            </div>
        </FormSection>
        );
        
    case 8:
        return (
        <FormSection>
            <FormTitle step={8}>Professional Details</FormTitle>
            
            <div className="space-y-5">
            <FormField label="Professional Title" error={errors.professionalTitle}>
                <input
                type="text"
                name="professionalTitle"
                value={formData.professionalTitle}
                onChange={handleChange}
                className={`w-full rounded-lg border ${errors.professionalTitle ? 'border-red-500' : 'border-gray-300'} px-3 py-2.5 focus:ring-2 focus:ring-orange-200 focus:border-orange-400`}
                placeholder="e.g., Senior Web Developer"
                />
            </FormField>

            <FormField label="Hourly Rate ($)" error={errors.hourlyRate}>
                <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className={`w-full pl-10 rounded-lg border ${errors.hourlyRate ? 'border-red-500' : 'border-gray-300'} px-3 py-2.5 focus:ring-2 focus:ring-orange-200 focus:border-orange-400`}
                    placeholder="Your hourly rate"
                    min="0"
                    step="0.01"
                />
                </div>
            </FormField>

            <FormField label="Interests/Categories" optional>
                <Select
                options={categories}
                isMulti
                value={formData.interests}
                onChange={(value) => setFormData(prev => ({ ...prev, interests: value as SelectOption[] }))}
                placeholder="Select categories you're interested in"
                className="basic-multi-select"
                classNamePrefix="select"
                styles={{
                    control: (base) => ({
                    ...base,
                    borderColor: '#d1d5db',
                    minHeight: '44px',
                    '&:focus-within': {
                        borderColor: '#f97316',
                        boxShadow: '0 0 0 2px rgba(249, 115, 22, 0.2)'
                    }
                    }),
                    option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected 
                        ? '#f97316' 
                        : isFocused 
                        ? '#ffedd5' 
                        : undefined,
                    color: isSelected ? 'white' : undefined,
                    }),
                    multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#ffedd5'
                    }),
                    multiValueLabel: (base) => ({
                    ...base,
                    color: '#9a3412'
                    }),
                }}
                />
            </FormField>

            <FormField label="About Me" error={errors.profileDescription}>
                <textarea
                name="profileDescription"
                value={formData.profileDescription}
                onChange={handleChange}
                rows={5}
                className={`w-full rounded-lg border ${errors.profileDescription ? 'border-red-500' : 'border-gray-300'} px-3 py-2.5 focus:ring-2 focus:ring-orange-200 focus:border-orange-400`}
                placeholder="Tell us about yourself, your skills, experience, and what you're looking for..."
                />
                <div className={`text-xs mt-1 ${
                formData.profileDescription.length < 100 ? 'text-red-500' : 'text-gray-500'
                }`}>
                {formData.profileDescription.length}/100 characters minimum
                </div>
            </FormField>
            
            <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Sign Up Summary</h3>
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="space-y-4 text-gray-700">
                    <div className="grid grid-cols-3 gap-4 items-center pb-3 border-b border-gray-200">
                    <span className="font-medium text-gray-500">Username:</span> 
                    <span className="col-span-2 font-medium text-gray-800">
                        {formData.username || <span className="text-gray-400 italic">Not provided</span>}
                    </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 items-center pb-3 border-b border-gray-200">
                    <span className="font-medium text-gray-500">Email:</span> 
                    <span className="col-span-2 text-gray-800">{formData.email}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 items-center pb-3 border-b border-gray-200">
                    <span className="font-medium text-gray-500">Role:</span> 
                    <span className="col-span-2 text-gray-800">
                        {formData.roleId === 1 ? 'Freelancer' : 'Client'}
                    </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 items-center pb-3 border-b border-gray-200">
                    <span className="font-medium text-gray-500">Country:</span> 
                    <span className="col-span-2 text-gray-800">
                        {formData.countryId ? formData.countryId.label : <span className="text-gray-400 italic">Not provided</span>}
                    </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 items-center pb-3 border-b border-gray-200">
                    <span className="font-medium text-gray-500">Professional:</span> 
                    <span className="col-span-2 text-gray-800">
                        {formData.professionalTitle || <span className="text-gray-400 italic">Not provided</span>}
                    </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 items-center">
                    <span className="font-medium text-gray-500">Interests:</span> 
                    <div className="col-span-2">
                        {formData.interests && formData.interests.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {formData.interests.map(interest => (
                            <span key={interest.value} className="inline-block px-2.5 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
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
        </FormSection>
        );
        
    default:
        return null;
    }
};

return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
        <FormCard>
        <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
            </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Our Community</h1>
            <p className="text-gray-600">Create your account in just a few steps</p>
        </div>
        
        {/* Progress bar */}
        <div className="mb-8">
            <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of {totalSteps}</span>
            <span className="text-sm font-medium text-orange-600">{Math.round((step / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
                className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
            </div>
        </div>

        <form onSubmit={step === totalSteps ? handleSubmit : (e) => e.preventDefault()}>
            {renderStep()}
            
            <div className="mt-10 flex justify-between">
            {step > 1 ? (
                <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-6 py-3 border border-gray-300 rounded-xl bg-white text-gray-700 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
                >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
                </button>
            ) : (
                <div></div>
            )}
            
            <div className="flex gap-3">
                {(step === 3 || step === 7) && (
                <button
                    type="button"
                    onClick={skipStep}
                    className="px-6 py-3 border border-orange-300 rounded-xl bg-white text-orange-600 hover:bg-orange-50 transition-all shadow-sm hover:shadow-md"
                >
                    Skip
                </button>
                )}
                
                {step < totalSteps ? (
                <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl text-white hover:from-orange-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl"
                >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                ) : (
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center px-8 py-3.5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl shadow-xl hover:from-orange-600 hover:to-yellow-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                    {isLoading ? (
                    <span className="flex items-center">
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                        Creating Account...
                    </span>
                    ) : (
                    <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Complete Sign Up
                    </>
                    )}
                </button>
                )}
            </div>
            </div>
        </form>

        <div className="mt-8 text-center">
            <p className="text-gray-600">
            Already have an account?{' '}
            <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-orange-600 hover:text-orange-800 font-medium hover:underline"
            >
                Log in here
            </button>
            </p>
        </div>
        </FormCard>
    </div>
    </div>
);
};

export default SignUp;