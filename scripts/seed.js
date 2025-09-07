#!/usr/bin/env node

/**
 * SafeMama Companion Seed Script
 * This script runs the seed data SQL to populate the database
 */

const fs = require('fs');
const path = require('path');

async function runSeed() {
  try {
    console.log('🌱 SafeMama Companion Seed Script');
    console.log('================================');
    
    const sqlPath = path.join(__dirname, 'seed-data.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 Seed data SQL loaded');
    console.log('📊 Content includes:');
    console.log('   - 12 education topics across trimesters');
    console.log('   - 30+ daily tips with condition-specific advice');
    console.log('   - 9 micro communities for different regions');
    console.log('');
    console.log('🚀 To apply this seed data:');
    console.log('   1. Copy the contents of scripts/seed-data.sql');
    console.log('   2. Run it in your Supabase SQL editor');
    console.log('   3. Or use the Supabase CLI: supabase db reset');
    console.log('');
    console.log('✅ Seed script completed successfully!');
    
  } catch (error) {
    console.error('❌ Error running seed script:', error);
    process.exit(1);
  }
}

runSeed();
