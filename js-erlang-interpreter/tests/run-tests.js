#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of this script file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import test modules directly
async function runAllTests() {
  console.log('🧪 Running JS Erlang Interpreter Tests\n');
  
  try {
    // Import lesson 1 tests (executes on import)
    console.log('Running Lesson 1 Koan Tests...');
    await import('./lesson1-koans.test.js');
    
    // Import validation tests (executes on import)
    console.log('\nRunning Koan Validation Tests...');
    await import('./koan-validation.test.js');
    
    console.log('\n✅ All test suites completed successfully!');
    
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

runAllTests();