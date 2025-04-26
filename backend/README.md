# Meetup Travel Backend

This is the backend service for the Meetup Travel website, built with Spring Boot and MySQL.

## Prerequisites

- Java 17 or higher
- Maven
- MySQL

## Setup

1. Clone the repository
2. Navigate to the backend directory
3. Configure the database connection in `src/main/resources/application.properties` if needed

## Running the Application

You can run the application using Maven:

```bash
mvn spring-boot:run
```

Or build and run the JAR file:

```bash
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Tours

- `GET /api/tours` - Get all tours (paginated)
- `GET /api/tours/{id}` - Get a specific tour by ID
- `GET /api/tours/featured` - Get featured tours
- `GET /api/tours/category/{categoryName}` - Get tours by category
- `GET /api/tours/search?query={searchTerm}` - Search tours
- `GET /api/tours/top-rated` - Get top rated tours
- `POST /api/tours` - Create a new tour (Admin only)
- `PUT /api/tours/{id}` - Update a tour (Admin only)
- `DELETE /api/tours/{id}` - Delete a tour (Admin only)

### Bookings

- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/{id}` - Get a specific booking
- `GET /api/bookings/user` - Get current user's bookings
- `PUT /api/bookings/{id}/status` - Update booking status (Admin only)
- `PUT /api/bookings/{id}/cancel` - Cancel a booking

## Initial Data

The application comes with some initial data loaded on startup:

- Admin user: admin@example.com / admin123
- Sample tours
- Tour categories

## Technologies Used

- Spring Boot 3.2
- Spring Security with JWT
- Spring Data JPA
- MySQL
- Lombok
- Jakarta Validation API 