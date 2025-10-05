#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Read configuration
const configPath = path.join(__dirname, '..', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
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

async function setupDatabaseConnection() {
  console.log('🗄️ Bagdja Database Connection Setup');
  console.log('=====================================\n');

  try {
    const environment = await question('Environment (development/production) [development]: ') || 'development';
    
    if (!config.database.supabase[environment]) {
      console.log(`❌ Environment '${environment}' not found in configuration`);
      return;
    }

    console.log(`\n📝 Setting up ${environment} database connection...`);

    // Get Supabase project details
    const projectName = await question(`Project name [${config.database.supabase[environment].project_name}]: `) || config.database.supabase[environment].project_name;
    const supabaseUrl = await question('Supabase URL: ');
    const anonKey = await question('Anonymous key: ');
    const serviceRoleKey = await question('Service role key: ');
    const jwtSecret = await question('JWT secret: ');
    const databasePassword = await question('Database password: ');
    const region = await question(`Region [${config.database.supabase[environment].region}]: `) || config.database.supabase[environment].region;

    if (!supabaseUrl || !anonKey || !serviceRoleKey || !jwtSecret || !databasePassword) {
      console.log('❌ Missing required database credentials');
      return;
    }

    // Update configuration
    config.database.supabase[environment].project_name = projectName;
    config.database.supabase[environment].url = supabaseUrl;
    config.database.supabase[environment].anon_key = anonKey;
    config.database.supabase[environment].service_role_key = serviceRoleKey;
    config.database.supabase[environment].jwt_secret = jwtSecret;
    config.database.supabase[environment].database_password = databasePassword;
    config.database.supabase[environment].region = region;

    // Generate connection string
    const urlObj = new URL(supabaseUrl);
    const projectRef = urlObj.hostname.split('.')[0];
    const connectionString = `postgresql://postgres:${databasePassword}@db.${projectRef}.supabase.co:5432/postgres`;
    config.database.supabase[environment].connection_string = connectionString;

    // Save updated configuration
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('\n✅ Database configuration updated successfully!');

    // Update environment files for all services
    console.log('\n🔄 Updating environment files...');
    
    const services = ['bagdja-store-frontend', 'bagdja-console-frontend', 'bagdja-api-services', 'bagdja-account'];
    
    services.forEach(serviceName => {
      const servicePath = path.join(__dirname, '..', serviceName);
      const envPath = path.join(servicePath, '.env');
      
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // Update Supabase URL
        envContent = envContent.replace(/VITE_SUPABASE_URL=.*/g, `VITE_SUPABASE_URL=${supabaseUrl}`);
        envContent = envContent.replace(/SUPABASE_URL=.*/g, `SUPABASE_URL=${supabaseUrl}`);
        
        // Update keys based on service type
        if (serviceName === 'bagdja-api-services') {
          envContent = envContent.replace(/SUPABASE_SERVICE_KEY=.*/g, `SUPABASE_SERVICE_KEY=${serviceRoleKey}`);
          envContent = envContent.replace(/SUPABASE_JWT_SECRET=.*/g, `SUPABASE_JWT_SECRET=${jwtSecret}`);
        } else {
          envContent = envContent.replace(/VITE_SUPABASE_ANON_KEY=.*/g, `VITE_SUPABASE_ANON_KEY=${anonKey}`);
        }
        
        writeFileWithBackup(envPath, envContent);
      }
    });

    // Update Supabase config.toml if exists
    const supabaseConfigPath = path.join(__dirname, '..', 'supabase', 'config.toml');
    if (fs.existsSync(supabaseConfigPath)) {
      console.log('\n🔄 Updating Supabase config.toml...');
      
      let configToml = fs.readFileSync(supabaseConfigPath, 'utf8');
      
      // Update project reference
      configToml = configToml.replace(/project_id = ".*"/g, `project_id = "${projectRef}"`);
      configToml = configToml.replace(/db_password = ".*"/g, `db_password = "${databasePassword}"`);
      
      writeFileWithBackup(supabaseConfigPath, configToml);
    }

    console.log('\n🎉 Database connection setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run install:all');
    console.log('2. Run: npm run dev');
    console.log('3. Test database connection in your applications');

  } catch (error) {
    console.error('❌ Error during database setup:', error.message);
  } finally {
    rl.close();
  }
}

// Helper function to test database connection
async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection');
  console.log('==============================\n');

  try {
    const environment = await question('Environment to test (development/production) [development]: ') || 'development';
    
    if (!config.database.supabase[environment]) {
      console.log(`❌ Environment '${environment}' not found in configuration`);
      return;
    }

    const dbConfig = config.database.supabase[environment];
    
    console.log(`Testing ${environment} connection...`);
    console.log(`URL: ${dbConfig.url}`);
    console.log(`Project: ${dbConfig.project_name}`);
    console.log(`Region: ${dbConfig.region}`);
    
    // Test basic connectivity (you can enhance this with actual Supabase client test)
    console.log('\n✅ Configuration loaded successfully');
    console.log('📝 To test actual connection, run your application and check the logs');

  } catch (error) {
    console.error('❌ Error testing connection:', error.message);
  } finally {
    rl.close();
  }
}

// Helper function to show database configuration
function showDatabaseConfig() {
  console.log('📋 Current Database Configuration');
  console.log('=================================\n');

  Object.keys(config.database.supabase).forEach(env => {
    if (env === 'migration' || env === 'auth' || env === 'storage') return;
    
    const dbConfig = config.database.supabase[env];
    console.log(`${env.toUpperCase()}:`);
    console.log(`  Project: ${dbConfig.project_name}`);
    console.log(`  URL: ${dbConfig.url}`);
    console.log(`  Region: ${dbConfig.region}`);
    console.log(`  Has Keys: ${dbConfig.anon_key && dbConfig.service_role_key ? '✅' : '❌'}`);
    console.log('');
  });

  console.log('MIGRATION:');
  console.log(`  Enabled: ${config.database.supabase.migration.enabled ? '✅' : '❌'}`);
  console.log(`  Path: ${config.database.supabase.migration.path}`);
  console.log(`  Schema: ${config.database.supabase.migration.schema}`);
  console.log('');

  console.log('AUTH PROVIDERS:');
  const providers = config.database.supabase.auth.providers;
  Object.keys(providers).forEach(provider => {
    console.log(`  ${provider}: ${providers[provider].enabled ? '✅' : '❌'}`);
  });
  console.log('');

  console.log('STORAGE BUCKETS:');
  config.database.supabase.storage.buckets.forEach(bucket => {
    console.log(`  ${bucket.name}: ${bucket.public ? 'Public' : 'Private'} (${bucket.description})`);
  });
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--test') || args.includes('-t')) {
    await testDatabaseConnection();
  } else if (args.includes('--show') || args.includes('-s')) {
    showDatabaseConfig();
  } else {
    await setupDatabaseConnection();
  }
}

main();
