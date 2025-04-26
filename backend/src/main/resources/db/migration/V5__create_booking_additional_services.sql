-- Create booking_additional_services table
CREATE TABLE `booking_additional_services` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `booking_id` bigint(20) NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `service_type` varchar(255) NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `subtotal` decimal(38,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_booking_id` (`booking_id`),
  CONSTRAINT `FK_booking_id` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci; 