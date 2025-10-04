#!/usr/bin/env node

/**
 * Set up database schema using service role key
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://ahlwvrfnhkurnaahdzmu.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFobHd2cmZuaGt1cm5hYWhkem11Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQ2OTY2MCwiZXhwIjoyMDc1MDQ1NjYwfQ.UunB0XChBIIKyLzOrUtgQ072mE3xKw22T2a1bKphbSU';

console.log('🏠 LeadGenie AI - Database Schema Setup');
console.log('=======================================\n');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setupSchema() {
  try {
    console.log('🔌 Testing connection with service role...');
    
    // Test basic connection
    const { data, error } = await supabase.rpc('version');
    if (error) {
      console.log('❌ Connection error:', error.message);
      return;
    }
    
    console.log('✅ Connected to Supabase successfully!');
    console.log('📊 Database version:', data || 'Unknown');
    
    // Check if tables exist
    console.log('\n🔍 Checking existing tables...');
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tableError) {
      console.log('⚠️  Could not check tables:', tableError.message);
    } else {
      const tableNames = tables?.map(t => t.table_name) || [];
      console.log('📋 Existing tables:', tableNames.length > 0 ? tableNames.join(', ') : 'None');
      
      if (tableNames.includes('users')) {
        console.log('✅ Database schema already exists!');
        await checkSampleData();
        return;
      }
    }
    
    console.log('\n📋 Setting up database schema...');
    console.log('⚠️  You need to run the SQL manually in Supabase dashboard:');
    console.log('1. Go to Supabase → SQL Editor');
    console.log('2. Copy the schema from supabase/migrations/001_initial_schema.sql');
    console.log('3. Paste and run the SQL');
    console.log('4. Copy the sample data from supabase/seed/001_sample_data.sql');
    console.log('5. Paste and run the sample data\n');
    
    // Show first few lines of schema
    const schemaPath = 'supabase/migrations/001_initial_schema.sql';
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      console.log('🔍 First 10 lines of schema:');
      console.log(schema.split('\n').slice(0, 10).join('\n'));
      console.log('...\n');
    }
    
  } catch (error) {
    console.log('❌ Setup failed:', error.message);
  }
}

async function checkSampleData() {
  console.log('\n📝 Checking sample data...');
  
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('count', { count: 'exact' });
  
  if (userError) {
    console.log('❌ Error checking users:', userError.message);
    return;
  }
  
  const userCount = users?.length || 0;
  console.log(`👥 Users: ${userCount}`);
  
  if (userCount === 0) {
    console.log('📝 No sample data found. You need to add sample data:');
    console.log('1. Go to Supabase → SQL Editor');
    console.log('2. Copy contents of supabase/seed/001_sample_data.sql');
    console.log('3. Paste and run the SQL\n');
  } else {
    console.log('✅ Sample data exists!');
    
    // Check other tables
    const { data: properties } = await supabase.from('properties').select('count', { count: 'exact' });
    const { data: leads } = await supabase.from('leads').select('count', { count: 'exact' });
    
    console.log(`🏠 Properties: ${properties?.length || 0}`);
    console.log(`📞 Leads: ${leads?.length || 0}`);
  }
}

// Run setup
setupSchema();
