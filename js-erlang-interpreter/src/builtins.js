export class ErlangBuiltins {
  constructor() {
    this.functions = new Map();
    this.guards = new Map();
    this.initializeBuiltins();
  }

  initializeBuiltins() {
    // Arithmetic functions
    this.functions.set('abs', (x) => {
      if (typeof x !== 'number') throw new Error('abs/1 expects a number');
      return Math.abs(x);
    });

    this.functions.set('max', (a, b) => {
      if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('max/2 expects numbers');
      }
      return Math.max(a, b);
    });

    this.functions.set('min', (a, b) => {
      if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('min/2 expects numbers');
      }
      return Math.min(a, b);
    });

    // List functions
    this.functions.set('length', (list) => {
      if (!Array.isArray(list)) throw new Error('length/1 expects a list');
      return list.length;
    });

    this.functions.set('hd', (list) => {
      if (!Array.isArray(list) || list.length === 0) {
        throw new Error('hd/1 expects a non-empty list');
      }
      return list[0];
    });

    this.functions.set('tl', (list) => {
      if (!Array.isArray(list) || list.length === 0) {
        throw new Error('tl/1 expects a non-empty list');
      }
      return list.slice(1);
    });

    // Type checking guard functions
    this.guards.set('is_atom', (value) => {
      return typeof value === 'string' && value.startsWith('atom:');
    });

    this.guards.set('is_number', (value) => {
      return typeof value === 'number';
    });

    this.guards.set('is_integer', (value) => {
      return typeof value === 'number' && Number.isInteger(value);
    });

    this.guards.set('is_float', (value) => {
      return typeof value === 'number' && !Number.isInteger(value);
    });

    this.guards.set('is_list', (value) => {
      return Array.isArray(value);
    });

    this.guards.set('is_tuple', (value) => {
      return value && typeof value === 'object' && value.__erlang_type === 'tuple';
    });

    this.guards.set('is_binary', (value) => {
      return typeof value === 'string';
    });

    // Size functions
    this.guards.set('byte_size', (value) => {
      if (typeof value !== 'string') throw new Error('byte_size/1 expects a binary');
      return value.length;
    });

    this.guards.set('tuple_size', (value) => {
      if (!this.guards.get('is_tuple')(value)) {
        throw new Error('tuple_size/1 expects a tuple');
      }
      return value.elements.length;
    });
  }

  hasFunction(name) {
    return this.functions.has(name);
  }

  callFunction(name, args) {
    if (!this.functions.has(name)) {
      throw new Error(`Unknown function: ${name}/${args.length}`);
    }
    return this.functions.get(name)(...args);
  }

  hasGuard(name) {
    return this.guards.has(name);
  }

  callGuard(name, args) {
    if (!this.guards.has(name)) {
      throw new Error(`Unknown guard: ${name}/${args.length}`);
    }
    return this.guards.get(name)(...args);
  }

  // Helper to create Erlang values
  static createAtom(value) {
    return `atom:${value}`;
  }

  static createTuple(elements) {
    return {
      __erlang_type: 'tuple',
      elements
    };
  }

  static isAtom(value) {
    return typeof value === 'string' && value.startsWith('atom:');
  }

  static isTuple(value) {
    return value && typeof value === 'object' && value.__erlang_type === 'tuple';
  }

  static atomValue(atom) {
    if (!this.isAtom(atom)) throw new Error('Not an atom');
    return atom.substring(5); // Remove 'atom:' prefix
  }

  static tupleElements(tuple) {
    if (!this.isTuple(tuple)) throw new Error('Not a tuple');
    return tuple.elements;
  }
}