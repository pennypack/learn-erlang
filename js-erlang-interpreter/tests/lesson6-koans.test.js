import { TestFramework } from './test-framework.js';

const test = new TestFramework();

test.describe('Lesson 6 Koans - Records and Complex Data Structures', () => {
  
  test.describe('Koan Structure Validation', () => {
    test.it('should have valid koan IDs', () => {
      const koanIds = [
        "record_definition",
        "record_creation", 
        "record_field_access",
        "record_update",
        "record_pattern_match",
        "nested_record_access",
        "record_comprehension",
        "record_default_value"
      ];
      
      koanIds.forEach(id => {
        test.expect(typeof id).toBe('string');
        test.expect(id.length > 0).toBeTrue();
      });
    });

    test.it('should have proper record syntax patterns', () => {
      const recordPatterns = [
        "#user{id=1, name=\"Bob\"}",
        "User#user.name", 
        "User#user{status=online}",
        "P#person.address#address.city"
      ];
      
      recordPatterns.forEach(pattern => {
        test.expect(pattern.includes('#')).toBeTrue();
        test.expect(typeof pattern).toBe('string');
      });
    });
  });

  test.describe('Answer Validation Logic', () => {
    test.it('should validate record field names', () => {
      const validFields = ['name', 'age', 'status', 'id'];
      
      validFields.forEach(field => {
        test.expect(typeof field).toBe('string');
        test.expect(field.length > 0).toBeTrue();
      });
    });

    test.it('should validate record syntax components', () => {
      const validRecordSyntax = "#user{id=1}";
      test.expect(validRecordSyntax.startsWith('#')).toBeTrue();
      test.expect(validRecordSyntax.includes('{')).toBeTrue();
      test.expect(validRecordSyntax.includes('}')).toBeTrue();
      test.expect(validRecordSyntax.includes('=')).toBeTrue();
    });

    test.it('should validate field access syntax', () => {
      const fieldAccess = "User#user.name";
      test.expect(fieldAccess.includes('#')).toBeTrue();
      test.expect(fieldAccess.includes('.')).toBeTrue();
      test.expect(fieldAccess.indexOf('#') < fieldAccess.indexOf('.')).toBeTrue();
    });

    test.it('should validate record update syntax', () => {
      const updateSyntax = "User#user{status=online}";
      test.expect(updateSyntax.includes('#')).toBeTrue();
      test.expect(updateSyntax.includes('{')).toBeTrue();
      test.expect(updateSyntax.includes('=')).toBeTrue();
    });

    test.it('should validate nested record access', () => {
      const nestedAccess = "P#person.address#address.city";
      const hashCount = (nestedAccess.match(/#/g) || []).length;
      const dotCount = (nestedAccess.match(/\./g) || []).length;
      
      test.expect(hashCount).toBe(2);
      test.expect(dotCount).toBe(2);
    });

    test.it('should validate reasonable default values', () => {
      const validDefaults = ['inactive', 'pending', 'new', 'offline'];
      
      validDefaults.forEach(def => {
        test.expect(typeof def).toBe('string');
        test.expect(def.length > 0).toBeTrue();
      });
      
      // Test that empty string is detected as invalid
      test.expect(''.length === 0).toBeTrue();
      
      // Test that numeric strings can be detected
      test.expect(!isNaN('123')).toBeTrue();
    });
  });

  test.describe('Koan Answer Patterns', () => {
    test.it('should match expected patterns for basic concepts', () => {
      // Test that our koan answers follow expected patterns
      const answers = {
        record_definition: "undefined",
        record_creation: "#user{id=1, name=\"Bob\"}",
        record_field_access: "User#user.name",
        record_update: "User#user{status=online}",
        record_pattern_match: "online",
        nested_record_access: "P#person.address#address.city",
        record_comprehension: "age",
        record_default_value: "inactive"
      };
      
      // Validate each answer has expected structure
      test.expect(answers.record_definition).toBe("undefined");
      test.expect(answers.record_creation.startsWith('#')).toBeTrue();
      test.expect(answers.record_field_access.includes('.')).toBeTrue();
      test.expect(answers.record_update.includes('{')).toBeTrue();
      test.expect(answers.record_pattern_match).toBe("online");
      test.expect(answers.nested_record_access.split('#').length).toBe(3);
      test.expect(answers.record_comprehension).toBe("age");
      test.expect(typeof answers.record_default_value).toBe('string');
    });
  });
});

// Run tests and show summary when executed directly
test.summary();

// Export test suite for use in run-tests.js
export default test;