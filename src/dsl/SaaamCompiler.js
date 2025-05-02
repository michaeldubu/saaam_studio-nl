/**
 * SAAAM Language Compiler
 * Translates SAAAM code into JavaScript that can be executed in the browser.
 */

class SaaamCompiler {
  constructor() {
    this.tokens = [];
    this.ast = null;
    this.currentToken = 0;
    
    // Predefined variables and function names in the SAAAM language
    this.predefinedVariables = [
      'position', 'velocity', 'size', 'color',
      'GRAVITY', 'FRICTION', 'MAX_FALL_SPEED'
    ];
    
    this.predefinedFunctions = [
      'create', 'step', 'draw', 'keyboard_check', 
      'keyboard_check_pressed', 'draw_sprite'
    ];
  }
  
  /**
   * Tokenize the input SAAAM code
   * @param {string} code - The SAAAM code to tokenize
   * @returns {Array} - Array of tokens
   */
  tokenize(code) {
    const tokenTypes = [
      // Keywords
      { type: 'KEYWORD', regex: /\b(var|const|function|if|else|for|while|return|this|new|true|false|null|undefined)\b/ },
      // Special SAAAM keywords
      { type: 'SAAAM_KEYWORD', regex: /\b(vec2|vec3|yield|signal|state|create|step|draw)\b/ },
      // Identifiers
      { type: 'IDENTIFIER', regex: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/ },
      // Numbers
      { type: 'NUMBER', regex: /\b\d+(\.\d+)?\b/ },
      // Strings
      { type: 'STRING', regex: /'([^'\\]|\\.)*'|"([^"\\]|\\.)*"/ },
      // Operators
      { type: 'OPERATOR', regex: /[+\-*\/=<>!&|^%]=?|[?:]/ },
      // Punctuation
      { type: 'PUNCTUATION', regex: /[.,;()]/ },
      // Brackets
      { type: 'BRACKET', regex: /[[\]{}]/ },
      // Whitespace (ignored)
      { type: 'WHITESPACE', regex: /\s+/, ignore: true },
      // Comments (ignored)
      { type: 'COMMENT', regex: /\/\/.*$|\/\*[\s\S]*?\*\//, ignore: true, multiline: true }
    ];
    
    this.tokens = [];
    let remaining = code;
    
    while (remaining.length > 0) {
      let match = null;
      let matchedType = null;
      
      for (const tokenType of tokenTypes) {
        const regex = new RegExp('^' + tokenType.regex.source, tokenType.multiline ? 'mi' : 'm');
        match = remaining.match(regex);
        
        if (match) {
          matchedType = tokenType;
          break;
        }
      }
      
      if (!match) {
        throw new Error(`Unexpected token at: ${remaining.slice(0, 20)}...`);
      }
      
      if (!matchedType.ignore) {
        this.tokens.push({
          type: matchedType.type,
          value: match[0],
          position: code.length - remaining.length
        });
      }
      
      remaining = remaining.slice(match[0].length);
    }
    
    // Add EOF token
    this.tokens.push({
      type: 'EOF',
      value: '',
      position: code.length
    });
    
    return this.tokens;
  }
  
  /**
   * Parse tokens into an abstract syntax tree (AST)
   * @returns {Object} - The root node of the AST
   */
  parse() {
    this.currentToken = 0;
    this.ast = this.parseProgram();
    return this.ast;
  }
  
  /**
   * Parse a full SAAAM program
   * @returns {Object} - Program AST node
   */
  parseProgram() {
    const body = [];
    
    while (this.peek().type !== 'EOF') {
      // Parse variable declarations and function definitions
      if (this.match('KEYWORD', 'var') || this.match('KEYWORD', 'const')) {
        body.push(this.parseVariableDeclaration());
      } else if (this.match('KEYWORD', 'function')) {
        body.push(this.parseFunctionDefinition());
      } else {
        body.push(this.parseStatement());
      }
    }
    
    return {
      type: 'Program',
      body
    };
  }
  
  /**
   * Parse a variable declaration
   * @returns {Object} - Variable declaration AST node
   */
  parseVariableDeclaration() {
    const kind = this.consume().value; // 'var' or 'const'
    const identifier = this.consume('IDENTIFIER').value;
    
    let init = null;
    if (this.match('OPERATOR', '=')) {
      this.consume(); // Consume '='
      init = this.parseExpression();
    }
    
    this.consume('PUNCTUATION', ';');
    
    return {
      type: 'VariableDeclaration',
      kind,
      identifier,
      init
    };
  }
  
  /**
   * Parse a function definition
   * @returns {Object} - Function definition AST node
   */
  parseFunctionDefinition() {
    this.consume('KEYWORD', 'function');
    const name = this.consume('IDENTIFIER').value;
    
    this.consume('PUNCTUATION', '(');
    const params = [];
    
    if (!this.match('PUNCTUATION', ')')) {
      do {
        params.push(this.consume('IDENTIFIER').value);
      } while (this.match('PUNCTUATION', ',') && this.consume());
    }
    
    this.consume('PUNCTUATION', ')');
    const body = this.parseBlock();
    
    return {
      type: 'FunctionDefinition',
      name,
      params,
      body
    };
  }
  
  /**
   * Parse a code block
   * @returns {Object} - Block AST node
   */
  parseBlock() {
    this.consume('BRACKET', '{');
    const statements = [];
    
    while (!this.match('BRACKET', '}')) {
      statements.push(this.parseStatement());
    }
    
    this.consume('BRACKET', '}');
    
    return {
      type: 'Block',
      statements
    };
  }
  
  /**
   * Parse a statement
   * @returns {Object} - Statement AST node
   */
  parseStatement() {
    // Handle if statements
    if (this.match('KEYWORD', 'if')) {
      return this.parseIfStatement();
    }
    
    // Handle for loops
    if (this.match('KEYWORD', 'for')) {
      return this.parseForLoop();
    }
    
    // Handle while loops
    if (this.match('KEYWORD', 'while')) {
      return this.parseWhileLoop();
    }
    
    // Handle return statements
    if (this.match('KEYWORD', 'return')) {
      return this.parseReturnStatement();
    }
    
    // Default: expression statement
    const expr = this.parseExpression();
    this.consume('PUNCTUATION', ';');
    
    return {
      type: 'ExpressionStatement',
      expression: expr
    };
  }
  
  /**
   * Parse an if statement
   * @returns {Object} - If statement AST node
   */
  parseIfStatement() {
    this.consume('KEYWORD', 'if');
    this.consume('PUNCTUATION', '(');
    const condition = this.parseExpression();
    this.consume('PUNCTUATION', ')');
    
    const consequent = this.parseBlock();
    let alternate = null;
    
    if (this.match('KEYWORD', 'else')) {
      this.consume();
      
      if (this.match('KEYWORD', 'if')) {
        alternate = this.parseIfStatement();
      } else {
        alternate = this.parseBlock();
      }
    }
    
    return {
      type: 'IfStatement',
      condition,
      consequent,
      alternate
    };
  }
  
  /**
   * Parse a for loop
   * @returns {Object} - For loop AST node
   */
  parseForLoop() {
    this.consume('KEYWORD', 'for');
    this.consume('PUNCTUATION', '(');
    
    const init = this.parseExpression();
    this.consume('PUNCTUATION', ';');
    
    const condition = this.parseExpression();
    this.consume('PUNCTUATION', ';');
    
    const update = this.parseExpression();
    this.consume('PUNCTUATION', ')');
    
    const body = this.parseBlock();
    
    return {
      type: 'ForLoop',
      init,
      condition,
      update,
      body
    };
  }
  
  /**
   * Parse a while loop
   * @returns {Object} - While loop AST node
   */
  parseWhileLoop() {
    this.consume('KEYWORD', 'while');
    this.consume('PUNCTUATION', '(');
    const condition = this.parseExpression();
    this.consume('PUNCTUATION', ')');
    
    const body = this.parseBlock();
    
    return {
      type: 'WhileLoop',
      condition,
      body
    };
  }
  
  /**
   * Parse a return statement
   * @returns {Object} - Return statement AST node
   */
  parseReturnStatement() {
    this.consume('KEYWORD', 'return');
    let argument = null;
    
    if (!this.match('PUNCTUATION', ';')) {
      argument = this.parseExpression();
    }
    
    this.consume('PUNCTUATION', ';');
    
    return {
      type: 'ReturnStatement',
      argument
    };
  }
  
  /**
   * Parse an expression
   * @returns {Object} - Expression AST node
   */
  parseExpression() {
    return this.parseAssignment();
  }
  
  /**
   * Parse an assignment expression
   * @returns {Object} - Assignment expression AST node
   */
  parseAssignment() {
    const left = this.parseLogicalOr();
    
    if (this.match('OPERATOR', '=')) {
      this.consume();
      const right = this.parseAssignment();
      
      return {
        type: 'AssignmentExpression',
        left,
        right
      };
    }
    
    return left;
  }
  
  /**
   * Parse a logical OR expression
   * @returns {Object} - Logical OR expression AST node
   */
  parseLogicalOr() {
    let left = this.parseLogicalAnd();
    
    while (this.match('OPERATOR', '||')) {
      this.consume();
      const right = this.parseLogicalAnd();
      
      left = {
        type: 'BinaryExpression',
        operator: '||',
        left,
        right
      };
    }
    
    return left;
  }
  
  /**
   * Parse a logical AND expression
   * @returns {Object} - Logical AND expression AST node
   */
  parseLogicalAnd() {
    let left = this.parseEquality();
    
    while (this.match('OPERATOR', '&&')) {
      this.consume();
      const right = this.parseEquality();
      
      left = {
        type: 'BinaryExpression',
        operator: '&&',
        left,
        right
      };
    }
    
    return left;
  }
  
  /**
   * Parse an equality expression
   * @returns {Object} - Equality expression AST node
   */
  parseEquality() {
    let left = this.parseComparison();
    
    while (this.match('OPERATOR', '==') || this.match('OPERATOR', '!=')) {
      const operator = this.consume().value;
      const right = this.parseComparison();
      
      left = {
        type: 'BinaryExpression',
        operator,
        left,
        right
      };
    }
    
    return left;
  }
  
  /**
   * Parse a comparison expression
   * @returns {Object} - Comparison expression AST node
   */
  parseComparison() {
    let left = this.parseAdditive();
    
    while (
      this.match('OPERATOR', '>') || 
      this.match('OPERATOR', '>=') || 
      this.match('OPERATOR', '<') || 
      this.match('OPERATOR', '<=')
    ) {
      const operator = this.consume().value;
      const right = this.parseAdditive();
      
      left = {
        type: 'BinaryExpression',
        operator,
        left,
        right
      };
    }
    
    return left;
  }
  
  /**
   * Parse an additive expression
   * @returns {Object} - Additive expression AST node
   */
  parseAdditive() {
    let left = this.parseMultiplicative();
    
    while (this.match('OPERATOR', '+') || this.match('OPERATOR', '-')) {
      const operator = this.consume().value;
      const right = this.parseMultiplicative();
      
      left = {
        type: 'BinaryExpression',
        operator,
        left,
        right
      };
    }
    
    return left;
  }
  
  /**
   * Parse a multiplicative expression
   * @returns {Object} - Multiplicative expression AST node
   */
  parseMultiplicative() {
    let left = this.parseUnary();
    
    while (this.match('OPERATOR', '*') || this.match('OPERATOR', '/') || this.match('OPERATOR', '%')) {
      const operator = this.consume().value;
      const right = this.parseUnary();
      
      left = {
        type: 'BinaryExpression',
        operator,
        left,
        right
      };
    }
    
    return left;
  }
  
  /**
   * Parse a unary expression
   * @returns {Object} - Unary expression AST node
   */
  parseUnary() {
    if (this.match('OPERATOR', '-') || this.match('OPERATOR', '!')) {
      const operator = this.consume().value;
      const argument = this.parseUnary();
      
      return {
        type: 'UnaryExpression',
        operator,
        argument
      };
    }
    
    return this.parseCallOrMember();
  }
  
  /**
   * Parse a member or call expression
   * @returns {Object} - Call or member expression AST node
   */
  parseCallOrMember() {
    let expression = this.parsePrimary();
    
    while (true) {
      if (this.match('PUNCTUATION', '(')) {
        expression = this.parseCallExpression(expression);
      } else if (this.match('PUNCTUATION', '.')) {
        expression = this.parseMemberExpression(expression);
      } else {
        break;
      }
    }
    
    return expression;
  }
  
  /**
   * Parse a call expression
   * @param {Object} callee - The function being called
   * @returns {Object} - Call expression AST node
   */
  parseCallExpression(callee) {
    this.consume('PUNCTUATION', '(');
    const args = [];
    
    if (!this.match('PUNCTUATION', ')')) {
      do {
        args.push(this.parseExpression());
      } while (this.match('PUNCTUATION', ',') && this.consume());
    }
    
    this.consume('PUNCTUATION', ')');
    
    return {
      type: 'CallExpression',
      callee,
      arguments: args
    };
  }
  
  /**
   * Parse a member expression
   * @param {Object} object - The object being accessed
   * @returns {Object} - Member expression AST node
   */
  parseMemberExpression(object) {
    this.consume('PUNCTUATION', '.');
    const property = this.consume('IDENTIFIER').value;
    
    return {
      type: 'MemberExpression',
      object,
      property
    };
  }
  
  /**
   * Parse a primary expression
   * @returns {Object} - Primary expression AST node
   */
  parsePrimary() {
    if (this.match('KEYWORD', 'this')) {
      this.consume();
      return {
        type: 'ThisExpression'
      };
    }
    
    if (this.match('SAAAM_KEYWORD', 'vec2')) {
      this.consume();
      this.consume('PUNCTUATION', '(');
      const x = this.parseExpression();
      this.consume('PUNCTUATION', ',');
      const y = this.parseExpression();
      this.consume('PUNCTUATION', ')');
      
      return {
        type: 'Vec2Expression',
        x,
        y
      };
    }
    
    if (this.match('IDENTIFIER')) {
      return {
        type: 'Identifier',
        name: this.consume().value
      };
    }
    
    if (this.match('NUMBER')) {
      return {
        type: 'Literal',
        value: parseFloat(this.consume().value)
      };
    }
    
    if (this.match('STRING')) {
      // Remove the quotes
      const str = this.consume().value;
      return {
        type: 'Literal',
        value: str.substring(1, str.length - 1)
      };
    }
    
    if (this.match('KEYWORD', 'true')) {
      this.consume();
      return {
        type: 'Literal',
        value: true
      };
    }
    
    if (this.match('KEYWORD', 'false')) {
      this.consume();
      return {
        type: 'Literal',
        value: false
      };
    }
    
    if (this.match('KEYWORD', 'null')) {
      this.consume();
      return {
        type: 'Literal',
        value: null
      };
    }
    
    if (this.match('PUNCTUATION', '(')) {
      this.consume();
      const expr = this.parseExpression();
      this.consume('PUNCTUATION', ')');
      return expr;
    }
    
    throw new Error(`Unexpected token: ${this.peek().value}`);
  }
  
  /**
   * Check if the current token matches the given criteria
   * @param {string} type - The token type to match
   * @param {string} [value] - The token value to match (optional)
   * @returns {boolean} - Whether the token matches
   */
  match(type, value) {
    const token = this.peek();
    
    if (token.type !== type) {
      return false;
    }
    
    if (value !== undefined && token.value !== value) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Peek at the current token without consuming it
   * @returns {Object} - The current token
   */
  peek() {
    return this.tokens[this.currentToken];
  }
  
  /**
   * Consume the current token and advance
   * @param {string} [type] - Expected token type (optional)
   * @param {string} [value] - Expected token value (optional)
   * @returns {Object} - The consumed token
   */
  consume(type, value) {
    const token = this.peek();
    
    if (type !== undefined && token.type !== type) {
      throw new Error(`Expected token of type ${type}, but got ${token.type}`);
    }
    
    if (value !== undefined && token.value !== value) {
      throw new Error(`Expected token with value ${value}, but got ${token.value}`);
    }
    
    this.currentToken++;
    return token;
  }
  
  /**
   * Generate JavaScript code from the AST
   * @returns {string} - The compiled JavaScript code
   */
  generate() {
    return this.generateNode(this.ast);
  }
  
  /**
   * Generate JavaScript code for a specific AST node
   * @param {Object} node - The AST node
   * @returns {string} - The compiled JavaScript code for this node
   */
  generateNode(node) {
    switch (node.type) {
      case 'Program':
        return node.body.map(stmt => this.generateNode(stmt)).join('\n');
        
      case 'VariableDeclaration': {
        let code = `${node.kind} ${node.identifier}`;
        if (node.init) {
          code += ` = ${this.generateNode(node.init)}`;
        }
        return code + ';';
      }
      
      case 'FunctionDefinition': {
        let code = `function ${node.name}(${node.params.join(', ')}) `;
        code += this.generateNode(node.body);
        return code;
      }
      
      case 'Block': {
        const inner = node.statements.map(stmt => this.generateNode(stmt)).join('\n');
        return `{\n${this.indent(inner)}\n}`;
      }
      
      case 'ExpressionStatement':
        return this.generateNode(node.expression) + ';';
        
      case 'IfStatement': {
        let code = `if (${this.generateNode(node.condition)}) ${this.generateNode(node.consequent)}`;
        if (node.alternate) {
          code += ` else ${this.generateNode(node.alternate)}`;
        }
        return code;
      }
      
      case 'ForLoop': {
        return `for (${this.generateNode(node.init)}; ${this.generateNode(node.condition)}; ${this.generateNode(node.update)}) ${this.generateNode(node.body)}`;
      }
      
      case 'WhileLoop': {
        return `while (${this.generateNode(node.condition)}) ${this.generateNode(node.body)}`;
      }
      
      case 'ReturnStatement': {
        return node.argument ? `return ${this.generateNode(node.argument)};` : 'return;';
      }
      
      case 'AssignmentExpression': {
        return `${this.generateNode(node.left)} = ${this.generateNode(node.right)}`;
      }
      
      case 'BinaryExpression': {
        return `${this.generateNode(node.left)} ${node.operator} ${this.generateNode(node.right)}`;
      }
      
      case 'UnaryExpression': {
        return `${node.operator}${this.generateNode(node.argument)}`;
      }
      
      case 'CallExpression': {
        const args = node.arguments.map(arg => this.generateNode(arg)).join(', ');
        return `${this.generateNode(node.callee)}(${args})`;
      }
      
      case 'MemberExpression': {
        return `${this.generateNode(node.object)}.${node.property}`;
      }
      
      case 'ThisExpression': {
        return 'this';
      }
      
      case 'Vec2Expression': {
        // Translate vec2 to an object creation
        return `{ x: ${this.generateNode(node.x)}, y: ${this.generateNode(node.y)} }`;
      }
      
      case 'Identifier': {
        // Special handling for SAAAM identifiers that need conversion
        if (node.name === 'keyboard_check') {
          return 'SAAAM.keyboardCheck';
        } else if (node.name === 'keyboard_check_pressed') {
          return 'SAAAM.keyboardCheckPressed';
        } else if (node.name === 'draw_sprite') {
          return 'SAAAM.drawSprite';
        }
        
        return node.name;
      }
      
      case 'Literal': {
        if (typeof node.value === 'string') {
          return `"${node.value}"`;
        } else if (node.value === null) {
          return 'null';
        } else {
          return node.value.toString();
        }
      }
      
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }
  
  /**
   * Add indentation to the given code
   * @param {string} code - The code to indent
   * @returns {string} - The indented code
   */
  indent(code) {
    return code.split('\n').map(line => `  ${line}`).join('\n');
  }
  
  /**
   * Compile SAAAM code to JavaScript
   * @param {string} code - The SAAAM code to compile
   * @returns {string} - The compiled JavaScript code
   */
  compile(code) {
    this.tokenize(code);
    this.parse();
    
    // Add wrapper to provide SAAAM environment
    const compiledCode = this.generate();
    
    return `
// Compiled SAAAM code
(function(SAAAM) {
${this.indent(compiledCode)}

// Register lifecycle functions with SAAAM engine
if (typeof create === 'function') SAAAM.registerCreate(create);
if (typeof step === 'function') SAAAM.registerStep(step);
if (typeof draw === 'function') SAAAM.registerDraw(draw);

})(SAAAM);
`;
  }
}

// Export the compiler
if (typeof module !== 'undefined') {
  module.exports = { SaaamCompiler };
}