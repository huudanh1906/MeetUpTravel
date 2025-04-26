import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tourPricingApi, toursApi } from '../services/api';

function TourPricingPage() {
    const { tourId } = useParams();
    const navigate = useNavigate();

    const [tourPricings, setTourPricings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tourDetails, setTourDetails] = useState(null);

    const [form, setForm] = useState({
        customerType: '',
        price: '',
        isRoundTrip: false
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch tour details
                const tourData = await toursApi.getById(tourId);
                setTourDetails(tourData);

                // Fetch tour pricings
                const pricingsData = await tourPricingApi.getByTourId(tourId);
                setTourPricings(pricingsData);
            } catch (err) {
                console.error('Error fetching data', err);
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tourId]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFormToggle = () => {
        setShowForm(!showForm);
        // Reset form state when toggling
        if (!showForm) {
            setForm({
                customerType: '',
                price: '',
                isRoundTrip: false
            });
            setIsEditing(false);
            setEditId(null);
            setFormError(null);
            setFormSuccess(null);
        }
    };

    const handleEditClick = (pricing) => {
        setForm({
            customerType: pricing.customerType,
            price: pricing.price.toString(),
            isRoundTrip: pricing.isRoundTrip
        });
        setIsEditing(true);
        setEditId(pricing.id);
        setShowForm(true);
        setFormError(null);
        setFormSuccess(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);

        try {
            const pricingData = {
                ...form,
                price: parseFloat(form.price)
            };

            if (isEditing) {
                await tourPricingApi.update(editId, pricingData);
                setFormSuccess('Pricing option updated successfully!');
            } else {
                await tourPricingApi.create(tourId, pricingData);
                setFormSuccess('New pricing option added successfully!');
            }

            // Refresh the pricing data
            const pricingsData = await tourPricingApi.getByTourId(tourId);
            setTourPricings(pricingsData);

            // Reset form after successful submit
            setTimeout(() => {
                setForm({
                    customerType: '',
                    price: '',
                    isRoundTrip: false
                });
                setIsEditing(false);
                setEditId(null);
                setShowForm(false);
                setFormSuccess(null);
            }, 1500);
        } catch (err) {
            console.error('Error saving pricing', err);
            setFormError(err.response?.data?.message || 'Failed to save pricing. Please check your inputs and try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this pricing option?')) {
            try {
                await tourPricingApi.delete(id);
                // Refresh the pricing data
                const pricingsData = await tourPricingApi.getByTourId(tourId);
                setTourPricings(pricingsData);
            } catch (err) {
                console.error('Error deleting pricing', err);
                setError('Failed to delete pricing. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <div className="py-6">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Pricing for {tourDetails?.title}
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage pricing options for this tour
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button
                        type="button"
                        onClick={() => navigate(`/tours`)}
                        className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Back to Tours
                    </button>
                    <button
                        type="button"
                        onClick={handleFormToggle}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        {showForm ? 'Cancel' : 'Add Pricing Option'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-4 rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{error}</div>
                </div>
            )}

            {showForm && (
                <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {isEditing ? 'Edit Pricing Option' : 'Add New Pricing Option'}
                        </h3>

                        {formError && (
                            <div className="mt-4 rounded-md bg-red-50 p-4">
                                <div className="text-sm text-red-700">{formError}</div>
                            </div>
                        )}

                        {formSuccess && (
                            <div className="mt-4 rounded-md bg-green-50 p-4">
                                <div className="text-sm text-green-700">{formSuccess}</div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div>
                                    <label htmlFor="customerType" className="block text-sm font-medium text-gray-700">
                                        Customer Type
                                    </label>
                                    <input
                                        type="text"
                                        name="customerType"
                                        id="customerType"
                                        value={form.customerType}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter customer type (e.g., Adult, Child, Student)"
                                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name="price"
                                        id="price"
                                        value={form.price}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                <div className="flex items-center h-full pt-5">
                                    <input
                                        id="isRoundTrip"
                                        name="isRoundTrip"
                                        type="checkbox"
                                        checked={form.isRoundTrip}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="isRoundTrip" className="ml-2 block text-sm text-gray-900">
                                        Round Trip
                                    </label>
                                </div>

                                <div className="sm:col-span-3 flex justify-end">
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    >
                                        {isEditing ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Pricing Options
                    </h3>
                    {tourPricings.length > 0 ? (
                        <div className="mt-4 flex flex-col">
                            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Customer Type
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Price ($)
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Round Trip
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {tourPricings.map((pricing) => (
                                                    <tr key={pricing.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {pricing.customerType}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            ${pricing.price.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {pricing.isRoundTrip ? 'Yes' : 'No'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => handleEditClick(pricing)}
                                                                className="text-primary-600 hover:text-primary-900 mr-4"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(pricing.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4 text-center py-6 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No pricing options found for this tour.</p>
                            {!showForm && (
                                <button
                                    type="button"
                                    onClick={() => setShowForm(true)}
                                    className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    Add Pricing Option
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TourPricingPage; 