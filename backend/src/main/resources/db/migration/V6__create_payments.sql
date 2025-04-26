-- Create payments table
CREATE TABLE `payments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `booking_id` bigint(20) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `amount` decimal(38,2) NOT NULL,
  `currency` varchar(10) NOT NULL,
  `payment_status` enum('PENDING','COMPLETED','FAILED','REFUNDED') NOT NULL,
  `payment_time` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_payment_booking` (`booking_id`),
  CONSTRAINT `FK_payment_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci; 