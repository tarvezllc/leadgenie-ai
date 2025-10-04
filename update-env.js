#!/usr/bin/env node

/**
 * Update environment variables with Supabase credentials
 */

import fs from 'fs';

const ENV_FILE = '.env.local';

// Your Supabase credentials
const SUPABASE_URL = 'https://ahlwvrfnhkurnaahdzmu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFobHd2cmZuaGt1cm5hYWhkem11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0Njk2NjAsImV4cCI6MjA3NTA0NTY2MH0.trk4vX0ponoLa7fM0z8fg4V2a_Z2rxLdIP6iPAxZmXI';

console.log('🔧 Updating environment variables...');

// Read current .env.local
let envContent = '';
if (fs.existsSync(ENV_FILE)) {
  envContent = fs.readFileSync(ENV_FILE, 'utf8');
} else {
  console.log('❌ .env.local file not found!');
  process.exit(1);
}

// Update Supabase URL
envContent = envContent.replace(
  /NEXT_PUBLIC_SUPABASE_URL=.*/,
  `NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}`
);

// Update Supabase anon key
envContent = envContent.replace(
  /NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}`
);

// Write updated content
fs.writeFileSync(ENV_FILE, envContent);

console.log('✅ Environment variables updated!');
console.log(`📍 Supabase URL: ${SUPABASE_URL}`);
console.log(`🔑 Anon Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...`);
console.log('\n⚠️  You still need to add your SERVICE_ROLE_KEY');
console.log('Go to Supabase → Settings → API → Copy service_role key');
console.log('Then update SUPABASE_SERVICE_ROLE_KEY in .env.local\n');
