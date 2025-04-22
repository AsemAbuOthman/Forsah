import {useState, useEffect, useMemo} from 'react';
import { Loader2 } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import { Toaster, toast } from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader'
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { storage } from '../services/Firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { format } from 'date-fns';



const roles = [
    { value: 'Freelancer', label: 'Freelancer' },
    { value: 'Client', label: 'Client' },
  // Add more countries as needed
];

const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
];

export default function SignUp() {

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        username: '',
        role: 'freelancer',
        country: null,
        phone: '',
        currency: null,
        dateOfBirth: null,
        description: '',
        interests: null,
        imageUrl: null
    });


    const [imgUrl, setImgUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);
    const [errors, setErrors] = useState({});
    const [countries, setCountries] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const today = new Date();
    const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const minDateStr = minAgeDate.toISOString().split("T")[0];


    useEffect(()=>{
        
            const fetchCountries = async  () => {
                    try {
            
                        const res = await axios.get('/api/countries');
                        
                        setCountries(await res.data[0]);
        
                    } catch (error) {
                        console.error("Failed to fetch countries:", error);
                        setCountries([]); 
                    } finally {
                        setIsLoading(false);
                    }
                };

            const fetchCurrencies = async  () => {
                try {
        
                    const res = await axios.get('/api/currencies');
                    
                    setCurrencies(await res.data[0]);
                    
                } catch (error) {
                    console.error("Failed to fetch currencies:", error);
                    setCurrencies([]); 
                } finally {
                    setIsLoading(false);
                }
            };

            const fetchCategories = async  () => {
                try {
        
                    const res = await axios.get('/api/categories');
                    
                    setCategories(await res.data[0]);
                    
                } catch (error) {
                    console.error("Failed to fetch categories:", error);
                    setCategories([]); 
                } finally {
                    setIsLoading(false);
                }
            };
        
        
            fetchCountries();
            fetchCurrencies();
            fetchCategories();

    }, [])

    

    const handleImageChange = (file) => {

        setFormData(prev => ({
            ...prev,
            imageUrl: file
            }));

            console.log(formData);
            
        };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
        newErrors.email = 'Email is required *';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email format *';
        }

        if (!formData.password) {
        newErrors.password = 'Password is required *';
        } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters *';
        }

        if (!formData.username) {
        newErrors.username = 'Username is required *';
        }

        if (!formData.country) {
        newErrors.country = 'Country is required *';
        }

        if (!formData.currency) {
        newErrors.currency = 'Currency is required *';
        }

        if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required *';
        }

        if (!formData.description) {
        newErrors.description = 'Description is required *';
        } else if (formData.description.length < 100) {
        newErrors.description = 'Description must be at least 100 characters *';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    
        const handleSubmitImageToFirebase = () => {
            return new Promise((resolve, reject) => {
            if (!formData.imageUrl) return resolve(); // early resolve if no file
        
            const storageRef = ref(storage, `files/${formData.imageUrl.name}`);
            const uploadTask = uploadBytesResumable(storageRef, formData.imageUrl);
        
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgresspercent(progress);
                },
                (error) => {
                alert(error);
                reject(error);
                },
                async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
                    // Important: use the updater function to wait for state update
                    setFormData((prev) => {
                    const updated = { ...prev, imageUrl: downloadURL };
                    resolve(updated); // resolve with the new form data
                    return updated;
                    });
        
                } catch (error) {
                    console.error('Error getting download URL:', error);
                    reject(error);
                }
                }
            );
            });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
        
            if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            console.log(formData);
            return;
            }
        
            setIsLoading(true);
        
            try {

            if(!formData.interests)
                formData.interests = categories;

            const updatedForm = await handleSubmitImageToFirebase(); // Wait for upload and update
        
            const res = await axios.post('/api/signin', updatedForm || formData); // use updatedForm if available
        
            if (res.data) {
                toast.success('Account created successfully!');
                console.log('after res:', res.data);
                navigate('/profile');
            }
            } catch (error) {
                console.log(formData);
                toast.error('Something went wrong. Please try again.');
            } finally {
            setIsLoading(false);
            }
        };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleDateChange = (e) => {
        setSelectedDate(new Date(e.target.value));
        
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto shadow-xl">
            <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="text-center mb-8">
                <img className="w-16" src="/icon_light.svg" alt="Logo" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Forsah Community</h2>
                <p className="text-gray-600">Create your account and start your journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                    <div>
                        <ImageUploader onChange={handleImageChange} />
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <div className="p-4 max-w-xs">
                            <div className="w-full max-w-md mx-auto">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    Select Date of Birth
                                </label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    max={minDateStr}
                                    className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} border-orange-400  rounded-xl shadow-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 transition`}
                                />
                                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1 ml-2">{errors.dateOfBirth}</p>}
                                <p className="text-xs text-gray-500 mt-1">
                                    You must be at least 18 years old.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                <div className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`border-orange-300 mt-1 block w-full border rounded-sm ${errors.email ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-orange-500 focus:ring-orange-500`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-2">{errors.email}</p>}
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`border-orange-300 mt-1 block w-full rounded-sm border ${errors.password ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-orange-500 focus:ring-orange-500`}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`border-orange-300 mt-1 block w-full rounded-sm border ${errors.username ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-orange-500 focus:ring-orange-500`}
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1 ml-2">{errors.username}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="border-orange-300 mt-1 block w-full rounded-sm border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500"
                        />
                    </div>

                    <div >
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md   px-3 py-2 focus:border-orange-500 focus:ring-orange-500`}
                        />
                    </div>
                    </div>

                {/* Additional Information */}


                    <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                        <Select
                            options={countries}
                            value={formData.country}    
                            onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                            className={errors.country ? 'border-red-500' : ''}
                            isLoading={countries.length === 0} // Show loading state if empty
                            styles={{
                                control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderColor: state.isFocused ? 'white' : 'orange',
                                }),
                            }}
                        />
                        {errors.country && <p className="text-red-500 text-xs mt-1 ml-2">{errors.country}</p>}
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <PhoneInput
                        country={formData.country?.code?.toLowerCase()  || undefined    }
                        value={formData.phone}
                        onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
                        containerClass="!w-full"
                        inputClass="!w-full !h-full !py-2 !border-orange-300"
                        dropdownClass= "!border-orange-300"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <Select
                        options={currencies}
                        value={formData.currency}
                        onChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                        className={errors.currency ? 'border-red-500' : ''}
                        styles={{
                            control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderColor: state.isFocused ? 'white' : 'orange',
                            }),
                        }}
                    />
                    {errors.currency && <p className="text-red-500 text-xs mt-1 ml-2">{errors.currency}</p>}
                    </div>
                </div>
                </div>

                {/* Full Width Fields */}
                <div className="space-y-4">


                <div>
                    <label className="block text-sm font-medium text-gray-700">Interests/Categories</label>
                    <Select
                        options={categories}
                        isMulti
                        value={formData.interests}
                        onChange={(value) => setFormData(prev => ({ ...prev, interests: value }))}
                        styles={{
                            control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderColor: state.isFocused ? 'white' : 'orange',
                            }),
                        }}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">About Me</label>
                    <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`mt-1 block w-full rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'} border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500`}
                    placeholder="Tell us about yourself..."
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1 ml-2">{errors.description}</p>}
                </div>
                </div>

                <div className="flex justify-center">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:from-orange-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                    <span className="flex items-center">
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                        Creating Account...
                    </span>
                    ) : (
                    'Create Account'
                    )}
                </button>
                </div>
            </form>
            </div>
        </div>
        <Toaster position="top-right"/>
        </div>
    );
}
