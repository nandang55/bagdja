#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Read configuration
const configPath = path.join(__dirname, '..', 'config.json');
let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function updateConfiguration() {
  console.log('🔧 Bagdja Configuration Updater');
  console.log('================================\n');

  try {
    // Update project information
    console.log('📝 Project Information:');
    const projectName = await question(`Project name [${config.project.name}]: `) || config.project.name;
    const projectVersion = await question(`Version [${config.project.version}]: `) || config.project.version;

    config.project.name = projectName;
    config.project.version = projectVersion;

    // Update Supabase configuration
    console.log('\n🗄️ Database Configuration:');
    const supabaseUrl = await question('Supabase URL: ');
    if (supabaseUrl) {
      config.deployment.environment.development.supabase_url = supabaseUrl;
      config.deployment.environment.production.supabase_url = supabaseUrl.replace('dev-', 'prod-');
    }

    // Update theme colors
    console.log('\n🎨 Theme Configuration:');
    const primaryColor = await question(`Primary color [${config.shared.styling.theme.primary}]: `) || config.shared.styling.theme.primary;
    const secondaryColor = await question(`Secondary color [${config.shared.styling.theme.secondary}]: `) || config.shared.styling.theme.secondary;

    config.shared.styling.theme.primary = primaryColor;
    config.shared.styling.theme.secondary = secondaryColor;

    // Save updated configuration
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('\n✅ Configuration updated successfully!');

    // Ask if user wants to apply changes
    const applyChanges = await question('\n🚀 Apply changes to all services? [Y/n]: ');
    
    if (applyChanges.toLowerCase() !== 'n' && applyChanges.toLowerCase() !== 'no') {
      console.log('\n🔄 Applying changes to all services...');
      
      // Run setup script to apply changes
      const { execSync } = require('child_process');
      execSync('node scripts/setup-config.js', { stdio: 'inherit' });
      
      console.log('\n🎉 All changes applied successfully!');
    }

  } catch (error) {
    console.error('❌ Error updating configuration:', error.message);
  } finally {
    rl.close();
  }
}

// Show current configuration
function showCurrentConfig() {
  console.log('\n📋 Current Configuration:');
  console.log('========================');
  console.log(`Project: ${config.project.name} v${config.project.version}`);
  console.log(`Store URL: ${config.services['bagdja-store-frontend'].url}`);
  console.log(`Console URL: ${config.services['bagdja-console-frontend'].url}`);
  console.log(`API URL: ${config.services['bagdja-api-services'].url}`);
  console.log(`Account URL: ${config.services['bagdja-account'].url}`);
  console.log(`Primary Color: ${config.shared.styling.theme.primary}`);
  console.log(`Secondary Color: ${config.shared.styling.theme.secondary}`);
  console.log(`Registration: ${config.features.registration ? 'Enabled' : 'Disabled'}`);
  console.log(`Social Login: ${config.features.social_login ? 'Enabled' : 'Disabled'}`);
  console.log(`Dark Mode: ${config.features.dark_mode ? 'Enabled' : 'Disabled'}`);
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--show') || args.includes('-s')) {
    showCurrentConfig();
  } else {
    await updateConfiguration();
  }
}

main();