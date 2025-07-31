import { TestFramework } from './test-framework.js';
import { KoanValidator } from '../src/koan-validator.js';

// Run tests
const test = new TestFramework();
const validator = new KoanValidator();

test.describe('Koan Validation Tests', () => {
  
  test.describe('Arithmetic Expression Validation', () => {
    test.it('should accept exact match', async () => {
      const result = await validator.validateAnswer('X * 2', 'X * 2');
      test.expect(result).toBeTrue();
    });
    
    test.it('should accept commutative multiplication', async () => {
      const result = await validator.validateAnswer('2 * X', 'X * 2');
      test.expect(result).toBeTrue();
    });
    
    test.it('should accept different spacing', async () => {
      const result1 = await validator.validateAnswer('X*2', 'X * 2');
      const result2 = await validator.validateAnswer('X  *  2', 'X * 2');
      const result3 = await validator.validateAnswer('2* X', 'X * 2');
      test.expect(result1).toBeTrue();
      test.expect(result2).toBeTrue();
      test.expect(result3).toBeTrue();
    });
    
    test.it('should accept parentheses', async () => {
      const result1 = await validator.validateAnswer('(X) * 2', 'X * 2');
      const result2 = await validator.validateAnswer('2 * (X)', 'X * 2');
      const result3 = await validator.validateAnswer('(X * 2)', 'X * 2');
      test.expect(result1).toBeTrue();
      test.expect(result2).toBeTrue();
      test.expect(result3).toBeTrue();
    });
    
    test.it('should accept commutative addition', async () => {
      const result1 = await validator.validateAnswer('Y + X', 'X + Y');
      const result2 = await validator.validateAnswer('X+Y', 'X + Y');
      test.expect(result1).toBeTrue();
      test.expect(result2).toBeTrue();
    });
    
    test.it('should reject incorrect expressions', async () => {
      const result1 = await validator.validateAnswer('X + 2', 'X * 2');
      const result2 = await validator.validateAnswer('X * 3', 'X * 2');
      const result3 = await validator.validateAnswer('Y * 2', 'X * 2');
      test.expect(result1).toBeFalse();
      test.expect(result2).toBeFalse();
      test.expect(result3).toBeFalse();
    });
  });
  
  test.describe('Pattern Matching Validation', () => {    
    test.it('should validate tuple patterns with concrete values and specific variable names', async () => {
      const result1 = await validator.validateAnswer('{person, Name}', '{person, Name}', 'pattern_check');
      const result2 = await validator.validateAnswer('{person, UserName}', '{person, Name}', 'pattern_check');
      const result3 = await validator.validateAnswer('{person, _}', '{person, Name}', 'pattern_check');
      const result4 = await validator.validateAnswer('{_, Name}', '{person, Name}', 'pattern_check');
      test.expect(result1).toBeTrue();  // Exact match
      test.expect(result2).toBeFalse(); // Different variable name not allowed
      test.expect(result3).toBeTrue();  // _ wildcard allowed
      test.expect(result4).toBeTrue();  // _ can match atoms
    });
    
    test.it('should validate tuple patterns with different spacing', async () => {
      const result1 = await validator.validateAnswer('{ person , Name }', '{person, Name}', 'pattern_check');
      const result2 = await validator.validateAnswer('{person,Name}', '{person, Name}', 'pattern_check');
      test.expect(result1).toBeTrue();
      test.expect(result2).toBeTrue();
    });
    
    test.it('should reject wrong arity patterns', async () => {
      const result1 = await validator.validateAnswer('{person}', '{person, Name}', 'pattern_check');
      const result2 = await validator.validateAnswer('{person, Name, Age}', '{person, Name}', 'pattern_check');
      test.expect(result1).toBeFalse();
      test.expect(result2).toBeFalse();
    });
    
    test.it('should reject wrong pattern types', async () => {
      const result1 = await validator.validateAnswer('[person, Name]', '{person, Name}', 'pattern_check');
      const result2 = await validator.validateAnswer('{person, Name}', '[person, Name]', 'pattern_check');
      test.expect(result1).toBeFalse();
      test.expect(result2).toBeFalse();
    });
    
    test.it('should reject invalid variable names', async () => {
      const result1 = await validator.validateAnswer('{person, 123}', '{person, Name}', 'pattern_check');
      const result2 = await validator.validateAnswer('{person, lowercase}', '{person, Name}', 'pattern_check');
      test.expect(result1).toBeFalse();
      test.expect(result2).toBeFalse();
    });
    
    test.it('should allow flexible matching when expected has wildcard', async () => {
      const result1 = await validator.validateAnswer('{person, Name}', '{_, Name}', 'pattern_check');
      const result2 = await validator.validateAnswer('{admin, Name}', '{_, Name}', 'pattern_check');
      const result3 = await validator.validateAnswer('{_, Name}', '{_, Name}', 'pattern_check');
      test.expect(result1).toBeTrue();
      test.expect(result2).toBeTrue();
      test.expect(result3).toBeTrue();
    });
    
    test.it('should handle constraint patterns with specific value requirements', async () => {
      // This is the regression case - pattern2 from lesson 01
      const result1 = await validator.validateAnswer('[10, 20, 30]', '[_, 20, _]', 'pattern_check');
      const result2 = await validator.validateAnswer('[10, 20, 40]', '[_, 20, _]', 'pattern_check');
      const result3 = await validator.validateAnswer('[5, 20, 100]', '[_, 20, _]', 'pattern_check');
      const result4 = await validator.validateAnswer('[10, 30, 40]', '[_, 20, _]', 'pattern_check');
      const result5 = await validator.validateAnswer('[10, 20]', '[_, 20, _]', 'pattern_check');
      
      test.expect(result1).toBeTrue();  // Original expected answer should work
      test.expect(result2).toBeTrue();  // Different third element should work
      test.expect(result3).toBeTrue();  // Different first and third should work
      test.expect(result4).toBeFalse(); // Wrong second element should fail
      test.expect(result5).toBeFalse(); // Wrong arity should fail
    });
    
    test.it('should handle constraint patterns with tuples', async () => {
      const result1 = await validator.validateAnswer('{ok, 42}', '{ok, _}', 'pattern_check');
      const result2 = await validator.validateAnswer('{ok, 100}', '{ok, _}', 'pattern_check');
      const result3 = await validator.validateAnswer('{error, 42}', '{ok, _}', 'pattern_check');
      
      test.expect(result1).toBeTrue();
      test.expect(result2).toBeTrue();
      test.expect(result3).toBeFalse();
    });
    
    test.it('should handle pattern_match_generator case from lesson 05', async () => {
      // Test the lesson 05 pattern_match_generator koan
      const result1 = await validator.validateAnswer('{person, Name}', '{_, Name}', 'pattern_check');
      const result2 = await validator.validateAnswer('{user, Name}', '{_, Name}', 'pattern_check');
      const result3 = await validator.validateAnswer('{_, Name}', '{_, Name}', 'pattern_check');
      const result4 = await validator.validateAnswer('{person, UserName}', '{_, Name}', 'pattern_check');
      
      test.expect(result1).toBeTrue();  // Different first element, correct second
      test.expect(result2).toBeTrue();  // Different first element, correct second
      test.expect(result3).toBeTrue();  // Exact match
      test.expect(result4).toBeFalse(); // Wrong second element (must be Name)
    });
  });
  
  test.describe('Value Check Validation', () => {
    test.it('should validate simple values', async () => {
      const result1 = await validator.validateAnswer('User', 'User', 'value_check');
      const result2 = await validator.validateAnswer('X', 'X', 'value_check');
      const result3 = await validator.validateAnswer('42', '42', 'value_check');
      test.expect(result1).toBeTrue();
      test.expect(result2).toBeTrue();
      test.expect(result3).toBeTrue();
    });
    
    test.it('should handle case-insensitive atoms', async () => {
      const result1 = await validator.validateAnswer('user', 'User', 'value_check');
      const result2 = await validator.validateAnswer('USER', 'user', 'value_check');
      test.expect(result1).toBeTrue();
      test.expect(result2).toBeTrue();
    });
    
    test.it('should handle numeric values', async () => {
      const result1 = await validator.validateAnswer('42', '42.0', 'value_check');
      const result2 = await validator.validateAnswer('42.0', '42', 'value_check');
      test.expect(result1).toBeTrue();
      test.expect(result2).toBeTrue();
    });
  });
  
  test.describe('Default Validation', () => {
    test.it('should do exact string matching by default', async () => {
      const result1 = await validator.validateAnswer('hello', 'hello');
      const result2 = await validator.validateAnswer('Hello', 'hello');
      const result3 = await validator.validateAnswer(' hello ', 'hello');
      test.expect(result1).toBeTrue();
      test.expect(result2).toBeTrue(); // Case-insensitive
      test.expect(result3).toBeTrue(); // Actually whitespace is trimmed in validation
    });
  });
});

test.summary();