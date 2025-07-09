export class ErlangParser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  parse() {
    const statements = [];
    
    while (!this.isAtEnd()) {
      if (this.peek().type === 'EOF') break;
      
      const stmt = this.parseStatement();
      if (stmt) {
        statements.push(stmt);
      }
    }
    
    return statements;
  }

  parseStatement() {
    // Variable assignment: X = 42.
    if (this.peek().type === 'VARIABLE' && this.peekNext()?.type === 'EQUALS') {
      return this.parseAssignment();
    }
    
    // Function definition: func(X) -> X + 1.
    if (this.peek().type === 'ATOM' && this.peekNext()?.type === 'LPAREN') {
      // Look ahead to see if this is a function definition or function call
      const saved = this.position;
      this.advance(); // skip atom
      this.advance(); // skip lparen
      
      // Skip parameters
      let parenCount = 1;
      while (parenCount > 0 && !this.isAtEnd()) {
        if (this.peek().type === 'LPAREN') parenCount++;
        if (this.peek().type === 'RPAREN') parenCount--;
        this.advance();
      }
      
      // Check if we have 'when' or '->' after parameters
      const isFunction = this.peek().type === 'WHEN' || this.peek().type === 'ARROW';
      
      // Restore position
      this.position = saved;
      
      if (isFunction) {
        return this.parseFunctionDefinition();
      }
    }
    
    // Expression statement
    const expr = this.parseExpression();
    this.consume('DOT', 'Expected "." after expression');
    return { type: 'ExpressionStatement', expression: expr };
  }

  parseAssignment() {
    const variable = this.consume('VARIABLE', 'Expected variable name').value;
    this.consume('EQUALS', 'Expected "="');
    const value = this.parseExpression();
    this.consume('DOT', 'Expected "." after assignment');
    
    return {
      type: 'Assignment',
      variable,
      value
    };
  }

  parseFunctionDefinition() {
    const name = this.consume('ATOM', 'Expected function name').value;
    this.consume('LPAREN', 'Expected "(" after function name');
    
    const parameters = [];
    if (this.peek().type !== 'RPAREN') {
      do {
        // Parameters can be variables, atoms, numbers, or patterns
        if (this.peek().type === 'VARIABLE') {
          parameters.push(this.consume('VARIABLE', 'Expected parameter name').value);
        } else if (this.peek().type === 'ATOM') {
          parameters.push(this.consume('ATOM', 'Expected parameter name').value);
        } else if (this.peek().type === 'NUMBER') {
          parameters.push(this.consume('NUMBER', 'Expected parameter').value);
        } else {
          throw new Error(`Unexpected parameter type: ${this.peek().type}`);
        }
      } while (this.match('COMMA'));
    }
    
    this.consume('RPAREN', 'Expected ")" after parameters');
    
    // Parse guards if present
    let guards = null;
    if (this.match('WHEN')) {
      guards = this.parseGuards();
    }
    
    this.consume('ARROW', 'Expected "->" after function head');
    const body = this.parseExpression();
    
    // Handle multiple function clauses
    const clauses = [{
      parameters,
      guards,
      body
    }];
    
    // Parse additional clauses
    while (this.match('SEMICOLON')) {
      const clauseName = this.consume('ATOM', 'Expected function name').value;
      if (clauseName !== name) {
        throw new Error(`Function clause name mismatch: expected ${name}, got ${clauseName}`);
      }
      
      this.consume('LPAREN', 'Expected "(" after function name');
      
      const clauseParams = [];
      if (this.peek().type !== 'RPAREN') {
        do {
          // Parameters can be variables, atoms, numbers, or patterns
          if (this.peek().type === 'VARIABLE') {
            clauseParams.push(this.consume('VARIABLE', 'Expected parameter name').value);
          } else if (this.peek().type === 'ATOM') {
            clauseParams.push(this.consume('ATOM', 'Expected parameter name').value);
          } else if (this.peek().type === 'NUMBER') {
            clauseParams.push(this.consume('NUMBER', 'Expected parameter').value);
          } else {
            throw new Error(`Unexpected parameter type: ${this.peek().type}`);
          }
        } while (this.match('COMMA'));
      }
      
      this.consume('RPAREN', 'Expected ")" after parameters');
      
      let clauseGuards = null;
      if (this.match('WHEN')) {
        clauseGuards = this.parseGuards();
      }
      
      this.consume('ARROW', 'Expected "->" after function head');
      const clauseBody = this.parseExpression();
      
      clauses.push({
        parameters: clauseParams,
        guards: clauseGuards,
        body: clauseBody
      });
    }
    
    this.consume('DOT', 'Expected "." after function definition');
    
    return {
      type: 'FunctionDefinition',
      name,
      clauses
    };
  }

  parseGuards() {
    const guards = [];
    
    do {
      guards.push(this.parseExpression());
    } while (this.match('COMMA'));
    
    return guards;
  }

  parseExpression() {
    return this.parseComparison();
  }

  parseComparison() {
    let expr = this.parseArithmetic();
    
    while (this.match('GT', 'GTE', 'LT', 'LTE')) {
      const operator = this.previous().value;
      const right = this.parseArithmetic();
      expr = {
        type: 'BinaryOp',
        operator,
        left: expr,
        right
      };
    }
    
    return expr;
  }

  parseArithmetic() {
    let expr = this.parseMultiplication();
    
    while (this.match('PLUS', 'MINUS')) {
      const operator = this.previous().value;
      const right = this.parseMultiplication();
      expr = {
        type: 'BinaryOp',
        operator,
        left: expr,
        right
      };
    }
    
    return expr;
  }

  parseMultiplication() {
    let expr = this.parseUnary();
    
    while (this.match('MULTIPLY', 'DIVIDE')) {
      const operator = this.previous().value;
      const right = this.parseUnary();
      expr = {
        type: 'BinaryOp',
        operator,
        left: expr,
        right
      };
    }
    
    return expr;
  }

  parseUnary() {
    if (this.match('MINUS')) {
      const operator = this.previous().value;
      const expr = this.parseUnary();
      return {
        type: 'UnaryOp',
        operator,
        operand: expr
      };
    }
    
    return this.parsePrimary();
  }

  parsePrimary() {
    // Number
    if (this.match('NUMBER')) {
      return { type: 'Number', value: this.previous().value };
    }
    
    // String
    if (this.match('STRING')) {
      return { type: 'String', value: this.previous().value };
    }
    
    // Atom
    if (this.match('ATOM')) {
      const name = this.previous().value;
      
      // Function call
      if (this.match('LPAREN')) {
        const args = [];
        if (this.peek().type !== 'RPAREN') {
          do {
            args.push(this.parseExpression());
          } while (this.match('COMMA'));
        }
        this.consume('RPAREN', 'Expected ")" after arguments');
        
        return {
          type: 'FunctionCall',
          name,
          arguments: args
        };
      }
      
      return { type: 'Atom', value: name };
    }
    
    // Variable
    if (this.match('VARIABLE')) {
      return { type: 'Variable', name: this.previous().value };
    }
    
    // List
    if (this.match('LBRACKET')) {
      const elements = [];
      let tail = null;
      
      if (this.peek().type !== 'RBRACKET') {
        do {
          elements.push(this.parseExpression());
          
          // Check for list tail: [Head | Tail]
          if (this.match('PIPE')) {
            tail = this.parseExpression();
            break;
          }
        } while (this.match('COMMA'));
      }
      
      this.consume('RBRACKET', 'Expected "]" after list elements');
      
      return {
        type: 'List',
        elements,
        tail
      };
    }
    
    // Tuple
    if (this.match('LBRACE')) {
      const elements = [];
      
      if (this.peek().type !== 'RBRACE') {
        do {
          elements.push(this.parseExpression());
        } while (this.match('COMMA'));
      }
      
      this.consume('RBRACE', 'Expected "}" after tuple elements');
      
      return {
        type: 'Tuple',
        elements
      };
    }
    
    // Parenthesized expression
    if (this.match('LPAREN')) {
      const expr = this.parseExpression();
      this.consume('RPAREN', 'Expected ")" after expression');
      return expr;
    }
    
    throw new Error(`Unexpected token: ${this.peek().type} at position ${this.position}`);
  }

  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  advance() {
    if (!this.isAtEnd()) this.position++;
    return this.previous();
  }

  isAtEnd() {
    return this.peek().type === 'EOF';
  }

  peek() {
    return this.tokens[this.position];
  }

  peekNext() {
    return this.position + 1 < this.tokens.length ? this.tokens[this.position + 1] : null;
  }

  previous() {
    return this.tokens[this.position - 1];
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();
    throw new Error(`${message}. Got ${this.peek().type} at position ${this.position}`);
  }
}