#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing PostCSS configuration for all services...');
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

// Helper function to create PostCSS config
function createPostCSSConfig(servicePath, serviceName) {
  const postcssConfigPath = path.join(servicePath, 'postcss.config.js');
  
  const postcssConfig = `export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}`;

  if (fs.existsSync(postcssConfigPath)) {
    console.log(`🔄 Updating PostCSS config for ${serviceName}...`);
    writeFileWithBackup(postcssConfigPath, postcssConfig);
  } else {
    console.log(`📝 Creating PostCSS config for ${serviceName}...`);
    fs.writeFileSync(postcssConfigPath, postcssConfig);
    console.log(`✅ Created: ${postcssConfigPath}`);
  }
}

// Helper function to install dependencies
function installDependencies(servicePath, serviceName) {
  console.log(`📦 Installing TailwindCSS dependencies for ${serviceName}...`);
  
  try {
    execSync('npm install @tailwindcss/postcss autoprefixer', {
      cwd: servicePath,
      stdio: 'inherit'
    });
    console.log(`✅ Dependencies installed for ${serviceName}`);
  } catch (error) {
    console.log(`⚠️  Error installing dependencies for ${serviceName}: ${error.message}`);
  }
}

// Helper function to create TailwindCSS config if missing
function createTailwindConfig(servicePath, serviceName) {
  const tailwindConfigPath = path.join(servicePath, 'tailwind.config.js');
  
  if (!fs.existsSync(tailwindConfigPath)) {
    console.log(`📝 Creating TailwindCSS config for ${serviceName}...`);
    
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        success: {
          500: '#22c55e',
        },
        warning: {
          500: '#f59e0b',
        },
        error: {
          500: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}`;
    
    fs.writeFileSync(tailwindConfigPath, tailwindConfig);
    console.log(`✅ Created: ${tailwindConfigPath}`);
  }
}

// Main function
function main() {
  try {
    const services = [
      { name: 'bagdja-store-frontend', port: 5173 },
      { name: 'bagdja-console-frontend', port: 5174 },
      { name: 'bagdja-account', port: 5175 }
    ];
    
    services.forEach(service => {
      const servicePath = path.join(__dirname, '..', service.name);
      
      if (fs.existsSync(servicePath)) {
        console.log(`\n🔧 Fixing ${service.name}...`);
        
        // Create PostCSS config
        createPostCSSConfig(servicePath, service.name);
        
        // Create TailwindCSS config
        createTailwindConfig(servicePath, service.name);
        
        // Install dependencies
        installDependencies(servicePath, service.name);
        
      } else {
        console.log(`❌ Service directory not found: ${service.name}`);
      }
    });
    
    console.log('\n🎉 PostCSS configuration fixed for all services!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Check if all services start without PostCSS errors');
    
  } catch (error) {
    console.error('❌ Error fixing PostCSS configuration:', error.message);
    process.exit(1);
  }
}

main();
