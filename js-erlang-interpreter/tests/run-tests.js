#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runAllTests() {
  console.log('🧪 Running JS Erlang Interpreter Tests\n');
  
  try {
    // Run lesson 1 tests
    console.log('Running Lesson 1 Koan Tests...');
    const { stdout: lesson1Output } = await execAsync('node lesson1-koans.test.js', { cwd: process.cwd() });
    console.log(lesson1Output);
    
    // Run validation tests
    console.log('\nRunning Koan Validation Tests...');
    const { stdout: validationOutput } = await execAsync('node koan-validation.test.js', { cwd: process.cwd() });
    console.log(validationOutput);
    
    console.log('\n✅ All test suites completed successfully!');
    
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    if (error.stdout) {
      console.log('Test output:', error.stdout);
    }
    if (error.stderr) {
      console.error('Error output:', error.stderr);
    }
    process.exit(1);
  }
}

runAllTests();