#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read configuration
const configPath = path.join(__dirname, '..', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

console.log('🔄 Updating .env files with latest configuration...');
console.log('================================================\n');

// Helper function to write file with backup
function writeFileWithBackup(filePath, content) {
  const backupPath = filePath + '.backup';
  
  // Create backup if file exists
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`📦 Created backup: ${backupPath}`);
  }
  
  // Write new file
  fs.writeFileSync(filePath, content);
  console.log(`✅ Updated: ${filePath}`);
}

// Helper function to update environment files
function updateEnvironmentFiles() {
  const services = ['bagdja-store-frontend', 'bagdja-console-frontend', 'bagdja-api-services', 'bagdja-account'];
  
  services.forEach(serviceName => {
    const serviceConfig = config.services[serviceName];
    const servicePath = path.join(__dirname, '..', serviceName);
    const envPath = path.join(servicePath, '.env');
    
    if (fs.existsSync(servicePath) && fs.existsSync(envPath)) {
      console.log(`\n📝 Updating .env for ${serviceName}...`);
      
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Update Supabase configuration
      if (serviceName === 'bagdja-api-services') {
        // Update API service environment variables
        envContent = envContent.replace(/SUPABASE_URL=.*/g, `SUPABASE_URL=${config.database.supabase.development.url}`);
        envContent = envContent.replace(/SUPABASE_SERVICE_KEY=.*/g, `SUPABASE_SERVICE_KEY=${config.database.supabase.development.service_role_key}`);
        envContent = envContent.replace(/SUPABASE_JWT_SECRET=.*/g, `SUPABASE_JWT_SECRET=${config.database.supabase.development.jwt_secret}`);
        
        // Update server configuration
        envContent = envContent.replace(/PORT=.*/g, `PORT=${serviceConfig.port}`);
        envContent = envContent.replace(/NODE_ENV=.*/g, `NODE_ENV=development`);
        
        // Update CORS configuration
        envContent = envContent.replace(/ALLOWED_ORIGINS=.*/g, `ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:5175`);
        
        console.log(`  ✅ Updated Supabase URL: ${config.database.supabase.development.url}`);
        console.log(`  ✅ Updated Service Key: ${config.database.supabase.development.service_role_key ? 'Set' : 'Not set'}`);
        console.log(`  ✅ Updated JWT Secret: ${config.database.supabase.development.jwt_secret ? 'Set' : 'Not set'}`);
        
      } else {
        // Update frontend service environment variables
        envContent = envContent.replace(/VITE_SUPABASE_URL=.*/g, `VITE_SUPABASE_URL=${config.database.supabase.development.url}`);
        envContent = envContent.replace(/VITE_SUPABASE_ANON_KEY=.*/g, `VITE_SUPABASE_ANON_KEY=${config.database.supabase.development.anon_key}`);
        envContent = envContent.replace(/VITE_BAGDJA_API_URL=.*/g, `VITE_BAGDJA_API_URL=http://localhost:3001`);
        envContent = envContent.replace(/VITE_APP_URL=.*/g, `VITE_APP_URL=${serviceConfig.url}`);
        envContent = envContent.replace(/VITE_APP_NAME=.*/g, `VITE_APP_NAME=${serviceConfig.name}`);
        envContent = envContent.replace(/VITE_APP_ENV=.*/g, `VITE_APP_ENV=development`);
        
        console.log(`  ✅ Updated Supabase URL: ${config.database.supabase.development.url}`);
        console.log(`  ✅ Updated Anonymous Key: ${config.database.supabase.development.anon_key ? 'Set' : 'Not set'}`);
        console.log(`  ✅ Updated App URL: ${serviceConfig.url}`);
        console.log(`  ✅ Updated App Name: ${serviceConfig.name}`);
      }
      
      writeFileWithBackup(envPath, envContent);
      
    } else if (fs.existsSync(servicePath) && !fs.existsSync(envPath)) {
      console.log(`⚠️  No .env file found for ${serviceName}, creating from template...`);
      
      // Create .env from env.example if it exists
      const envExamplePath = path.join(servicePath, 'env.example');
      if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        console.log(`✅ Created .env from template for ${serviceName}`);
        
        // Update the newly created file
        updateEnvironmentFiles();
      } else {
        console.log(`❌ No env.example found for ${serviceName}`);
      }
    } else {
      console.log(`❌ Service directory not found: ${serviceName}`);
    }
  });
}

// Helper function to show current environment configuration
function showCurrentEnvConfig() {
  console.log('\n📋 Current Environment Configuration:');
  console.log('=====================================');
  
  const services = ['bagdja-store-frontend', 'bagdja-console-frontend', 'bagdja-api-services', 'bagdja-account'];
  
  services.forEach(serviceName => {
    const servicePath = path.join(__dirname, '..', serviceName);
    const envPath = path.join(servicePath, '.env');
    
    console.log(`\n${serviceName}:`);
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      
      // Extract key environment variables
      const lines = envContent.split('\n');
      lines.forEach(line => {
        if (line.includes('SUPABASE_URL') || line.includes('VITE_SUPABASE_URL')) {
          console.log(`  ${line}`);
        } else if (line.includes('SUPABASE_SERVICE_KEY') || line.includes('VITE_SUPABASE_ANON_KEY')) {
          const key = line.split('=')[1];
          console.log(`  ${line.split('=')[0]}=${key ? '***' + key.slice(-8) : 'Not set'}`);
        } else if (line.includes('SUPABASE_JWT_SECRET')) {
          const secret = line.split('=')[1];
          console.log(`  ${line.split('=')[0]}=${secret ? '***' + secret.slice(-8) : 'Not set'}`);
        }
      });
    } else {
      console.log('  ❌ No .env file found');
    }
  });
}

// Main function
function main() {
  try {
    const args = process.argv.slice(2);
    
    if (args.includes('--show') || args.includes('-s')) {
      showCurrentEnvConfig();
    } else {
      updateEnvironmentFiles();
      
      console.log('\n🎉 Environment files updated successfully!');
      console.log('\nNext steps:');
      console.log('1. Check the updated .env files');
      console.log('2. Run: npm run dev');
      console.log('3. Test your applications');
    }
    
  } catch (error) {
    console.error('❌ Error updating environment files:', error.message);
    process.exit(1);
  }
}

main();
