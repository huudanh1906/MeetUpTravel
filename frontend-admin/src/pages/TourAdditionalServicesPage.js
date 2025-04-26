import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toursApi } from '../services/api';

function TourAdditionalServicesPage() {
    const { tourId } = useParams();
    const navigate = useNavigate();

    const [tour, setTour] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Form for new service
    const [newService, setNewService] = useState({
        name: '',
        description: '',
        price: '',
        priceUnit: 'USD'
    });

    // State for editing service
    const [editingService, setEditingService] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch tour details
                const tourData = await toursApi.getById(tourId);
                setTour(tourData);
                console.log('Tour data:', tourData);

                // Check if tour has additionalServices property in the response
                if (tourData && tourData.additionalServices) {
                    console.log('Tour additional services:', tourData.additionalServices);
                    // Use the additionalServices directly from the tour data
                    setServices(Array.isArray(tourData.additionalServices)
                        ? tourData.additionalServices
                        : []);
                } else {
                    // Fallback to separate API call if not found in tour data
                    const tourServices = await toursApi.getAdditionalServices(tourId);
                    console.log('Tour services data from separate API call:', tourServices);

                    // Ensure we have an array, even if empty
                    let servicesArray = [];
                    if (Array.isArray(tourServices)) {
                        servicesArray = tourServices;
                    } else if (tourServices && typeof tourServices === 'object') {
                        // Handle case where API returns an object instead of array
                        servicesArray = [tourServices];
                    }

                    setServices(servicesArray);
                }
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
        const { name, value } = e.target;
        if (isEditing) {
            setEditingService({
                ...editingService,
                [name]: value
            });
        } else {
            setNewService({
                ...newService,
                [name]: value
            });
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();

        if (!newService.name.trim()) {
            setError('Service name is required');
            return;
        }

        try {
            setError(null);
            // Create new service and add it to tour
            const serviceData = {
                ...newService,
                price: parseFloat(newService.price) || 0
            };

            // Log request
            console.log('Sending service data:', serviceData);

            const createdService = await toursApi.createAdditionalService(tourId, serviceData);
            console.log('Created service:', createdService);

            setSuccess('Service added to tour successfully');

            // Add the new service to the existing services immediately
            setServices(prevServices => [...prevServices, createdService]);

            // Reset form
            setNewService({
                name: '',
                description: '',
                price: '',
                priceUnit: 'USD'
            });

            // Clear success message after delay
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error adding service to tour', err);
            setError(err.response?.data?.message || 'Failed to add service to tour');
        }
    };

    const handleEditService = (service) => {
        setIsEditing(true);
        // Set the service being edited with the correct format
        setEditingService({
            id: service.id || service.serviceId || service.additionalServiceId,
            name: service.name,
            description: service.description || '',
            price: service.price.toString(),
            priceUnit: service.priceUnit || 'USD'
        });
    };

    const handleUpdateService = async (e) => {
        e.preventDefault();

        if (!editingService.name.trim()) {
            setError('Service name is required');
            return;
        }

        try {
            setError(null);
            const serviceId = editingService.id;
            const serviceData = {
                ...editingService,
                price: parseFloat(editingService.price) || 0
            };

            // Log request
            console.log('Updating service data:', serviceData);

            const updatedService = await toursApi.updateAdditionalService(tourId, serviceId, serviceData);
            console.log('Updated service:', updatedService);

            setSuccess('Service updated successfully');

            // Update the service in the existing services list
            setServices(prevServices => prevServices.map(service =>
                (service.id === serviceId || service.serviceId === serviceId || service.additionalServiceId === serviceId)
                    ? updatedService
                    : service
            ));

            // Reset editing state
            setIsEditing(false);
            setEditingService(null);

            // Clear success message after delay
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error updating service', err);
            setError(err.response?.data?.message || 'Failed to update service');
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingService(null);
    };

    const handleRemoveService = async (serviceId) => {
        if (!window.confirm('Are you sure you want to remove this service from the tour?')) {
            return;
        }

        // Ask if user also wants to delete the service completely
        const deleteService = window.confirm(
            'Do you also want to delete this service completely from the system?\n\n' +
            'Yes: Delete the service from the entire system\n' +
            'No: Only remove the service from this tour'
        );

        try {
            setError(null);
            await toursApi.removeAdditionalService(tourId, serviceId, deleteService);

            if (deleteService) {
                setSuccess('Service completely deleted from system');
            } else {
                setSuccess('Service removed from tour successfully');
            }

            // Update services after removal
            setServices(prevServices => prevServices.filter(service =>
                (service.id !== serviceId && service.serviceId !== serviceId && service.additionalServiceId !== serviceId)
            ));

            // Clear success message after delay
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error removing service from tour', err);
            setError(err.response?.data?.message || 'Failed to remove service from tour');
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
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate(`/tours`)}
                            className="mr-2 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-900"
                        >
                            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Back to Tour
                        </button>
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-900 mt-2">
                        Additional Services for {tour?.title}
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage additional services offered with this tour
                    </p>
                </div>
            </div>

            {error && (
                <div className="mt-4 rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{error}</div>
                </div>
            )}

            {success && (
                <div className="mt-4 rounded-md bg-green-50 p-4">
                    <div className="text-sm text-green-700">{success}</div>
                </div>
            )}

            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {isEditing ? 'Edit Service' : 'Add Service to Tour'}
                    </h3>
                    <form onSubmit={isEditing ? handleUpdateService : handleAddService} className="mt-4">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Service Name*
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={isEditing ? editingService.name : newService.name}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    name="description"
                                    id="description"
                                    value={isEditing ? editingService.description : newService.description}
                                    onChange={handleInputChange}
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
                                    value={isEditing ? editingService.price : newService.price}
                                    onChange={handleInputChange}
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label htmlFor="priceUnit" className="block text-sm font-medium text-gray-700">
                                    Price Unit
                                </label>
                                <input
                                    type="text"
                                    name="priceUnit"
                                    id="priceUnit"
                                    value={isEditing ? editingService.priceUnit : newService.priceUnit}
                                    onChange={handleInputChange}
                                    placeholder="USD, Per Person, Per Day, etc."
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Examples: USD, EUR, VND, Per Person, Per Day, Per Hour
                                </p>
                            </div>

                            <div className="sm:col-span-2 flex justify-end space-x-3">
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    {isEditing ? 'Update Service' : 'Add Service'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Tour Services
                    </h3>
                    {services.length > 0 ? (
                        <div className="mt-4 flex flex-col">
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
                                                        Description
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Price
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {services.map((service) => (
                                                    <tr key={service.id || service.serviceId || service.additionalServiceId || Math.random()}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {service.name}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                            {service.description}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {service.price}$ / {service.priceUnit}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => handleEditService(service)}
                                                                className="text-primary-600 hover:text-primary-900 mr-4"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleRemoveService(service.id || service.serviceId || service.additionalServiceId)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Remove
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
                            <p className="text-gray-500">No additional services added to this tour yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TourAdditionalServicesPage; 