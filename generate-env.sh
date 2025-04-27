#!/bin/bash

# Script to generate environment files from environment variables
# To be run before the build process

# Generate frontend .env file
cat > ./frontend/.env.production << EOL
REACT_APP_API_URL=${REACT_APP_API_URL}
EOL

# Generate admin frontend .env file
cat > ./frontend-admin/.env.production << EOL
REACT_APP_API_URL=${REACT_APP_API_URL}
EOL

echo "Environment files generated successfully:"
echo "Frontend .env.production:"
cat ./frontend/.env.production
echo "Admin Frontend .env.production:"
cat ./frontend-admin/.env.production 