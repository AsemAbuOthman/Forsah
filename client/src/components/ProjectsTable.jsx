import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { format } from 'date-fns';
import { Pencil, Trash2, X, Eye, SquareArrowOutUpRight } from 'lucide-react';
import { mockProjects, mockProjectStates } from './mockData';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const ProjectsTable = ({ userId }) => {
    
const [projects, setProjects] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [filters, setFilters] = useState({
    search: '',
    stateId: '',
    minBudget: '',
    maxBudget: '',
});
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
const [editingProject, setEditingProject] = useState(null);
const [selectedProject, setSelectedProject] = useState(null);
const [projectStates, setProjectStates] = useState([]);

const navigate = useNavigate();

const fetchProjects = async () => {
    try {
    setLoading(true);
    // Simulate API call delay
    const res = await axios.get(`api/user/projects?page=${currentPage}&userId=${userId}&filters=${filters}`);
    
    console.log(' res.data.projects : ', res.data.projects);

    // Filter projects based on search c
    // riteria
    let filteredProjects = [...res.data.projects];
    
    if (filters.search) {
        filteredProjects = filteredProjects.filter(project => 
        project.projectTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.projectDescription.toLowerCase().includes(filters.search.toLowerCase())
        );
    }
    
    if (filters.stateId) {
        filteredProjects = filteredProjects.filter(project => 
        project.projectStateId === filters.stateId
        );
    }
    
    if (filters.minBudget) {
        filteredProjects = filteredProjects.filter(project => 
        project.minBudget >= parseInt(filters.minBudget)
        );
    }
    
    if (filters.maxBudget) {
        filteredProjects = filteredProjects.filter(project => 
        project.maxBudget <= parseInt(filters.maxBudget)
        );
    }

    if(res.data){

        setProjects(filteredProjects);
        setTotalPages(Math.ceil(filteredProjects.length / 10));
    }
    
    } catch (err) {
    setError('Failed to fetch projects');
    toast.error('Failed to fetch projects');
    } finally {
    setLoading(false);
    }
};

const fetchProjectStates = async () => {
    // Use mock data instead of API call


    setProjectStates(mockProjectStates);
};

useEffect(() => {
    fetchProjects();
    fetchProjectStates();
}, [userId, currentPage, filters]);

const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
    ...prev,
    [name]: value
    }));
    setCurrentPage(1);
};

const handleViewDetails = (project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
};

const handleEdit = (project) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
};

const handleUpdate = async (e) => {
    e.preventDefault();
    try {
    // Simulate API call
    
    console.log('editingProject : ', editingProject);
    

    const res = await axios.patch(`api/project/${editingProject.projectId}`, editingProject);

    if(res.data){

        toast.success('Project updated successfully');
        setIsEditModalOpen(false);
        fetchProjects();
    }

    } catch (err) {
    toast.error('Failed to update project');
    }
};

const handleDelete = async (projectId, userId) => {


    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {

    // Simulate API call
    const res = await axios.delete(`api/project/${projectId}/${userId}`);

    if (res.data.success) {

        toast.success('Project deleted successfully');
        fetchProjects();
    }else{

        toast.warning('Project was not deleted !');
    }

    } catch (err) {
        toast.error('Failed to delete project');
    }
};

if (loading) {
    return (
    <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-violet-600"></div>
    </div>
    );
}

if (error) {
    return (
    <div className="text-red-500 text-center py-4">
        {error}
    </div>
    );
}

return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 bg-gray-200">
    <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Projects Management</h1>
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
                type="text"
                name="search"
                placeholder="Search projects..."
                className="rounded-lg border-gray-300 ring-gray-300 ring-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all duration-200 p-2 outline-none "
                value={filters.search}
                onChange={handleFilterChange}
            />
            <select
                name="stateId"
                className="rounded-lg border-gray-300 ring-gray-300 ring-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all duration-200 p-2 outline-none"
                value={filters.stateId}
                onChange={handleFilterChange}
            >
                <option value="">All States</option>
                {projectStates.map(state => (
                <option key={state.projectStateId} value={state.projectStateId}>
                    {state.projectStateType}
                </option>
                ))}
            </select>
            <input
                type="number"
                name="minBudget"
                placeholder="Min Budget"
                className="rounded-lg ring-gray-300 ring-1 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all duration-200 p-2 outline-none"
                value={filters.minBudget}
                onChange={handleFilterChange}
            />
            <input
                type="number"
                name="maxBudget"
                placeholder="Max Budget"
                className="rounded-lg ring-gray-300 ring-1 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all duration-200 p-2 outline-none"
                value={filters.maxBudget}
                onChange={handleFilterChange}
            />
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto  ">
            <table className="min-w-full divide-y divide-gray-200 overflow-hidden">
            <thead className="bg-gray-50 ">
                <tr>
                <th className="px-6 py-3 text-left text-md font-medium text-gray-600 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-md font-medium text-gray-600 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-3 text-left text-md font-medium text-gray-600 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-md font-medium text-gray-600 uppercase tracking-wider">State</th>
                <th className="px-6 py-3 text-left text-md font-medium text-gray-600 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-left text-md font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                <tr key={project.projectId} className="hover:bg-black/10  duration-150 cursor-pointer hover:shadow-lg hover:scale-102 hover:translate-z-5 transition-all">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.projectTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                        {format(new Date(project.projectDeadline), 'MMM dd, yyyy')}
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                        {project.symbol}{project.minBudget} - {project.symbol}{project.maxBudget}
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.projectStateType === 'Active' ? 'bg-green-100 text-green-800' :
                        project.projectStateType === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                        {project.projectStateType}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.countryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                        <button
                        onClick={() => handleViewDetails(project)}
                        className="text-gray-600 hover:text-blue-700 cursor-pointer transition-colors"
                        >
                        <Eye className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/proposals', { state: { projectData: project } })}
                            className="text-gray-600 hover:text-gray-900 transition-colors hover:cursor-pointer"
                        >
                        <SquareArrowOutUpRight  className="w-5 h-5" />
                        </button>
                        <button
                        onClick={() => handleEdit(project)}
                        className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors"
                        >
                        <Pencil className="w-5 h-5" />
                        </button>
                        <button
                        onClick={() => handleDelete(project.projectId, project.userId)}
                        className="text-red-400 hover:text-red-600 cursor-pointer transition-colors"
                        >
                        <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
            <button
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
                Previous
            </button>
            <button
                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
                Next
            </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
                <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
                </p>
            </div>
            <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                {[...Array(totalPages)].map((_, i) => (
                    <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                    >
                    {i + 1}
                    </button>
                ))}
                </nav>
            </div>
            </div>
        </div>

        {/* Edit Modal */}
        <Dialog 
            open={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                <div className="absolute top-4 right-4">
                <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                </div>

                <Dialog.Title className="text-xl font-semibold text-gray-900 mb-6">
                Edit Project
                </Dialog.Title>

                <form onSubmit={handleUpdate} className="space-y-5">
                <div className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Title
                    </label>
                    <input
                        type="text"
                        value={editingProject?.projectTitle || ''}
                        onChange={(e) => setEditingProject({
                        ...editingProject,
                        projectTitle: e.target.value
                        })}
                        className="w-full rounded-lg ring-gray-300 ring-1 border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 p-2 outline-none"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deadline
                    </label>
                    <input
                        type="date"
                        value={editingProject?.projectDeadline?.split('T')[0] || ''}
                        onChange={(e) => setEditingProject({
                        ...editingProject,
                        projectDeadline: e.target.value
                        })}
                        className="w-full rounded-lg ring-gray-300 ring-1 border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 p-2 outline-none"
                    />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Budget
                        </label>
                        <input
                        type="number"
                        value={editingProject?.minBudget || ''}
                        onChange={(e) => setEditingProject({
                            ...editingProject,
                            minBudget: Number(e.target.value)
                        })}
                        className="w-full rounded-lg ring-gray-300 ring-1 border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 p-2 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Budget
                        </label>
                        <input
                        type="number"
                        value={editingProject?.maxBudget || ''}
                        onChange={(e) => setEditingProject({
                            ...editingProject,
                            maxBudget: Number(e.target.value)
                        })}
                        className="w-full rounded-lg ring-gray-300 ring-1 border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 p-2 outline-none"
                        />
                    </div>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project State
                    </label>
                    <select
                        value={editingProject?.projectStateId || ''}
                        onChange={(e) => setEditingProject({
                        ...editingProject,
                        projectStateId: e.target.value
                        })}
                        className="w-full rounded-lg ring-gray-300 ring-1 border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 p-2"
                    >
                        {projectStates.map(state => (
                        <option key={state.projectStateId} value={state.projectStateId}>
                            {state.projectStateType}
                        </option>
                        ))}
                    </select>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        value={editingProject?.projectDescription || ''}
                        onChange={(e) => setEditingProject({
                        ...editingProject,
                        projectDescription: e.target.value
                        })} 
                        rows={4}
                        className="w-full rounded-lg ring-gray-300 ring-1 border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 p-2 outline-none"
                    />
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                    <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                    Save Changes
                    </button>
                </div>
                </form>
            </Dialog.Panel>
            </div>
        </Dialog>

        {/* Project Details Modal */}
        <Dialog 
            open={isDetailsModalOpen} 
            onClose={() => setIsDetailsModalOpen(false)}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="relative bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl">
                <div className="absolute top-4 right-4">
                <button
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                </div>

                <Dialog.Title className="text-xl font-semibold text-gray-900 mb-6">
                Project Details
                </Dialog.Title>

                {selectedProject && (
                <div className="space-y-6">
                    <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-8">{selectedProject.projectTitle}</h3>
                        <pre>
                            <p className="text-gray-500 max-h-80 overflow-auto border-1 rounded-lg p-2 border-violet-50">{selectedProject.projectDescription}</p>
                        </pre>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Budget Range</h4>
                        <p className="mt-1 text-gray-900">
                        {selectedProject.symbol}{selectedProject.minBudget} - {selectedProject.symbol}{selectedProject.maxBudget}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Deadline</h4>
                        <p className="mt-1 text-gray-900">
                        {format(new Date(selectedProject.projectDeadline), 'MMMM dd, yyyy')}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Status</h4>
                        <p className="mt-1">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            selectedProject.projectStateType === 'Active' ? 'bg-green-100 text-green-800' :
                            selectedProject.projectStateType === 'Completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {selectedProject.projectStateType}
                        </span>
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Location</h4>
                        <p className="mt-1 text-gray-900">{selectedProject.countryName}</p>
                    </div>
                    </div>

                    <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Project Timeline</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Created</p>
                            <p className="text-sm text-gray-500">
                            {format(new Date(selectedProject.createdAt), 'MMMM dd, yyyy')}
                            </p>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Deadline</p>
                            <p className="text-sm text-gray-500">
                            {format(new Date(selectedProject.projectDeadline), 'MMMM dd, yyyy')}
                            </p>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                )}
            </Dialog.Panel>
            </div>
        </Dialog>
        </div>
    </div>
    </div>
);
};

export default ProjectsTable;