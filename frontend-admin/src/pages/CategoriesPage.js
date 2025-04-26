import React, { useState, useEffect } from 'react';
import { categoriesApi } from '../services/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [formError, setFormError] = useState('');

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoriesApi.getAll(currentPage);
            setCategories(data.content);
            setTotalPages(data.totalPages);
            setError(null);
        } catch (err) {
            setError('Failed to load categories. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleCreateNew = () => {
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
        setFormError('');
        setModalOpen(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || ''
        });
        setFormError('');
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await categoriesApi.delete(id);
                fetchCategories();
            } catch (err) {
                setError('Failed to delete category. Please try again.');
                console.error(err);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!formData.name.trim()) {
            setFormError('Category name is required');
            return;
        }

        try {
            if (editingCategory) {
                await categoriesApi.update(editingCategory.id, formData);
            } else {
                await categoriesApi.create(formData);
            }
            setModalOpen(false);
            fetchCategories();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setFormError('A category with this name already exists');
            } else {
                setFormError('Failed to save category. Please try again.');
            }
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
                <button
                    onClick={handleCreateNew}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Add Category
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center">
                    <div className="loader">Loading...</div>
                </div>
            ) : (
                <>
                    <div className="flex flex-col">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ID
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Description
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {categories.length > 0 ? (
                                                categories.map((category) => (
                                                    <tr key={category.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {category.id}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-500">{category.description || '-'}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => handleEdit(category)}
                                                                className="text-primary-600 hover:text-primary-900 mr-4"
                                                            >
                                                                <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(category.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <TrashIcon className="h-5 w-5" aria-hidden="true" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                        No categories found
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
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4">
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Previous
                                </button>
                                {[...Array(totalPages).keys()].map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === page ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        {page + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages - 1}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    )}
                </>
            )}

            {/* Modal for Create/Edit */}
            {modalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setModalOpen(false)}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                {editingCategory ? 'Edit Category' : 'Create New Category'}
                                            </h3>
                                            <div className="mt-4 space-y-4">
                                                {formError && (
                                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                                        <span className="block sm:inline">{formError}</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                        Name*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                                        Description
                                                    </label>
                                                    <textarea
                                                        id="description"
                                                        name="description"
                                                        rows="3"
                                                        value={formData.description}
                                                        onChange={handleChange}
                                                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {editingCategory ? 'Save Changes' : 'Create Category'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoriesPage; 