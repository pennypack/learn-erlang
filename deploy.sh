#!/bin/bash

# Railway deployment script for Astro site
echo "Starting Railway deployment for Learn Erlang site..."

# Install dependencies
echo "Installing dependencies..."
npm ci

# Run type checking and build
echo "Running type checking and building..."
npm run build

# Start the preview server
echo "Starting preview server..."
npm run preview