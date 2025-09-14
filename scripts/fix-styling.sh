#!/bin/bash

# SafeMama Styling Fix Script
# This script clears Next.js cache and restarts the development server
# to fix styling issues where the app appears as unstyled HTML

echo "🔧 Fixing SafeMama styling issues..."

# Stop any running Next.js processes
echo "⏹️  Stopping existing Next.js processes..."
pkill -f "next dev" 2>/dev/null || true

# Clear Next.js cache
echo "🗑️  Clearing Next.js cache..."
rm -rf .next

# Clear node modules cache
echo "🗑️  Clearing node modules cache..."
rm -rf node_modules/.cache

# Clear npm cache
echo "🗑️  Clearing npm cache..."
npm cache clean --force

# Reinstall dependencies (optional, uncomment if needed)
# echo "📦 Reinstalling dependencies..."
# npm install

# Start development server
echo "🚀 Starting development server..."
npm run dev

echo "✅ Styling fix complete! The app should now display properly."
echo "🌐 Open http://localhost:3000 in your browser"






