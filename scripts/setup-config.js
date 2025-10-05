#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read configuration
const configPath = path.join(__dirname, '..', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

console.log('🚀 Bagdja Configuration Setup');
console.log('================================\n');

// Helper function to create directory if it doesn't exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  }
}

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

// Helper function to setup environment files
function setupEnvironmentFiles() {
  console.log('\n📝 Setting up environment files...');
  
  const services = ['bagdja-store-frontend', 'bagdja-console-frontend', 'bagdja-api-services', 'bagdja-account'];
  
  services.forEach(serviceName => {
    const serviceConfig = config.services[serviceName];
    const servicePath = path.join(__dirname, '..', serviceName);
    
    if (fs.existsSync(servicePath)) {
      const envExamplePath = path.join(servicePath, 'env.example');
      const envPath = path.join(servicePath, '.env');
      
      let envContent = '';
      
      if (serviceName === 'bagdja-api-services') {
        envContent = `# Supabase Configuration
SUPABASE_URL=${config.database.supabase.development.url}
SUPABASE_SERVICE_KEY=${config.database.supabase.development.service_role_key}
SUPABASE_JWT_SECRET=${config.database.supabase.development.jwt_secret}
SUPABASE_DB_PASSWORD=${config.database.supabase.development.database_password || 'your-dev-db-password'}

# Server Configuration
PORT=${serviceConfig.port}
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:5175

# Security Configuration
API_KEY_SECRET=your-api-key-secret-here

# Optional: Analytics
SENTRY_DSN=https://your-sentry-dsn
`;
      } else {
        envContent = `# Supabase Configuration
VITE_SUPABASE_URL=${config.database.supabase.development.url}
VITE_SUPABASE_ANON_KEY=${config.database.supabase.development.anon_key}

# API Configuration
VITE_BAGDJA_API_URL=http://localhost:3001

# Application Configuration
VITE_APP_URL=${serviceConfig.url}
VITE_APP_NAME=${serviceConfig.name}
VITE_APP_ENV=development

# Optional: Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn
`;
      }
      
      // Update env.example
      writeFileWithBackup(envExamplePath, envContent);
      
      // Update .env if it exists
      if (fs.existsSync(envPath)) {
        console.log(`🔄 Updating .env for ${serviceName}...`);
        
        let existingEnvContent = fs.readFileSync(envPath, 'utf8');
        
        // Update Supabase URL
        if (serviceName === 'bagdja-api-services') {
          existingEnvContent = existingEnvContent.replace(/SUPABASE_URL=.*/g, `SUPABASE_URL=${config.database.supabase.development.url}`);
          existingEnvContent = existingEnvContent.replace(/SUPABASE_SERVICE_KEY=.*/g, `SUPABASE_SERVICE_KEY=${config.database.supabase.development.service_role_key}`);
          existingEnvContent = existingEnvContent.replace(/SUPABASE_JWT_SECRET=.*/g, `SUPABASE_JWT_SECRET=${config.database.supabase.development.jwt_secret}`);
        } else {
          existingEnvContent = existingEnvContent.replace(/VITE_SUPABASE_URL=.*/g, `VITE_SUPABASE_URL=${config.database.supabase.development.url}`);
          existingEnvContent = existingEnvContent.replace(/VITE_SUPABASE_ANON_KEY=.*/g, `VITE_SUPABASE_ANON_KEY=${config.database.supabase.development.anon_key}`);
        }
        
        writeFileWithBackup(envPath, existingEnvContent);
      }
    }
  });
}

// Main setup function
function main() {
  try {
    console.log('Starting configuration setup...\n');
    
    // Setup environment files
    setupEnvironmentFiles();
    
    console.log('\n🎉 Configuration setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run setup:env');
    console.log('2. Edit .env files with your actual configuration values');
    console.log('3. Run: npm run install:all');
    console.log('4. Run: npm run dev');
    
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    process.exit(1);
  }
}

// Run main function
main();