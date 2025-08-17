#!/bin/bash

echo "🚀 DICOM Insight - Complete Vercel Deployment (Fixed)"
echo "======================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Complete cleanup
echo "🧹 Complete cleanup of all previous builds and dependencies..."
rm -rf dist
rm -rf client/dist
rm -rf node_modules
rm -rf .vercel
rm -rf package-lock.json

# Fresh install
echo "📦 Fresh install of dependencies..."
npm install

# Test build locally
echo "🔨 Testing build locally..."
npm run vercel-build

if [ $? -ne 0 ]; then
    echo "❌ Local build failed! Let's debug..."
    
    echo "📁 Checking directory structure..."
    ls -la
    echo "📁 Client directory:"
    ls -la client/
    
    echo "🔍 Checking Vite config..."
    cat vite.config.ts
    
    echo "🔄 Trying alternative build approach..."
    cd client
    npm install
    npx vite build --outDir ../dist
    cd ..
    
    if [ $? -ne 0 ]; then
        echo "❌ Alternative build also failed!"
        echo "🔍 Let's check for specific errors..."
        echo "📄 Package.json scripts:"
        cat package.json | grep -A 5 -B 5 "scripts"
        exit 1
    fi
fi

echo "✅ Build successful!"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod --yes

echo "✅ Deployment complete!"
echo "🌐 Your app should be live at the URL provided above." 