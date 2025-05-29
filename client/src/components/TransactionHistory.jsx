import React, { useState } from 'react';
import { format } from 'date-fns';
import { Eye, Search, ArrowUpDown, CheckCircle2, XCircle, Clock } from 'lucide-react';

// Mock data for demonstration
const mockBills = [
{
    billId: 'BILL-001',
    generatedTime: '2024-02-15T10:30:00',
    amount: 1500.00,
    description: 'Web Development Services - January',
    status: 'paid',
    projectId: 'PRJ-001',
    projectName: 'E-commerce Website'
},
{
    billId: 'BILL-002',
    generatedTime: '2024-02-20T14:45:00',
    amount: 2000.00,
    description: 'Mobile App Development - Sprint 1',
    status: 'pending',
    projectId: 'PRJ-002',
    projectName: 'Mobile App'
},
{
    billId: 'BILL-003',
    generatedTime: '2024-02-25T09:15:00',
    amount: 800.00,
    description: 'UI/UX Design Services',
    status: 'paid',
    projectId: 'PRJ-003',
    projectName: 'Dashboard Redesign'
}
];

const mockPayments = [
{
    paymentId: 'PAY-001',
    amountMoney: 1500.00,
    paidTime: '2024-02-16T11:30:00',
    status: 'completed',
    projectId: 'PRJ-001',
    billId: 'BILL-001',
    method: 'bank_transfer'
},
{
    paymentId: 'PAY-002',
    amountMoney: 800.00,
    paidTime: '2024-02-26T10:20:00',
    status: 'completed',
    projectId: 'PRJ-003',
    billId: 'BILL-003',
    method: 'credit_card'
}
];

const TransactionsHistory = () => {
const [activeTab, setActiveTab] = useState('all');
const [searchTerm, setSearchTerm] = useState('');
const [selectedTransaction, setSelectedTransaction] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [sortConfig, setSortConfig] = useState({
    key: 'generatedTime',
    direction: 'desc'
});

const handleSort = (key) => {
    setSortConfig({
    key,
    direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
};

const filterTransactions = () => {
    let transactions = [];
    
    if (activeTab === 'all' || activeTab === 'bills') {
    transactions = [...mockBills.map(bill => ({
        ...bill,
        type: 'bill',
        amount: bill.amount,
        date: bill.generatedTime
    }))];
    }
    
    if (activeTab === 'all' || activeTab === 'payments') {
    transactions = [...transactions, ...mockPayments.map(payment => ({
        ...payment,
        type: 'payment',
        amount: payment.amountMoney,
        date: payment.paidTime
    }))];
    }

    // Apply search filter
    if (searchTerm) {
    transactions = transactions.filter(transaction => 
        transaction.type.includes(searchTerm.toLowerCase()) ||
        transaction.status.includes(searchTerm.toLowerCase()) ||
        (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transaction.projectName && transaction.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    }

    // Apply sorting
    transactions.sort((a, b) => {
    if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    return sortConfig.direction === 'asc' 
        ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
        : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
    });

    return transactions;
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
            onClick={() => setActiveTab('bills')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'bills'
                ? 'bg-violet-100 text-violet-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            >
            Bills
            </button>
            <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'payments'
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
            <tr key={transaction.type === 'bill' ? transaction.billId : transaction.paymentId} className="hover:bg-gray-50">
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
                {transaction.projectName || `Project ${transaction.projectId}`}
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

    {/* Transaction Details Modal */}
    {isModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                {selectedTransaction.type === 'bill' ? selectedTransaction.billId : selectedTransaction.paymentId}
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
                {selectedTransaction.projectName || `Project ${selectedTransaction.projectId}`}
                </p>
            </div>

            {selectedTransaction.description && (
                <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="mt-1 text-sm text-gray-900">{selectedTransaction.description}</p>
                </div>
            )}

            {selectedTransaction.type === 'payment' && (
                <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Payment Method</p>
                <p className="mt-1 text-sm text-gray-900 capitalize">
                    {selectedTransaction.method.replace('_', ' ')}
                </p>
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