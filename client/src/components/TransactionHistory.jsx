import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Eye, Search, ArrowUpDown, CheckCircle2, XCircle, Clock } from 'lucide-react';
import axios from 'axios';

const TransactionsHistory = ({ userId = JSON.parse(localStorage.getItem('userData')).userId[0] }) => {
const [activeTab, setActiveTab] = useState('all');
const [searchTerm, setSearchTerm] = useState('');
const [selectedTransaction, setSelectedTransaction] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
});
const [transactions, setTransactions] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    const fetchTransactions = async () => {
    try {
        setIsLoading(true);
        const response = await axios.get(`/api/payments/${userId}`);
        
        if (response.data.success) {

        const transformedData = [
            ...response.data.payments.map(payment => ({
                type: 'payment',
                id: payment.paymentId,
                amount: payment.paymentAmount,
                date: payment.paidTime,
                status: payment.paymentStatus.toLowerCase(),
                projectId: payment.projectId,
                method: payment.paymentMethod,
                transactionId: payment.transactionId
            })),
            ...response.data.bills.map(bill => ({
                type: 'bill',
                id: bill.billId,
                amount: bill.subtotal + (bill.subtotal * bill.tax),
                date: response.data.payments.find(p => p.paymentId === bill.paymentId)?.paidTime || new Date().toISOString(),
                status: 'paid', // Assuming bills are always paid if they exist
                projectId: response.data.payments.find(p => p.paymentId === bill.paymentId)?.projectId,
                billUrl: bill.billUrl,
                tax: bill.tax,
                subtotal: bill.subtotal
            }))
        ];
        
        setTransactions(transformedData);
        } else {
        setError(response.data.error || 'Failed to fetch transactions');
        }
    } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(err.message || 'Failed to fetch transactions');
    } finally {
        setIsLoading(false);
    }
    };

    if (userId) {
    fetchTransactions();
    }
}, [userId]);

const handleSort = (key) => {
    setSortConfig({
    key,
    direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
};

const filterTransactions = () => {
    let filtered = [...transactions];
    
    // Apply tab filter
    if (activeTab !== 'all') {
    filtered = filtered.filter(t => t.type === activeTab);
    }
    
    // Apply search filter
    if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(t => 
        t.type.includes(term) ||
        t.status.includes(term) ||
        (t.method && t.method.toLowerCase().includes(term)) ||
        (t.projectId && t.projectId.toString().toLowerCase().includes(term))
    );
    }

    // Apply sorting
    filtered.sort((a, b) => {
    if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    return sortConfig.direction === 'asc' 
        ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
        : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
    });

    return filtered;
};

const getStatusIcon = (status) => {
    switch (status) {
    case 'completed':
    case 'paid':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
    default:
        return null;
    }
};

const getStatusClass = (status) => {
    switch (status) {
    case 'completed':
    case 'paid':
        return 'bg-green-50 text-green-700 border-green-200';
    case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
    default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
};

const getProjectName = (projectId) => {
    // In a real app, you might fetch project names from another API
    return `Project ${projectId}`;
};

if (isLoading) {
    return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
    </div>
    );
}

if (error) {
    return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
        Error: {error}
        </div>
    </div>
    );
}

return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Transactions History</h2>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex space-x-2">
            <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'all'
                ? 'bg-violet-100 text-violet-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            >
            All Transactions
            </button>
            <button
            onClick={() => setActiveTab('bill')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'bill'
                ? 'bg-violet-100 text-violet-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            >
            Bills
            </button>
            <button
            onClick={() => setActiveTab('payment')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'payment'
                ? 'bg-violet-100 text-violet-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            >
            Payments
            </button>
        </div>
        
        <div className="relative w-full sm:w-auto">
            <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        </div>
    </div>

    {filterTransactions().length === 0 ? (
        <div className="text-center py-12">
        <p className="text-gray-500">No transactions found</p>
        </div>
    ) : (
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('date')}>
                <div className="flex items-center">
                    Date
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('amount')}>
                <div className="flex items-center">
                    Amount
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
                </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {filterTransactions().map((transaction) => (
                <tr key={`${transaction.type}-${transaction.id}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize font-medium text-gray-900">
                    {transaction.type}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(transaction.date), 'MMM dd, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                    ${transaction.amount.toFixed(2)}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                    {getStatusIcon(transaction.status)}
                    <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getProjectName(transaction.projectId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                    onClick={() => {
                        setSelectedTransaction(transaction);
                        setIsModalOpen(true);
                    }}
                    className="text-violet-600 hover:text-violet-900 transition-colors"
                    >
                    <Eye className="h-5 w-5" />
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    )}

    {/* Transaction Details Modal */}
    {isModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative">
            <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
            <XCircle className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-6">
            Transaction Details
            </h3>

            <div className="grid grid-cols-2 gap-6">
            <div>
                <p className="text-sm font-medium text-gray-500">Type</p>
                <p className="mt-1 text-sm text-gray-900 capitalize">{selectedTransaction.type}</p>
            </div>

            <div>
                <p className="text-sm font-medium text-gray-500">ID</p>
                <p className="mt-1 text-sm text-gray-900">
                {selectedTransaction.id}
                </p>
            </div>

            <div>
                <p className="text-sm font-medium text-gray-500">Amount</p>
                <p className="mt-1 text-sm text-gray-900">${selectedTransaction.amount.toFixed(2)}</p>
            </div>

            <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="mt-1 flex items-center">
                {getStatusIcon(selectedTransaction.status)}
                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(selectedTransaction.status)}`}>
                    {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                </span>
                </div>
            </div>

            <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="mt-1 text-sm text-gray-900">
                {format(new Date(selectedTransaction.date), 'MMMM dd, yyyy HH:mm')}
                </p>
            </div>

            <div>
                <p className="text-sm font-medium text-gray-500">Project</p>
                <p className="mt-1 text-sm text-gray-900">
                {getProjectName(selectedTransaction.projectId)}
                </p>
            </div>

            {selectedTransaction.type === 'payment' && selectedTransaction.method && (
                <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Payment Method</p>
                <p className="mt-1 text-sm text-gray-900 capitalize">
                    {selectedTransaction.method.replace('_', ' ')}
                </p>
                </div>
            )}

            {selectedTransaction.type === 'bill' && selectedTransaction.billUrl && (
                <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Bill</p>
                <a 
                    href={selectedTransaction.billUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-1 text-sm text-violet-600 hover:underline"
                >
                    View Bill PDF
                </a>
                </div>
            )}
            </div>

            <div className="mt-8 flex justify-end">
            <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
                Close
            </button>
            </div>
        </div>
        </div>
    )}
    </div>
);
};

export default TransactionsHistory;