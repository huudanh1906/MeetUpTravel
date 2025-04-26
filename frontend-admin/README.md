# Meetup Travel Admin Dashboard

This is the admin dashboard for the Meetup Travel website, built with React and Tailwind CSS.

## Features

- Secure admin authentication with JWT
- Dashboard with key metrics and statistics
- Tours management (CRUD operations)
- Bookings management
- Users management
- Responsive design for all devices

## Prerequisites

- Node.js 14.x or higher
- NPM 6.x or higher

## Installation

1. Clone the repository
2. Navigate to the frontend-admin directory:

```bash
cd frontend-admin
```

3. Install dependencies:

```bash
npm install
```

## Configuration

Make sure the backend API is running at the correct URL. By default, the admin dashboard connects to `http://localhost:8080/api`. 

If your backend runs on a different URL, update it in `src/services/api.js`.

## Running the Application

Start the development server:

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `build` directory.

## Project Structure

- `src/components/` - Reusable UI components
- `src/contexts/` - React context providers (Authentication)
- `src/pages/` - Main application pages
- `src/services/` - API service for backend communication

## Authentication

The admin dashboard uses JWT for authentication. Default admin credentials:

- Email: admin@example.com
- Password: admin123

## License

This project is part of the Meetup Travel application and is subject to the same licensing terms. 