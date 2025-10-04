#!/usr/bin/env node

/**
 * LeadGenie AI - Database Setup Script
 * 
 * This script helps you set up your Supabase database quickly.
 * Run with: node setup-database.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const ENV_FILE = '.env.local';

console.log('🏠 LeadGenie AI - Database Setup');
console.log('================================\n');

// Check if .env.local exists
if (!fs.existsSync(ENV_FILE)) {
  console.log('❌ .env.local file not found!');
  console.log('Please copy env.example to .env.local first:');
  console.log('cp env.example .env.local\n');
  process.exit(1);
}

// Read current environment variables
const envContent = fs.readFileSync(ENV_FILE, 'utf8');

// Check if Supabase URL is still placeholder
if (envContent.includes('your_supabase_project_url')) {
  console.log('⚠️  Supabase configuration not set up yet!');
  console.log('\n📋 Please follow these steps:');
  console.log('1. Go to https://supabase.com');
  console.log('2. Create a new project (FREE tier)');
  console.log('3. Go to Settings → API');
  console.log('4. Copy your Project URL and API keys');
  console.log('5. Update .env.local with your actual values\n');
  
  console.log('🔧 Then run this script again to set up the database.\n');
  process.exit(1);
}

// Extract Supabase configuration
const supabaseUrlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const supabaseKeyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const serviceKeyMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);

if (!supabaseUrlMatch || !supabaseKeyMatch || !serviceKeyMatch) {
  console.log('❌ Missing Supabase configuration in .env.local');
  console.log('Please make sure you have:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('- SUPABASE_SERVICE_ROLE_KEY\n');
  process.exit(1);
}

const supabaseUrl = supabaseUrlMatch[1].trim();
const supabaseKey = supabaseKeyMatch[1].trim();
const serviceKey = serviceKeyMatch[1].trim();

console.log('✅ Supabase configuration found');
console.log(`📍 Project URL: ${supabaseUrl}\n`);

// Test connection
console.log('🔌 Testing database connection...');

const supabase = createClient(supabaseUrl, serviceKey);

async function setupDatabase() {
  try {
    // Test connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('📊 Database schema not found. Setting up...\n');
      await setupSchema();
    } else if (error) {
      console.log('❌ Database connection error:', error.message);
      process.exit(1);
    } else {
      console.log('✅ Database connection successful!');
      
      // Check if we have data
      const { data: userCount } = await supabase.from('users').select('count', { count: 'exact' });
      if (userCount && userCount.length === 0) {
        console.log('📝 No sample data found. Adding sample data...\n');
        await addSampleData();
      } else {
        console.log('✅ Database already has data');
      }
    }
    
    console.log('\n🎉 Database setup complete!');
    console.log('🚀 You can now run: npm run dev\n');
    
  } catch (error) {
    console.log('❌ Setup failed:', error.message);
    console.log('\n💡 Try running the SQL manually in Supabase dashboard:');
    console.log('1. Go to SQL Editor');
    console.log('2. Copy contents of supabase/migrations/001_initial_schema.sql');
    console.log('3. Run the SQL');
    console.log('4. Copy contents of supabase/seed/001_sample_data.sql');
    console.log('5. Run the seed data\n');
  }
}

async function setupSchema() {
  console.log('📋 Setting up database schema...');
  
  // Read schema file
  const schemaPath = path.join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql');
  
  if (!fs.existsSync(schemaPath)) {
    console.log('❌ Schema file not found:', schemaPath);
    return;
  }
  
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Split by semicolon and execute each statement
  const statements = schema.split(';').filter(stmt => stmt.trim());
  
  for (const statement of statements) {
    if (statement.trim()) {
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      if (error) {
        console.log('⚠️  SQL execution warning:', error.message);
      }
    }
  }
  
  console.log('✅ Schema setup complete');
}

async function addSampleData() {
  console.log('📝 Adding sample data...');
  
  // Read seed file
  const seedPath = path.join(process.cwd(), 'supabase', 'seed', '001_sample_data.sql');
  
  if (!fs.existsSync(seedPath)) {
    console.log('❌ Seed file not found:', seedPath);
    return;
  }
  
  const seedData = fs.readFileSync(seedPath, 'utf8');
  
  // Split by semicolon and execute each statement
  const statements = seedData.split(';').filter(stmt => stmt.trim());
  
  for (const statement of statements) {
    if (statement.trim()) {
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      if (error) {
        console.log('⚠️  Seed data warning:', error.message);
      }
    }
  }
  
  console.log('✅ Sample data added');
}

// Run setup
setupDatabase();
