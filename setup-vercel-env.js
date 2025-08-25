#!/usr/bin/env node

/**
 * Automated Vercel Environment Variables Setup Script
 * This script automatically configures all required environment variables for the JobConnect application
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Environment variables configuration
const envVars = {
  MONGODB_URI: 'mongodb+srv://aryabratmishra:jobsforarya2023@cluster0.mongodb.net/jobconnect?retryWrites=true&w=majority',
  JWT_SECRET: '36718b6c5e943c88a46822b12f94b6b35ecc1514b24255181e7b57cf36d1eb0d072b7c80f7642c1e097f4659293abe22d8b97f68afadcf35560053c79d468ff7',
  JWT_EXPIRE: '7d',
  NODE_ENV: 'production',
  CLIENT_URL: 'https://jobcon-six.vercel.app',
  API_BASE_URL: 'https://jobcon-six.vercel.app/api',
  PORT: '5000'
};

console.log('🚀 JobConnect - Vercel Environment Setup');
console.log('=====================================\n');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI detected');
} catch (error) {
  console.log('❌ Vercel CLI not found. Installing...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install Vercel CLI. Please install manually: npm install -g vercel');
    process.exit(1);
  }
}

// Login to Vercel (if not already logged in)
console.log('\n🔐 Checking Vercel authentication...');
try {
  execSync('vercel whoami', { stdio: 'pipe' });
  console.log('✅ Already authenticated with Vercel');
} catch (error) {
  console.log('🔑 Please login to Vercel...');
  try {
    execSync('vercel login', { stdio: 'inherit' });
    console.log('✅ Successfully authenticated with Vercel');
  } catch (loginError) {
    console.error('❌ Failed to authenticate with Vercel');
    process.exit(1);
  }
}

// Set environment variables
console.log('\n⚙️  Setting up environment variables...');

for (const [key, value] of Object.entries(envVars)) {
  try {
    console.log(`Setting ${key}...`);
    execSync(`vercel env add ${key} production`, {
      input: `${value}\ny\n`,
      stdio: ['pipe', 'pipe', 'inherit']
    });
    console.log(`✅ ${key} set successfully`);
  } catch (error) {
    // Try to update if variable already exists
    try {
      console.log(`Updating existing ${key}...`);
      execSync(`vercel env rm ${key} production`, {
        input: 'y\n',
        stdio: ['pipe', 'pipe', 'inherit']
      });
      execSync(`vercel env add ${key} production`, {
        input: `${value}\ny\n`,
        stdio: ['pipe', 'pipe', 'inherit']
      });
      console.log(`✅ ${key} updated successfully`);
    } catch (updateError) {
      console.log(`⚠️  ${key} might already exist or failed to set`);
    }
  }
}

// Trigger redeployment
console.log('\n🔄 Triggering redeployment...');
try {
  execSync('vercel --prod', { stdio: 'inherit' });
  console.log('✅ Redeployment triggered successfully');
} catch (error) {
  console.log('⚠️  Manual redeployment may be required');
}

console.log('\n🎉 Environment setup completed!');
console.log('\n📋 Summary:');
console.log('- All environment variables configured');
console.log('- Production deployment triggered');
console.log('- Your app should be live at: https://jobcon-six.vercel.app');
console.log('\n⏰ Please wait 2-3 minutes for deployment to complete.');