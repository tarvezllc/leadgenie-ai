#!/bin/bash
echo "🚀 Ready to push LeadGenie AI to GitHub!"

# Add GitHub remote (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/leadgenie-ai.git

# Rename branch to main (GitHub standard)
git branch -M main

# Push to GitHub
git push -u origin main

echo "✅ Code pushed to GitHub successfully!"
echo "🌐 Next: Go to vercel.com → Import repository → Select leadgenie-ai → Deploy"
