import { ErlangLexer } from './lexer.js';
import { ErlangParser } from './parser.js';
import { ErlangEvaluator } from './evaluator.js';
import { ErlangBuiltins } from './builtins.js';

export class ErlangInterpreter {
  constructor() {
    this.evaluator = new ErlangEvaluator();
  }

  execute(code) {
    try {
      // Tokenize
      const lexer = new ErlangLexer(code);
      const tokens = lexer.tokenize();
      
      // Parse
      const parser = new ErlangParser(tokens);
      const ast = parser.parse();
      
      // Evaluate
      const result = this.evaluator.evaluate(ast);
      
      return this.formatResult(result);
    } catch (error) {
      throw new Error(`Execution error: ${error.message}`);
    }
  }

  formatResult(result) {
    if (result === null || result === undefined) {
      return 'undefined';
    }
    
    if (typeof result === 'number') {
      return result;
    }
    
    if (typeof result === 'string') {
      if (ErlangBuiltins.isAtom(result)) {
        return ErlangBuiltins.atomValue(result);
      }
      return `"${result}"`;
    }
    
    if (Array.isArray(result)) {
      const elements = result.map(elem => this.formatResult(elem));
      return `[${elements.join(', ')}]`;
    }
    
    if (ErlangBuiltins.isTuple(result)) {
      const elements = ErlangBuiltins.tupleElements(result);
      const formatted = elements.map(elem => this.formatResult(elem));
      return `{${formatted.join(', ')}}`;
    }
    
    if (typeof result === 'boolean') {
      return result ? 'true' : 'false';
    }
    
    return String(result);
  }

  reset() {
    this.evaluator.reset();
  }

  // Execute multiple statements and return the last result
  executeStatements(statements) {
    let result = null;
    for (const statement of statements) {
      result = this.execute(statement);
    }
    return result;
  }

  // Get current variable values (for debugging)
  getVariables() {
    return Object.fromEntries(this.evaluator.variables);
  }

  // Get current function definitions (for debugging)
  getFunctions() {
    return Object.fromEntries(this.evaluator.functions);
  }
}