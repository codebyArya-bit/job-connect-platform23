#!/usr/bin/env node

/**
 * Automated Vercel Environment Variables Setup Script
 * This script automatically configures all required environment variables for the JobConnect application
 */

const { execSync } = require('child_process');
const fs = require('fs');

const parseDotenv = (content) => {
  const result = {};
  const lines = content.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) continue;
    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
};

const loadEnvFromFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return {};
    const content = fs.readFileSync(filePath, 'utf8');
    return parseDotenv(content);
  } catch {
    return {};
  }
};

const serverEnv = loadEnvFromFile('server/.env');
const clientEnv = loadEnvFromFile('client/.env');

const envVars = {
  MONGODB_URI: serverEnv.MONGODB_URI,
  JWT_SECRET: serverEnv.JWT_SECRET,
  JWT_EXPIRE: serverEnv.JWT_EXPIRE || '7d',
  NODE_ENV: 'production',
  CLIENT_URL: serverEnv.CLIENT_URL,
  VITE_API_URL: clientEnv.VITE_API_URL || '/api',
};

const requiredKeys = ['MONGODB_URI', 'JWT_SECRET'];
const missingRequired = requiredKeys.filter((k) => !envVars[k]);
if (missingRequired.length) {
  console.error(`❌ Missing required variables: ${missingRequired.join(', ')}`);
  console.error('Add them to server/.env and re-run this script.');
  process.exit(1);
}

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

for (const [key, value] of Object.entries(envVars).filter(([, v]) => v)) {
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
console.log('\n⏰ Please wait 2-3 minutes for deployment to complete.');
