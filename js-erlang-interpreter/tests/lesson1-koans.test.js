import { ErlangInterpreter } from '../src/interpreter.js';
import { TestFramework } from './test-framework.js';

const test = new TestFramework();

test.describe('Lesson 1 Koans - Basic Erlang Concepts', () => {
  let interpreter;

  // Helper to reset interpreter before each test
  function beforeEach() {
    interpreter = new ErlangInterpreter();
  }

  test.describe('Basic Arithmetic', () => {
    test.it('should add two numbers', () => {
      beforeEach();
      const result = interpreter.execute('2 + 3.');
      test.expect(result).toBe(5);
    });

    test.it('should subtract two numbers', () => {
      beforeEach();
      const result = interpreter.execute('10 - 4.');
      test.expect(result).toBe(6);
    });

    test.it('should multiply two numbers', () => {
      beforeEach();
      const result = interpreter.execute('6 * 7.');
      test.expect(result).toBe(42);
    });

    test.it('should divide two numbers', () => {
      beforeEach();
      const result = interpreter.execute('15 / 3.');
      test.expect(result).toBe(5);
    });

    test.it('should handle floating point arithmetic', () => {
      beforeEach();
      const result = interpreter.execute('3.14 + 2.86.');
      test.expect(result).toBe(6.0);
    });
  });

  test.describe('Variables and Assignment', () => {
    test.it('should assign and retrieve a number', () => {
      beforeEach();
      interpreter.execute('X = 42.');
      const result = interpreter.execute('X.');
      test.expect(result).toBe(42);
    });

    test.it('should assign and retrieve a string', () => {
      beforeEach();
      interpreter.execute('Name = "Alice".');
      const result = interpreter.execute('Name.');
      test.expect(result).toBe('"Alice"');
    });

    test.it('should assign and retrieve an atom', () => {
      beforeEach();
      interpreter.execute('Status = ok.');
      const result = interpreter.execute('Status.');
      test.expect(result).toBe('ok');
    });

    test.it('should use variables in expressions', () => {
      beforeEach();
      interpreter.execute('A = 5.');
      interpreter.execute('B = 3.');
      const result = interpreter.execute('A + B.');
      test.expect(result).toBe(8);
    });
  });

  test.describe('Data Types', () => {
    test.it('should handle atoms', () => {
      beforeEach();
      const result = interpreter.execute('hello.');
      test.expect(result).toBe('hello');
    });

    test.it('should handle lists', () => {
      beforeEach();
      const result = interpreter.execute('[1, 2, 3].');
      test.expect(result).toBe('[1, 2, 3]');
    });

    test.it('should handle tuples', () => {
      beforeEach();
      const result = interpreter.execute('{ok, 42}.');
      test.expect(result).toBe('{ok, 42}');
    });

    test.it('should handle empty list', () => {
      beforeEach();
      const result = interpreter.execute('[].');
      test.expect(result).toBe('[]');
    });

    test.it('should handle mixed data types in lists', () => {
      beforeEach();
      const result = interpreter.execute('[1, hello, "world"].');
      test.expect(result).toBe('[1, hello, "world"]');
    });
  });

  test.describe('Simple Functions', () => {
    test.it('should define and call a simple function', () => {
      beforeEach();
      interpreter.execute('double(X) -> X * 2.');
      const result = interpreter.execute('double(5).');
      test.expect(result).toBe(10);
    });

    test.it('should define a function with guards', () => {
      beforeEach();
      interpreter.execute('sign(X) when X > 0 -> positive; sign(X) when X < 0 -> negative; sign(X) -> zero.');
      
      test.expect(interpreter.execute('sign(5).')).toBe('positive');
      test.expect(interpreter.execute('sign(-3).')).toBe('negative');
      test.expect(interpreter.execute('sign(0).')).toBe('zero');
    });

    test.it('should handle function with multiple clauses', () => {
      beforeEach();
      interpreter.execute('factorial(0) -> 1; factorial(N) -> N * factorial(N - 1).');
      
      test.expect(interpreter.execute('factorial(0).')).toBe(1);
      test.expect(interpreter.execute('factorial(1).')).toBe(1);
      test.expect(interpreter.execute('factorial(3).')).toBe(6);
    });
  });

  test.describe('Built-in Functions', () => {
    test.it('should call abs function', () => {
      beforeEach();
      test.expect(interpreter.execute('abs(-5).')).toBe(5);
      test.expect(interpreter.execute('abs(3).')).toBe(3);
    });

    test.it('should call max function', () => {
      beforeEach();
      test.expect(interpreter.execute('max(5, 3).')).toBe(5);
      test.expect(interpreter.execute('max(1, 10).')).toBe(10);
    });

    test.it('should call min function', () => {
      beforeEach();
      test.expect(interpreter.execute('min(5, 3).')).toBe(3);
      test.expect(interpreter.execute('min(1, 10).')).toBe(1);
    });

    test.it('should call length function on lists', () => {
      beforeEach();
      interpreter.execute('MyList = [1, 2, 3, 4].');
      test.expect(interpreter.execute('length(MyList).')).toBe(4);
      test.expect(interpreter.execute('length([]).')).toBe(0);
    });
  });

  test.describe('Error Handling', () => {
    test.it('should throw error for undefined variable', () => {
      beforeEach();
      test.expect(() => interpreter.execute('UndefinedVar.')).toThrow('Undefined variable');
    });

    test.it('should throw error for division by zero', () => {
      beforeEach();
      test.expect(() => interpreter.execute('5 / 0.')).toThrow('Division by zero');
    });

    test.it('should throw error for unknown function', () => {
      beforeEach();
      test.expect(() => interpreter.execute('unknown_function(42).')).toThrow('Unknown function');
    });
  });
});

// Export test suite for use in run-tests.js
export default test;