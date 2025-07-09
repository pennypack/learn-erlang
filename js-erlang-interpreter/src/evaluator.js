import { ErlangBuiltins } from './builtins.js';

export class ErlangEvaluator {
  constructor() {
    this.variables = new Map();
    this.functions = new Map();
    this.builtins = new ErlangBuiltins();
  }

  evaluate(statements) {
    let result = null;
    
    for (const statement of statements) {
      result = this.evaluateStatement(statement);
    }
    
    return result;
  }

  evaluateStatement(statement) {
    switch (statement.type) {
      case 'Assignment':
        return this.evaluateAssignment(statement);
      case 'FunctionDefinition':
        return this.evaluateFunctionDefinition(statement);
      case 'ExpressionStatement':
        return this.evaluateExpression(statement.expression);
      default:
        throw new Error(`Unknown statement type: ${statement.type}`);
    }
  }

  evaluateAssignment(statement) {
    const value = this.evaluateExpression(statement.value);
    this.variables.set(statement.variable, value);
    return value;
  }

  evaluateFunctionDefinition(statement) {
    this.functions.set(statement.name, statement.clauses);
    return ErlangBuiltins.createAtom('ok');
  }

  evaluateExpression(expression) {
    switch (expression.type) {
      case 'Number':
        return expression.value;
      case 'String':
        return expression.value;
      case 'Atom':
        return ErlangBuiltins.createAtom(expression.value);
      case 'Variable':
        return this.evaluateVariable(expression);
      case 'List':
        return this.evaluateList(expression);
      case 'Tuple':
        return this.evaluateTuple(expression);
      case 'BinaryOp':
        return this.evaluateBinaryOp(expression);
      case 'UnaryOp':
        return this.evaluateUnaryOp(expression);
      case 'FunctionCall':
        return this.evaluateFunctionCall(expression);
      default:
        throw new Error(`Unknown expression type: ${expression.type}`);
    }
  }

  evaluateVariable(expression) {
    if (!this.variables.has(expression.name)) {
      throw new Error(`Undefined variable: ${expression.name}`);
    }
    return this.variables.get(expression.name);
  }

  evaluateList(expression) {
    const elements = expression.elements.map(elem => this.evaluateExpression(elem));
    
    if (expression.tail) {
      const tail = this.evaluateExpression(expression.tail);
      if (Array.isArray(tail)) {
        return [...elements, ...tail];
      } else {
        // Improper list (not supported in this basic implementation)
        throw new Error('Improper lists not supported');
      }
    }
    
    return elements;
  }

  evaluateTuple(expression) {
    const elements = expression.elements.map(elem => this.evaluateExpression(elem));
    return ErlangBuiltins.createTuple(elements);
  }

  evaluateBinaryOp(expression) {
    const left = this.evaluateExpression(expression.left);
    const right = this.evaluateExpression(expression.right);
    
    switch (expression.operator) {
      case '+':
        if (typeof left !== 'number' || typeof right !== 'number') {
          throw new Error('Addition requires numbers');
        }
        return left + right;
      case '-':
        if (typeof left !== 'number' || typeof right !== 'number') {
          throw new Error('Subtraction requires numbers');
        }
        return left - right;
      case '*':
        if (typeof left !== 'number' || typeof right !== 'number') {
          throw new Error('Multiplication requires numbers');
        }
        return left * right;
      case '/':
        if (typeof left !== 'number' || typeof right !== 'number') {
          throw new Error('Division requires numbers');
        }
        if (right === 0) {
          throw new Error('Division by zero');
        }
        return left / right;
      case '>':
        return left > right;
      case '>=':
        return left >= right;
      case '<':
        return left < right;
      case '<=':
        return left <= right;
      default:
        throw new Error(`Unknown operator: ${expression.operator}`);
    }
  }

  evaluateUnaryOp(expression) {
    const operand = this.evaluateExpression(expression.operand);
    
    switch (expression.operator) {
      case '-':
        if (typeof operand !== 'number') {
          throw new Error('Unary minus requires a number');
        }
        return -operand;
      default:
        throw new Error(`Unknown unary operator: ${expression.operator}`);
    }
  }

  evaluateFunctionCall(expression) {
    const args = expression.arguments.map(arg => this.evaluateExpression(arg));
    
    // Check builtins first
    if (this.builtins.hasFunction(expression.name)) {
      return this.builtins.callFunction(expression.name, args);
    }
    
    // Check user-defined functions
    if (this.functions.has(expression.name)) {
      return this.callUserFunction(expression.name, args);
    }
    
    throw new Error(`Unknown function: ${expression.name}/${args.length}`);
  }

  callUserFunction(name, args) {
    const clauses = this.functions.get(name);
    
    for (const clause of clauses) {
      if (clause.parameters.length !== args.length) {
        continue; // Wrong arity
      }
      
      // Create new variable scope
      const savedVariables = new Map(this.variables);
      
      try {
        // Bind parameters (handle pattern matching)
        let patternMatched = true;
        for (let i = 0; i < clause.parameters.length; i++) {
          const param = clause.parameters[i];
          const arg = args[i];
          
          if (typeof param === 'string' && param[0] === param[0].toUpperCase()) {
            // Variable parameter
            this.variables.set(param, arg);
          } else if (typeof param === 'number') {
            // Numeric pattern - must match exactly
            if (arg !== param) {
              patternMatched = false;
              break;
            }
          } else if (typeof param === 'string') {
            // Atom pattern - must match exactly
            const atomValue = ErlangBuiltins.createAtom(param);
            if (arg !== atomValue) {
              patternMatched = false;
              break;
            }
          }
        }
        
        if (!patternMatched) {
          this.variables = savedVariables;
          continue;
        }
        
        // Check guards
        if (clause.guards) {
          let guardsPassed = true;
          for (const guard of clause.guards) {
            if (!this.evaluateGuard(guard)) {
              guardsPassed = false;
              break;
            }
          }
          if (!guardsPassed) {
            this.variables = savedVariables;
            continue;
          }
        }
        
        // Execute body
        const result = this.evaluateExpression(clause.body);
        this.variables = savedVariables;
        return result;
        
      } catch (error) {
        this.variables = savedVariables;
        throw error;
      }
    }
    
    throw new Error(`No function clause matches ${name}/${args.length}`);
  }

  evaluateGuard(guard) {
    try {
      const result = this.evaluateExpression(guard);
      return result === true;
    } catch (error) {
      return false; // Guards that fail are considered false
    }
  }

  // Helper to check if a function call is a guard
  isGuardCall(expression) {
    if (expression.type !== 'FunctionCall') return false;
    return this.builtins.hasGuard(expression.name);
  }

  // Reset state for new execution
  reset() {
    this.variables.clear();
    this.functions.clear();
  }
}