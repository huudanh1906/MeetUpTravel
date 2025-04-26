-- Remove guideLanguage and specialRequests columns from bookings table
ALTER TABLE `bookings` 
DROP COLUMN `guide_language`,
DROP COLUMN `special_requests`; 