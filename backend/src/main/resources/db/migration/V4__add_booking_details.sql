-- Add new columns to bookings table
ALTER TABLE `bookings` 
ADD COLUMN `pickup_location` varchar(255) DEFAULT NULL,
ADD COLUMN `pickup_address` varchar(500) DEFAULT NULL,
ADD COLUMN `end_date` date DEFAULT NULL,
ADD COLUMN `is_round_trip` bit(1) NOT NULL DEFAULT b'0',
ADD COLUMN `whatsapp_number` varchar(50) DEFAULT NULL,
ADD COLUMN `note_for_meetup` text DEFAULT NULL,
ADD COLUMN `adult_count` int(11) NOT NULL DEFAULT 0,
ADD COLUMN `child_0_2_count` int(11) NOT NULL DEFAULT 0,
ADD COLUMN `child_3_10_count` int(11) NOT NULL DEFAULT 0,
ADD COLUMN `rt_adult_count` int(11) NOT NULL DEFAULT 0,
ADD COLUMN `rt_child_3_10_count` int(11) NOT NULL DEFAULT 0; 