export class KoanValidator {
  constructor() {
    // Ready to validate
  }

  async validateAnswer(userAnswer, expectedAnswer, validationHint) {
    // For pattern matching, validate that the pattern structure matches
    if (validationHint === 'pattern_check') {
      try {
        const normalizePattern = (pattern) => {
          return pattern
            .replace(/\s+/g, ' ')
            .trim();
        };
        
        const userNorm = normalizePattern(userAnswer);
        const expectedNorm = normalizePattern(expectedAnswer);
        
        // Check if expected answer uses constraint syntax like "[_, 20, _]"
        // This specifies which positions must match specific values
        const isConstraintPattern = expectedNorm.includes('_') && 
          (expectedNorm.includes('[') || expectedNorm.includes('{'));
        
        if (isConstraintPattern) {
          // Parse constraint pattern - positions with specific values must match
          const getPatternStructure = (pattern) => {
            if (pattern.startsWith('{') && pattern.endsWith('}')) {
              const elements = pattern.slice(1, -1).split(',').map(e => e.trim());
              return { type: 'tuple', elements, arity: elements.length };
            }
            if (pattern.startsWith('[') && pattern.endsWith(']')) {
              const elements = pattern.slice(1, -1).split(',').map(e => e.trim());
              return { type: 'list', elements, arity: elements.length };
            }
            return null;
          };
          
          const userStruct = getPatternStructure(userNorm);
          const expectedStruct = getPatternStructure(expectedNorm);
          
          // Must be same type and arity
          if (!userStruct || !expectedStruct || 
              userStruct.type !== expectedStruct.type || 
              userStruct.arity !== expectedStruct.arity) {
            return false;
          }
          
          // Check constraints: non-_ positions must match exactly
          for (let i = 0; i < expectedStruct.elements.length; i++) {
            const expectedElem = expectedStruct.elements[i];
            const userElem = userStruct.elements[i];
            
            if (expectedElem !== '_') {
              // This position has a constraint - must match exactly
              if (userElem !== expectedElem) {
                return false;
              }
            }
            // If expected is _, user can put anything
          }
          
          return true;
        }
        
        // Legacy pattern matching for tuple/list patterns with variables
        const getPatternStructure = (pattern) => {
          if (pattern.startsWith('{') && pattern.endsWith('}')) {
            const elements = pattern.slice(1, -1).split(',').map(e => e.trim());
            return { type: 'tuple', elements, arity: elements.length };
          }
          if (pattern.startsWith('[') && pattern.endsWith(']')) {
            const elements = pattern.slice(1, -1).split(',').map(e => e.trim());
            return { type: 'list', elements, arity: elements.length };
          }
          return null;
        };
        
        const userStruct = getPatternStructure(userNorm);
        const expectedStruct = getPatternStructure(expectedNorm);
        
        // Both must be the same type and arity  
        if (!userStruct || !expectedStruct || 
            userStruct.type !== expectedStruct.type || 
            userStruct.arity !== expectedStruct.arity) {
          return false;
        }
        
        // For tuple/list patterns, check matching rules
        for (let i = 0; i < userStruct.elements.length; i++) {
          const userElem = userStruct.elements[i];
          const expectedElem = expectedStruct.elements[i];
          
          // If expected is a concrete value (atom/string), user must match exactly or use _
          if (expectedElem.startsWith('"') || /^[a-z][a-zA-Z0-9_]*$/.test(expectedElem)) {
            if (userElem !== expectedElem && userElem !== '_') {
              return false;
            }
          }
          // If expected is a specific variable name, user must use that exact name or _
          else if (/^[A-Z][a-zA-Z0-9_]*$/.test(expectedElem)) {
            if (userElem !== expectedElem && userElem !== '_') {
              return false;
            }
          }
          // If expected is just _, user can use any variable, atom, or _
          else if (expectedElem === '_') {
            // Allow variables (uppercase), atoms (lowercase), or wildcard
            if (!/^[A-Za-z_][a-zA-Z0-9_]*$/.test(userElem) && !userElem.startsWith('"')) {
              return false;
            }
          }
        }
        return true;
      } catch (error) {
        return false;
      }
    }
    
    // For arithmetic and other value checks, allow flexible matching
    if (validationHint === 'value_check' || !validationHint) {
      // Remove whitespace and check if it's the expected value
      const cleanUser = userAnswer.trim();
      const cleanExpected = expectedAnswer.trim();
      
      // Try to parse as numbers for arithmetic
      const userNum = parseFloat(cleanUser);
      const expectedNum = parseFloat(cleanExpected);
      
      if (!isNaN(userNum) && !isNaN(expectedNum)) {
        return userNum === expectedNum;
      }
      
      // Handle Erlang expression patterns like "Head + 1"
      if (cleanExpected.includes('+') || cleanExpected.includes('-') || cleanExpected.includes('*') || cleanExpected.includes('/')) {
        // Allow flexible matching for arithmetic expressions
        const normalizeExpr = (expr) => {
          // Normalize whitespace and remove unnecessary parentheses
          return expr
            .replace(/\s+/g, ' ')
            .replace(/\(\s*([^()]+)\s*\)/g, '$1') // Remove single parentheses
            .trim();
        };
        
        // Check for exact match first
        if (normalizeExpr(cleanUser) === normalizeExpr(cleanExpected)) {
          return true;
        }
        
        // For multiplication, check commutative property (X * 2 === 2 * X)
        if (cleanExpected.includes('*') || cleanUser.includes('*')) {
          // Handle different multiplication formats
          const parseMultiplication = (expr) => {
            // Also handle (X) * 2, X*2, etc.
            const normalized = normalizeExpr(expr);
            const parts = normalized.split(/\s*\*\s*/).map(p => p.trim());
            return parts;
          };
          
          const expectedParts = parseMultiplication(cleanExpected);
          const userParts = parseMultiplication(cleanUser);
          
          if (expectedParts.length === 2 && userParts.length === 2) {
            // Check if it's the same multiplication in different order
            if ((expectedParts[0] === userParts[0] && expectedParts[1] === userParts[1]) ||
                (expectedParts[0] === userParts[1] && expectedParts[1] === userParts[0])) {
              return true;
            }
          }
        }
        
        // For addition, check commutative property (X + Y === Y + X)
        if (cleanExpected.includes('+') || cleanUser.includes('+')) {
          const parseAddition = (expr) => {
            const normalized = normalizeExpr(expr);
            const parts = normalized.split(/\s*\+\s*/).map(p => p.trim());
            return parts;
          };
          
          const expectedParts = parseAddition(cleanExpected);
          const userParts = parseAddition(cleanUser);
          
          if (expectedParts.length === 2 && userParts.length === 2) {
            // Check if it's the same addition in different order
            if ((expectedParts[0] === userParts[0] && expectedParts[1] === userParts[1]) ||
                (expectedParts[0] === userParts[1] && expectedParts[1] === userParts[0])) {
              return true;
            }
          }
        }
        
        return false;
      }
      
      // Case-insensitive matching for Erlang atoms and variables
      if (cleanExpected.toLowerCase() === cleanUser.toLowerCase()) {
        return true;
      }
      
      // Otherwise do string comparison
      return cleanUser === cleanExpected;
    }
    
    // Default to string comparison
    return userAnswer === expectedAnswer;
  }
}