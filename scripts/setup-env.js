#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment files...');
console.log('====================================\n');

const services = ['bagdja-store-frontend', 'bagdja-console-frontend', 'bagdja-api-services', 'bagdja-account'];

services.forEach(serviceName => {
  const servicePath = path.join(__dirname, '..', serviceName);
  const envExamplePath = path.join(servicePath, 'env.example');
  const envPath = path.join(servicePath, '.env');
  
  if (fs.existsSync(envExamplePath) && !fs.existsSync(envPath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log(`✅ Created .env for ${serviceName}`);
  } else if (fs.existsSync(envPath)) {
    console.log(`⚠️  .env already exists for ${serviceName}`);
  } else {
    console.log(`❌ No env.example found for ${serviceName}`);
  }
});

console.log('\n📝 Please edit the .env files with your actual configuration values:');
console.log('   - SUPABASE_URL');
console.log('   - SUPABASE_SERVICE_KEY (for API services)');
console.log('   - SUPABASE_ANON_KEY (for frontend services)');
console.log('   - SUPABASE_JWT_SECRET (for API services)');
console.log('\n🚀 After editing .env files, run: npm run install:all && npm run dev');