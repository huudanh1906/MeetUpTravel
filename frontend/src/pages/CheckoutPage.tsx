import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Check } from 'lucide-react';

// API URL
const API_BASE_URL = 'http://localhost:8080/api';

// VietQR constants
const BANK_ID = 'BIDV';
const ACCOUNT_NO = '71010001675691';
const ACCOUNT_NAME = 'BUI HUU DANH';

// Function to generate VietQR URL
const generateVietQRUrl = (amount: number, content: string) => {
  // Create a random 6-digit booking reference
  const bookingRef = Math.floor(100000 + Math.random() * 900000);
  const transferContent = `DAT TOUR MEETUP ${bookingRef}`;

  // Format the amount with no decimal places
  const formattedAmount = Math.round(amount * conversionRate).toString();

  return `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact.png?amount=${formattedAmount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
};

// Conversion rate
const conversionRate = 26200; // Example rate: 1 USD = 26,200 VND

interface LocationState {
  tourTitle: string;
  tourImage?: string;
  quantities: {
    adult: number;
    childSmall: number;
    childBig: number;
    adultRoundTrip: number;
    childRoundTrip: number;
  };
  additionalServices: Record<string, number>;
  totalPrice: number;
  totalItems: number;
  pricingQuantities?: PricingQuantity[];
  pricingKeyMap?: Record<number, QuantitiesKey>;
}

type QuantitiesKey = 'adult' | 'childSmall' | 'childBig' | 'adultRoundTrip' | 'childRoundTrip';
type AdditionalServices = { [key: string]: number };

// Cập nhật interface để thêm id vào pricing options
interface TourDataPricingOption {
  id: number;
  customerType: string;
  price: number;
  isRoundTrip: boolean;
}

// Cập nhật interface TourData
interface TourData {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: number;
  imageUrl: string;
  pickupPoints: string[];
  pricingOptions: TourDataPricingOption[];
  additionalServices: {
    id: number;
    name: string;
    description: string;
    price: number;
    priceUnit: string;
  }[];
}

// Thêm một kiểu mới cho quantity với id của pricing option
interface PricingQuantity {
  quantityKey: QuantitiesKey;
  id: number;
  amount: number;
}

const CheckoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tourData, setTourData] = useState<TourData | null>(null);
  const [showQR, setShowQR] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    note: '',
    agreedToTerms: false,

    address: '',
    location: 'tan-son-nhat',
  });
  const [formState, setFormState] = useState<{
    quantities: Record<QuantitiesKey, number>;
    additionalServices: AdditionalServices;
  }>({
    quantities: {
      adult: 1,
      childSmall: 0,
      childBig: 0,
      adultRoundTrip: 0,
      childRoundTrip: 0,
    },
    additionalServices: {
      "Esim 15 days": 1,
      "16-seat car pickup": 0,
      "4-seat car pickup": 0,
      "Esim 30 days": 0,
      "7-seat car pickup": 0,
    },
  });
  const [pricingQuantities, setPricingQuantities] = useState<PricingQuantity[]>([]);
  const [pricingKeyMap, setPricingKeyMap] = useState<Record<number, QuantitiesKey>>({});

  const increment = (key: QuantitiesKey, pricingId?: number) => {
    if (pricingId !== undefined) {
      setPricingQuantities(prev => {
        const existingItem = prev.find(item => item.id === pricingId);
        if (existingItem) {
          return prev.map(item =>
            item.id === pricingId ? { ...item, amount: item.amount + 1 } : item
          );
        } else {
          return [...prev, { quantityKey: key, id: pricingId, amount: 1 }];
        }
      });
    }

    setFormState(prev => ({
      ...prev,
      quantities: {
        ...prev.quantities,
        [key]: prev.quantities[key] + 1,
      },
    }));
  };

  const decrement = (key: QuantitiesKey, pricingId?: number) => {
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

    setFormState(prev => ({
      ...prev,
      quantities: {
        ...prev.quantities,
        [key]: Math.max(0, prev.quantities[key] - 1),
      },
    }));
  };

  const incrementService = (serviceName: string) => {
    setFormState(prev => ({
      ...prev,
      additionalServices: {
        ...prev.additionalServices,
        [serviceName]: (prev.additionalServices[serviceName] ?? 0) + 1,
      },
    }));
  };

  const decrementService = (serviceName: string) => {
    setFormState(prev => ({
      ...prev,
      additionalServices: {
        ...prev.additionalServices,
        [serviceName]: Math.max(0, (prev.additionalServices[serviceName] ?? 0) - 1),
      },
    }));
  };
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [locations, setLocations] = useState<Array<{ value: string, label: string }>>([]);

  const [quantities, setQuantities] = useState({
    adult: 0,
    childSmall: 0,
    childBig: 0,
    adultRoundTrip: 0,
    childRoundTrip: 0,
  });
  const [showDropdown, setShowDropdown] = useState(false);
  // Calculate dates for the current month's calendar
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 0, 0).getDate();
  };
  const selectedLocation = locations.find(loc => loc.value === formData.location);

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDay();
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty days for the start of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', date: null });
    }

    // Add actual days
    for (let i = 0; i <= daysInMonth; i++) {
      days.push({
        day: i.toString(),
        date: new Date(year, month, i)
      });
    }

    return days;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleDateSelect = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date >= today) {
      setSelectedDate(date);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.whatsapp || !selectedDate || !formData.agreedToTerms) {
      setError("Please fill in all required fields and agree to terms");
      return;
    }

    // Calculate end date based on tour duration
    const endDate = selectedDate ? new Date(selectedDate) : null;
    if (endDate && tourData) {
      endDate.setDate(endDate.getDate() + (tourData.duration || 0));
    }

    // Fix time zone issues by manually creating YYYY-MM-DD format
    const formatDateToYYYYMMDD = (date: Date | null): string => {
      if (!date) return '';

      // Adjust for timezone by using local date functions instead of toISOString
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    };

    // Remove spaces and formatting from phone numbers
    const formattedPhone = formData.whatsapp.replace(/\s+/g, '');

    // Create booking data to send to API
    const bookingData = {
      tourId: Number(id),  // Ensure tourId is a number, not a string
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formattedPhone,
      whatsappNumber: formattedPhone,
      departureDate: formatDateToYYYYMMDD(selectedDate),
      endDate: formatDateToYYYYMMDD(endDate),
      noteForMeetup: formData.note,
      pickupLocation: selectedLocation?.label || '',
      pickupAddress: formData.address,
      totalPrice: totalPrice,
      additionalServices: Object.entries(formState.additionalServices)
        .filter(([_, quantity]) => quantity > 0)
        .map(([name, quantity]) => {
          const service = tourData?.additionalServices.find(s => s.name === name);
          if (!service?.id) return null;

          // Include all required fields for the DTO
          return {
            additionalServiceId: service.id,
            serviceName: service.name,
            serviceType: service.priceUnit || 'unit',
            price: service.price,
            quantity: quantity
          };
        })
        .filter(item => item !== null),
      pricingOptions: pricingQuantities
        .filter(pq => pq.amount > 0)
        .map(pq => {
          const pricingOption = tourData?.pricingOptions.find(po => po.id === pq.id);
          return {
            pricingOptionId: pq.id,
            quantity: pq.amount
          };
        })
    };

    console.log('Sending booking data to API:', bookingData);

    // Call API to create booking
    fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })
      .then(async response => {
        if (!response.ok) {
          // Try to get more detailed error information
          let errorDetail = '';
          try {
            const errorResponse = await response.json();
            errorDetail = JSON.stringify(errorResponse);
          } catch (e) {
            errorDetail = `Status code: ${response.status}`;
          }
          throw new Error(`HTTP error! Details: ${errorDetail}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Booking created successfully:', data);
        // Show success message and redirect to confirmation page
        navigate('/booking-confirmation', {
          state: {
            bookingId: data.id,
            tourName: tourData?.title,
            departureDate: selectedDate,
            customerName: formData.name,
            totalPrice: totalPrice
          }
        });
      })
      .catch(error => {
        console.error('Error creating booking:', error);
        setError(`Failed to create booking: ${error.message}`);
      });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const isDateSelectable = (date: Date) => {
    const today = new Date();
    return date >= new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  // Thêm state để lưu tên gói dịch vụ tương ứng với mỗi loại số lượng
  const [pricingLabels, setPricingLabels] = useState<Record<QuantitiesKey, string>>({
    adult: 'Adult',
    childSmall: 'Child 0-2',
    childBig: 'Child 3-10',
    adultRoundTrip: 'Round trip Adult',
    childRoundTrip: 'Round trip child 3-10'
  });

  // If we don't have state (user directly navigated to checkout), redirect to home
  useEffect(() => {
    if (!state) {
      navigate('/');
    }
  }, [state, navigate]);

  // Fetch tour data
  useEffect(() => {
    const fetchTourData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/tours/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTourData(data);

        // Xử lý pricing options để lấy tên chính xác
        if (data.pricingOptions && data.pricingOptions.length > 0) {
          const newPricingLabels: Record<QuantitiesKey, string> = { ...pricingLabels };
          const newPricingKeyMap: Record<number, QuantitiesKey> = {};
          let initialPricingQuantities: PricingQuantity[] = [];

          data.pricingOptions.forEach((option: TourDataPricingOption) => {
            let quantityKey: QuantitiesKey;

            if (option.isRoundTrip) {
              quantityKey = option.customerType.toLowerCase().includes('child') ? 'childRoundTrip' : 'adultRoundTrip';
            } else {
              if (option.customerType.toLowerCase().includes('child')) {
                quantityKey = option.customerType.toLowerCase().includes('0-2') ? 'childSmall' : 'childBig';
              } else {
                quantityKey = 'adult';
              }
            }

            // Lưu tên gói thực tế
            newPricingLabels[quantityKey] = `${option.customerType}${option.isRoundTrip ? ' (Round Trip)' : ''}`;

            // Lưu ánh xạ giữa pricing option id và quantityKey
            newPricingKeyMap[option.id] = quantityKey;

            // Tạo pricing quantity với số lượng ban đầu là 0
            initialPricingQuantities.push({
              id: option.id,
              quantityKey: quantityKey,
              amount: 0
            });
          });

          setPricingLabels(newPricingLabels);

          // Use pricingKeyMap from state if available, otherwise use the new map
          if (state?.pricingKeyMap) {
            setPricingKeyMap(state.pricingKeyMap);
          } else {
            setPricingKeyMap(newPricingKeyMap);
          }

          // Use pricingQuantities from state if available, otherwise use the new list
          if (state?.pricingQuantities && state.pricingQuantities.length > 0) {
            setPricingQuantities(state.pricingQuantities);
          } else {
            setPricingQuantities(initialPricingQuantities);
          }
        }

        // Xử lý pickupPoints từ API
        if (data.pickupPoints && data.pickupPoints.length > 0) {
          // Chuyển đổi pickupPoints từ API thành định dạng để hiển thị
          const locationOptions = data.pickupPoints.map((point: string, index: number) => ({
            value: `location-${index}`,
            label: point
          }));
          setLocations(locationOptions);

          // Đặt giá trị mặc định cho location nếu có ít nhất một điểm đón
          if (locationOptions.length > 0) {
            setFormData(prev => ({
              ...prev,
              location: locationOptions[0].value
            }));
          }
        } else {
          // Fallback to default locations if tour doesn't have pickup points
          setLocations([
            { value: 'noi-bai', label: 'Noi Bai Airport (Hanoi)' },
            { value: 'tan-son-nhat', label: 'Tan Son Nhat Airport (HCMC)' },
            { value: 'danang', label: 'Danang Airport' },
            { value: 'phu-quoc', label: 'Phu Quoc Airport' },
          ]);
        }

        // Initialize additional services from API data
        if (data.additionalServices && data.additionalServices.length > 0) {
          const apiServices: Record<string, number> = {};
          data.additionalServices.forEach((service: any) => {
            apiServices[service.name] = 0;
          });

          setFormState(prev => ({
            ...prev,
            additionalServices: {
              ...apiServices,
              ...(state?.additionalServices || {}) // Use state values if present
            }
          }));
        }

        // Initialize quantities from state or default
        if (state?.quantities) {
          setFormState(prev => ({
            ...prev,
            quantities: state.quantities
          }));
        }
      } catch (err) {
        console.error('Error fetching tour data:', err);
        setError('Failed to load tour details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, [id, state]);

  if (!state) {
    return <div>Loading...</div>;
  }

  // Calculate end date based on tour duration
  const endDate = selectedDate ? new Date(selectedDate) : null;
  if (endDate && tourData) {
    endDate.setDate(endDate.getDate() + (tourData.duration || 0));
  }

  // Set up calendar data
  const calendarDays = generateCalendarDays();
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Get current month and year
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const calculateTotalPrice = () => {
    if (!tourData) return 0;

    let quantityTotal = 0;

    // Nếu chúng ta có pricingQuantities, sử dụng chúng để tính toán
    if (pricingQuantities.length > 0 && tourData.pricingOptions) {
      // Tính tổng số tiền dựa trên số lượng theo từng pricing option cụ thể
      pricingQuantities.forEach(pq => {
        const pricingOption = tourData.pricingOptions.find(po => po.id === pq.id);
        if (pricingOption) {
          quantityTotal += pricingOption.price * pq.amount;
        }
      });
    }
    // Nếu không, sử dụng phương pháp cũ
    else if (tourData.pricingOptions && tourData.pricingOptions.length > 0) {
      // Map API pricing options to form state quantity keys
      tourData.pricingOptions.forEach(option => {
        let quantityKey: keyof typeof formState.quantities;

        if (option.isRoundTrip) {
          quantityKey = option.customerType.toLowerCase().includes('child') ? 'childRoundTrip' : 'adultRoundTrip';
        } else {
          if (option.customerType.toLowerCase().includes('child')) {
            quantityKey = option.customerType.toLowerCase().includes('0-2') ? 'childSmall' : 'childBig';
          } else {
            quantityKey = 'adult';
          }
        }

        quantityTotal += option.price * formState.quantities[quantityKey];
      });
    } else {
      // Fallback to base price calculation
      const basePrice = tourData.price;

      quantityTotal =
        basePrice * formState.quantities.adult +
        0 * formState.quantities.childSmall +
        (basePrice * 0.5) * formState.quantities.childBig +
        (basePrice * 1.8) * formState.quantities.adultRoundTrip +
        (basePrice * 0.5 * 1.8) * formState.quantities.childRoundTrip;
    }

    // Calculate additional services
    const servicesTotal = Object.entries(formState.additionalServices).reduce((total, [key, value]) => {
      // Find the price for this service in the API data
      const serviceData = tourData.additionalServices?.find(s => s.name === key);
      const servicePrice = serviceData ? serviceData.price : 0;

      return total + (servicePrice * value);
    }, 0);

    return quantityTotal + servicesTotal;
  };

  const totalPrice = calculateTotalPrice();
  const vietQRUrl = generateVietQRUrl(totalPrice, '');

  // Function to handle VietQR payment confirmation
  const handleVietQRPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreedToTerms || !formData.name || !formData.email || !formData.whatsapp || !selectedDate) {
      setError("Please fill in all required fields and agree to terms");
      return;
    }

    // Thêm xác nhận trước khi tiếp tục
    if (!window.confirm("By clicking OK, you confirm that you have completed the bank transfer via VietQR. Providing false information may result in booking cancellation. Have you completed the payment?")) {
      return;
    }

    setLoading(true);
    setError(null); // Reset error state
    try {
      // First, create the booking as usual
      const bookingData = createBookingData();

      console.log("Sending booking data:", bookingData);

      // Send booking data to API
      const bookingResponse = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!bookingResponse.ok) {
        let errorMsg = `Booking creation failed with status: ${bookingResponse.status}`;

        try {
          const errorData = await bookingResponse.json();
          errorMsg += ` - ${JSON.stringify(errorData)}`;
        } catch (e) {
          // Ignore json parsing error
        }

        throw new Error(errorMsg);
      }

      const bookingResult = await bookingResponse.json();
      const bookingId = bookingResult.id;

      console.log("Booking created with ID:", bookingId, "Now confirming payment...");

      // Confirm VietQR payment
      const paymentResponse = await fetch(`${API_BASE_URL}/bookings/${bookingId}/confirm-vietqr-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!paymentResponse.ok) {
        let errorMsg = `Payment confirmation failed! Status: ${paymentResponse.status}`;

        // Special handling for 401 errors
        if (paymentResponse.status === 401) {
          errorMsg = "Authentication error. We'll process your booking manually. Our staff will contact you soon.";

          // Still consider this a success and navigate to confirmation
          navigate('/booking-confirmation', {
            state: {
              bookingId: bookingId,
              tourName: tourData?.title,
              departureDate: selectedDate,
              customerName: formData.name,
              totalPrice: totalPrice,
              paymentMethod: 'VietQR (Pending Verification)'
            }
          });
          return;
        }

        throw new Error(errorMsg);
      }

      const paymentResult = await paymentResponse.json();
      console.log("Payment confirmed:", paymentResult);

      // Navigate to confirmation page
      navigate('/booking-confirmation', {
        state: {
          bookingId: bookingId,
          tourName: tourData?.title,
          departureDate: selectedDate,
          customerName: formData.name,
          totalPrice: totalPrice,
          paymentMethod: 'VietQR'
        }
      });
    } catch (error: any) {
      console.error('Error processing payment:', error);
      setError(`Payment processing failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to create booking data object
  const createBookingData = () => {
    // Calculate end date based on tour duration
    const endDate = selectedDate ? new Date(selectedDate) : null;
    if (endDate && tourData) {
      endDate.setDate(endDate.getDate() + (tourData.duration || 0));
    }

    // Fix time zone issues by manually creating YYYY-MM-DD format
    const formatDateToYYYYMMDD = (date: Date | null): string => {
      if (!date) return '';

      // Adjust for timezone by using local date functions instead of toISOString
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    };

    // Remove spaces and formatting from phone numbers
    const formattedPhone = formData.whatsapp.replace(/\s+/g, '');

    // Create booking data to send to API
    return {
      tourId: Number(id),  // Ensure tourId is a number, not a string
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formattedPhone,
      whatsappNumber: formattedPhone,
      departureDate: formatDateToYYYYMMDD(selectedDate),
      endDate: formatDateToYYYYMMDD(endDate),
      noteForMeetup: formData.note,
      pickupLocation: selectedLocation?.label || '',
      pickupAddress: formData.address,
      totalPrice: totalPrice,
      additionalServices: Object.entries(formState.additionalServices)
        .filter(([_, quantity]) => quantity > 0)
        .map(([name, quantity]) => {
          const service = tourData?.additionalServices.find(s => s.name === name);
          if (!service?.id) return null;

          // Include all required fields for the DTO
          return {
            additionalServiceId: service.id,
            serviceName: service.name,
            serviceType: service.priceUnit || 'unit',
            price: service.price,
            quantity: quantity
          };
        })
        .filter(item => item !== null),
      pricingOptions: pricingQuantities
        .filter(pq => pq.amount > 0)
        .map(pq => {
          const pricingOption = tourData?.pricingOptions.find(po => po.id === pq.id);
          return {
            pricingOptionId: pq.id,
            quantity: pq.amount
          };
        })
    };
  };

  // Format date for display in the confirmation section
  const formatDisplayDate = (date: Date | null) => {
    if (!date) return 'Not selected';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Show loading while fetching tour data
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-100px)]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error if API fetch failed
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="flex flex-col justify-center items-center h-[calc(100vh-100px)]">
          <div className="text-red-500 text-xl font-semibold mb-4">{error}</div>
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

  // Add loading check for both state and tourData
  if (!state || !tourData) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-100px)]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <button
          onClick={handleGoBack}
          className="flex items-center font-bold text-[14px] border rounded-full p-2 mt-3 px-5  bg-gray-100 text-gray-600 mb-3"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1 text-gray-600">
            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg p-4 py-6 mb-6 shadow-sm">
              <div className="flex">
                <img src={tourData.imageUrl || state.tourImage || 'https://cdn.meetup.travel/default-tour-image.jpg'}
                  alt={tourData.title}
                  className="w-32 h-14 object-cover mr-2" />
                <div>
                  <h1 className="text-lg font-bold">{tourData.title}</h1>
                </div>
              </div>
              <div className="text-sm mt-6 text-black ">
                <div dangerouslySetInnerHTML={{ __html: tourData.description || 'No description available.' }}></div>
              </div>
              <div className="text-sm mt-2 text-gray-500">
                {selectedDate ? formatDisplayDate(selectedDate) : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="mt-2">
                {/* Hiển thị số lượng từ formState với tên gói dịch vụ chính xác */}
                {formState.quantities.adult > 0 && <p className="text-sm text-gray-500">{pricingLabels.adult}: {formState.quantities.adult}</p>}
                {formState.quantities.childSmall > 0 && <p className="mt-2 text-sm text-gray-500">{pricingLabels.childSmall}: {formState.quantities.childSmall}</p>}
                {formState.quantities.childBig > 0 && <p className="mt-2 text-sm text-gray-500">{pricingLabels.childBig}: {formState.quantities.childBig}</p>}
                {formState.quantities.adultRoundTrip > 0 && <p className="mt-2 text-sm text-gray-500">{pricingLabels.adultRoundTrip}: {formState.quantities.adultRoundTrip}</p>}
                {formState.quantities.childRoundTrip > 0 && <p className="mt-2 text-sm text-gray-500">{pricingLabels.childRoundTrip}: {formState.quantities.childRoundTrip}</p>}
              </div>
              <div className="border mt-2"></div>
              <div className="font-bold mt-2">${totalPrice.toFixed(2)} | {tourData.duration} {tourData.duration === 1 ? 'day' : 'days'}</div>
            </div>

            {/* Pick date & time */}

            <div className="bg-white rounded-lg p-6 mb-6 shadow-xl">
              <h2 className="text-lg font-medium mb-4">Pick date & time</h2>
              <div className="grid grid-cols-8 gap-[4px]">
                <div
                  className="flex flex-col items-center justify-center bg-[hsl(42,100%,84%)] rounded-lg py-4 cursor-pointer"
                  onClick={() => setShowCalendar(!showCalendar)}
                >                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                {showCalendar && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="bg-white rounded-xl p-6 relative">

                      {/* Component DatePicker hiển thị lịch */}
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date: Date | null) => {
                          if (date) {
                            setSelectedDate(date); // cập nhật ngày
                            setShowCalendar(false); // ẩn modal
                          }
                        }}
                        inline
                      />

                    </div>
                  </div>
                )}

                {[...Array(7)].map((_, idx) => {
                  const baseDate = selectedDate || new Date(); // Ưu tiên dùng selectedDate
                  const startOfWeek = new Date(baseDate);
                  const day = startOfWeek.getDay();
                  const diffToMonday = day === 0 ? -6 : 1 - day; // nếu là Chủ Nhật (0), lùi 6 ngày
                  startOfWeek.setDate(baseDate.getDate() + diffToMonday);

                  const date = new Date(startOfWeek);
                  date.setDate(startOfWeek.getDate() + idx);

                  const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateSelect(date)}
                      className={`text-center py-2 rounded-lg w-full focus:outline-none ${isSelected ? 'bg-teal-500 text-white' : 'bg-gray-100'
                        }`}
                    >
                      <div className={`text-xs mb-1 ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-sm font-semibold">{date.getDate()}</div>
                      <div className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Pick-up */}
              <div className="border mt-6 mb-6  "></div>
              <div className="">
                <h2 className="text-lg font-medium mb-4">Pick-up</h2>

                <div className="flex flex-nowrap items-start gap-4 mb-4 ">
                  {/* Location Dropdown */}
                  <div className="flex-shrink-0">
                    <label className="block text-sm  mb-2 text-gray-400">Location</label>
                    <div className="relative inline-block text-[14px]">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="inline-flex items-center border border-gray-300 rounded-xl px-4 py-2 bg-white shadow-sm transition-all duration-300 hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 w-auto"
                      >
                        <span className="text-gray-700 font-medium mr-2 whitespace-nowrap max-w-[250px] truncate">
                          {selectedLocation?.label || 'Choose location'}
                        </span>
                        <svg
                          className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''
                            }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {showDropdown && (
                        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl animate-fade-in-up">
                          {locations.map((loc, index) => (
                            <div
                              key={loc.value}
                              onClick={() => {
                                setFormData({ ...formData, location: loc.value });
                                setShowDropdown(false);
                              }}
                              className="cursor-pointer px-4 py-2 hover:bg-gray-50"
                            >
                              <div
                                className={`w-full px-2 pb-2 text-[14px] flex justify-between items-center font-bold transition-colors
                  ${loc.value === formData.location ? 'text-teal-500' : 'text-gray-800'} 
                  hover:text-teal-200
                  ${index !== locations.length - 1 ? 'border-b border-gray-200' : ''}`}
                              >
                                <span className="text-[14px]">{loc.label}</span>
                                {loc.value === formData.location && <Check className="w-4 h-4" />}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address input */}
                  <div className="flex-grow">
                    <label className="block text-sm text-gray-400 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                      className="inline-flex items-center border border-gray-300 rounded-xl px-4 py-2 bg-white shadow-sm transition-all duration-300 hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
                    />
                  </div>
                </div>


              </div>
              <div className="border mt-6 mb-6  "></div>
              {/* Quantity and Additional Service Container */}
              <div className="flex justify-between gap-4 mb-6">
                {/* Quantity Section */}
                <div className=" flex-1">
                  <h2 className="text-lg font-medium mb-4">Quantity</h2>
                  <div className="border mt-4 mb-4  "></div>
                  <div className="space-y-3 text-sm">
                    {tourData.pricingOptions && tourData.pricingOptions.length > 0 ? (
                      // Use pricing options from API
                      tourData.pricingOptions.map(option => {
                        // Tìm số lượng của pricing option này
                        const pricingQuantity = pricingQuantities.find(pq => pq.id === option.id);
                        const quantity = pricingQuantity ? pricingQuantity.amount : 0;

                        // Map to our quantity keys
                        let quantityKey: keyof typeof formState.quantities;

                        if (option.isRoundTrip) {
                          quantityKey = option.customerType.toLowerCase().includes('child') ? 'childRoundTrip' : 'adultRoundTrip';
                        } else {
                          if (option.customerType.toLowerCase().includes('child')) {
                            quantityKey = option.customerType.toLowerCase().includes('0-2') ? 'childSmall' : 'childBig';
                          } else {
                            quantityKey = 'adult';
                          }
                        }

                        return (
                          <div key={option.id} className="flex justify-between items-center">
                            <span className="font-bold">{option.customerType} {option.isRoundTrip ? '(Round Trip)' : ''}</span>
                            <div className="flex items-center">
                              <span className="mr-3 font-bold">${option.price.toFixed(2)}</span>
                              <button
                                onClick={() => decrement(quantityKey, option.id)}
                                className={`w-8 h-8 font-bold rounded-full ${quantity === 0 ? 'bg-gray-200 text-gray-400' : 'bg-gray-100'}`}
                                style={{ opacity: quantity === 0 ? 0.5 : 1 }}
                              >
                                -
                              </button>
                              <span className="w-8 font-bold text-gray-400 text-center">
                                {quantity.toString().padStart(2, '0')}
                              </span>
                              <button
                                onClick={() => increment(quantityKey, option.id)}
                                className="w-8 h-8 font-bold rounded-full bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      // Fallback to default pricing
                      [
                        { label: 'Adult', price: tourData.price, value: formState.quantities.adult, key: 'adult' },
                        { label: 'Child 0-2', price: 0, value: formState.quantities.childSmall, key: 'childSmall' },
                        { label: 'Child 3-10', price: tourData.price * 0.5, value: formState.quantities.childBig, key: 'childBig' },
                        { label: 'Round trip Adult', price: tourData.price * 1.8, value: formState.quantities.adultRoundTrip, key: 'adultRoundTrip' },
                        { label: 'Round trip child 3-10', price: tourData.price * 0.5 * 1.8, value: formState.quantities.childRoundTrip, key: 'childRoundTrip' },
                      ].map(({ label, price, value, key }) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="font-bold">{label}</span>
                          <div className="flex items-center">
                            <span className="mr-3 font-bold">${price.toFixed(2)}</span>
                            <button
                              onClick={() => decrement(key as QuantitiesKey)}
                              className={`w-8 h-8 font-bold rounded-full ${value === 0 ? 'bg-gray-200 text-gray-400' : 'bg-gray-100'}`}
                              style={{ opacity: value === 0 ? 0.5 : 1 }}
                            >
                              -
                            </button>
                            <span className="w-8 font-bold text-gray-400 text-center">{value.toString().padStart(2, '0')}</span>
                            <button onClick={() => increment(key as QuantitiesKey)} className="w-8 h-8 font-bold rounded-full bg-gray-100">+</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Additional Service Section */}
                <div className="flex-1">
                  <h2 className="text-lg font-medium mb-4">Additional service</h2>
                  <div className="border mt-4 mb-4"></div>
                  <div className="space-y-3 text-sm">
                    {tourData.additionalServices && tourData.additionalServices.length > 0 ? (
                      // Use additional services from API
                      tourData.additionalServices.map(service => (
                        <div key={service.id} className="flex justify-between items-center">
                          <div>
                            <span className="mr-5 font-bold">{service.name}</span><br />
                            <span className="mr-3 text-sm text-gray-500">Add ${service.price.toFixed(2)} per {service.priceUnit}</span>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => decrementService(service.name)}
                              className={`w-8 h-8 font-bold rounded-full ${(formState.additionalServices[service.name] || 0) === 0 ? 'bg-gray-200 text-gray-400' : 'bg-gray-100'}`}
                              style={{ opacity: (formState.additionalServices[service.name] || 0) === 0 ? 0.5 : 1 }}
                            >
                              -
                            </button>
                            <span className="w-8 font-bold text-gray-400 text-center">
                              {(formState.additionalServices[service.name] || 0).toString().padStart(2, '0')}
                            </span>
                            <button onClick={() => incrementService(service.name)} className="w-8 h-8 font-bold rounded-full bg-gray-100">+</button>
                          </div>
                        </div>
                      ))
                    ) : (
                      // Show empty state or fallback
                      <div className="text-gray-500">No additional services available</div>
                    )}
                  </div>
                </div>
              </div>

            </div>
            {/* Communications */}
            <div className="">
              <h2 className="text-lg font-medium mb-4">Communications</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm  text-gray-500 font-medium mb-2">
                    Name  <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="inline-flex items-center border text-[14px] rounded-xl px-4 py-2 bg-[hsl(0,0,94%)]  shadow-sm transition-all duration-300  focus:outline-none focus:ring-2 focus:ring-teal-400 w-full"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-500 font-medium mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="inline-flex items-center border text-[14px] rounded-xl px-4 py-2 bg-[hsl(0,0,94%)]  shadow-sm transition-all duration-300  focus:outline-none focus:ring-2 focus:ring-teal-400 w-full"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-500 font-medium mb-2">
                    Whatsapp number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className="inline-flex items-center border text-[14px] rounded-xl px-4 py-2 bg-[hsl(0,0,94%)]  shadow-sm transition-all duration-300  focus:outline-none focus:ring-2 focus:ring-teal-400 w-full"
                    placeholder="Enter your Whatsapp number"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-500 font-medium mb-2">
                  Note for Meetup Team
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  className="inline-flex items-center border text-[14px] rounded-xl px-4 py-2 bg-[hsl(0,0,94%)]  shadow-sm transition-all duration-300  focus:outline-none focus:ring-2 focus:ring-teal-400 w-full h-20"
                  rows={4}
                  placeholder="Note for Meetup "
                />
              </div>
            </div>
          </div>

          {/* Right Column - Confirmation Box */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <h2 className="text-lg font-medium mb-4">Confirm information:</h2>
              <div className="border mt-4 mb-4"></div>
              <div className="mb-6">
                <p className="font-bold font-medium text-[14px]">{tourData.title}</p>
                <div className="flex text-[14px] mt-2">
                  <p className="mr-1 font-bold text-[hsl(0,0,66%)]">Departure date:</p>
                  <span className="font-bold font-medium text-black">{formatDisplayDate(selectedDate)}</span>
                  <p className="mx-1">|</p>
                  <p className="mr-1 font-bold text-[hsl(0,0,66%)]">End date:</p>
                  <span className="font-bold font-medium text-black">{formatDisplayDate(endDate)}</span>
                </div>
                <div className="flex">
                  <p className="mr-1 text-sm font-bold text-[hsl(0,0,66%)]">Name:</p>
                  <p className="text-[14px] font-medium text-black">{formData.name || ''}</p>
                </div>
                <div className="flex">
                  <p className="mr-1 text-sm font-bold text-[hsl(0,0,66%)]">Whatsapp number:</p>
                  <p className="text-[14px] font-medium text-black">{formData.whatsapp || ''}</p>
                </div>
                <div className="flex text-sm text-gray-500">
                  <p className="mr-1 text-sm font-bold text-[hsl(0,0,66%)]">Email:</p>
                  <p className="text-[14px] font-medium text-black">{formData.email || ''}</p>
                </div>
                <div className="flex flex-wrap text-sm">
                  <p className="mt-2 font-medium text-[hsl(0,0,66%)]">
                    {/* Display quantities from pricingQuantities if available, otherwise fall back to old method */}
                    {pricingQuantities.length > 0 && tourData.pricingOptions ? (
                      <>
                        {tourData.pricingOptions.map(option => {
                          const pricingQty = pricingQuantities.find(pq => pq.id === option.id);
                          if (!pricingQty || pricingQty.amount <= 0) return null;

                          return (
                            <span key={option.id} className="mr-2">
                              {option.customerType} {option.isRoundTrip ? '(Round Trip)' : ''}:
                              <span className="text-black ml-1">{pricingQty.amount}</span>
                            </span>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        {formState.quantities.adult > 0 && <span>{pricingLabels.adult}: <span className="text-black">{formState.quantities.adult}</span>  </span>}
                        {formState.quantities.childSmall > 0 && <span className="ml-2">{pricingLabels.childSmall}: <span className="text-black">{formState.quantities.childSmall}</span> </span>}
                        {formState.quantities.childBig > 0 && <span className="ml-2">{pricingLabels.childBig}: <span className="text-black">{formState.quantities.childBig}</span>  </span>}
                        {formState.quantities.adultRoundTrip > 0 && <span className="ml-2">{pricingLabels.adultRoundTrip}: <span className="text-black">{formState.quantities.adultRoundTrip}</span>  </span>}
                        {formState.quantities.childRoundTrip > 0 && <span className="ml-2">{pricingLabels.childRoundTrip}: <span className="text-black">{formState.quantities.childRoundTrip}</span></span>}
                      </>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap text-sm text-gray-500">
                  <p className="mt-3 text-sm font-bold text-[hsl(0,0,66%)]">Note for Meetup:</p>
                  <p className="mt-2 items-center border text-[14px] rounded-xl px-4 py-2 bg-[hsl(0,0,94%)] shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full h-14">
                    {formData.note || ''}
                  </p>
                </div>
              </div>

              <p className="text-sm text-[hsl(0,0,66%)] mb-6">
                After payment, you and your tour guide will receive each other's emails and WhatsApp to plan the trip in detail!
              </p>

              <div className="mb-6">
                <p className="text-sm mb-2">Please read the <a className="font-bold underline" href="https://meetuptravel.blogspot.com/2024/07/terms.html?m=1"> Terms and Conditions</a> carefully before making payment</p>
                <label className="text-[hsl(0,0,66%)] flex items-center text-sm">
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleInputChange}
                    className="mr-2"
                    required
                  />
                  I agreed with <span className="text-[hsl(0,0,66%)] ml-1">terms and conditions</span>
                </label>
              </div>

              {/* Payment options */}
              <div className="mb-4">
                <p className="font-medium mb-2">Payment methods:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowQR(false)}
                    className={`px-3 py-1 rounded text-sm ${!showQR ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}>
                    Credit Card
                  </button>
                  <button
                    onClick={() => setShowQR(true)}
                    className={`px-3 py-1 rounded text-sm ${showQR ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}>
                    VietQR Transfer
                  </button>
                </div>
              </div>

              {showQR ? (
                /* VietQR Payment Option */
                <div className="mb-4">
                  <div className="text-center mb-3">
                    <p className="text-sm text-gray-600 mb-1">Scan this QR code with your banking app</p>
                    <p className="text-sm font-bold">Amount: {(totalPrice * conversionRate).toLocaleString()} VND</p>
                  </div>
                  <div className="flex justify-center mb-3">
                    <img
                      src={vietQRUrl}
                      alt="VietQR Payment"
                      className="w-64 h-auto"
                    />
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    <p>Bank: BIDV</p>
                    <p>Account: {ACCOUNT_NO}</p>
                    <p>Name: {ACCOUNT_NAME}</p>
                    <p className="mt-2">After payment, click "I've Paid" below</p>
                  </div>
                </div>
              ) : (
                /* Credit Card Payment Option */
                <div className="flex mb-2 w-36 space-x-2">
                  <img src="https://meetup.travel/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpci-image.63296345.png&w=128&q=75" alt="JCB" className="h-6" />
                  <img src="https://meetup.travel/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmaster-card.3bff22e1.png&w=128&q=75" alt="MasterCard" className="h-6" />
                  <img src="https://meetup.travel/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvisa.8c08854f.png&w=128&q=75" alt="Visa" className="h-6" />
                </div>
              )}

              {/* Payment Section */}
              <div>
                <div className="bg-teal-500 text-white p-2 rounded-md mb-2">
                  <div className="text-sm">Total</div>
                  <div className="flex justify-between items-center">
                    <div className="font-bold">
                      <span className="text-white">${totalPrice.toFixed(2)}</span> | <span>{(totalPrice * conversionRate).toLocaleString()} VND</span>
                    </div>
                    <button
                      onClick={showQR ? handleVietQRPayment : handleSubmit}
                      disabled={!formData.agreedToTerms || !formData.name || !formData.email || !formData.whatsapp || !selectedDate}
                      className={`bg-white ${formData.agreedToTerms && formData.name && formData.email && formData.whatsapp && selectedDate ? 'text-teal-500' : 'text-gray-400'} px-3 py-1 rounded font-medium`}
                    >
                      {showQR ? "I've Paid" : "Book Now"}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="bg-red-100 text-red-700 p-2 rounded mt-2 text-sm">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage; 