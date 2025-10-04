#!/usr/bin/env node

/**
 * Update environment variables with Supabase service role key
 */

import fs from 'fs';

const ENV_FILE = '.env.local';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFobHd2cmZuaGt1cm5hYWhkem11Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQ2OTY2MCwiZXhwIjoyMDc1MDQ1NjYwfQ.UunB0XChBIIKyLzOrUtgQ072mE3xKw22T2a1bKphbSU';

console.log('🔧 Updating service role key...');

// Read current .env.local
let envContent = '';
if (fs.existsSync(ENV_FILE)) {
  envContent = fs.readFileSync(ENV_FILE, 'utf8');
} else {
  console.log('❌ .env.local file not found!');
  process.exit(1);
}

// Update service role key
envContent = envContent.replace(
  /SUPABASE_SERVICE_ROLE_KEY=.*/,
  `SUPABASE_SERVICE_ROLE_KEY=${SERVICE_ROLE_KEY}`
);

// Write updated content
fs.writeFileSync(ENV_FILE, envContent);

console.log('✅ Service role key updated!');
console.log(`🔑 Service Key: ${SERVICE_ROLE_KEY.substring(0, 20)}...`);
console.log('\n🚀 Now let\'s test the database connection...\n');
