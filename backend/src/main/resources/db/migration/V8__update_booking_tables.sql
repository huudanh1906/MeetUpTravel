-- Update the bookings table

-- Drop foreign key constraint for user_id
ALTER TABLE bookings
DROP FOREIGN KEY bookings_ibfk_2;

-- Drop unnecessary columns
ALTER TABLE bookings
DROP COLUMN user_id,
DROP COLUMN number_of_people,
DROP COLUMN adult_count,
DROP COLUMN child0to2count,
DROP COLUMN child3to10count,
DROP COLUMN rt_adult_count,
DROP COLUMN rt_child3to10count,
DROP COLUMN is_round_trip;

-- Rename tourDate to departureDate
ALTER TABLE bookings
CHANGE COLUMN tour_date departure_date DATE NOT NULL;

-- Add new customer fields
ALTER TABLE bookings
ADD COLUMN customer_name VARCHAR(255) NOT NULL,
ADD COLUMN customer_email VARCHAR(255) NOT NULL;

-- Create the booking_pricing_options table
CREATE TABLE booking_pricing_options (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  booking_id BIGINT NOT NULL,
  pricing_option_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(38,2) NOT NULL,
  subtotal DECIMAL(38,2) NOT NULL,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (pricing_option_id) REFERENCES tour_pricing(id)
);

-- Update booking_additional_services to include reference to the additional_services table
ALTER TABLE booking_additional_services
ADD COLUMN additional_service_id BIGINT,
ADD CONSTRAINT FK_booking_additional_service_id FOREIGN KEY (additional_service_id) REFERENCES additional_services(id); 