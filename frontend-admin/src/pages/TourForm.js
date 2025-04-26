import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toursApi, categoriesApi } from '../services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../quill-custom.css';

function TourForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const [form, setForm] = useState({
        title: '',
        description: '',
        scheduleDescription: '',
        price: '',
        duration: '',
        imageUrl: '',
        minPax: '',
        maxPax: '',
        featured: false,
        categories: [],
        highlights: [],
        includedServices: [],
        excludedServices: [],
        pickupPoints: [],
        images: [],
        availableGuides: [],
        youtubeUrl: ''
    });

    // Handle array fields (highlights, included/excluded services, pickup points)
    const [newItemValue, setNewItemValue] = useState({
        highlights: '',
        includedServices: '',
        excludedServices: '',
        pickupPoints: '',
        images: '',
        availableGuides: ''
    });

    // New state for schedule sections
    const [scheduleSections, setScheduleSections] = useState([]);
    const [newSection, setNewSection] = useState({
        title: '',
        content: '',
        imageUrl: ''
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const data = await categoriesApi.getAllList();
                setCategories(data);
            } catch (err) {
                console.error('Error fetching categories', err);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (isEditMode) {
            const fetchTour = async () => {
                try {
                    const tour = await toursApi.getById(id);
                    console.log('Tour data:', tour); // Log tour data for debugging

                    // Make sure all numeric fields are properly cast to strings for form inputs
                    setForm({
                        title: tour.title || '',
                        description: tour.description || '',
                        scheduleDescription: tour.scheduleDescription || '',
                        price: tour.price ? tour.price.toString() : '',
                        duration: tour.duration !== undefined ? tour.duration.toString() : '',
                        imageUrl: tour.imageUrl || '',
                        minPax: tour.minPax ? tour.minPax.toString() : '',
                        maxPax: tour.maxPax ? tour.maxPax.toString() : '',
                        featured: tour.featured || false,
                        categories: tour.categories || [],
                        highlights: tour.highlights || [],
                        includedServices: tour.includedServices || [],
                        excludedServices: tour.excludedServices || [],
                        pickupPoints: tour.pickupPoints || [],
                        images: tour.images || [],
                        availableGuides: tour.availableGuides || [],
                        youtubeUrl: tour.youtubeUrl || ''
                    });
                } catch (err) {
                    console.error('Error fetching tour details', err);
                    setError('Failed to load tour details. Please try again.');
                } finally {
                    setLoading(false);
                }
            };

            fetchTour();
        }
    }, [id, isEditMode]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleCategoryChange = (e) => {
        const categoryName = e.target.value;

        setForm(prevForm => {
            if (e.target.checked) {
                // Add category
                return {
                    ...prevForm,
                    categories: [...prevForm.categories, categoryName]
                };
            } else {
                // Remove category
                return {
                    ...prevForm,
                    categories: prevForm.categories.filter(name => name !== categoryName)
                };
            }
        });
    };

    // Handle array fields (highlights, included/excluded services, pickup points)
    const handleAddItem = (field) => {
        if (newItemValue[field].trim() !== '') {
            // For includedServices, excludedServices, pickupPoints and highlights handle multiline content
            if (field === 'includedServices' || field === 'excludedServices' || field === 'pickupPoints' || field === 'highlights') {
                // Split by newlines and filter out empty lines
                const items = newItemValue[field].split('\n')
                    .map(line => line.trim())
                    .filter(line => line !== '');

                setForm(prevForm => ({
                    ...prevForm,
                    [field]: [...prevForm[field], ...items]
                }));
            } else {
                // Handle other fields normally
                setForm(prevForm => ({
                    ...prevForm,
                    [field]: [...prevForm[field], newItemValue[field].trim()]
                }));
            }

            setNewItemValue({
                ...newItemValue,
                [field]: ''
            });
        }
    };

    const handleRemoveItem = (field, index) => {
        setForm(prevForm => ({
            ...prevForm,
            [field]: prevForm[field].filter((_, i) => i !== index)
        }));
    };

    const handleItemChange = (field, value) => {
        setNewItemValue({
            ...newItemValue,
            [field]: value
        });
    };

    // Handle rich text content for description and scheduleDescription
    const handleRichTextChange = (fieldName, value) => {
        setForm(prevForm => ({
            ...prevForm,
            [fieldName]: value
        }));
    };

    // Handler for schedule section fields
    const handleSectionChange = (field, value) => {
        setNewSection(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Add a new schedule section
    const addScheduleSection = () => {
        if (newSection.title.trim() !== '' && newSection.content.trim() !== '') {
            setScheduleSections([...scheduleSections, { ...newSection }]);
            setNewSection({ title: '', content: '', imageUrl: '' });
        }
    };

    // Remove a schedule section
    const removeScheduleSection = (index) => {
        setScheduleSections(scheduleSections.filter((_, i) => i !== index));
    };

    // Compile all schedule sections into the HTML format for storage
    const compileScheduleDescription = () => {
        let compiledHtml = '';

        scheduleSections.forEach(section => {
            // Add a data attribute to identify this as a section title
            compiledHtml += `<p class="schedule-section-title" data-section-title="${section.title}"><strong>${section.title}</strong></p>`;

            // Process content to add width and height attributes to images
            let processedContent = section.content;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = processedContent;

            // Find all images and set width, height attributes
            const images = tempDiv.querySelectorAll('img');
            images.forEach(img => {
                img.width = 442;
                img.height = 248;
                img.style.objectFit = 'cover';
                img.classList.add('schedule-image');
            });

            compiledHtml += tempDiv.innerHTML;
            compiledHtml += '<p><br></p>';
        });

        return compiledHtml;
    };

    // Parse existing schedule description into sections when editing
    useEffect(() => {
        if (isEditMode && form.scheduleDescription) {
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(form.scheduleDescription, 'text/html');
                const parsedSections = [];

                // Find all section titles that have our specific marker class
                const sectionTitles = doc.querySelectorAll('.schedule-section-title, [data-section-title]');

                // If we don't find any sections with our marker, try the legacy approach
                if (sectionTitles.length === 0) {
                    // Legacy parsing logic - try to find logical section breaks
                    let currentSectionTitle = null;
                    let currentSectionContent = '';
                    let foundValidSection = false;

                    Array.from(doc.body.children).forEach((element, index) => {
                        // Check if this element contains a strong tag directly at the root of the paragraph
                        const strongElement = element.querySelector(':scope > strong');
                        if (element.tagName === 'P' && strongElement && element.textContent.trim() !== ''
                            && element.childNodes.length === 1 && strongElement.parentNode === element) {

                            // If we already have a section in progress, save it
                            if (currentSectionTitle && currentSectionContent) {
                                parsedSections.push({
                                    title: currentSectionTitle,
                                    content: currentSectionContent,
                                    imageUrl: ''
                                });
                                foundValidSection = true;
                            }

                            // Start a new section
                            currentSectionTitle = strongElement.textContent.trim();
                            currentSectionContent = '';
                        } else if (currentSectionTitle) {
                            // Add to current section content
                            currentSectionContent += element.outerHTML;
                        }
                    });

                    // Add the last section if we have one
                    if (currentSectionTitle && currentSectionContent) {
                        parsedSections.push({
                            title: currentSectionTitle,
                            content: currentSectionContent,
                            imageUrl: ''
                        });
                        foundValidSection = true;
                    }

                    // If we didn't find any valid sections with our logic,
                    // treat the entire content as a single section
                    if (!foundValidSection && doc.body.children.length > 0) {
                        // Check if there's any content that might be a title
                        const firstElem = doc.body.children[0];
                        let title = "Schedule Section";
                        let contentStart = 0;

                        if (firstElem.tagName === 'P' && firstElem.querySelector('strong')) {
                            title = firstElem.textContent.trim();
                            contentStart = 1;
                        }

                        // Collect all content after the potential title
                        let content = '';
                        for (let i = contentStart; i < doc.body.children.length; i++) {
                            content += doc.body.children[i].outerHTML;
                        }

                        if (content.trim() !== '') {
                            parsedSections.push({
                                title: title,
                                content: content,
                                imageUrl: ''
                            });
                        }
                    }
                } else {
                    // Modern parsing logic - use our section markers
                    sectionTitles.forEach((titleElem, index) => {
                        const title = titleElem.textContent.trim();
                        let content = '';
                        let currentElem = titleElem.nextElementSibling;

                        // Collect all content until the next section title or the end
                        while (currentElem &&
                            !currentElem.classList.contains('schedule-section-title') &&
                            !currentElem.hasAttribute('data-section-title')) {
                            content += currentElem.outerHTML;
                            currentElem = currentElem.nextElementSibling;
                        }

                        parsedSections.push({
                            title: title,
                            content: content,
                            imageUrl: ''
                        });
                    });
                }

                if (parsedSections.length > 0) {
                    setScheduleSections(parsedSections);
                    console.log('Parsed sections:', parsedSections);
                }
            } catch (error) {
                console.error('Error parsing schedule description:', error);
            }
        }
    }, [isEditMode, form.scheduleDescription]);

    // Quill modules configuration
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ]
    };

    const quillFormats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link', 'image'
    ];

    // Initialize Quill with custom image handler
    useEffect(() => {
        // Add a global handler for all Quill image buttons
        if (window.Quill) {
            // Only set up once
            if (!window.quillImageHandlerSet) {
                // Original image handler
                const originalImageHandler = window.Quill.prototype.getModule('toolbar').handlers.image;

                // Override image handler
                window.Quill.prototype.getModule('toolbar').handlers.image = function () {
                    const imageUrl = prompt('Enter the URL of the image:', 'https://cdn.meetup.travel/');
                    if (imageUrl) {
                        const range = this.quill.getSelection();
                        this.quill.insertEmbed(range.index, 'image', imageUrl);

                        // Set fixed dimensions for the inserted image
                        setTimeout(() => {
                            const images = document.querySelectorAll('.ql-editor img');
                            images.forEach(img => {
                                img.style.width = '442px';
                                img.style.height = '248px';
                                img.style.objectFit = 'cover';
                                // Add data attributes for dimensions
                                img.setAttribute('data-width', '442');
                                img.setAttribute('data-height', '248');
                            });
                        }, 10);
                    }
                };

                window.quillImageHandlerSet = true;
            }
        }
    }, []);

    // Custom CSS to apply to the Quill editor
    useEffect(() => {
        // Create a style element
        const style = document.createElement('style');
        style.textContent = `
            .ql-editor img {
                width: 442px !important;
                height: 248px !important;
                object-fit: cover;
            }
            
            .schedule-section img {
                width: 442px !important;
                height: 248px !important;
                object-fit: cover;
            }
        `;
        document.head.appendChild(style);

        // Cleanup
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            // Compile schedule sections into HTML format
            const compiledSchedule = compileScheduleDescription();

            // Convert numeric fields to appropriate types
            const tourData = {
                ...form,
                price: parseFloat(form.price),
                duration: parseInt(form.duration),
                minPax: parseInt(form.minPax),
                maxPax: parseInt(form.maxPax),
                scheduleDescription: compiledSchedule
            };

            if (isEditMode) {
                await toursApi.update(id, tourData);
                setSuccess(true);
                setTimeout(() => navigate('/tours'), 1500);
            } else {
                await toursApi.create(tourData);
                setSuccess(true);
                setTimeout(() => navigate('/tours'), 1500);
            }
        } catch (err) {
            console.error('Error saving tour', err);
            setError(err.response?.data?.message || 'Failed to save tour. Please check your inputs and try again.');
        }
    };

    // Add a function to handle the quick add image with fixed dimensions
    const addImageToContent = (imageUrl) => {
        if (!imageUrl) return;

        // Create image HTML with specific dimensions
        const imageHtml = `<p><img src="${imageUrl}" width="442" height="248" style="object-fit: cover;" class="schedule-image" /></p>`;

        // Update the content
        const updatedContent = newSection.content + imageHtml;
        handleSectionChange('content', updatedContent);
    };

    if (loading || loadingCategories) {
        return (
            <div className="py-6">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="py-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    {isEditMode ? 'Edit Tour' : 'Create New Tour'}
                </h1>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
                    <div className="text-sm text-red-700">{error}</div>
                </div>
            )}

            {success && (
                <div className="rounded-md bg-green-50 p-4 mb-6">
                    <div className="text-sm text-green-700">
                        Tour successfully {isEditMode ? 'updated' : 'created'}! Redirecting...
                    </div>
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="col-span-2">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={form.title}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <div className="mt-1">
                                    <ReactQuill
                                        theme="snow"
                                        value={form.description}
                                        onChange={(content) => handleRichTextChange('description', content)}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        className="h-64"
                                    />
                                </div>
                            </div>
                            <div></div>

                            <div className="col-span-2">
                                <label htmlFor="scheduleDescription" className="block text-sm font-medium text-gray-700">Schedule Description</label>
                                <div className="mt-1 border border-gray-300 rounded-md p-4">
                                    <div className="mb-4">
                                        <h3 className="text-sm font-medium mb-2">Add Schedule Sections</h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500">Section Title</label>
                                                <input
                                                    type="text"
                                                    value={newSection.title}
                                                    onChange={(e) => handleSectionChange('title', e.target.value)}
                                                    placeholder="e.g., Process: FAST TRACK"
                                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs text-gray-500">Section Content</label>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={newSection.content}
                                                    onChange={(content) => handleSectionChange('content', content)}
                                                    modules={quillModules}
                                                    formats={quillFormats}
                                                    className="h-32"
                                                />
                                            </div>

                                            <div className='mt-28'>
                                                <div className="text-xs text-gray-500 mb-2">
                                                    <span className="font-semibold">Tip:</span> You can now add images directly in the content editor above by clicking the image icon (📷) and entering the image URL.
                                                </div>
                                                <div className="flex rounded-md shadow-sm">
                                                    <input
                                                        type="url"
                                                        placeholder="Quick add image URL to content (optional)"
                                                        className="focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-l-md sm:text-sm border-gray-300"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            const imageUrl = e.target.previousSibling.value;
                                                            if (imageUrl) {
                                                                addImageToContent(imageUrl);
                                                                e.target.previousSibling.value = '';
                                                            }
                                                        }}
                                                        className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    All images will be displayed at 442×248 pixels
                                                </div>
                                            </div>

                                            <div>
                                                <button
                                                    type="button"
                                                    onClick={addScheduleSection}
                                                    className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                                >
                                                    Add Section
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="text-sm font-medium mb-2">Schedule Sections</h3>
                                        {scheduleSections.length === 0 ? (
                                            <p className="text-sm text-gray-500">No sections added yet.</p>
                                        ) : (
                                            <div className="space-y-4">
                                                {scheduleSections.map((section, index) => (
                                                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-medium">{section.title}</h4>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeScheduleSection(index)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                        <div
                                                            className="text-sm text-gray-700 mb-2 schedule-section"
                                                            dangerouslySetInnerHTML={{ __html: section.content }}
                                                        />
                                                        {section.imageUrl && (
                                                            <div className="mt-2">
                                                                <img
                                                                    src={section.imageUrl}
                                                                    alt={section.title}
                                                                    className="h-20 object-cover rounded-md"
                                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100?text=Error' }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className='mt-6'>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
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

                            <div className='mt-6'>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (days)</label>
                                <input
                                    type="number"
                                    min="0"
                                    name="duration"
                                    id="duration"
                                    value={form.duration}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="col-span-2">
                                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Main Image URL</label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    id="imageUrl"
                                    value={form.imageUrl}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="col-span-2">
                                <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700">YouTube Video URL</label>
                                <input
                                    type="url"
                                    name="youtubeUrl"
                                    id="youtubeUrl"
                                    value={form.youtubeUrl}
                                    onChange={handleInputChange}
                                    placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Add a YouTube video URL to display on the tour detail page.
                                </p>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Additional Images</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        type="url"
                                        value={newItemValue.images}
                                        onChange={(e) => handleItemChange('images', e.target.value)}
                                        className="focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                                        placeholder="Add image URL"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleAddItem('images')}
                                        className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="mt-2">
                                    {form.images.map((url, index) => (
                                        <div key={index} className="flex justify-between items-center bg-gray-50 py-1 px-2 rounded mb-1">
                                            <div className="flex items-center">
                                                <img
                                                    src={url}
                                                    alt={`Additional image ${index + 1}`}
                                                    className="h-10 w-10 object-cover mr-2 rounded"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100?text=Error' }}
                                                />
                                                <span className="text-sm truncate" style={{ maxWidth: '300px' }}>{url}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem('images', index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="minPax" className="block text-sm font-medium text-gray-700">Minimum Travelers</label>
                                <input
                                    type="number"
                                    min="1"
                                    name="minPax"
                                    id="minPax"
                                    value={form.minPax}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label htmlFor="maxPax" className="block text-sm font-medium text-gray-700">Maximum Travelers</label>
                                <input
                                    type="number"
                                    min="1"
                                    name="maxPax"
                                    id="maxPax"
                                    value={form.maxPax}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="col-span-2">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="featured"
                                            name="featured"
                                            type="checkbox"
                                            checked={form.featured}
                                            onChange={handleInputChange}
                                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="featured" className="font-medium text-gray-700">Featured Tour</label>
                                        <p className="text-gray-500">This tour will be displayed in the featured section on the homepage.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {categories.map(category => (
                                        <div key={category.id} className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id={`category-${category.id}`}
                                                    name={`category-${category.id}`}
                                                    type="checkbox"
                                                    value={category.name}
                                                    checked={form.categories.includes(category.name)}
                                                    onChange={handleCategoryChange}
                                                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor={`category-${category.id}`} className="font-medium text-gray-700">
                                                    {category.name}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {categories.length === 0 && (
                                    <p className="text-sm text-gray-500 mt-2">No categories available. <a href="/categories" className="text-primary-600 hover:text-primary-800">Create categories</a> first.</p>
                                )}
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Highlights</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <textarea
                                        rows={4}
                                        value={newItemValue.highlights}
                                        onChange={(e) => handleItemChange('highlights', e.target.value)}
                                        className="focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-l-md sm:text-sm border-gray-300"
                                        placeholder="Add highlights (one per line)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleAddItem('highlights')}
                                        className="inline-flex items-center px-3 self-stretch rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="mt-2">
                                    {form.highlights.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center bg-gray-50 py-1 px-2 rounded mb-1">
                                            <span className="text-sm">{item}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem('highlights', index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Included Services</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <textarea
                                        rows={4}
                                        value={newItemValue.includedServices}
                                        onChange={(e) => handleItemChange('includedServices', e.target.value)}
                                        className="focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-l-md sm:text-sm border-gray-300"
                                        placeholder="Add included services (one per line)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleAddItem('includedServices')}
                                        className="inline-flex items-center px-3 self-stretch rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="mt-2">
                                    {form.includedServices.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center bg-gray-50 py-1 px-2 rounded mb-1">
                                            <span className="text-sm">{item}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem('includedServices', index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Excluded Services</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <textarea
                                        rows={4}
                                        value={newItemValue.excludedServices}
                                        onChange={(e) => handleItemChange('excludedServices', e.target.value)}
                                        className="focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-l-md sm:text-sm border-gray-300"
                                        placeholder="Add excluded services (one per line)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleAddItem('excludedServices')}
                                        className="inline-flex items-center px-3 self-stretch rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="mt-2">
                                    {form.excludedServices.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center bg-gray-50 py-1 px-2 rounded mb-1">
                                            <span className="text-sm">{item}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem('excludedServices', index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Pickup Points</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <textarea
                                        rows={4}
                                        value={newItemValue.pickupPoints}
                                        onChange={(e) => handleItemChange('pickupPoints', e.target.value)}
                                        className="focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-l-md sm:text-sm border-gray-300"
                                        placeholder="Add pickup points (one per line)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleAddItem('pickupPoints')}
                                        className="inline-flex items-center px-3 self-stretch rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="mt-2">
                                    {form.pickupPoints.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center bg-gray-50 py-1 px-2 rounded mb-1">
                                            <span className="text-sm">{item}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem('pickupPoints', index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Available Guide Languages</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        value={newItemValue.availableGuides}
                                        onChange={(e) => handleItemChange('availableGuides', e.target.value)}
                                        className="focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                                        placeholder="Add guide language (e.g., English, Vietnamese)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleAddItem('availableGuides')}
                                        className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="mt-2">
                                    {form.availableGuides.map((language, index) => (
                                        <div key={index} className="flex justify-between items-center bg-gray-50 py-1 px-2 rounded mb-1">
                                            <span className="text-sm">{language}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem('availableGuides', index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-5">
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => navigate('/tours')}
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    {isEditMode ? 'Update Tour' : 'Create Tour'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TourForm; 