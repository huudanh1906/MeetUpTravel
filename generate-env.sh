#!/bin/bash

# Create environment file for frontend
echo "Creating .env file for frontend"
echo "REACT_APP_API_URL=https://meetuptravel-backend.onrender.com/api" > frontend/.env

# Create environment file for frontend-admin
echo "Creating .env file for frontend-admin"
echo "REACT_APP_API_URL=https://meetuptravel-backend.onrender.com/api" > frontend-admin/.env

echo "Environment files created successfully" 