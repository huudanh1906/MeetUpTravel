import React, { useState, useEffect } from 'react';
import { usersApi } from '../services/api';

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        phoneNumber: '',
        password: ''
    });
    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword: ''
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            console.log('Fetching users with page:', page);
            const response = await usersApi.getAll(page, 10);
            console.log('Users response:', response);
            setUsers(response.content || []);
            setTotalPages(response.totalPages || 1);
        } catch (err) {
            console.error('Error fetching users', err);
            console.log('Error details:', JSON.stringify(err, null, 2));
            setError('Failed to load users. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // In a real app, you would implement search functionality
        // For simplicity, we're just filtering the current list
        console.log(`Searching for "${searchTerm}"`);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });
    };

    const openCreateModal = () => {
        setCurrentUser(null);
        setFormData({
            email: '',
            fullName: '',
            phoneNumber: '',
            password: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setCurrentUser(user);
        setFormData({
            email: user.email || '',
            fullName: user.fullName || '',
            phoneNumber: user.phoneNumber || '',
            password: ''
        });
        setIsModalOpen(true);
    };

    const openPasswordModal = (user) => {
        setCurrentUser(user);
        setPasswordData({
            password: '',
            confirmPassword: ''
        });
        setIsPasswordModalOpen(true);
    };

    const openDeleteModal = (user) => {
        setCurrentUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentUser) {
                // Update user
                await usersApi.update(currentUser.id, formData);
            } else {
                // Create user
                await usersApi.create(formData);
                setSuccessMessage('User created successfully');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (err) {
            console.error('Error saving user', err);
            setError('Failed to save user. Please try again later.');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.password !== passwordData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await usersApi.updatePassword(currentUser.id, passwordData.password);
            setIsPasswordModalOpen(false);
            setSuccessMessage('Password updated successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error updating password', err);
            setError('Failed to update password. Please try again later.');
        }
    };

    const handleDelete = async () => {
        try {
            await usersApi.delete(currentUser.id);
            setIsDeleteModalOpen(false);
            fetchUsers();
        } catch (err) {
            console.error('Error deleting user', err);
            setError('Failed to delete user. Please try again later.');
        }
    };

    const filteredUsers = searchTerm
        ? users.filter(
            user =>
                user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : users;

    if (loading && users.length === 0) {
        return (
            <div className="py-6">
                <div className="text-center">Loading users...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="py-6 md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
                </div>
                <div className="mt-4 md:mt-0 md:ml-4">
                    <form onSubmit={handleSearch} className="flex space-x-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search users..."
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Add User
                        </button>
                    </form>
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
                    <div className="text-sm text-red-700">{error}</div>
                </div>
            )}

            {successMessage && (
                <div className="rounded-md bg-green-50 p-4 mb-6">
                    <div className="text-sm text-green-700">{successMessage}</div>
                </div>
            )}

            {/* Users Table */}
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.phoneNumber || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="text-indigo-600 hover:text-indigo-900 mx-1"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => openPasswordModal(user)}
                                                    className="text-blue-600 hover:text-blue-900 mx-1"
                                                >
                                                    Set Password
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(user)}
                                                    className="text-red-600 hover:text-red-900 mx-1"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && !searchTerm && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 0}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= totalPages - 1}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{users.length > 0 ? page * 10 + 1 : 0}</span> to{' '}
                                <span className="font-medium">{page * 10 + users.length}</span> of{' '}
                                <span className="font-medium">
                                    {totalPages * 10}
                                </span>{' '}
                                results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => handlePageChange(0)}
                                    disabled={page === 0}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">First</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === i
                                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(totalPages - 1)}
                                    disabled={page >= totalPages - 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Last</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Create/Edit User Modal */}
            {isModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            {currentUser ? 'Edit User' : 'Create User'}
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 mb-4">Fields marked with * are required</p>
                                            <form onSubmit={handleSubmit}>
                                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                                    <div className="sm:col-span-6">
                                                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                                            Full Name *
                                                        </label>
                                                        <div className="mt-1">
                                                            <input
                                                                type="text"
                                                                name="fullName"
                                                                id="fullName"
                                                                required
                                                                value={formData.fullName}
                                                                onChange={handleInputChange}
                                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="sm:col-span-6">
                                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                            Email *
                                                        </label>
                                                        <div className="mt-1">
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                id="email"
                                                                required
                                                                value={formData.email}
                                                                onChange={handleInputChange}
                                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="sm:col-span-6">
                                                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                                            Phone Number
                                                        </label>
                                                        <div className="mt-1">
                                                            <input
                                                                type="text"
                                                                name="phoneNumber"
                                                                id="phoneNumber"
                                                                value={formData.phoneNumber}
                                                                onChange={handleInputChange}
                                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                            />
                                                        </div>
                                                    </div>

                                                    {!currentUser && (
                                                        <div className="sm:col-span-6">
                                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                                Password *
                                                            </label>
                                                            <div className="mt-1">
                                                                <input
                                                                    type="password"
                                                                    name="password"
                                                                    id="password"
                                                                    required
                                                                    value={formData.password}
                                                                    onChange={handleInputChange}
                                                                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                                    <button
                                                        type="submit"
                                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                                                    >
                                                        {currentUser ? 'Save Changes' : 'Create User'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                                        onClick={() => setIsModalOpen(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && currentUser && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Delete User
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete the user "{currentUser.fullName}"? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Update Modal */}
            {isPasswordModalOpen && currentUser && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Set Password for {currentUser.fullName}
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 mb-4">Fields marked with * are required</p>
                                            <form onSubmit={handlePasswordSubmit}>
                                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                                    <div className="sm:col-span-6">
                                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                            New Password *
                                                        </label>
                                                        <div className="mt-1">
                                                            <input
                                                                type="password"
                                                                name="password"
                                                                id="password"
                                                                required
                                                                value={passwordData.password}
                                                                onChange={handlePasswordInputChange}
                                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="sm:col-span-6">
                                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                                            Confirm Password *
                                                        </label>
                                                        <div className="mt-1">
                                                            <input
                                                                type="password"
                                                                name="confirmPassword"
                                                                id="confirmPassword"
                                                                required
                                                                value={passwordData.confirmPassword}
                                                                onChange={handlePasswordInputChange}
                                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                                    <button
                                                        type="submit"
                                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                                                    >
                                                        Update Password
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                                        onClick={() => setIsPasswordModalOpen(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UsersPage; 