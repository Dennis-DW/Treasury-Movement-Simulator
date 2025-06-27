#!/bin/bash

# 🚀 Treasury Movement Simulator Deployment Script
# This script helps prepare your application for deployment

echo "🚀 Treasury Movement Simulator - Deployment Preparation"
echo "======================================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found. Please run setup first:"
    echo "   npm run setup"
    exit 1
fi

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Test the build
echo "🧪 Testing build..."
npm start &
SERVER_PID=$!
sleep 10

# Test health endpoint
curl -s http://localhost:3000 > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Frontend test successful!"
else
    echo "❌ Frontend test failed."
fi

# Kill the test server
kill $SERVER_PID 2>/dev/null

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for deployment'"
echo "   git push"
echo ""
echo "2. Deploy backend to Render:"
echo "   - Go to https://dashboard.render.com/"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repo"
echo "   - Set environment variables"
echo ""
echo "3. Deploy frontend to Vercel:"
echo "   - Go to https://vercel.com/dashboard"
echo "   - Create new project"
echo "   - Import your GitHub repo"
echo "   - Set NEXT_PUBLIC_API_URL to your Render URL"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md" 