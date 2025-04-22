import  { useState, useRef } from 'react';
import { format } from 'date-fns';
import {
    Camera,
    Pencil,
    Star,
    Briefcase,
    GraduationCap,
    Award,
    User,
    Users,
    ChevronDown,
    X,
    Plus,
    Calendar,
    MapPin,
    DollarSign,
    Clock,
    ThumbsUp,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import PortfolioGallery from './portfolio/PortfolioGallery';



function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 transition-opacity duration-300"
                onClick={onClose}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div 
                    className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </button>
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}

export default function Profile() {
    const [activeProfile, setActiveProfile] = useState({
        id: 1,
        type: 'freelancer',
        name: 'Alex Thompson',
        title: 'Senior Full Stack Developer',
        location: 'San Francisco, CA',
        joinDate: '2020-01-15',
        totalEarned: 150000,
        rating: 4.9,
        totalReviews: 47,
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        about: "Passionate full-stack developer with 8+ years of experience in building scalable web applications. Specialized in React, Node.js, and cloud technologies.",
        skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'PostgreSQL']
    });

    const [profiles, setProfiles] = useState([
        activeProfile,
        {
        id: 2,
        type: 'client',
        name: 'Sarah Johnson',
        title: 'Product Manager',
        location: 'New York, NY',
        joinDate: '2019-06-20',
        totalEarned: 0,
        rating: 4.8,
        totalReviews: 15,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        about: "Product Manager with a focus on delivering high-quality software solutions.",
        skills: ['Project Management', 'Agile', 'Product Strategy']
        }
    ]);

    const [portfolios, setPortfolios] = useState([
        {
        id: 1,
        title: "E-commerce Platform",
        description:
            "Built a full-stack e-commerce platform with React and Node.js. Implemented features including product management, cart functionality, and payment processing.",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
        duration: "3 months",
        client: "TechCorp Inc.",
        images: [
            "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1542744095-291d1f67b221?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1556740749-887f6717d7e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ]
        },
        {
        id: 2,
        title: "Fitness Tracking App",
        description:
            "Designed and developed a mobile-first fitness tracking application with workout planning and progress monitoring features.",
        technologies: ["React Native", "Firebase", "TypeScript"],
        duration: "4 months",
        client: "FitTech Solutions",
        images: [
            "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ]
        }
    ]);
    

    const [reviews, setReviews] = useState([
        {
        id: 1,
        name: "John Smith",
        rating: 5,
        comment: "Excellent work! Delivered the project ahead of schedule and exceeded expectations.",
        date: "2024-03-15",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        projectTitle: "E-commerce Platform"
        },
        {
        id: 2,
        name: "Emily Brown",
        rating: 5,
        comment: "Very professional and great communication throughout the project. Would definitely hire again!",
        date: "2024-03-10",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        projectTitle: "Fitness Tracking App"
        }
    ]);

    const [education, setEducation] = useState([
        {
        id: 1,
        degree: "Master's in Computer Science",
        institution: "Stanford University",
        year: "2018",
        description: "Specialized in Distributed Systems and Machine Learning"
        },
        {
        id: 2,
        degree: "Bachelor's in Software Engineering",
        institution: "University of California, Berkeley",
        year: "2016",
        description: "Focus on Web Technologies and Algorithms"
        }
    ]);

    const [certifications, setCertifications] = useState([
        {
        id: 1,
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2020-06",
        expiryDate: "2023-06",
        credentialId: "AWS-123456"
        },
        {
        id: 2,
        name: "Professional Scrum Master I",
        issuer: "Scrum.org",
        date: "2021-03",
        credentialId: "PSM-789012"
        }
    ]);

    const [certification, setCertification] = useState({
        id: null,
        name: '',
        issuer: '',
        date: '',
        expiryDate: '',
        credentialId: '',
    });

    const [experience, setExperience] = useState([
        {
        id: 1,
        title: "Senior Developer",
        company: "TechCorp",
        location: "San Francisco, CA",
        startDate: "2020-01",
        description: "Led a team of 5 developers in building enterprise-level applications."
        },
        {
        id: 2,
        title: "Full Stack Developer",
        company: "StartupX",
        location: "San Francisco, CA",
        startDate: "2018-03",
        endDate: "2019-12",
        description: "Developed and maintained multiple client projects using modern web technologies."
        }
    ]);

    // State for modals
    const [activeSection, setActiveSection] = useState("about");
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showPortfolioModal, setShowPortfolioModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showEducationModal, setShowEducationModal] = useState(false);
    const [showCertificationModal, setShowCertificationModal] = useState(false);
    const [showExperienceModal, setShowExperienceModal] = useState(false);
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);
    const [selectedEducation, setSelectedEducation] = useState(null);
    const [selectedCertification, setSelectedCertification] = useState(null);

    
    const fileInputRef = useRef(null);

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setActiveProfile(prev => ({
            ...prev,
            image: reader.result
            }));
        };
        reader.readAsDataURL(file);
        }
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        autoplay: false,
        autoplaySpeed: 3000,
    };

    const handleProfileTypeToggle = () => {
        setActiveProfile(prev => ({
        ...prev,
        type: prev.type === 'freelancer' ? 'client' : 'freelancer'
        }));
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        }
        setActiveSection(sectionId);
    };

    // Navigation items
    const navItems = [
        { id: 'about', label: 'About', icon: User },
        { id: 'portfolio', label: 'Portfolio', icon: Briefcase, showFor: ['freelancer'] },
        { id: 'experience', label: 'Experience', icon: Clock },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'certifications', label: 'Certifications', icon: Award },
        { id: 'reviews', label: 'Reviews', icon: Star }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
        {/* Sticky Header Navigation */}
        <header className="sticky top-0 bg-white shadow-md z-30">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                {navItems
                    .filter(item => !item.showFor || item.showFor.includes(activeProfile.type))
                    .map(item => (
                    <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                    >
                        <div className="flex items-center space-x-2">
                        <item.icon size={18} />
                        <span>{item.label}</span>
                        </div>
                    </button>
                    ))}
                </div>
                
                <div className="flex items-center space-x-4">
                <button
                    onClick={handleProfileTypeToggle}
                    className="btn-secondary flex items-center space-x-2"
                >
                    <Users size={18} />
                    <span>{activeProfile.type === 'freelancer' ? 'Switch to Client' : 'Switch to Freelancer'}</span>
                </button>
                
                <div className="relative">
                    <button
                    // onClick={() => setShowProfileModal(true)}
                    className="btn-secondary flex items-center space-x-2"
                    >
                    <User size={18} />
                    <span>Switch Profile</span>
                    <ChevronDown size={16} />
                    </button>
                </div>
                </div>
            </div>
            </nav>
        </header>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-60"></div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 pb-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Profile Section */}
            <div className="relative p-8">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
                <div className="relative">
                    <img
                    src={activeProfile.image}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700"
                    >
                    <Camera size={20} />
                    </button>
                    <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                    />
                </div>
                
                <div className="mt-4 md:mt-0">
                    <h1 className="text-3xl font-bold text-gray-900">{activeProfile.name}</h1>
                    <p className="text-xl text-gray-600">{activeProfile.title}</p>
                    <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center text-gray-500">
                        <MapPin size={18} className="mr-1" />
                        <span>{activeProfile.location}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                        <Calendar size={18} className="mr-1" />
                        <span>Joined {format(new Date(activeProfile.joinDate), 'MMM yyyy')}</span>
                    </div>
                    </div>
                    <div className="mt-4 flex items-center space-x-6">
                    <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span className="ml-1 text-gray-900 font-semibold">{activeProfile.rating}</span>
                        <span className="ml-1 text-gray-500">({activeProfile.totalReviews} reviews)</span>
                    </div>
                    {activeProfile.type === 'freelancer' && (
                        <div className="flex items-center text-gray-900">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <span className="font-semibold">${activeProfile.totalEarned.toLocaleString()}</span>
                        <span className="ml-1 text-gray-500">earned</span>
                        </div>
                    )}
                    </div>
                </div>
                </div>
            </div>

            {/* About Me Section */}
            <section id="about" className="p-8 border-t border-gray-200">
                <div className="section-title">
                    <h2>About Me</h2>
                    <button className="text-blue-600 hover:text-blue-800" onClick={()=> setShowProfileModal(true)}>
                        <Pencil size={20} />
                    </button>
                </div>
                <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed">{activeProfile.about}</p>
                
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                    {activeProfile.skills.map((skill, index) => (
                        <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                        {skill}
                        </span>
                    ))}
                    </div>
                </div>
                </div>
            </section>

            {/* Portfolio Section */}
            {activeProfile.type === 'freelancer' && 
                <div className=" bg-gray-100 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto w-full mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Portfolio Gallery</h1>
                        <p className="mt-2 text-gray-600">A showcase of recent projects and work samples</p>
                    </div>
                    
                    <div className="max-w-7xl mx-auto w-full">
                    <PortfolioGallery portfolios={portfolios}/> 
                    </div>
                </div>
            }

            {/* Experience Section */}
            <section id="experience" className="p-8 border-t border-gray-200">
                <div className="section-title">
                <h2>Experience</h2>
                <button
                    onClick={() => setShowExperienceModal(true)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus size={18} />
                    <span>Add Experience</span>
                </button>
                </div>
                <div className="space-y-6">
                {experience.map(exp => (
                    <div key={exp.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                        <p className="text-gray-600">{exp.company} • {exp.location}</p>
                        <p className="text-gray-500">
                        {format(new Date(exp.startDate), 'MMM yyyy')} -{' '}
                        {exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : 'Present'}
                        </p>
                        <p className="text-gray-600 mt-2">{exp.description}</p>
                    </div>
                    </div>
                ))}
                </div>
            </section>

            {/* Education Section */}
            <section id="education" className="p-8 border-t border-gray-200">
                <div className="section-title">
                <h2>Education</h2>
                <button
                    onClick={() => setShowEducationModal(true)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus size={18} />
                    <span>Add Education</span>
                </button>
                </div>
                <div className="space-y-6">
                {education.map(edu => (
                    <div key={edu.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-gray-500">{edu.year}</p>
                        <p className="text-gray-600 mt-2">{edu.description}</p>
                    </div>
                    </div>
                ))}
                </div>
            </section>

            {/* Certifications Section */}
            <section id="certifications" className="p-8 border-t border-gray-200">
                <div className="section-title">
                <h2>Certifications</h2>
                <button
                    onClick={() => setShowCertificationModal(true)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus size={18} />
                    <span>Add Certification</span>
                </button>
                </div>
                <div className="space-y-6">
                {certifications.map(cert => (
                    <div key={cert.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Award className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
                        <p className="text-gray-600">{cert.issuer}</p>
                        <p className="text-gray-500">
                        Issued {format(new Date(cert.date), 'MMM yyyy')}
                        {cert.expiryDate && ` • Expires ${format(new Date(cert.expiryDate), 'MMM yyyy')}`}
                        </p>
                        <p className="text-gray-500 mt-1">Credential ID: {cert.credentialId}</p>
                    </div>
                    </div>
                ))}
                </div>
            </section>

            {/* Reviews Section */}
            <section id="reviews" className="p-8 border-t border-gray-200">
                <div className="section-title">
                <h2>Client Reviews ({reviews.length})</h2>
                </div>
                <div className="space-y-6">
                {reviews.map(review => (
                    <div key={review.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                        <img
                            src={review.image}
                            alt={review.name}
                            className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{review.name}</h3>
                            <p className="text-gray-500">{format(new Date(review.date), 'PP')}</p>
                        </div>
                        </div>
                        <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                            key={i}
                            className={`h-5 w-5 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                            />
                        ))}
                        </div>
                    </div>
                    <p className="text-gray-600 mt-4">{review.comment}</p>
                    <p className="text-gray-500 mt-2 text-sm">Project: {review.projectTitle}</p>
                    </div>
                ))}
                </div>
            </section>
            </div>
        </main>

        {/* Modals */}
        <Modal isOpen={showPortfolioModal} onClose={() => setShowPortfolioModal(false)}>
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedPortfolio ? 'Project Details' : 'Add New Project'}
            </h2>
            
            {selectedPortfolio ? (
            <div className="space-y-6">
                {/* Improved Image Slider/Grid */}
                <div className="relative">
                {selectedPortfolio.images.length > 1 ? (
                    <div className="grid grid-cols-3 gap-4">
                    {selectedPortfolio.images.map((image, index) => (
                        <div key={index} className=" aspect-video">
                        <img
                            src={image}
                            alt={`${selectedPortfolio.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                    {selectedPortfolio.images.map((image, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                        <img
                            src={image}
                            alt={`${selectedPortfolio.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        </div>
                    ))}
                    </div>
                )}
                </div>

                <div className="space-y-4">
                <h3 className="text-xl font-semibold">{selectedPortfolio.title}</h3>
                <p className="text-gray-600">{selectedPortfolio.description}</p>
                
                <div>
                    <h4 className="font-semibold text-gray-900">Technologies</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                    {selectedPortfolio.technologies.map((tech, index) => (
                        <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                        {tech}
                        </span>
                    ))}
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <h4 className="font-semibold text-gray-900">Duration</h4>
                    <p className="text-gray-600">{selectedPortfolio.duration}</p>
                    </div>
                    <div>
                    <h4 className="font-semibold text-gray-900">Client</h4>
                    <p className="text-gray-600">{selectedPortfolio.client}</p>
                    </div>
                </div>
                </div>
            </div>
            ) : (
            <form className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700">Project Title</label>
                <input 
                    type="text" 
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                />
                </div>
                
                <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea 
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    rows={4}
                />
                </div>
                
                <div>
                <label className="block text-sm font-medium text-gray-700">Technologies</label>
                <input 
                    type="text" 
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="React, Node.js, etc." 
                />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Duration</label>
                    <input 
                    type="text" 
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="3 months" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Client</label>
                    <input 
                    type="text" 
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    />
                </div>
                </div>
                
                <div>
                <label className="block text-sm font-medium text-gray-700">Project Images</label>
                <div className="mt-1 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {/* Preview of selected images would go here */}
                    <div className="relative aspect-square border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                    <span className="text-gray-400">+</span>
                    </div>
                </div>
                <input 
                    type="file" 
                    multiple 
                    className="mt-2 w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                    accept="image/*" 
                />
                </div>
                
                <div className="flex justify-end space-x-4 mt-6">
                <button
                    type="button"
                    onClick={() => setShowPortfolioModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Save Project
                </button>
                </div>
            </form>
            )}
        </div>
        </Modal>

        <Modal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)}>
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
                <form
                onSubmit={(e) => {
                    e.preventDefault();
                    // You can call your update logic here
                    console.log('Updated profile:', activeProfile);
                    setShowProfileModal(false);
                }}
                className="space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                        type="text"
                        value={activeProfile.name}
                        onChange={(e) =>
                            setActiveProfile({ ...activeProfile, name: e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                        type="text"
                        value={activeProfile.title}
                        onChange={(e) =>
                            setActiveProfile({ ...activeProfile, title: e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                        type="text"
                        value={activeProfile.location}
                        onChange={(e) =>
                            setActiveProfile({ ...activeProfile, location: e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Join Date</label>
                        <input
                        type="date"
                        value={activeProfile.joinDate}
                        onChange={(e) =>
                            setActiveProfile({ ...activeProfile, joinDate: e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">About</label>
                        <textarea
                        value={activeProfile.about}
                        onChange={(e) =>
                            setActiveProfile({ ...activeProfile, about: e.target.value })
                        }
                        rows={4}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
                        <input
                        type="text"
                        value={activeProfile.skills.join(', ')}
                        onChange={(e) =>
                            setActiveProfile({
                            ...activeProfile,
                            skills: e.target.value.split(',').map((skill) => skill.trim()),
                            })
                        }
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
                        <input
                        type="text"
                        value={activeProfile.image}
                        onChange={(e) =>
                            setActiveProfile({ ...activeProfile, image: e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <img
                        src={activeProfile.image}
                        alt="Profile Preview"
                        className="w-24 h-24 mt-4 rounded-full object-cover border"
                        />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                        type="button"
                        onClick={() => setShowProfileModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
                        >
                        Cancel
                        </button>
                        <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                        Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </Modal>

        <Modal isOpen={showEducationModal} onClose={() => setShowEducationModal(false)}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {selectedEducation ? "Edit Education" : "Add Education"}
                    </h2>

                    <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (selectedEducation) {
                        // Update logic here
                        } else {
                        // Add new education logic here
                        }
                        setShowEducationModal(false);
                    }}
                    className="space-y-4"
                    >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Degree</label>
                        <input
                        type="text"
                        value={education.degree}
                        onChange={(e) =>
                            setEducation({ ...education, degree: e.target.value })
                        }
                        placeholder="e.g., Master's in Computer Science"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Institution</label>
                        <input
                        type="text"
                        value={education.institution}
                        onChange={(e) =>
                            setEducation({ ...education, institution: e.target.value })
                        }
                        placeholder="e.g., Stanford University"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Year</label>
                        <input
                        type="text"
                        value={education.year}
                        onChange={(e) =>
                            setEducation({ ...education, year: e.target.value })
                        }
                        placeholder="e.g., 2018"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                        value={education.description}
                        onChange={(e) =>
                            setEducation({ ...education, description: e.target.value })
                        }
                        placeholder="e.g., Specialized in Distributed Systems and Machine Learning"
                        rows={4}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                        type="button"
                        onClick={() => setShowEducationModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
                        >
                        Cancel
                        </button>
                        <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                        Save
                        </button>
                    </div>
                    </form>
                </div>
            </Modal>


            <Modal isOpen={showCertificationModal} onClose={() => setShowCertificationModal(false)}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {selectedCertification ? "Edit Certification" : "Add Certification"}
                    </h2>

                    <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (selectedCertification) {
                        // Update logic here
                        } else {
                        // Add new certification logic here
                        }
                        setShowCertificationModal(false);
                    }}
                    className="space-y-4"
                    >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Certification Name</label>
                        <input
                        type="text"
                        value={certification.name}
                        onChange={(e) =>
                            setCertification({ ...certification, name: e.target.value })
                        }
                        placeholder="e.g., AWS Certified Solutions Architect"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Issuer</label>
                        <input
                        type="text"
                        value={certification.issuer}
                        onChange={(e) =>
                            setCertification({ ...certification, issuer: e.target.value })
                        }
                        placeholder="e.g., Amazon Web Services"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                        <label className="block text-sm font-medium text-gray-700">Issued Date</label>
                        <input
                            type="date"
                            value={certification.date}
                            onChange={(e) =>
                            setCertification({ ...certification, date: e.target.value })
                            }
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                            type="date"
                            value={certification.expiryDate}
                            onChange={(e) =>
                            setCertification({ ...certification, expiryDate: e.target.value })
                            }
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Credential ID</label>
                        <input
                        type="text"
                        value={certification.credentialId}
                        onChange={(e) =>
                            setCertification({ ...certification, credentialId: e.target.value })
                        }
                        placeholder="e.g., AWS-123456"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                        type="button"
                        onClick={() => setShowCertificationModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
                        >
                        Cancel
                        </button>
                        <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                        Save
                        </button>
                    </div>
                    </form>
                </div>
            </Modal>


        </div>
    );
}

