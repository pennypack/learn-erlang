export class ErlangLexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.tokens = [];
  }

  tokenize() {
    while (this.position < this.input.length) {
      this.skipWhitespace();
      
      if (this.position >= this.input.length) break;
      
      const char = this.input[this.position];
      
      // Numbers
      if (this.isDigit(char)) {
        this.readNumber();
      }
      // Atoms and variables
      else if (this.isLetter(char) || char === '_') {
        this.readAtomOrVariable();
      }
      // Strings
      else if (char === '"') {
        this.readString();
      }
      // Single character tokens
      else if (char === '(') {
        this.tokens.push({ type: 'LPAREN', value: '(' });
        this.position++;
      }
      else if (char === ')') {
        this.tokens.push({ type: 'RPAREN', value: ')' });
        this.position++;
      }
      else if (char === '[') {
        this.tokens.push({ type: 'LBRACKET', value: '[' });
        this.position++;
      }
      else if (char === ']') {
        this.tokens.push({ type: 'RBRACKET', value: ']' });
        this.position++;
      }
      else if (char === '{') {
        this.tokens.push({ type: 'LBRACE', value: '{' });
        this.position++;
      }
      else if (char === '}') {
        this.tokens.push({ type: 'RBRACE', value: '}' });
        this.position++;
      }
      else if (char === ',') {
        this.tokens.push({ type: 'COMMA', value: ',' });
        this.position++;
      }
      else if (char === '.') {
        this.tokens.push({ type: 'DOT', value: '.' });
        this.position++;
      }
      else if (char === ';') {
        this.tokens.push({ type: 'SEMICOLON', value: ';' });
        this.position++;
      }
      else if (char === '=') {
        this.tokens.push({ type: 'EQUALS', value: '=' });
        this.position++;
      }
      else if (char === '+') {
        this.tokens.push({ type: 'PLUS', value: '+' });
        this.position++;
      }
      else if (char === '-') {
        if (this.peek() === '>') {
          this.tokens.push({ type: 'ARROW', value: '->' });
          this.position += 2;
        } else {
          this.tokens.push({ type: 'MINUS', value: '-' });
          this.position++;
        }
      }
      else if (char === '*') {
        this.tokens.push({ type: 'MULTIPLY', value: '*' });
        this.position++;
      }
      else if (char === '/') {
        this.tokens.push({ type: 'DIVIDE', value: '/' });
        this.position++;
      }
      else if (char === '>') {
        if (this.peek() === '=') {
          this.tokens.push({ type: 'GTE', value: '>=' });
          this.position += 2;
        } else {
          this.tokens.push({ type: 'GT', value: '>' });
          this.position++;
        }
      }
      else if (char === '<') {
        if (this.peek() === '=') {
          this.tokens.push({ type: 'LTE', value: '<=' });
          this.position += 2;
        } else {
          this.tokens.push({ type: 'LT', value: '<' });
          this.position++;
        }
      }
      else if (char === '|') {
        this.tokens.push({ type: 'PIPE', value: '|' });
        this.position++;
      }
      else {
        throw new Error(`Unexpected character: ${char} at position ${this.position}`);
      }
    }
    
    this.tokens.push({ type: 'EOF', value: null });
    return this.tokens;
  }

  skipWhitespace() {
    while (this.position < this.input.length && 
           /\s/.test(this.input[this.position])) {
      this.position++;
    }
  }

  readNumber() {
    let value = '';
    let isFloat = false;
    
    while (this.position < this.input.length && 
           (this.isDigit(this.input[this.position]) || 
            (this.input[this.position] === '.' && !isFloat && this.isDigit(this.peek())))) {
      if (this.input[this.position] === '.') {
        isFloat = true;
      }
      value += this.input[this.position];
      this.position++;
    }
    
    this.tokens.push({ 
      type: 'NUMBER', 
      value: isFloat ? parseFloat(value) : parseInt(value) 
    });
  }

  readAtomOrVariable() {
    let value = '';
    
    while (this.position < this.input.length && 
           (this.isAlphaNumeric(this.input[this.position]) || this.input[this.position] === '_')) {
      value += this.input[this.position];
      this.position++;
    }
    
    // Check for keywords
    if (value === 'when') {
      this.tokens.push({ type: 'WHEN', value: 'when' });
    } else if (this.isCapitalized(value)) {
      this.tokens.push({ type: 'VARIABLE', value });
    } else {
      this.tokens.push({ type: 'ATOM', value });
    }
  }

  readString() {
    let value = '';
    this.position++; // Skip opening quote
    
    while (this.position < this.input.length && this.input[this.position] !== '"') {
      if (this.input[this.position] === '\\') {
        this.position++; // Skip escape character
        if (this.position < this.input.length) {
          value += this.input[this.position];
        }
      } else {
        value += this.input[this.position];
      }
      this.position++;
    }
    
    if (this.position >= this.input.length) {
      throw new Error('Unterminated string');
    }
    
    this.position++; // Skip closing quote
    this.tokens.push({ type: 'STRING', value });
  }

  peek() {
    return this.position + 1 < this.input.length ? this.input[this.position + 1] : null;
  }

  isDigit(char) {
    return /\d/.test(char);
  }

  isLetter(char) {
    return /[a-zA-Z]/.test(char);
  }

  isAlphaNumeric(char) {
    return /[a-zA-Z0-9]/.test(char);
  }

  isCapitalized(str) {
    return str[0] === str[0].toUpperCase() && /[A-Z]/.test(str[0]);
  }
}