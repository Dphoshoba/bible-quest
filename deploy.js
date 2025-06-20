#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 BibleQuest Deployment Script');
console.log('===============================\n');

// Check if build directory exists
if (!fs.existsSync(path.join(__dirname, 'build'))) {
  console.log('📦 Building project...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully!\n');
  } catch (error) {
    console.error('❌ Build failed!');
    process.exit(1);
  }
} else {
  console.log('✅ Build directory already exists\n');
}

// Check if Netlify CLI is installed
try {
  execSync('netlify --version', { stdio: 'ignore' });
  console.log('✅ Netlify CLI is installed\n');
} catch (error) {
  console.log('⚠️  Netlify CLI not found. Installing...');
  try {
    execSync('npm install -g netlify-cli', { stdio: 'inherit' });
    console.log('✅ Netlify CLI installed successfully!\n');
  } catch (installError) {
    console.error('❌ Failed to install Netlify CLI');
    console.log('Please install manually: npm install -g netlify-cli\n');
  }
}

console.log('🎯 Deployment Options:');
console.log('1. Deploy to Netlify (recommended)');
console.log('2. Manual deployment instructions');
console.log('3. Exit\n');

console.log('To deploy to Netlify:');
console.log('1. Run: netlify login');
console.log('2. Run: netlify deploy --prod');
console.log('\nOr visit https://netlify.com to deploy via UI\n');

console.log('📁 Your build is ready in the "build" directory');
console.log('📄 Check DEPLOYMENT.md for detailed instructions'); 