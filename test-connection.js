#!/usr/bin/env node

/**
 * Simple connection test
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ahlwvrfnhkurnaahdzmu.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFobHd2cmZuaGt1cm5hYWhkem11Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQ2OTY2MCwiZXhwIjoyMDc1MDQ1NjYwfQ.UunB0XChBIIKyLzOrUtgQ072mE3xKw22T2a1bKphbSU';

console.log('🔌 Testing Supabase Connection');
console.log('==============================\n');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function testConnection() {
  try {
    // Test basic API connection
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Supabase API connection successful!');
      console.log(`📍 Project URL: ${SUPABASE_URL}`);
      console.log(`🔑 Service Key: ${SUPABASE_SERVICE_KEY.substring(0, 20)}...`);
      
      console.log('\n📋 Next steps:');
      console.log('1. Go to Supabase → SQL Editor');
      console.log('2. Copy and run the schema SQL');
      console.log('3. Copy and run the sample data SQL');
      console.log('4. Test the application\n');
      
    } else {
      console.log('❌ API connection failed:', response.status);
    }
    
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
}

testConnection();
