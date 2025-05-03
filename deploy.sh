#!/bin/bash

# Build the application
echo "Building the application..."
npm run build

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Build successful!"
else
  echo "Build failed. Please fix the issues and try again."
  exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "Vercel CLI not found. Installing..."
  npm install -g vercel
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Deployment complete! Your EMI Calculator is now ready to be embedded in WordPress."
echo "You can find the embed code at YOUR_DEPLOYMENT_URL/iframe-embed-code.html" 