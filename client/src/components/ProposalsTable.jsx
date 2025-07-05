import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Eye, Edit2, Trash2, Plus, X, CheckCircle2, Clock, XCircle, SquareArrowOutUpRight } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Mock data for demonstration - replace with your API calls
const mockProposals = [
{
    proposalId: 1,
    proposalAmount: 1500,
    proposalDescription: "I can deliver this project within the specified timeline with high quality.",
    proposalDeadline: "2024-03-30T00:00:00",
    createdAt: "2024-02-20T10:30:00",
    userId: 1,
    projectId: 1,
    proposalStateId: 1, // 1: Pending, 2: Accepted, 3: Rejected
    project: {
    projectId: 1,
    projectTitle: "E-commerce Website Development",
    projectDeadline: "2024-04-15T00:00:00",
    minBudget: 1000,
    maxBudget: 2000,
    projectDescription: "Looking for an experienced developer to build a modern e-commerce platform",
    projectStateId: 1
    }
},
// Add more mock proposals as needed
];

const proposalStates = {
    1: { name: 'Open', color: 'blue' },
    2: { name: 'In progress', color: 'Yellow' },
    3: { name: 'Completed', color: 'green' },
    4: { name: 'Closed', color: 'red' }
};

const ProposalsTable = () => {
const [proposals, setProposals] = useState([]);
const [selectedProposal, setSelectedProposal] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'create'
const [formData, setFormData] = useState({
    proposalAmount: '',
    proposalDescription: '',
    proposalDeadline: '',
});
const [loading, setLoading] = useState(true);
const navigate = useNavigate();

useEffect(() => {
    fetchProposals();
}, []);

const fetchProposals = async () => {
    try {
    setLoading(true);

    const response = await axios.get(`/api/my_proposals/${JSON.parse(localStorage.getItem('userData')).userId[0]}`);
    setProposals(response.data.proposals);

    // setProposals(mockProposals);

    } catch (error) {
    toast.error('Failed to fetch proposals');
    } finally {
    setLoading(false);
    }
};

const handleCreate = () => {
    setModalMode('create');
    setSelectedProposal(null);
    setFormData({
    proposalAmount: '',
    proposalDescription: '',
    proposalDeadline: '',
    });
    setIsModalOpen(true);
};

const handleEdit = (proposal) => {
    setModalMode('edit');
    setSelectedProposal(proposal);
    setFormData({
    proposalAmount: proposal.proposalAmount,
    proposalDescription: proposal.proposalDescription,
    proposalDeadline: proposal.proposalDeadline,
    });
    setIsModalOpen(true);
};

const handleView = (proposal) => {
    setModalMode('view');
    setSelectedProposal(proposal);
    setIsModalOpen(true);
};

const handleDelete = async (proposalId) => {
    if (!window.confirm('Are you sure you want to delete this proposal?')) return;

    try {
    // Replace with your API call
    const res = await axios.delete(`/api/my_proposals/${proposalId}`);

    if(res.data.success){

        setProposals(proposals.filter(p => p.proposalId !== proposalId));
        toast.success('Proposal deleted successfully');
    }else{

        toast.error('Failed to delete proposal');
    }

    } catch (error) {
    toast.error('Failed to delete proposal');
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    if (modalMode === 'create') {

        // const response = await axios.post('/api/proposals', formData);
        // setProposals([...proposals, response.data]);
        // toast.success('Proposal created successfully');
    } else if (modalMode === 'edit') {

        const res = await axios.put(`/api/my_proposals/${selectedProposal.proposalId}`, formData);

        if(res.data.success){

            setProposals(proposals.map(p => 
                p.proposalId === selectedProposal.proposalId 
                    ? { ...p, ...formData }
                    : p
                ));
                toast.success('Proposal updated successfully');
        }else{

            toast.error(`Failed to ${modalMode} proposal`);
        }

    }

    setIsModalOpen(false);
    } catch (error) {
    toast.error(`Failed to ${modalMode} proposal`);
    }
};

const getStatusIcon = (stateId) => {
    switch (stateId) {
    case 2: // Accepted
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case 1: // Pending
        return <Clock className="w-5 h-5 text-yellow-500" />;
    case 3: // Rejected
        return <XCircle className="w-5 h-5 text-red-500" />;
    default:
        return null;
    }
};

if (loading) {
    return (
    <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
    </div>
    );
}


return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-200 border-1 rounded-lg border-violet-500 py-10 mt-15 ">
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-900 py-3">My Proposals</h1>
            {/* <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
            
            </button> */}
        </div>
        </div>

        <div className="overflow-x-auto ">
        <table className="min-w-full divide-y divide-gray-200 overflow-hidden">
            <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {proposals.map((proposal) => (
                <tr key={proposal.proposalId}  className=" hover:bg-black/10 hover:scale-101 transition-all ">
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{proposal.project.projectTitle}</div>
                    <div className="text-sm text-gray-500">${proposal.project.minBudget} - ${proposal.project.maxBudget}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${proposal.proposalAmount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {proposal.proposalDeadline} Days
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                    {getStatusIcon(proposal.proposalStateId)}
                    <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${proposal.proposalStateId === 2 ? 'bg-green-50 text-green-700 border-green-200' :
                        proposal.proposalStateId === 1 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        'bg-red-50 text-red-700 border-red-200'}`}>
                        {proposalStates[proposal.proposalStateId].name}
                    </span>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                    <button
                        onClick={() => handleView(proposal)}
                        className="text-gray-600 hover:text-gray-900 transition-colors hover:cursor-pointer"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => navigate('/proposals', { state: { projectData: proposal.project } })}
                        className="text-gray-600 hover:text-gray-900 transition-colors hover:cursor-pointer"
                    >
                        <SquareArrowOutUpRight  className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleEdit(proposal)}
                        className="text-violet-600 hover:text-violet-900 transition-colors hover:cursor-pointer"
                    >
                        <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleDelete(proposal.proposalId)}
                        className="text-red-600 hover:text-red-900 transition-colors hover:cursor-pointer"
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
    </div>
    
    {/* Modal */}
    {isModalOpen && (
        <div className="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative">
            <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
            <X className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-6">
            {modalMode === 'view' ? 'Proposal Details' :
            modalMode === 'edit' ? 'Edit Proposal' : 'Create Proposal'}
            </h3>

            {modalMode === 'view' ? (
            <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Project Details</h4>
                <p className="text-lg font-medium text-gray-900 mb-1">{selectedProposal.project.projectTitle}</p>
                <p className="text-sm text-gray-600 ">{selectedProposal.project.projectDescription}</p>
                <div className="mt-3 flex items-center text-sm text-gray-500">
                    <span className="mr-4">Budget: ${selectedProposal.project.minBudget} - ${selectedProposal.project.maxBudget}</span>
                    <span>Deadline: {format(new Date(selectedProposal.project.projectDeadline), 'MMM dd, yyyy')}</span>
                </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                <div>
                    <p className="text-sm font-medium text-gray-500">Proposal Amount</p>
                    <p className="mt-1 text-lg font-medium text-gray-900">${selectedProposal.proposalAmount}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <div className="mt-1 flex items-center">
                    {getStatusIcon(selectedProposal.proposalStateId)}
                    <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${proposalStates[selectedProposal.proposalStateId].color === 'green' ? 'bg-green-50 text-green-700 border-green-200' :
                        proposalStates[selectedProposal.proposalStateId].color === 'yellow' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        'bg-red-50 text-red-700 border-red-200'}`}>
                        {proposalStates[selectedProposal.proposalStateId].name}
                    </span>
                    </div>
                </div>
                </div>

                <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Proposal Description</p>
                <p className="text-gray-900">{selectedProposal.proposalDescription}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                <div>
                    <p className="text-sm font-medium text-gray-500">Submitted On</p>
                    <p className="mt-1 text-gray-900">
                    {format(new Date(selectedProposal.createdAt), 'MMMM dd, yyyy')}
                    </p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Proposal Deadline</p>
                    <p className="mt-1 text-gray-900">
                    {selectedProposal.proposalDeadline} Days
                    </p>
                </div>
                </div>
            </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposal Amount
                </label>
                <input
                    type="number"
                    value={formData.proposalAmount}
                    onChange={(e) => setFormData({ ...formData, proposalAmount: e.target.value })}
                    className="w-full rounded-lg border-gray-300 ring-2 ring-blue-500 focus:ring-violet-500 focus:border-violet-500 p-3"
                    required
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposal Description
                </label>
                <textarea
                    value={formData.proposalDescription}
                    onChange={(e) => setFormData({ ...formData, proposalDescription: e.target.value })}
                    rows={8}
                    className="w-full rounded-lg border-gray-300 ring-2 ring-blue-500 focus:ring-violet-500 focus:border-violet-500 p-3"
                    required
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposal Deadline
                </label>
                <input
                    type="number"
                    value={formData.proposalDeadline}
                    onChange={(e) => setFormData({ ...formData, proposalDeadline: e.target.value })}
                    className="w-full rounded-lg border-gray-300 ring-2 ring-blue-500 focus:ring-violet-500 focus:border-violet-500 p-3 "
                    required
                />
                </div>

                <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                >
                    {modalMode === 'edit' ? 'Save Changes' : 'Create Proposal'}
                </button>
                </div>
            </form>
            )}
        </div>
        </div>
    )}
    </div>
);
};

export default ProposalsTable;


