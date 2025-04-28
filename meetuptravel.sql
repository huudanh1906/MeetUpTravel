-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 28, 2025 at 08:19 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `meetuptravel`
--

-- --------------------------------------------------------

--
-- Table structure for table `additional_services`
--

CREATE TABLE `additional_services` (
  `id` bigint(20) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `price_unit` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `additional_services`
--

INSERT INTO `additional_services` (`id`, `description`, `name`, `price`, `price_unit`) VALUES
(2, '', 'Esim 15 days', 10.00, 'sim'),
(3, '', '16-seat car pickup', 32.00, 'car'),
(4, '', '4-seat car pickup', 15.00, 'car'),
(5, '', 'Esim 30 days', 15.00, 'sim'),
(6, '', '7-seat car pickup', 20.00, 'car'),
(7, '', '23:30 (Hanoi - Sapa)', 0.00, '1'),
(8, '', '7:00 (Hanoi - Sapa)', 0.00, '1'),
(9, '', '8:30 (Hanoi - Sapa)', 0.00, '1'),
(10, '', '13:30 (Hanoi - Sapa)', 0.00, '1'),
(11, '', '22:15 (Hanoi - Sapa)', 0.00, '1'),
(12, '', '6:30 (Hanoi - Sapa)', 0.00, '1'),
(13, '', '13:00 (Hanoi - Sapa)', 0.00, '1'),
(14, '', '9:30 (Hanoi - Sapa)', 0.00, '1'),
(15, '', '22:00 (Hanoi - Sapa)', 0.00, '1'),
(16, '', '22:45 (Hanoi - Sapa)', 0.00, '1'),
(17, '', '10:30 (Hanoi - Sapa)', 0.00, '1'),
(18, '', '14:30 (Hanoi - Sapa)', 0.00, '1'),
(19, '', '10:00 (Sapa - Hanoi)', 0.00, '1'),
(20, '', '07:00 (Sapa - Hanoi)', 0.00, '1'),
(21, '', '12:30 (Sapa - Hanoi)', 0.00, '1'),
(22, '', '14:30 (Sapa - Hanoi)', 0.00, '1'),
(23, '', '11:30 (Sapa - Hanoi)', 0.00, '1'),
(24, '', '23:00 (Sapa - Hanoi)', 0.00, '1'),
(25, '', '13:30 (Sapa - Hanoi)', 0.00, '1'),
(26, '', '08:30 (Sapa - Hanoi)', 0.00, '1'),
(27, '', '16:00 (Sapa - Hanoi)', 0.00, '1'),
(28, '', '22:00 (Sapa - Hanoi)', 0.00, '1'),
(29, '', '18:00 (Sapa - Hanoi)', 0.00, '1'),
(30, '', '23:30 (Sapa - Hanoi)', 0.00, '1'),
(31, '', '17:00 (Sapa - Hanoi)', 0.00, '1'),
(32, '', '14:00 (Sapa - Hanoi)', 0.00, '1'),
(36, '', 'Lunch', 12.00, 'pax'),
(37, '', 'Ao Dai rental', 10.00, 'unit'),
(38, '', 'Perfume workshop making 30ml bottles', 60.00, 'pax'),
(39, '', 'Perfume workshop making 10ml bottles', 35.00, 'pax');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint(20) NOT NULL,
  `booking_time` datetime(6) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `departure_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `note_for_meetup` text DEFAULT NULL,
  `payment_id` varchar(255) DEFAULT NULL,
  `pickup_address` varchar(255) DEFAULT NULL,
  `pickup_location` varchar(255) DEFAULT NULL,
  `status` enum('PENDING','CONFIRMED','CANCELLED','COMPLETED') NOT NULL,
  `total_price` decimal(38,2) NOT NULL,
  `whatsapp_number` varchar(255) DEFAULT NULL,
  `tour_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `booking_time`, `customer_email`, `customer_name`, `departure_date`, `end_date`, `note_for_meetup`, `payment_id`, `pickup_address`, `pickup_location`, `status`, `total_price`, `whatsapp_number`, `tour_id`) VALUES
(3, '2025-04-25 19:50:04.000000', 'khiem@gmail.com', 'khiem', '2025-04-27', '2025-04-27', '', NULL, '', 'Hotel in Old Quarter / Noi Bai Airport / Sapa', 'PENDING', 19.60, '0273541782', 2),
(6, '2025-04-26 08:37:47.000000', 'lam@gmail.com', 'Lam', '2025-04-28', '2025-04-29', '', NULL, '', 'Ho Chi Minh City', 'CONFIRMED', 28.00, '0733873264', 3),
(7, '2025-04-26 08:45:28.000000', 'lam@gmail.com', 'Lam', '2025-04-28', '2025-04-29', '', NULL, '', 'Ho Chi Minh City', 'COMPLETED', 28.00, '0733873264', 3),
(8, '2025-04-26 09:58:26.000000', 'tu@gmail.com', 'Tu', '2025-04-30', '2025-05-01', '', NULL, '', 'Hotel in Old Quarter', 'PENDING', 91.00, '0373821542', 4);

-- --------------------------------------------------------

--
-- Table structure for table `booking_additional_services`
--

CREATE TABLE `booking_additional_services` (
  `id` bigint(20) NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `service_type` varchar(255) NOT NULL,
  `subtotal` decimal(38,2) NOT NULL,
  `additional_service_id` bigint(20) DEFAULT NULL,
  `booking_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_additional_services`
--

INSERT INTO `booking_additional_services` (`id`, `price`, `quantity`, `service_name`, `service_type`, `subtotal`, `additional_service_id`, `booking_id`) VALUES
(2, 0.00, 1, '14:30 (Hanoi - Sapa)', '1', 0.00, 18, 3),
(3, 35.00, 1, 'Perfume workshop making 10ml bottles', 'pax', 35.00, 39, 8);

-- --------------------------------------------------------

--
-- Table structure for table `booking_pricing_options`
--

CREATE TABLE `booking_pricing_options` (
  `id` bigint(20) NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `subtotal` decimal(38,2) NOT NULL,
  `booking_id` bigint(20) NOT NULL,
  `pricing_option_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_pricing_options`
--

INSERT INTO `booking_pricing_options` (`id`, `price`, `quantity`, `subtotal`, `booking_id`, `pricing_option_id`) VALUES
(4, 19.60, 1, 19.60, 3, 6),
(7, 28.00, 1, 28.00, 6, 7),
(8, 28.00, 1, 28.00, 7, 7),
(9, 32.00, 1, 32.00, 8, 11),
(10, 24.00, 1, 24.00, 8, 12);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `description`, `name`) VALUES
(1, 'Culture tours and activities', 'Culture'),
(2, 'Adventure tours and activities', 'Adventure'),
(3, 'Food tour tours and activities', 'Food tour'),
(4, 'Diving tours and activities', 'Diving'),
(5, 'Motorbike tours and activities', 'Motorbike'),
(6, 'Trekking tours and activities', 'Trekking'),
(7, 'Paragliding tours and activities', 'Paragliding'),
(8, 'Surf tours and activities', 'Surf'),
(9, 'Nature tours and activities', 'Nature'),
(10, 'Bicycle tours and activities', 'Bicycle'),
(11, 'Luxury tours and activities', 'Luxury'),
(12, 'Cruise tours and activities', 'Cruise'),
(13, 'Walking tours and activities', 'Walking');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) NOT NULL,
  `amount` decimal(38,2) NOT NULL,
  `currency` varchar(10) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `payment_status` enum('PENDING','COMPLETED','FAILED','REFUNDED') NOT NULL,
  `payment_time` datetime(6) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `booking_id` bigint(20) NOT NULL,
  `bank_code` varchar(50) DEFAULT NULL,
  `card_type` varchar(50) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `order_reference` varchar(100) DEFAULT NULL,
  `response_code` varchar(50) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tours`
--

CREATE TABLE `tours` (
  `id` bigint(20) NOT NULL,
  `description` text DEFAULT NULL,
  `duration` int(11) NOT NULL,
  `featured` bit(1) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `max_pax` int(11) NOT NULL,
  `min_pax` int(11) NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `rating` float NOT NULL,
  `title` varchar(255) NOT NULL,
  `schedule_description` text DEFAULT NULL,
  `youtube_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tours`
--

INSERT INTO `tours` (`id`, `description`, `duration`, `featured`, `image_url`, `max_pax`, `min_pax`, `price`, `rating`, `title`, `schedule_description`, `youtube_url`) VALUES
(1, '<p><strong>Fast-Track service</strong>&nbsp;helps you save time by avoiding the endless lines, especially during rush hours at the visa and custom counter Skip long lines, and receive assistance at checkpoints. Get assistance with any Visa or Immigration and Customs procedures When arriving, our representative will welcome and help you with all the post-flight procedures (for arrival flights).</p>', 0, b'0', 'https://cdn.meetup.travel/dich-vu-don-tien-khach-fast-track.jpg', 100, 1, 30.00, 0, 'FAST TRACK SERVICE - Note your flight detail when booking', '<p class=\"schedule-section-title\" data-section-title=\"Process: FAST TRACK\"><strong>Process: FAST TRACK</strong></p><p>Meetup Travel\'s VIP Fast-Track Service, available at&nbsp;<strong>Tan Son Nhat, Noi Bai, Da Nang, and Phu Quoc International Airports, will make your Vietnam trip stress-free</strong>. You can skip long immigration lines and breeze through the Priority Immigration Lane for a smooth, hassle-free experience.</p><p>For instant confirmation, share your flight details and preferred meet-up time (for departures). Upon arrival, our friendly staff will greet you with a personalized sign and assist with all formalities. Whether you’re landing in Ho Chi Minh City, Hanoi, Da Nang, or Phu Quoc, let Meetup Travel make your arrival seamless. Book now for a worry-free start to your journey!</p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p class=\"schedule-section-title\" data-section-title=\"What We Offer:\"><strong>What We Offer:</strong></p><p><strong>What We Offer:</strong></p><p>At Vietnam Airport Fast Track Service, we are dedicated to enhancing your travel experience with personalized, efficient, and professional assistance. Whether you\'re traveling through&nbsp;<strong>Hanoi Noi Bai, Tan Son Nhat, Da Nang, or Phu Quoc International Airport</strong>, we ensure your journey is seamless and stress-free.</p><p><strong>Meet and Greet:</strong></p><p>Upon arrival, our friendly, multilingual staff will welcome you with a personalized meet-and-greet service. We’ll guide you through immigration and customs, ensuring a smooth transition from the aircraft to your transportation.</p><p><strong>Fast-Track Immigration:</strong></p><p>With our expedited immigration processing, you can skip the long queues and avoid delays. It is available at all major airports: Hanoi Noi Bai, Tan Son Nhat (Ho Chi Minh City), Da Nang, and Phu Quoc.</p><p><strong>Exclusive Lounge Access (extra):</strong></p><p>Relax in luxury with access to exclusive lounges. Whether you\'re a business traveler seeking a productive environment or a leisure traveler looking to unwind, our lounges at all four airports offer premium comfort and convenience.</p><p><strong>Baggage Handling (extra $12/pax):</strong></p><p>Let us handle your luggage for a stress-free experience. Our team will ensure that your bags are handled with care and delivered promptly so you can focus on enjoying your trip.</p><p><img src=\"https://cdn.meetup.travel/fast-track-meetup-2.jpg\" width=\"442\" height=\"248\" class=\"schedule-image\" style=\"object-fit: cover;\"></p><p><img src=\"https://cdn.meetup.travel/fast-track-meetup-1.jpg\" width=\"442\" height=\"248\" class=\"schedule-image\" style=\"object-fit: cover;\"></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p class=\"schedule-section-title\" data-section-title=\"Another Services:\"><strong>Another Services:</strong></p><p><strong>Airport Transfers:</strong></p><p>Travel in comfort with our private airport transfer service, offering options tailored to your group size and needs:</p><ul><li>Private 4-seat Car – $15/way: Perfect for 1 to 2 passengers.</li><li>Private 7-seat Car – $20/way: Ideal for groups of 3 to 5 passengers.</li><li>Private 16-seat Car – $32/way: Best for larger groups of 6 to 12 passengers.</li></ul><p>Our driver will be waiting at the airport exit holding a sign with your name, ready to assist you with your luggage and ensure a smooth transfer. You’ll be taken directly to your hotel door without any delays, letting you relax after your long flight. Book now for a hassle-free, seamless travel experience!</p><p><strong>eSIM Services:</strong></p><p>Stay connected throughout your trip with our easy and convenient eSIM service, powered by&nbsp;<strong>Viettel</strong>—Vietnam\'s largest mobile network provider with nationwide coverage.</p><ul><li><strong>5GB/day of high-speed 4G data</strong>&nbsp;ensures seamless internet access anywhere in Vietnam.</li><li>Quick and hassle-free activation via QR code—no physical SIM card required.</li><li>While the eSIM doesn’t support traditional calls, you can easily stay in touch with everyone through WhatsApp or other messaging apps.</li></ul><p><strong>Pricing:</strong></p><ul><li>eSIM (15 days): $10</li><li>eSIM (30 days): $15</li></ul><p>Enjoy reliable connectivity and focus on exploring Vietnam without worrying about staying online. Book your eSIM now for instant setup!</p><p><img src=\"https://cdn.meetup.travel/150255217_4025392440813725_1555766780124450271_n.jpg\" width=\"442\" height=\"248\" class=\"schedule-image\" style=\"object-fit: cover;\"></p><p><img src=\"https://cdn.meetup.travel/xe-dua-don-san-bay-noi-bai.jpg\" width=\"442\" height=\"248\" class=\"schedule-image\" style=\"object-fit: cover;\"></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p class=\"schedule-section-title\" data-section-title=\"Why Choose Us:\"><strong>Why Choose Us:</strong></p><ul><li><strong>Expertise:</strong>&nbsp;With years of experience, Meetup Travel provides exceptional services across Vietnam\'s busiest airports, ensuring that you have a smooth and stress-free journey every time.</li><li><strong>A Customer-Centric Approach:</strong>&nbsp;Your satisfaction is our priority. At Meetup Travel, we customize our services to meet your unique requirements, ensuring a personalized experience tailored just for you.</li><li><strong>Efficiency:</strong>&nbsp;We understand how valuable your time is. With Meetup Travel, you’ll save precious minutes and enjoy a seamless travel experience, allowing you to make the most of your trip to Vietnam.</li></ul><p>Choose Meetup Travel for unparalleled convenience and service at every step of your journey!</p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>', ''),
(2, '<p><strong>Your Comfortable Journey to Sapa Starts Here!</strong></p><p>Looking for a&nbsp;<strong>relaxing and hassle-free</strong>&nbsp;way to travel from&nbsp;<strong>Hanoi to Sapa</strong>? With&nbsp;<strong>HK Buslines</strong>, you can enjoy a smooth and comfortable journey featuring:</p><ul><li><strong>Spacious &amp; Cozy Sleeper Seats</strong>&nbsp;– Reclining beds with soft blankets, air conditioning, and a quiet atmosphere for a restful night’s sleep.</li><li><strong>Top-Tier Safety</strong>&nbsp;– Well-maintained buses and experienced drivers ensure a secure and smooth ride.</li><li><strong>Flexible Departure Times</strong>&nbsp;– Multiple options to fit your schedule.</li><li><strong>Scenic Views Along the Way</strong>&nbsp;– Admire the breathtaking mountain landscapes as you head to one of Vietnam’s most picturesque destinations.</li></ul><h3><strong>Luggage Policy</strong></h3><ul><li><strong>Standard Luggage Size</strong>: 61 cm (Larger bags count as two pieces).</li><li><strong>Each Passenger</strong>&nbsp;is allowed&nbsp;<strong>one suitcase + one handbag</strong>.</li></ul><h3><strong>Ticket Eligibility</strong></h3><ul><li><strong>Children under 5 years old</strong>&nbsp;travel free when sharing a bed with an adult.</li><li><strong>Children aged 6+</strong>&nbsp;are charged the same as adults.</li></ul><h3><strong>Important Travel Information</strong></h3><ul><li><strong>Shuttle Pickup Service</strong>&nbsp;– Group pickup at designated locations via shuttle car/minivan. Pickup starts&nbsp;<strong>15-45 minutes before departure</strong>, and drop-off takes&nbsp;<strong>15-45 minutes after arrival</strong>.</li><li><strong>Shoes must be take off before boarding</strong>&nbsp;sleeper buses.</li><li><strong>Cabin Bed Dimensions</strong>: 180 x 85 cm.</li><li><strong>Special Assistance Available</strong>&nbsp;for passengers who require additional support.</li><li><strong>Shared Transfer Notice</strong>&nbsp;– Travel time may vary due to traffic, weather conditions, and comfort breaks.</li></ul>', 0, b'0', 'https://cdn.meetup.travel/z5899367009674-85fa7fd28783caac6742381bfa54d4bc.jpg', 40, 1, 19.00, 0, 'Hanoi - Sapa Sleeper Bus by HK Buslines', '<p class=\"schedule-section-title\" data-section-title=\"Luxury Sleeper Bus from Hanoi to Sapa: Luxury Sleeper Bus from Hanoi to Sapa\"><strong>Luxury Sleeper Bus from Hanoi to Sapa: Luxury Sleeper Bus from Hanoi to Sapa</strong></p><p><strong>Duration: 6 hours - 7 hours (exclude pick up/drop off duration ~ 1 hour)</strong></p><p><strong>Stations :</strong></p><p><strong>Hanoi</strong></p><p>- Hanoi Old Quarter: 70 Nguyen Huu Huan.&nbsp;</p><p>- 132 Vo Chi Cong, Tay Ho.&nbsp;</p><p>- Noi Bai International Airport (HAN)</p><p><strong>Sapa</strong></p><p>- 697 Dien Bien Phu.&nbsp;</p><p>2 rest stops during the journey</p><p>Transport:&nbsp;bus</p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p class=\"schedule-section-title\" data-section-title=\"Trailer\"><strong>Trailer</strong></p><p><a href=\"https://www.youtube.com/embed/uLwiRxle0UM\" rel=\"noopener noreferrer\" target=\"_blank\">Xe khách HK BUSLINE-SAPA OPEN TOUR - YouTube</a></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>', 'https://www.youtube.com/watch?v=uLwiRxle0UM'),
(3, '<p>Discover Cu Chi Tunnels with an informative tour guide. Go underground to explore the tunnel system, walk around the forest, and try your hand at the shooting range.</p>', 1, b'0', 'https://cdn.meetup.travel/172230763351598.jpg', 20, 8, 28.00, 0, 'Cu Chi Tunnels Half-day Tour', '<p class=\"schedule-section-title\" data-section-title=\"Itinerary: Cu Chi Tunnels Half-day Tour\"><strong>Itinerary: Cu Chi Tunnels Half-day Tour</strong></p><p><strong>Morning Tour:</strong>&nbsp;07:30 AM – 1:30 PM</p><p><strong>Afternoon Tour:</strong>&nbsp;12:30 PM – 6:30 PM</p><p>(<strong>Duration:</strong>&nbsp;5-6 hours)</p><ul><li>Pick-up from hotels in District 1, Ho Chi Minh City.</li><li>Drive to Cu Chi Tunnels (approximately 1.5 hours).</li></ul><h4><strong>Cu Chi Tunnel Exploration (09:00 AM – 12:00 PM / 2:00 PM – 5:00 PM)</strong></h4><ul><li>Introduction &amp; Briefing (09:15 AM / 2:15 PM)</li><li>Learn about the history of Cu Chi Tunnels and their role in the Vietnam War.</li><li>Tunnel Experience (09:45 AM / 2:45 PM) – Optional</li><li>Explore and crawl through the underground tunnel system used for survival and combat.</li><li>Visit VC Workshop (10:00 AM / 3:00 PM)</li><li>Discover how the Viet Cong built weapons, traps, and war supplies.</li><li>Smokeless Kitchen &amp; Secret Bunker (10:20 AM / 3:20 PM)</li><li>See how VC soldiers prepared food without revealing their location.</li><li>Tapioca Root Tasting (10:40 AM / 3:40 PM)</li><li>Try tapioca root, a staple wartime food of the Viet Cong.</li><li>Shooting Range (11:00 AM / 4:00 PM) – Optional, Self-Funded</li><li>Experience shooting historical firearms at the on-site range.</li><li>Visit an Art Studio (11:30 AM / 4:30 PM)</li><li>Observe the process of traditional lacquerware craftsmanship.</li></ul><h4>Return to Ho Chi Minh City (12:00 PM – 1:30 PM / 5:00 PM – 6:30 PM)</h4><ul><li>Drive back to the city center.</li><li>Drop-off at the hotel or designated meeting point.</li></ul><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>', 'https://www.youtube.com/watch?v=uDE8fSmW5lU'),
(4, '<p>Immerse yourself in Vietnam’s rich artisanal heritage with this&nbsp;<strong>half-day cultural tour</strong>. Journey to&nbsp;<strong>Chuong Village</strong>, home to a 300-year-old conical hat-making tradition, where you\'ll meet skilled artisans and witness their meticulous craftsmanship. Then, explore&nbsp;<strong>Quang Phu Cau Incense Village</strong>, a vibrant hub of incense production, famous for its stunning, colorful incense bundles—a photographer’s dream! Gain a deeper understanding of rural craftsmanship by visiting the village’s largest incense factory. This tour offers a unique glimpse into Vietnam’s traditional industries, making it a&nbsp;<strong>perfect escape</strong>&nbsp;for culture lovers and photography enthusiasts.</p>', 1, b'0', 'https://cdn.meetup.travel/146.jpg', 15, 8, 32.00, 0, 'Incense Village & Hat Making Village in Hanoi Half Day Tour', '<p class=\"schedule-section-title\" data-section-title=\" Itinerary: Itinerary\"><strong> Itinerary: Itinerary</strong></p><p><strong>&nbsp;7:30 - 8:00 AM (Morning) | 12:00 - 12:30 PM (Afternoon)</strong></p><ul><li>Pick-up from Hanoi Old Quarter by our English-speaking tour guide.</li><li>Begin your cultural journey to Chuong Village, renowned for its 300-year-old conical hat-making tradition.</li><li>Meet skilled artisans, witness the delicate craftsmanship, and gain insight into the techniques behind these iconic Vietnamese hats.</li></ul><p><strong>Next Stop: Quang Phu Cau Incense Village</strong></p><ul><li>Explore this century-old village, known for its vibrant incense-making craft.</li><li>Stroll through the bustling village streets, where families engage in small-scale incense production.</li><li>Visit a specialist household that dyes incense sticks—capture stunning photos of the colorful incense bundles beautifully arranged in the sun.</li></ul><p><strong>Final Stop: The Largest Incense Factory in the Village</strong></p><ul><li>Get an in-depth look at the entire incense-making process, from raw materials to the final product.</li><li>Learn about local workers\' lives and the significance of incense in Vietnamese culture.</li></ul><p><strong>12:00 - 12:30 PM (Morning Tour) | 5:00 - 5:30 PM (Afternoon Tour)</strong></p><ul><li>Return to Hanoi. Drop off at either Hanoi Train Street or a location of your choice.</li></ul><p>Transport:&nbsp;motorbike</p><p><br></p><p class=\"schedule-section-title\" data-section-title=\" Chuong Village: The Home of Vietnam’s Conical Hats\"><strong> Chuong Village: The Home of Vietnam’s Conical Hats</strong></p><h3><strong>Chuong Village – The Home of Vietnam’s Conical Hats</strong></h3><p>Nestled on the outskirts of Hanoi, Chuong Village is renowned for its&nbsp;<strong>300-year-old tradition of making conical hats (nón lá)</strong>. This iconic Vietnamese craft has been passed down through generations, preserving its cultural significance.</p><ul><li>Meet local artisans and witness the delicate process of selecting, shaping, and stitching palm leaves to create the perfect nón lá.</li><li>Learn about the history and symbolic meaning of conical hats in Vietnamese daily life.</li><li>Hands-on experience: Watch craftsmen at work and gain insights into this time-honored tradition.</li></ul><p>A must-visit for those seeking authentic Vietnamese craftsmanship!</p><p><img src=\"https://cdn.meetup.travel/2c14dea1152a177506aace6eef1ac07e.jpeg\" width=\"442\" height=\"248\" class=\"schedule-image\" style=\"object-fit: cover;\"></p><p><img src=\"https://cdn.meetup.travel/chuong-local-market.jpg\" width=\"442\" height=\"248\" class=\"schedule-image\" style=\"object-fit: cover;\"></p><p><br></p><p class=\"schedule-section-title\" data-section-title=\" Quang Phu Cau Village: century-old incense-making hub\"><strong> Quang Phu Cau Village: century-old incense-making hub</strong></p><p>This village is famous for its vibrant, handcrafted incense sticks. It has preserved its traditional techniques while becoming a must-visit spot for culture lovers and photographers.</p><ul><li>Explore the incense craft from raw materials to the final product, witnessing artisans at work.</li><li>Capture stunning visuals of colorful incense bundles arranged in mesmerizing patterns.</li><li>Visit a specialist workshop to see the intricate dyeing process that gives the incense its bright hues.</li><li>Experience the village’s largest incense factory, where families continue this long-standing tradition.</li></ul><p><img src=\"https://cdn.meetup.travel/quang-phu-cau-meetup-3.jpg\" width=\"442\" height=\"248\" class=\"schedule-image\" style=\"object-fit: cover;\"></p><p><img src=\"https://cdn.meetup.travel/quang-phu-cau-meetup-2.jpg\" width=\"442\" height=\"248\" class=\"schedule-image\" style=\"object-fit: cover;\"></p><p><br></p>', 'https://www.youtube.com/watch?v=LC2Ikgzfb80'),
(5, '<p>Discover the vibrant charm of Hanoi in a unique and exciting way with our&nbsp;<strong>Hanoi City Half-Day Tour</strong>. Whether you prefer the classic&nbsp;<strong>Jeep</strong>, the stylish&nbsp;<strong>Vespa</strong>, the adventurous&nbsp;<strong>motorbike</strong>, or the eco-friendly&nbsp;<strong>bicycle</strong>, this tour offers a dynamic and immersive experience through the heart of Vietnam’s capital.</p><p>Explore both&nbsp;<strong>iconic landmarks</strong>&nbsp;and&nbsp;<strong>hidden gems</strong>, from the historic&nbsp;<strong>Ho Chi Minh Mausoleum</strong>&nbsp;to the bustling streets of the&nbsp;<strong>Old Quarter</strong>, the scenic&nbsp;<strong>West Lake</strong>, and the famous&nbsp;<strong>Train Street</strong>. This tour is perfect for those who want to see the real Hanoi, beyond the usual tourist routes.</p><p>With an expert local guide leading the way, you’ll enjoy&nbsp;<strong>authentic street food</strong>, interact with locals, and experience the city’s rich history and culture—all in just half a day!</p>', 1, b'0', 'https://cdn.meetup.travel/2023-05-06-20-25-04-166-01-scaled.jpg', 9, 1, 67.00, 0, 'TOURS HANOI CITY HALF DAY BY JEEP/VESPA/MOTORBIKE/BICYCLE', '<p class=\"schedule-section-title\" data-section-title=\" Itinenary: TOURS HANOI CITY HALF DAY\"><strong> Itinenary: TOURS HANOI CITY HALF DAY</strong></p><p><strong>Option 1: Morning Tour (8:00 - 12:00) | Option 2: Afternoon Tour (13:00 - 17:00)</strong></p><h3><strong>&nbsp;Stop 1: Pick-up &amp; Introduction</strong></h3><ul><li>Meet your guide at your hotel in Hanoi Old Quarter</li><li>Receive safety briefing and introduction to your chosen vehicle</li></ul><h3><strong>&nbsp;Stop 2: Ho Chi Minh Mausoleum &amp; Ba Dinh Square</strong>&nbsp;<em>(Outside Visit)</em></h3><ul><li>Explore the historic heart of Hanoi, home to the grand Ho Chi Minh Mausoleum and the Presidential Palace</li><li>Learn about Vietnam’s revolutionary leader and the country’s history</li></ul><h3><strong>&nbsp;Stop 3: West Lake &amp; Tran Quoc Pagoda</strong></h3><ul><li>Enjoy a scenic ride along Hanoi’s largest lake</li><li>Visit&nbsp;<strong>Tran Quoc Pagoda</strong>, the oldest Buddhist temple in Hanoi, dating back over 1,500 years</li></ul><h3><strong>&nbsp;Stop 4: The Hanoi Train Street (if open)</strong></h3><p>Witness the famous narrow railway track running through local homes</p><ul><li>Capture unique photos and enjoy a coffee at a trackside café</li></ul><h3><strong>&nbsp;Stop 5: Long Bien Bridge &amp; Red River Countryside (Bicycle/Motorbike Option)</strong></h3><ul><li>Ride across Hanoi’s historic Long Bien Bridge, designed by Gustave Eiffel</li><li>Visit a peaceful countryside area along the Red River to see local farms and villages</li></ul><h3><strong>&nbsp;Stop 6: Hidden Streets of the Old Quarter</strong></h3><ul><li>Dive into Hanoi’s bustling small alleys and markets</li><li>Discover street vendors, traditional homes, and local businesses</li></ul><h3><strong>&nbsp;Stop 7: Local Coffee or Street Food Experience</strong></h3><ul><li>Stop at a local café to enjoy&nbsp;<strong>egg coffee</strong>&nbsp;or fresh coconut coffee</li><li>Optional tasting of Hanoi’s famous street food, such as Bánh Mì or Phở</li></ul><h3><strong>&nbsp;Stop 8: Return to Hotel</strong></h3><ul><li>Drop-off at your hotel or any preferred location in Hanoi Old Quarter</li></ul><p><br></p><p><br></p><p><img src=\"https://cdn.meetup.travel/mausoleum.jpg\" width=\"442\" height=\"248\" class=\"schedule-image\" style=\"object-fit: cover;\"></p><p><img src=\"https://cdn.meetup.travel/ho-chi-minh-museum.jpg\" width=\"442\" height=\"248\" class=\"schedule-image\" style=\"object-fit: cover;\"></p><p><br></p>', 'https://www.youtube.com/watch?v=TbXqCJw96cQ');

-- --------------------------------------------------------

--
-- Table structure for table `tour_additional_services`
--

CREATE TABLE `tour_additional_services` (
  `tour_id` bigint(20) NOT NULL,
  `additional_service_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_additional_services`
--

INSERT INTO `tour_additional_services` (`tour_id`, `additional_service_id`) VALUES
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(2, 7),
(2, 8),
(2, 9),
(2, 10),
(2, 11),
(2, 12),
(2, 13),
(2, 14),
(2, 15),
(2, 16),
(2, 17),
(2, 18),
(2, 19),
(2, 20),
(2, 21),
(2, 22),
(2, 23),
(2, 24),
(2, 25),
(2, 26),
(2, 27),
(2, 28),
(2, 29),
(2, 30),
(2, 31),
(2, 32),
(4, 36),
(4, 37),
(4, 38),
(4, 39);

-- --------------------------------------------------------

--
-- Table structure for table `tour_categories`
--

CREATE TABLE `tour_categories` (
  `tour_id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_categories`
--

INSERT INTO `tour_categories` (`tour_id`, `category_id`) VALUES
(1, 11),
(2, 11),
(3, 1),
(3, 2),
(4, 1),
(5, 5),
(5, 10);

-- --------------------------------------------------------

--
-- Table structure for table `tour_excluded_services`
--

CREATE TABLE `tour_excluded_services` (
  `tour_id` bigint(20) NOT NULL,
  `service_description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_excluded_services`
--

INSERT INTO `tour_excluded_services` (`tour_id`, `service_description`) VALUES
(1, 'Government visa fee'),
(1, 'Visa change support fee'),
(3, 'Bullets (if you try shooting)'),
(3, 'Tips (optional)'),
(4, 'Personal expenses and souvenirs'),
(4, 'Meals and drinks not mentioned'),
(4, 'Travel insurance'),
(5, 'Additional food & drinks beyond the included tastings'),
(5, 'Personal expenses and souvenirs'),
(5, 'Tips for guide and driver'),
(5, 'Travel insurance');

-- --------------------------------------------------------

--
-- Table structure for table `tour_guides`
--

CREATE TABLE `tour_guides` (
  `tour_id` bigint(20) NOT NULL,
  `guide_language` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_guides`
--

INSERT INTO `tour_guides` (`tour_id`, `guide_language`) VALUES
(2, 'English tour guide'),
(1, 'English tour guide'),
(1, 'Vietnamese tour guide'),
(3, 'English tour guide'),
(3, 'Vietnamese tour guide'),
(4, 'English tour guide'),
(5, 'English tour guide');

-- --------------------------------------------------------

--
-- Table structure for table `tour_highlights`
--

CREATE TABLE `tour_highlights` (
  `tour_id` bigint(20) NOT NULL,
  `highlight` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_highlights`
--

INSERT INTO `tour_highlights` (`tour_id`, `highlight`) VALUES
(1, 'Available at Major Airports: Offered in Ho Chi Minh City, Hanoi, Phu Quoc, and Danang.'),
(1, 'No Waiting at the Airport: Skip the long lines and expedite your entry process.'),
(1, 'Time-Saving Convenience: Our service ensures you move swiftly through visa and immigration procedures.'),
(3, 'Visit a VC (Viet Cong) workshop to learn about their daily life.'),
(3, 'Experience wartime survival tactics, including trap-building and underground bunkers.'),
(3, 'Visit an Art Studio to observe traditional lacquerware craftsmanship.'),
(3, 'Interactive shooting range (optional, self-funded).'),
(3, 'Explore a 250km underground tunnel system used during the Vietnam War.'),
(4, 'Interact with friendly craftsmen and experience hands-on hat-making'),
(4, 'Learn about the traditional art of making Vietnam’s iconic conical hats (nón lá) from local artisans'),
(4, '✅ Enjoy a scenic countryside drive outside Hanoi'),
(4, 'Visit two traditional craft villages near Hanoi: Quang Phu Cau Incense Village and Chuong Conical Hat Village'),
(4, 'Witness the mesmerizing sight of colorful incense sticks drying in the sun'),
(4, 'Capture stunning Instagram-worthy photos of vibrant incense bundles'),
(5, 'Choose from Jeep, Vespa, motorbike, or bicycle for an adventurous experience'),
(5, 'Discover lesser-known local streets, vibrant markets, and historic sites'),
(5, 'Visit must-see attractions such as the Old Quarter, Ho Chi Minh Mausoleum, and West Lake'),
(5, 'Explore Hanoi’s iconic landmarks and hidden gems on a unique ride'),
(5, 'Ride with experienced local guides for an insightful and safe journey');

-- --------------------------------------------------------

--
-- Table structure for table `tour_images`
--

CREATE TABLE `tour_images` (
  `tour_id` bigint(20) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_images`
--

INSERT INTO `tour_images` (`tour_id`, `image_url`) VALUES
(2, 'https://cdn.meetup.travel/z5889631119786_08b56fc5a1dedcc5c517a436fb540315.jpg'),
(2, 'https://cdn.meetup.travel/z6427548546928_d5726764bb8db5639fb0d77ad29e5965.jpg'),
(2, 'https://cdn.meetup.travel/z5899367009674-85fa7fd28783caac6742381bfa54d4bc.jpg'),
(2, 'https://cdn.meetup.travel/z5889623306547_6c9b7dc28c193f6789aaf59887b42c8d.jpg'),
(2, 'https://cdn.meetup.travel/z5899366984249-c49822a0f25a1574bca22c2f297997d9.jpg'),
(1, 'https://cdn.meetup.travel/dich-vu-don-tien-khach-fast-track.jpg'),
(1, 'https://cdn.meetup.travel/z6262159459145_3bd88ffc8c236fb09cc0adc4427fd367.jpg'),
(1, 'https://cdn.meetup.travel/xe-dua-don-san-bay-noi-bai.jpg'),
(1, 'https://cdn.meetup.travel/z6249929208477_666194b4f506352f1665c736f0bf3f87.jpg'),
(1, 'https://cdn.meetup.travel/fast-track-meetup-1.jpg'),
(3, 'https://cdn.meetup.travel/1722307681239caption.jpg'),
(3, 'https://cdn.meetup.travel/1722307691990caption.jpg'),
(3, 'https://cdn.meetup.travel/172230763351598.jpg'),
(3, 'https://cdn.meetup.travel/1722307665218f7.jpg'),
(3, 'https://cdn.meetup.travel/172230763686497.jpg'),
(4, 'https://cdn.meetup.travel/b6.jpg'),
(4, 'https://cdn.meetup.travel/146.jpg'),
(4, 'https://cdn.meetup.travel/quang-phu-cau-village-chuong-hathai-2_jpg.jpg'),
(4, 'https://cdn.meetup.travel/fc.jpg'),
(4, 'https://cdn.meetup.travel/hanoi-incense-village-conical-hat-village-visit-half-day-2682036.webp'),
(5, 'https://cdn.meetup.travel/2023-05-06-20-25-04-166-01-scaled.jpg'),
(5, 'https://cdn.meetup.travel/hanoi-jeep-tours-17-1067x800.jpg'),
(5, 'https://cdn.meetup.travel/c2.jpg'),
(5, 'https://cdn.meetup.travel/2023-04-12-21-46-27-512-01.jpg'),
(5, 'https://cdn.meetup.travel/bc.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `tour_included_services`
--

CREATE TABLE `tour_included_services` (
  `tour_id` bigint(20) NOT NULL,
  `service_description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_included_services`
--

INSERT INTO `tour_included_services` (`tour_id`, `service_description`) VALUES
(2, 'Pickup and Drop off in Hanoi Old Quarter'),
(2, 'Pickup and Drop Off in Sapa'),
(2, 'A bottle of Water'),
(1, 'Welcome passengers at the arrival gate or drop'),
(1, 'Assist in picking up luggage for customers (additional)'),
(3, 'Tour guide'),
(3, 'Air-conditioned transportation'),
(3, 'Entry tickets'),
(3, 'Hotel pickup and drop-off at the center of District 1'),
(3, 'Bottled water and tapioca'),
(4, 'Private car transfer with an English-speaking driver'),
(4, 'Local guide to explain the history and craftsmanship'),
(4, 'Bottled water'),
(4, 'Hands-on experience in hat-making'),
(4, 'Entrance fees to both villages'),
(5, 'Transportation by Jeep/Vespa/motorbike/bicycle'),
(5, 'Bottled water'),
(5, 'Helmet and raincoat (for motorbike & Vespa options)'),
(5, 'Local street food or drinks'),
(5, 'Entrance fees to included attractions'),
(5, 'Professional English-speaking guide');

-- --------------------------------------------------------

--
-- Table structure for table `tour_pickup_points`
--

CREATE TABLE `tour_pickup_points` (
  `tour_id` bigint(20) NOT NULL,
  `pickup_point` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_pickup_points`
--

INSERT INTO `tour_pickup_points` (`tour_id`, `pickup_point`) VALUES
(2, 'Hotel in Old Quarter / Noi Bai Airport / Sapa'),
(1, 'Tan Son Nhat Airport (HCMC)'),
(1, 'Danang Airport'),
(1, 'Phu Quoc Airport'),
(1, 'Noi Bai Airport (Hanoi)'),
(3, 'Ho Chi Minh City'),
(4, 'Hotel in Old Quarter'),
(5, 'Hanoi in Old Quarter');

-- --------------------------------------------------------

--
-- Table structure for table `tour_pricing`
--

CREATE TABLE `tour_pricing` (
  `id` bigint(20) NOT NULL,
  `customer_type` varchar(255) NOT NULL,
  `is_round_trip` bit(1) NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `tour_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_pricing`
--

INSERT INTO `tour_pricing` (`id`, `customer_type`, `is_round_trip`, `price`, `tour_id`) VALUES
(1, 'Adult', b'0', 30.00, 1),
(2, 'Child 0-2', b'0', 0.00, 1),
(3, 'Child 3-10', b'0', 15.00, 1),
(4, 'Adult', b'1', 55.00, 1),
(5, 'Child 3-10', b'1', 28.00, 1),
(6, 'VIP Single Cabin', b'0', 19.60, 2),
(7, 'Big group MAX 20 PAX', b'0', 28.00, 3),
(8, 'Private Tour (Quantity-based pricing)', b'0', 0.00, 3),
(9, 'Small Group', b'0', 0.00, 3),
(11, 'Adult', b'0', 32.00, 4),
(12, 'Child 5-9', b'0', 24.00, 4),
(13, 'Child 0-4', b'0', 0.00, 4),
(14, 'Private (Quantity-based pricing)', b'0', 138.00, 4),
(15, 'Group tour <10 pax', b'0', 67.00, 5),
(16, 'Private Tour', b'0', 91.00, 5);

-- --------------------------------------------------------

--
-- Table structure for table `tour_reviews`
--

CREATE TABLE `tour_reviews` (
  `id` bigint(20) NOT NULL,
  `comment` text DEFAULT NULL,
  `platform` varchar(255) NOT NULL,
  `rating` float NOT NULL,
  `review_date` date DEFAULT NULL,
  `reviewer_name` varchar(255) DEFAULT NULL,
  `tour_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `role` enum('USER','ADMIN') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `full_name`, `password`, `phone_number`, `role`) VALUES
(1, 'admin@example.com', 'Admin User', '$2a$10$sKQer38BPT79.ZPbP9eqeurIGjQh6frgvQdLjtH95kgkhwLT.WtyS', NULL, 'ADMIN');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `additional_services`
--
ALTER TABLE `additional_services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKi21lisuytk5t7tlp7lv51ny2l` (`tour_id`);

--
-- Indexes for table `booking_additional_services`
--
ALTER TABLE `booking_additional_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKos64p8kfesr7vhqyegbjarmsj` (`additional_service_id`),
  ADD KEY `FKjvxsfcv7nlcxs1gu5pop2g2rk` (`booking_id`);

--
-- Indexes for table `booking_pricing_options`
--
ALTER TABLE `booking_pricing_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKpovobvtpuyvwtx7v99kpgr2ly` (`booking_id`),
  ADD KEY `FK7ela1gyhcdiwlyhtapc5kwl41` (`pricing_option_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_t8o6pivur7nn124jehx7cygw5` (`name`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKc52o2b1jkxttngufqp3t7jr3h` (`booking_id`);

--
-- Indexes for table `tours`
--
ALTER TABLE `tours`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tour_additional_services`
--
ALTER TABLE `tour_additional_services`
  ADD PRIMARY KEY (`tour_id`,`additional_service_id`),
  ADD KEY `FKasapqsrlrsk2ajjqismw3fgtd` (`additional_service_id`);

--
-- Indexes for table `tour_categories`
--
ALTER TABLE `tour_categories`
  ADD PRIMARY KEY (`tour_id`,`category_id`),
  ADD KEY `FK540enrxlwoslqd60lsn7bwqw5` (`category_id`);

--
-- Indexes for table `tour_excluded_services`
--
ALTER TABLE `tour_excluded_services`
  ADD KEY `FK938928og6i5ugiv9aauf6lah6` (`tour_id`);

--
-- Indexes for table `tour_guides`
--
ALTER TABLE `tour_guides`
  ADD KEY `FK652qc1bgxlqjlxunyh7cren6m` (`tour_id`);

--
-- Indexes for table `tour_highlights`
--
ALTER TABLE `tour_highlights`
  ADD KEY `FKaq3ia4klpirbb018ll28wvx9r` (`tour_id`);

--
-- Indexes for table `tour_images`
--
ALTER TABLE `tour_images`
  ADD KEY `FKth1m2rd6q6ltp8kii2msvfi5d` (`tour_id`);

--
-- Indexes for table `tour_included_services`
--
ALTER TABLE `tour_included_services`
  ADD KEY `FKskufy8btoj3souk49ee3a39o6` (`tour_id`);

--
-- Indexes for table `tour_pickup_points`
--
ALTER TABLE `tour_pickup_points`
  ADD KEY `FK2a8jhmsgwewlm4jp9dt49mwx7` (`tour_id`);

--
-- Indexes for table `tour_pricing`
--
ALTER TABLE `tour_pricing`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKcbbxsg7ler3o4lfw5w7if5rbm` (`tour_id`);

--
-- Indexes for table `tour_reviews`
--
ALTER TABLE `tour_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKleylwsgv63q5xvdtxkcymch6i` (`tour_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `additional_services`
--
ALTER TABLE `additional_services`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `booking_additional_services`
--
ALTER TABLE `booking_additional_services`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `booking_pricing_options`
--
ALTER TABLE `booking_pricing_options`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tours`
--
ALTER TABLE `tours`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tour_pricing`
--
ALTER TABLE `tour_pricing`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tour_reviews`
--
ALTER TABLE `tour_reviews`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `FKi21lisuytk5t7tlp7lv51ny2l` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`);

--
-- Constraints for table `booking_additional_services`
--
ALTER TABLE `booking_additional_services`
  ADD CONSTRAINT `FKjvxsfcv7nlcxs1gu5pop2g2rk` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  ADD CONSTRAINT `FKos64p8kfesr7vhqyegbjarmsj` FOREIGN KEY (`additional_service_id`) REFERENCES `additional_services` (`id`);

--
-- Constraints for table `booking_pricing_options`
--
ALTER TABLE `booking_pricing_options`
  ADD CONSTRAINT `FK7ela1gyhcdiwlyhtapc5kwl41` FOREIGN KEY (`pricing_option_id`) REFERENCES `tour_pricing` (`id`),
  ADD CONSTRAINT `FKpovobvtpuyvwtx7v99kpgr2ly` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `FKc52o2b1jkxttngufqp3t7jr3h` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`);

--
-- Constraints for table `tour_additional_services`
--
ALTER TABLE `tour_additional_services`
  ADD CONSTRAINT `FKasapqsrlrsk2ajjqismw3fgtd` FOREIGN KEY (`additional_service_id`) REFERENCES `additional_services` (`id`),
  ADD CONSTRAINT `FKs7nhcsyv9098928p3eoo1d3pa` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`);

--
-- Constraints for table `tour_categories`
--
ALTER TABLE `tour_categories`
  ADD CONSTRAINT `FK540enrxlwoslqd60lsn7bwqw5` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `FK5gl9w8r86ush9etysw1uvvu31` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`);

--
-- Constraints for table `tour_excluded_services`
--
ALTER TABLE `tour_excluded_services`
  ADD CONSTRAINT `FK938928og6i5ugiv9aauf6lah6` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`);

--
-- Constraints for table `tour_guides`
--
ALTER TABLE `tour_guides`
  ADD CONSTRAINT `FK652qc1bgxlqjlxunyh7cren6m` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`);

--
-- Constraints for table `tour_highlights`
--
ALTER TABLE `tour_highlights`
  ADD CONSTRAINT `FKaq3ia4klpirbb018ll28wvx9r` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`);

--
-- Constraints for table `tour_images`
--
ALTER TABLE `tour_images`
  ADD CONSTRAINT `FKth1m2rd6q6ltp8kii2msvfi5d` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`);

--
-- Constraints for table `tour_included_services`
--
ALTER TABLE `tour_included_services`
  ADD CONSTRAINT `FKskufy8btoj3souk49ee3a39o6` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`);

--
-- Constraints for table `tour_pickup_points`
--
ALTER TABLE `tour_pickup_points`
  ADD CONSTRAINT `FK2a8jhmsgwewlm4jp9dt49mwx7` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`);

--
-- Constraints for table `tour_pricing`
--
ALTER TABLE `tour_pricing`
  ADD CONSTRAINT `FKcbbxsg7ler3o4lfw5w7if5rbm` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`);

--
-- Constraints for table `tour_reviews`
--
ALTER TABLE `tour_reviews`
  ADD CONSTRAINT `FKleylwsgv63q5xvdtxkcymch6i` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
