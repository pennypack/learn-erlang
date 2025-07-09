export class TestFramework {
  constructor() {
    this.tests = [];
    this.results = {
      passed: 0,
      failed: 0,
      total: 0
    };
  }

  describe(description, testFunction) {
    console.log(`\n📚 ${description}`);
    testFunction();
  }

  it(description, testFunction) {
    this.results.total++;
    
    try {
      testFunction();
      this.results.passed++;
      console.log(`  ✅ ${description}`);
    } catch (error) {
      this.results.failed++;
      console.log(`  ❌ ${description}`);
      console.log(`     Error: ${error.message}`);
    }
  }

  expect(actual) {
    return new Expectation(actual);
  }

  summary() {
    console.log(`\n📊 Test Results:`);
    console.log(`   Passed: ${this.results.passed}`);
    console.log(`   Failed: ${this.results.failed}`);
    console.log(`   Total:  ${this.results.total}`);
    
    if (this.results.failed === 0) {
      console.log(`\n🎉 All tests passed!`);
    } else {
      console.log(`\n⚠️  ${this.results.failed} test(s) failed`);
      process.exit(1);
    }
  }
}

class Expectation {
  constructor(actual) {
    this.actual = actual;
  }

  toBe(expected) {
    if (this.actual !== expected) {
      throw new Error(`Expected ${expected}, got ${this.actual}`);
    }
  }

  toEqual(expected) {
    if (JSON.stringify(this.actual) !== JSON.stringify(expected)) {
      throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(this.actual)}`);
    }
  }

  toThrow(expectedMessage) {
    if (typeof this.actual !== 'function') {
      throw new Error('Expected a function to test for thrown errors');
    }
    
    let threwError = false;
    let actualMessage = '';
    
    try {
      this.actual();
    } catch (error) {
      threwError = true;
      actualMessage = error.message;
    }
    
    if (!threwError) {
      throw new Error('Expected function to throw an error');
    }
    
    if (expectedMessage && !actualMessage.includes(expectedMessage)) {
      throw new Error(`Expected error message to contain "${expectedMessage}", got "${actualMessage}"`);
    }
  }

  toContain(expected) {
    if (!this.actual.includes(expected)) {
      throw new Error(`Expected "${this.actual}" to contain "${expected}"`);
    }
  }

  toBeTrue() {
    if (this.actual !== true) {
      throw new Error(`Expected true, got ${this.actual}`);
    }
  }

  toBeFalse() {
    if (this.actual !== false) {
      throw new Error(`Expected false, got ${this.actual}`);
    }
  }
}