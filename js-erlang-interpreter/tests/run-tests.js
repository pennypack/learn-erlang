#!/usr/bin/env node

// ES module imports

// Import test modules directly
async function runAllTests() {
  console.log('🧪 Running JS Erlang Interpreter Tests\n');
  
  try {
    // Import lesson 1 tests (executes on import)
    console.log('Running Lesson 1 Koan Tests...');
    await import('./lesson1-koans.test.js');
    
    // Import lesson 6 tests (executes on import)
    console.log('\nRunning Lesson 6 Koan Tests...');
    await import('./lesson6-koans.test.js');
    
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