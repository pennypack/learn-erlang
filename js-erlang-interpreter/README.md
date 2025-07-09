# JS Erlang Interpreter

A minimal JavaScript implementation of Erlang for educational koans.

## Features

- Basic data types (atoms, numbers, strings, lists, tuples)
- Simple function definitions and calls
- Guards with `when` clauses
- Pattern matching basics
- Variable binding
- Module system (simplified)

## Usage

```javascript
import { ErlangInterpreter } from './src/interpreter.js';

const interpreter = new ErlangInterpreter();

// Execute Erlang code
const result = interpreter.execute('2 + 3.');
console.log(result); // 5

// Execute with variables
interpreter.execute('X = 42.');
const value = interpreter.execute('X.');
console.log(value); // 42
```

## Running Tests

```bash
npm test
```

## Supported Syntax

### Basic Expressions
- Numbers: `42`, `3.14`
- Atoms: `ok`, `error`, `hello`
- Strings: `"Hello World"`
- Lists: `[1, 2, 3]`
- Tuples: `{ok, 42}`

### Variables
- Assignment: `X = 42.`
- Variable reference: `X.`

### Functions
- Simple functions: `max(A, B) when A >= B -> A; max(A, B) -> B.`
- Function calls: `max(5, 3).`

### Guards
- Basic guards: `when A > B`, `when is_number(X)`

## Limitations

This is a minimal interpreter for educational purposes. It does not support:
- Full Erlang syntax
- Processes and message passing
- Advanced OTP features
- Error handling (try/catch)
- Hot code reloading
- And many other Erlang features

## Architecture

- `src/interpreter.js` - Main interpreter class
- `src/lexer.js` - Tokenizes Erlang source code
- `src/parser.js` - Parses tokens into AST
- `src/evaluator.js` - Evaluates AST nodes
- `src/builtins.js` - Built-in functions and guards
- `tests/` - Unit tests for all koans