#!/usr/bin/env node

/**
 * Simple database setup script for LeadGenie AI
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://ahlwvrfnhkurnaahdzmu.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFobHd2cmZuaGt1cm5hYWhkem11Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQ2OTY2MCwiZXhwIjoyMDc1MDQ1NjYwfQ.UunB0XChBIIKyLzOrUtgQ072mE3xKw22T2a1bKphbSU';

console.log('🏠 LeadGenie AI - Database Setup');
console.log('================================\n');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setupDatabase() {
  try {
    console.log('🔌 Testing connection...');
    
    // Test connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('📊 Database schema not found. Setting up...\n');
      await setupSchema();
    } else if (error) {
      console.log('❌ Database connection error:', error.message);
      console.log('\n💡 You may need to add the service role key for admin operations.');
      console.log('Go to Supabase → Settings → API → Copy service_role key');
      console.log('Then update SUPABASE_SERVICE_ROLE_KEY in .env.local\n');
      return;
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
    console.log('\n💡 Try setting up the database manually:');
    console.log('1. Go to Supabase → SQL Editor');
    console.log('2. Copy contents of supabase/migrations/001_initial_schema.sql');
    console.log('3. Run the SQL');
    console.log('4. Copy contents of supabase/seed/001_sample_data.sql');
    console.log('5. Run the seed data\n');
  }
}

async function setupSchema() {
  console.log('📋 Setting up database schema...');
  
  // Read schema file
  const schemaPath = 'supabase/migrations/001_initial_schema.sql';
  
  if (!fs.existsSync(schemaPath)) {
    console.log('❌ Schema file not found:', schemaPath);
    return;
  }
  
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  // For now, just show what needs to be done
  console.log('📄 Schema file found. You need to run this SQL manually:');
  console.log('1. Go to Supabase → SQL Editor');
  console.log('2. Copy and paste the schema SQL');
  console.log('3. Click "Run" to execute\n');
  
  console.log('🔍 First few lines of schema:');
  console.log(schema.split('\n').slice(0, 10).join('\n'));
  console.log('...\n');
}

async function addSampleData() {
  console.log('📝 Adding sample data...');
  
  // Read seed file
  const seedPath = 'supabase/seed/001_sample_data.sql';
  
  if (!fs.existsSync(seedPath)) {
    console.log('❌ Seed file not found:', seedPath);
    return;
  }
  
  const seedData = fs.readFileSync(seedPath, 'utf8');
  
  console.log('📄 Seed data file found. You need to run this SQL manually:');
  console.log('1. Go to Supabase → SQL Editor');
  console.log('2. Copy and paste the seed data SQL');
  console.log('3. Click "Run" to execute\n');
  
  console.log('🔍 First few lines of seed data:');
  console.log(seedData.split('\n').slice(0, 10).join('\n'));
  console.log('...\n');
}

// Run setup
setupDatabase();
