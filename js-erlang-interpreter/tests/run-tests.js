#!/usr/bin/env node

import lesson1Tests from './lesson1-koans.test.js';

async function runAllTests() {
  console.log('🧪 Running JS Erlang Interpreter Tests\n');
  
  try {
    // Run lesson 1 tests
    lesson1Tests.summary();
    
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  }
}

runAllTests();