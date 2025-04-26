import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TourCard from '../components/TourCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../tourDetailModal.css';
import '../tourDetailStyles.css';
import API_BASE_URL from '../config/api-config';

// Tour interfaces
interface AdditionalService {
    id: number;
    name: string;
    description: string;
    price: number;
    priceUnit: string;
}

interface TourPricing {
    id: number;
    customerType: string;
    price: number;
    isRoundTrip: boolean;
}

interface TourDetails {
    id: number;
    title: string;
    description: string;
    price: number;
    duration: number;
    rating: number;
    maxPax: number;
    minPax: number;
    location: string;
    imageUrl: string;
    images: string[];
    highlights: string[];
    includedServices: string[];
    excludedServices: string[];
    pickupPoints: string[];
    additionalServices: AdditionalService[];
    categories: string[];
    availableGuides: string[];
    pricingOptions: TourPricing[];
    scheduleDescription: string;
    youtubeUrl?: string;
}

const TourDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tour, setTour] = useState<TourDetails | null>(null);
    const [relatedToursData, setRelatedToursData] = useState<any[]>([]);

    // Add state for quantities
    const [quantities, setQuantities] = useState({
        adult: 0,
        childSmall: 0,
        childBig: 0,
        adultRoundTrip: 0,
        childRoundTrip: 0
    });

    // Define PricingQuantity interface here after quantities state
    interface PricingQuantity {
        id: number;
        quantityKey: keyof typeof quantities;
        amount: number;
    }

    // Add new states for pricing option quantities and mappings
    const [pricingQuantities, setPricingQuantities] = useState<PricingQuantity[]>([]);
    const [pricingKeyMap, setPricingKeyMap] = useState<Record<number, keyof typeof quantities>>({});

    // Add state for additional services quantities
    const [additionalServices, setAdditionalServices] = useState<Record<string, number>>({});

    // Add state for collapsible sections
    const [processExpanded, setProcessExpanded] = useState(true);
    const [offerExpanded, setOfferExpanded] = useState(true);
    const [transferExpanded, setTransferExpanded] = useState(true);
    const [chooseUsExpanded, setChooseUsExpanded] = useState(true);
    const [scheduleExpanded, setScheduleExpanded] = useState(true);

    // Add state for individual section expansion
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [scheduleSections, setScheduleSections] = useState<{ title: string, content: string }[]>([]);

    // Fetch tour data
    useEffect(() => {
        const fetchTourDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                // Fetch tour details
                const tourResponse = await fetch(`${API_BASE_URL}/tours/${id}`);

                if (!tourResponse.ok) {
                    throw new Error(`HTTP error! Status: ${tourResponse.status}`);
                }

                // Check for empty response
                const responseText = await tourResponse.text();
                if (!responseText || responseText.trim() === '') {
                    throw new Error('Empty response received from server');
                }

                // Parse JSON safely
                let tourData;
                try {
                    tourData = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('JSON parse error:', parseError);
                    throw new Error('Invalid JSON response from server');
                }

                setTour(tourData);

                try {
                    // Fetch additional services
                    const additionalServicesResponse = await fetch(`${API_BASE_URL}/tours/${id}/additional-services`);

                    if (additionalServicesResponse.ok) {
                        const responseText = await additionalServicesResponse.text();
                        if (responseText && responseText.trim() !== '') {
                            const additionalServicesData = JSON.parse(responseText);
                            setTour(prev => prev ? { ...prev, additionalServices: additionalServicesData } : null);
                        }
                    }
                } catch (servicesError) {
                    console.error('Error fetching additional services:', servicesError);
                    // Continue with main tour data even if additional services fail
                }

                try {
                    // Fetch related tours (could be based on same category or location)
                    const relatedResponse = await fetch(`${API_BASE_URL}/tours?page=0&size=4`);

                    if (relatedResponse.ok) {
                        const responseText = await relatedResponse.text();
                        if (responseText && responseText.trim() !== '') {
                            const relatedData = JSON.parse(responseText);

                            // Ensure each related tour has all required fields for TourCard
                            const formattedRelatedTours = relatedData.content.map((tour: any) => {
                                // Create a new object with all the tour properties
                                const formattedTour = { ...tour };

                                // Add or update the images array
                                formattedTour.images = tour.images?.length ? tour.images : tour.imageUrl ? [tour.imageUrl] : [];

                                return formattedTour;
                            });

                            setRelatedToursData(formattedRelatedTours || []);
                        }
                    }
                } catch (relatedError) {
                    console.error('Error fetching related tours:', relatedError);
                    // Continue with main functionality even if related tours fail
                }

                // Inside the successful fetch response handling:
                if (tourData.pricingOptions && tourData.pricingOptions.length > 0) {
                    const newPricingKeyMap: Record<number, keyof typeof quantities> = {};
                    const initialPricingQuantities: PricingQuantity[] = [];

                    tourData.pricingOptions.forEach((option: TourPricing) => {
                        let quantityKey: keyof typeof quantities;

                        if (option.isRoundTrip) {
                            quantityKey = option.customerType.toLowerCase().includes('child') ? 'childRoundTrip' : 'adultRoundTrip';
                        } else {
                            if (option.customerType.toLowerCase().includes('child')) {
                                quantityKey = option.customerType.toLowerCase().includes('0-2') ? 'childSmall' : 'childBig';
                            } else {
                                quantityKey = 'adult';
                            }
                        }

                        // Map pricing option id to quantity key
                        newPricingKeyMap[option.id] = quantityKey;

                        // Initialize pricing quantity with zero amount
                        initialPricingQuantities.push({
                            id: option.id,
                            quantityKey: quantityKey,
                            amount: 0
                        });
                    });

                    setPricingKeyMap(newPricingKeyMap);
                    setPricingQuantities(initialPricingQuantities);
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching tour details:', err);
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                setError(`Failed to load tour details: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchTourDetails();
    }, [id]);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
    // Add state for the greeting service slider
    const [greetingSlideIndex, setGreetingSlideIndex] = useState(0);
    const [isGreetingDragging, setIsGreetingDragging] = useState(false);
    const greetingStartX = useRef(0);

    // Add modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageIndex, setModalImageIndex] = useState(0);

    // Add state for active review tab
    const [activeReviewTab, setActiveReviewTab] = useState<'tripadvisor' | 'google'>('tripadvisor');

    // Add greeting service images
    const greetingImages = [
        {
            src: "https://cdn.meetup.travel/sign-connie-tang.jpg",
            alt: "Greeting with sign for Connie Tang",
            name: "Connie Tang"
        },
        {
            src: "https://cdn.meetup.travel/sign-taylor-nicolas.jpg",
            alt: "Greeting with sign for Taylor Nicolas Alexander",
            name: "TAYLOR NICOLAS ALEXANDER"
        },
        {
            src: "https://cdn.meetup.travel/sign-tran-conner.jpg",
            alt: "Greeting with sign for Tran Conner Khang",
            name: "TRAN CONNER KHANG"
        }
    ];

    const nextGreetingSlide = () => {
        // Áp dụng transition mượt trước khi thay đổi slide
        const slider = document.querySelector('.greeting-slider') as HTMLElement;
        if (slider) {
            slider.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
        // Đảm bảo luôn đến trang cuối cùng
        setGreetingSlideIndex(greetingImages.length - 1);
    };

    const prevGreetingSlide = () => {
        // Áp dụng transition mượt trước khi thay đổi slide
        const slider = document.querySelector('.greeting-slider') as HTMLElement;
        if (slider) {
            slider.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
        // Đảm bảo luôn về trang đầu tiên
        setGreetingSlideIndex(0);
    };

    const goToGreetingSlide = (index: number) => {
        setGreetingSlideIndex(index);
    };

    const openModal = (index: number) => {
        setModalImageIndex(index);
        setCurrentIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const nextModalImage = () => {
        if (tour && tour.images) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % tour.images.length);
        }
    };

    const prevModalImage = () => {
        if (tour && tour.images) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + tour.images.length) % tour.images.length);
        }
    };

    // Initialize additional services from API
    useEffect(() => {
        if (tour && tour.additionalServices) {
            setAdditionalServices(
                tour.additionalServices.reduce((acc, service) => {
                    acc[service.name] = 0;
                    return acc;
                }, {} as Record<string, number>)
            );
        }
    }, [tour]);

    // Update increaseQuantity to handle pricing option id
    const increaseQuantity = (type: keyof typeof quantities, pricingId?: number) => {
        if (pricingId !== undefined) {
            setPricingQuantities(prev => {
                const existingItem = prev.find(item => item.id === pricingId);
                if (existingItem) {
                    return prev.map(item =>
                        item.id === pricingId ? { ...item, amount: item.amount + 1 } : item
                    );
                } else {
                    return [...prev, { quantityKey: type, id: pricingId, amount: 1 }];
                }
            });
        }

        setQuantities(prev => ({
            ...prev,
            [type]: prev[type] + 1
        }));
    };

    // Update decreaseQuantity to handle pricing option id
    const decreaseQuantity = (type: keyof typeof quantities, pricingId?: number) => {
        if (pricingId !== undefined) {
            setPricingQuantities(prev => {
                const existingItem = prev.find(item => item.id === pricingId);
                if (existingItem && existingItem.amount > 0) {
                    return prev.map(item =>
                        item.id === pricingId ? { ...item, amount: Math.max(0, item.amount - 1) } : item
                    );
                }
                return prev;
            });
        }

        setQuantities(prev => ({
            ...prev,
            [type]: Math.max(0, prev[type] - 1)
        }));
    };

    // Add handlers for additional service quantities
    const increaseAdditionalService = (name: string) => {
        setAdditionalServices(prev => ({
            ...prev,
            [name]: (prev[name] || 0) + 1
        }));
    };

    const decreaseAdditionalService = (name: string) => {
        setAdditionalServices(prev => ({
            ...prev,
            [name]: Math.max(0, (prev[name] || 0) - 1)
        }));
    };

    // Update calculateTotal to use pricingQuantities
    const calculateTotal = () => {
        // Prevent issues with null tour
        if (!tour) return 0;

        // If we have pricing options, use those
        if (tour.pricingOptions && tour.pricingOptions.length > 0) {
            let total = 0;

            // If we have pricingQuantities, use them to calculate price
            if (pricingQuantities.length > 0) {
                // Calculate prices based on pricing options by ID
                pricingQuantities.forEach(pq => {
                    const pricingOption = tour.pricingOptions.find(po => po.id === pq.id);
                    if (pricingOption) {
                        total += pricingOption.price * pq.amount;
                    }
                });
            } else {
                // Fallback to old calculation method
                // Calculate prices based on pricing options
                tour.pricingOptions.forEach(option => {
                    // Map pricing option to our quantity keys
                    let quantityKey: keyof typeof quantities;

                    if (option.isRoundTrip) {
                        quantityKey = option.customerType.toLowerCase().includes('child') ? 'childRoundTrip' : 'adultRoundTrip';
                    } else {
                        if (option.customerType.toLowerCase().includes('child')) {
                            quantityKey = option.customerType.toLowerCase().includes('0-2') ? 'childSmall' : 'childBig';
                        } else {
                            quantityKey = 'adult';
                        }
                    }

                    // Add to total
                    total += option.price * quantities[quantityKey];
                });
            }

            // Add additional services
            const servicesTotal = tour.additionalServices?.reduce((sum, service) => {
                return sum + (service.price * (additionalServices[service.name] || 0));
            }, 0) || 0;

            return total + servicesTotal;
        } else {
            // Fallback to base price if no pricing options
            const adultPrice = tour.price;
            const childSmallPrice = 0; // Children 0-2 typically free
            const childBigPrice = tour.price * 0.5; // Children 3-10 typically half price
            const adultRoundTripPrice = tour.price * 1.8; // Round trip about 1.8x single price
            const childRoundTripPrice = childBigPrice * 1.8; // Round trip about 1.8x single price

            const quantityTotal =
                adultPrice * quantities.adult +
                childSmallPrice * quantities.childSmall +
                childBigPrice * quantities.childBig +
                adultRoundTripPrice * quantities.adultRoundTrip +
                childRoundTripPrice * quantities.childRoundTrip;

            const servicesTotal = tour.additionalServices?.reduce((total, service) => {
                return total + (service.price * (additionalServices[service.name] || 0));
            }, 0) || 0;

            return quantityTotal + servicesTotal;
        }
    };

    // Get total number of items from main quantity section only
    const getMainQuantities = () => {
        return Object.values(quantities).reduce((sum, value) => sum + value, 0);
    };

    // Get tour duration in days
    const getTotalDays = () => {
        return tour?.duration || 0;
    };

    const handleProceedToCheckout = () => {
        // Only proceed to checkout if at least one item is selected from the main quantity section
        if (getMainQuantities() > 0 && tour) {
            navigate(`/checkout/${id}`, {
                state: {
                    tourTitle: tour.title,
                    tourImage: tour.imageUrl || tour.images?.[0],
                    quantities,
                    additionalServices,
                    totalPrice: calculateTotal(),
                    totalItems: getTotalDays(),
                    // Add pricingQuantities to pass to checkout page
                    pricingQuantities,
                    pricingKeyMap
                }
            });
        } else {
            alert('Please select at least one in the quantity section.');
        }
    };

    // Parse schedule sections from HTML
    useEffect(() => {
        if (tour?.scheduleDescription) {
            try {
                // Create temporary DOM element to parse HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(tour.scheduleDescription, 'text/html');
                const parsedSections: { title: string, content: string }[] = [];

                // Find all section titles that have the specific marker class
                const sectionTitles = doc.querySelectorAll('.schedule-section-title, [data-section-title]');

                if (sectionTitles.length > 0) {
                    // Modern section format with markers
                    sectionTitles.forEach((titleElem, index) => {
                        const title = titleElem.textContent?.trim() || '';
                        let content = '';
                        let currentElem = titleElem.nextElementSibling;

                        // Collect all content until the next section title or the end
                        while (currentElem &&
                            !currentElem.classList.contains('schedule-section-title') &&
                            !currentElem.hasAttribute('data-section-title')) {
                            content += currentElem.outerHTML || '';
                            currentElem = currentElem.nextElementSibling;
                        }

                        parsedSections.push({ title, content });

                        // Default to first section expanded
                        if (index === 0) {
                            setExpandedSections(prev => ({ ...prev, [title]: true }));
                        }
                    });
                } else {
                    // Try to find paragraphs with strong tags that look like section titles
                    let currentSectionTitle = '';
                    let currentSectionContent = '';

                    Array.from(doc.body.children).forEach((element, index) => {
                        const paragraph = element as HTMLParagraphElement;
                        // Check if this looks like a section title (paragraph with just a strong tag)
                        const strongElement = paragraph.querySelector(':scope > strong');

                        if (paragraph.tagName === 'P' && strongElement &&
                            paragraph.textContent?.trim() !== '' &&
                            paragraph.childNodes.length === 1) {

                            // If we already have a section in progress, save it
                            if (currentSectionTitle && currentSectionContent) {
                                parsedSections.push({
                                    title: currentSectionTitle,
                                    content: currentSectionContent
                                });
                            }

                            // Start a new section
                            currentSectionTitle = strongElement.textContent?.trim() || '';
                            currentSectionContent = '';

                            // Default first section to expanded
                            if (parsedSections.length === 0) {
                                setExpandedSections(prev => ({ ...prev, [currentSectionTitle]: true }));
                            }
                        } else if (currentSectionTitle) {
                            // Add to current section content
                            currentSectionContent += element.outerHTML || '';
                        } else if (index === 0) {
                            // If this is the first element and not a title, treat all content as one section
                            currentSectionTitle = tour.title || 'Schedule';
                            currentSectionContent += element.outerHTML || '';
                            setExpandedSections(prev => ({ ...prev, [currentSectionTitle]: true }));
                        }
                    });

                    // Add the last section if we have one
                    if (currentSectionTitle && currentSectionContent) {
                        parsedSections.push({
                            title: currentSectionTitle,
                            content: currentSectionContent
                        });
                    }
                }

                // If no sections found but we have content, create a default section with all content
                if (parsedSections.length === 0 && doc.body.innerHTML.trim() !== '') {
                    parsedSections.push({
                        title: tour.title || 'Schedule',
                        content: doc.body.innerHTML
                    });
                    setExpandedSections(prev => ({ ...prev, [tour.title || 'Schedule']: true }));
                }

                setScheduleSections(parsedSections);
            } catch (error) {
                console.error('Error parsing schedule description:', error);
                // Fall back to showing all content
                setScheduleSections([{
                    title: tour.title || 'Schedule',
                    content: tour.scheduleDescription
                }]);
                setExpandedSections(prev => ({ ...prev, [tour.title || 'Schedule']: true }));
            }
        }
    }, [tour?.scheduleDescription, tour?.title]);

    // Toggle a specific section
    const toggleSection = (title: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    // Add a function to extract YouTube video ID from URL
    const getYoutubeVideoId = (url: string): string | null => {
        if (!url) return null;

        // Match YouTube URL patterns
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        return (match && match[2].length === 11)
            ? match[2]
            : null;
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen">
                <Header />
                <div className="flex justify-center items-center h-[calc(100vh-100px)]">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
                </div>
                <Footer />
            </div>
        );
    }

    // Error state
    if (error || !tour) {
        return (
            <div className="min-h-screen">
                <Header />
                <div className="flex flex-col justify-center items-center h-[calc(100vh-100px)]">
                    <div className="text-red-500 text-xl font-semibold mb-4">
                        {error || "Tour not found"}
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
                    >
                        Return to Home
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow">
                {/* Image Gallery */}
                <div className="grid grid-cols-12 gap-4 mb-6">
                    <div className="col-span-12 md:col-span-6 relative">
                        <div
                            className="relative overflow-hidden rounded-lg shadow-lg h-[400px]"
                        >
                            <img
                                src={tour.images && tour.images.length > 0 ? tour.images[currentIndex] : tour.imageUrl}
                                alt={tour.title}
                                className="w-full h-full object-cover"
                            />

                            {/* Left/Right Arrow Buttons */}
                            {tour.images && tour.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevModalImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 text-gray-800 p-2 rounded-full shadow-md hover:bg-opacity-100 transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={nextModalImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 text-gray-800 p-2 rounded-full shadow-md hover:bg-opacity-100 transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}

                            {/* Page Indicator */}
                            {tour.images && tour.images.length > 1 && (
                                <div className="absolute bottom-4 right-4 bg-white rounded-md px-3 py-1 text-sm font-semibold flex items-center shadow-sm">
                                    {currentIndex + 1}/{tour.images.length}
                                    <img src="https://meetup.travel/_next/static/media/media.b0a397e0.svg" alt="Gallery" className="w-4 h-4 ml-1" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 grid grid-cols-2 gap-4">
                        {tour.images && tour.images.slice(0, 4).map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`${tour.title} - image ${index + 1}`}
                                className="w-full h-[195px] object-cover rounded-lg cursor-pointer"
                                onClick={() => openModal(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-12 gap-8">
                    {/* Left column - Tour details */}
                    <div className="col-span-12 lg:col-span-7">
                        {/* Tour Title */}
                        <h1 className="text-2xl font-semibold mb-4 text-[26px]">{tour.title}</h1>
                        <div className="flex flex-wrap text-sm mb-4">
                            {tour.availableGuides && tour.availableGuides.map((guide, index) => (
                                <span key={index} className="mr-2 bg-gray-100 px-2 py-1 rounded-full font-medium">
                                    {guide} tour guide
                                </span>
                            ))}
                        </div>

                        {/* Highlights */}
                        {tour.highlights && tour.highlights.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-bold mb-4">Highlight:</h2>
                                <ul className="font-weight text-[15px] list-disc pl-8 bg-[url('https://meetup.travel/_next/static/media/highlight-2-bg.a05deeb7.png')] bg-no-repeat bg-right w-full h-full rounded-xl p-6">
                                    {tour.highlights.map((highlight, index) => (
                                        <li key={index} className="mb-4 font-semibold">{highlight}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-4">Descriptions:</h2>
                            <div
                                className="mt-4 text-gray-700 text-[15px] description-content"
                                dangerouslySetInnerHTML={{ __html: tour.description }}
                                style={{
                                    lineHeight: '1.6',
                                }}
                            ></div>
                        </div>

                        {/* Schedule Description */}
                        {tour.scheduleDescription && (
                            <div className="mb-8">
                                <h2 className="text-xl font-bold mb-4">Schedule:</h2>
                                <div className="mx-auto w-full">
                                    {scheduleSections.length > 0 ? (
                                        scheduleSections.map((section, sectionIndex) => (
                                            <div key={sectionIndex} className="mb-2">
                                                <button
                                                    className="mt-4 w-full text-left text-gray-600 font-semibold pb-2"
                                                    type="button"
                                                    aria-expanded={expandedSections[section.title] || false}
                                                    onClick={() => toggleSection(section.title)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <div className="relative flex h-4 w-4 rounded-full bg-yellow-500 items-center justify-center">
                                                                <div className="h-[6px] w-[6px] translate-x-[1%] translate-y-[1%] rounded-full bg-yellow-100"></div>
                                                                <div className="absolute left-[50%] top-[50%] h-[50%] w-[2px] translate-x-[-51%] rounded-[2px] bg-yellow-100"></div>
                                                            </div>
                                                            <div className="ml-3 text-base">
                                                                {section.title}
                                                            </div>
                                                        </div>
                                                        <div className="transition-transform duration-200" style={{
                                                            transform: expandedSections[section.title] ? 'rotate(180deg)' : 'rotate(0deg)'
                                                        }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M6 9l6 6 6-6" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </button>

                                                {expandedSections[section.title] && (
                                                    <div className="animate-fadeIn">
                                                        <div className="translate-y-[-4px] overflow-hidden transition-all duration-300 ease-in-out">
                                                            <div className="ml-[7px] flex items-start border-l-[2px] border-yellow-100">
                                                                <div className="ml-[18px] w-full pt-3 text-gray-700">
                                                                    <div
                                                                        className="text-gray-800 [&_img]:rounded-md [&_img]:shadow-sm [&_li]:list-inside [&_li]:list-disc schedule-section"
                                                                        dangerouslySetInnerHTML={{ __html: section.content }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        // Fallback to original implementation if no sections parsed
                                        <>
                                            <button
                                                className="mt-6 w-full text-left text-gray-600 font-semibold max-lg:mt-2"
                                                type="button"
                                                aria-expanded={scheduleExpanded}
                                                onClick={() => setScheduleExpanded(!scheduleExpanded)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="relative flex h-4 w-4 rounded-full bg-yellow-500 items-center justify-center">
                                                            <div className="h-[6px] w-[6px] translate-x-[1%] translate-y-[1%] rounded-full bg-yellow-100"></div>
                                                            <div className="absolute left-[50%] top-[50%] h-[50%] w-[2px] translate-x-[-51%] rounded-[2px] bg-yellow-100"></div>
                                                        </div>
                                                        <div className="ml-3">
                                                            {tour.title}
                                                        </div>
                                                    </div>
                                                    <div className="transition-transform duration-200" style={{ transform: scheduleExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M6 9l6 6 6-6" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </button>
                                            {scheduleExpanded && (
                                                <div>
                                                    <div className="translate-y-[-4px] overflow-hidden transition-all duration-300 ease-in-out">
                                                        <div className="ml-[7px] flex h-full items-center border-l-[2px] border-yellow-100">
                                                            <div className="ml-[18px] w-full pt-3 text-gray-500">
                                                                <div className="text-gray-800 [&_img]:w-[442px] [&_img]:h-[248px] [&_img]:object-cover [&_img]:rounded-md [&_li]:list-inside [&_li]:list-disc" dangerouslySetInnerHTML={{ __html: tour.scheduleDescription }}></div>
                                                                <div className="mt-3 w-full max-w-full gap-3 overflow-x-auto"></div>
                                                                <div className="mt-1">
                                                                    <div className="mt-2">
                                                                        <span className="font-semibold">Transport: </span>
                                                                        {tour.categories?.find(cat => cat.toLowerCase().includes('bus') || cat.toLowerCase().includes('transport')) || 'bus'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Overview */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-4">Overviews:</h2>
                            <div className="bg-gray-200 bg-opacity-50 p-4 rounded-lg">
                                {tour.pickupPoints && tour.pickupPoints.length > 0 && (
                                    <>
                                        <p className="mb-2">
                                            <strong>Pick up:</strong><br /> {tour.pickupPoints.join(', ')}
                                        </p>
                                        <div className="border-b-2 border-white mt-1"></div>
                                    </>
                                )}
                                <p className="mb-2">
                                    <strong>Group size:</strong><br /> {tour.minPax} - {tour.maxPax}
                                </p>
                                <div className="border-b-2 border-white mt-1"></div>
                                {tour.categories && tour.categories.length > 0 && (
                                    <>
                                        <p className="mb-2">
                                            <strong>Travel style:</strong><br /> {tour.categories.join(', ')}
                                        </p>
                                        <div className="border-b-2 border-white mt-1"></div>
                                    </>
                                )}
                                {tour.availableGuides && tour.availableGuides.length > 0 && (
                                    <p className="mb-2">
                                        <strong>Language:</strong> <br />{tour.availableGuides.join(', ')}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* YouTube Video Section */}
                        {tour.youtubeUrl && getYoutubeVideoId(tour.youtubeUrl) && (
                            <div className="mb-8">
                                <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
                                    <iframe
                                        className="absolute top-0 left-0 w-full h-full"
                                        src={`https://www.youtube.com/embed/${getYoutubeVideoId(tour.youtubeUrl)}`}
                                        title={`${tour.title} Video`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        )}

                        {/* Included/Excluded */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h2 className="text-xl font-bold mb-4">Included:</h2>
                                <div className="bg-[#f5f5f5] bg-opacity-50 p-4 rounded-lg">
                                    <ul className="list-none">
                                        {tour.includedServices && tour.includedServices.map((service, index) => (
                                            <li key={index} className="mb-2 flex text-gray-500 text-[12px]">
                                                <img src="https://meetup.travel/_next/static/media/check-success.abaf1a51.svg" alt="check" className="w-4 h-4 mr-2 flex-shrink-0 mt-0" />
                                                <span>{service}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-4">Excluded:</h2>
                                <div className="bg-[#f5f5f5] bg-opacity-50 p-4 rounded-lg">
                                    <ul className="list-none">
                                        {tour.excludedServices && tour.excludedServices.map((service, index) => (
                                            <li key={index} className="mb-2 flex text-gray-500 text-[12px]">
                                                <img src="https://meetup.travel/_next/static/media/exclude.662a7e0b.svg" alt="exclude" className="w-4 h-4 mr-2 flex-shrink-0 mt-0" />
                                                <span>{service}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column - Booking form */}
                    <div className="col-span-12 lg:col-span-5">
                        <div className="p-2 sticky top-0">
                            <div className="border rounded-lg p-4">
                                <h3 className="text-lg font-bold mb-4">Pick-up:</h3>
                                <div className="mb-6">
                                    <div className="flex flex-wrap gap-1">
                                        {tour.pickupPoints && tour.pickupPoints.map((point, index) => (
                                            <div key={index} className="bg-gray-200 px-2 py-1 rounded-xl">
                                                <span className="text-gray-500 text-[14px]">{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Quantity services */}
                            <div className="border rounded-lg p-4 mt-4">
                                <h3 className="text-lg font-bold mb-4">Quantity</h3>

                                <div className="border-t border-gray-200">
                                    {tour.pricingOptions && tour.pricingOptions.length > 0 ? (
                                        tour.pricingOptions.map((option, index) => (
                                            <div key={index} className="flex items-center justify-between py-2">
                                                <span className="text-gray-700 font-bold text-[14px]">
                                                    {option.customerType}
                                                    {option.isRoundTrip && " (Round Trip)"}
                                                </span>
                                                <div className="flex items-center">
                                                    <span className="font-bold mr-5 text-[14px]">${option.price.toFixed(2)}</span>
                                                    <button
                                                        onClick={() => decreaseQuantity(option.isRoundTrip ?
                                                            (option.customerType.toLowerCase().includes('child') ? 'childRoundTrip' : 'adultRoundTrip') :
                                                            (option.customerType.toLowerCase().includes('child') ?
                                                                (option.customerType.toLowerCase().includes('0-2') ? 'childSmall' : 'childBig') :
                                                                'adult'), option.id)}
                                                        className={`w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold`}>−</button>
                                                    <span className="mx-2 text-gray-500 font-medium text-[14px]">
                                                        {pricingQuantities.find(pq => pq.id === option.id)?.amount.toString().padStart(2, '0') || '0'}
                                                    </span>
                                                    <button
                                                        onClick={() => increaseQuantity(option.isRoundTrip ?
                                                            (option.customerType.toLowerCase().includes('child') ? 'childRoundTrip' : 'adultRoundTrip') :
                                                            (option.customerType.toLowerCase().includes('child') ?
                                                                (option.customerType.toLowerCase().includes('0-2') ? 'childSmall' : 'childBig') :
                                                                'adult'), option.id)}
                                                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-lg">+</button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-gray-700 font-bold text-[14px]">Adult</span>
                                                <div className="flex items-center">
                                                    <span className="font-bold mr-5 text-[14px]">${tour.price.toFixed(2)}</span>
                                                    <button
                                                        onClick={() => decreaseQuantity('adult')}
                                                        className={`w-6 h-6 rounded-full ${quantities.adult > 0 ? 'bg-gray-200' : 'bg-gray-100'} flex items-center justify-center text-lg font-bold`}>−</button>
                                                    <span className="mx-2 text-gray-500 font-medium text-[14px]">{quantities.adult.toString().padStart(2, '0')}</span>
                                                    <button
                                                        onClick={() => increaseQuantity('adult')}
                                                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-lg">+</button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-gray-700 font-bold text-[14px]">Child 0-2</span>
                                                <div className="flex items-center">
                                                    <span className="font-bold mr-5 text-[14px]">$0.00</span>
                                                    <button
                                                        onClick={() => decreaseQuantity('childSmall')}
                                                        className={`w-6 h-6 rounded-full ${quantities.childSmall > 0 ? 'bg-gray-200' : 'bg-gray-100'} flex items-center justify-center text-lg font-bold`}>−</button>
                                                    <span className="mx-2 text-gray-500 font-medium text-[14px]">{quantities.childSmall.toString().padStart(2, '0')}</span>
                                                    <button
                                                        onClick={() => increaseQuantity('childSmall')}
                                                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-lg">+</button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-gray-700 font-bold text-[14px]">Child 3-10</span>
                                                <div className="flex items-center">
                                                    <span className="font-bold mr-5 text-[14px]">${(tour.price * 0.5).toFixed(2)}</span>
                                                    <button
                                                        onClick={() => decreaseQuantity('childBig')}
                                                        className={`w-6 h-6 rounded-full ${quantities.childBig > 0 ? 'bg-gray-200' : 'bg-gray-100'} flex items-center justify-center text-lg font-bold`}>−</button>
                                                    <span className="mx-2 text-gray-500 font-medium text-[14px]">{quantities.childBig.toString().padStart(2, '0')}</span>
                                                    <button
                                                        onClick={() => increaseQuantity('childBig')}
                                                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-lg">+</button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Additional services */}
                            {tour.additionalServices && tour.additionalServices.length > 0 && (
                                <div className="border rounded-lg p-4 mt-4">
                                    <h3 className="text-lg font-bold">Additional service</h3>
                                    <div className="p-2 mt-2 border-t border-gray-200"></div>
                                    {tour.additionalServices.map((service, index) => (
                                        <div key={index} className="flex items-center justify-between py-1">
                                            <div className="flex flex-col text-[14px]">
                                                <span className="text-black">{service.name}</span>
                                                <span className="text-xs text-gray-500">Add ${service.price.toFixed(2)} per {service.priceUnit}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => decreaseAdditionalService(service.name)}
                                                    className={`w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center ${additionalServices[service.name] > 0 ? 'bg-gray-200' : 'bg-white text-gray-300'}`}>-</button>
                                                <span className="mx-2 text-gray-500">{(additionalServices[service.name] || 0).toString().padStart(2, '0')}</span>
                                                <button
                                                    onClick={() => increaseAdditionalService(service.name)}
                                                    className="w-6 h-6 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center">+</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mb-4 text-xs text-gray-600 mt-4">
                                After payment, you and your tour guide will receive each others emails and WhatsApp to plan the trip in detail!
                            </div>

                            <div className="border rounded-lg p-4 mt-4 bg-white shadow-sm">
                                {/* See price detail trigger */}
                                <div
                                    className="inline-flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-xl w-fit mb-4 cursor-pointer"
                                    onClick={handleOpenModal}
                                >
                                    <span className="text-sm text-gray-700">See price detail</span>
                                    <img
                                        src="https://meetup.travel/_next/static/media/question-mark.430bbc1d.svg"
                                        alt="question"
                                        className="w-5 h-5"
                                    />
                                </div>

                                {/* Total */}
                                <div className="bg-teal-400 text-white p-3 rounded-lg flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium">Total</div>
                                        <div className="text-lg font-bold">
                                            ${calculateTotal().toFixed(2)} | {getTotalDays()} days
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleProceedToCheckout}
                                        className="bg-white text-teal-500 font-bold py-1.5 px-4 rounded hover:opacity-80 transition">
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Tours */}
                {relatedToursData.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Related Tours</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {relatedToursData.map((relatedTour) => (
                                <TourCard
                                    key={relatedTour.id}
                                    tour={{
                                        id: relatedTour.id,
                                        title: relatedTour.title,
                                        image: relatedTour.imageUrl || (relatedTour.images && relatedTour.images.length > 0 ? relatedTour.images[0] : ''),
                                        images: relatedTour.images || [],
                                        price: relatedTour.price,
                                        duration: `${relatedTour.duration} ${relatedTour.duration === 1 ? 'day' : 'days'}`,
                                        rating: relatedTour.rating || 4.5,
                                        maxPax: relatedTour.maxPax || 10,
                                        minPax: relatedTour.minPax || 1,
                                        languages: relatedTour.availableGuides || ['English']
                                    }}
                                    className="tour-card"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />

            {/* Modal using CSS classes for proper z-index handling */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">See price detail</h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-2xl font-bold text-gray-500 hover:text-black"
                            >
                                ×
                            </button>
                        </div>
                        <div className="w-full bg-gray-50 p-4 rounded-lg">
                            <div className="space-y-4">
                                <div>
                                    <div className="text-gray-600 mb-1 font-bold">Adult</div>
                                    <div className="flex justify-between bg-teal-500 text-white px-3 py-2 rounded-md">
                                        <span>Price</span>
                                        <span>${tour.price.toFixed(2)}/Person</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-600 mb-1 font-bold">Child 0–2</div>
                                    <div className="flex justify-between bg-teal-500 text-white px-3 py-2 rounded-md">
                                        <span>Price</span>
                                        <span>$0.00/Person</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-600 mb-1 font-bold">Child 3–10</div>
                                    <div className="flex justify-between bg-teal-500 text-white px-3 py-2 rounded-md">
                                        <span>Price</span>
                                        <span>${(tour.price * 0.5).toFixed(2)}/Person</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TourDetailPage; 