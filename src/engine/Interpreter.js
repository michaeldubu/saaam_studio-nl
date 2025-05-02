// src/engine/Interpreter.js

/**
 * SaaamInterpreter executes SAAAM language scripts and provides
 * the runtime environment for script execution
 */
export class SaaamInterpreter {
  constructor() {
    // Script source and compiled code
    this.source = '';
    this.compiled = null;
    
    // Script namespace for variables and functions
    this._namespace = {};
    
    // Execution state
    this._executionContext = null;
    this._currentEntity = null;
    this._renderContext = null;
    
    // Coroutine state
    this._activeCoroutines = new Map();
    this._nextCoroutineId = 1;
    
    // Virtual machine constants
    this.constants = {
      // Key constants
      vk_left: 37,
      vk_right: 39,
      vk_up: 38,
      vk_down: 40,
      vk_space: 32,
      vk_enter: 13,
      vk_escape: 27,
      vk_shift: 16,
      vk_control: 17,
      vk_alt: 18,
      vk_tab: 9,
      vk_backspace: 8,
      vk_delete: 46,
      
      // Letter keys
      vk_a: 65, vk_b: 66, vk_c: 67, vk_d: 68, vk_e: 69,
      vk_f: 70, vk_g: 71, vk_h: 72, vk_i: 73, vk_j: 74,
      vk_k: 75, vk_l: 76, vk_m: 77, vk_n: 78, vk_o: 79,
      vk_p: 80, vk_q: 81, vk_r: 82, vk_s: 83, vk_t: 84,
      vk_u: 85, vk_v: 86, vk_w: 87, vk_x: 88, vk_y: 89,
      vk_z: 90,
      
      // Number keys
      vk_0: 48, vk_1: 49, vk_2: 50, vk_3: 51, vk_4: 52,
      vk_5: 53, vk_6: 54, vk_7: 55, vk_8: 56, vk_9: 57,
      
      // Alignment constants
      align_left: 'left',
      align_center: 'center',
      align_right: 'right',
      valign_top: 'top',
      valign_middle: 'middle',
      valign_bottom: 'bottom',
      
      // Other constants
      debug_mode: false,
      pi: Math.PI,
      infinity: Infinity,
      nan: NaN,
      undefined: undefined,
      null: null,
      
      // Blend modes
      blend_normal: 'normal',
      blend_add: 'add',
      blend_subtract: 'subtract',
      blend_multiply: 'multiply',
      blend_screen: 'screen',
    };
    
    // Global functions available to scripts
    this.globalFunctions = {
      // Math functions
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      asin: Math.asin,
      acos: Math.acos,
      atan: Math.atan,
      atan2: Math.atan2,
      sqrt: Math.sqrt,
      abs: Math.abs,
      floor: Math.floor,
      ceil: Math.ceil,
      round: Math.round,
      sign: Math.sign,
      min: Math.min,
      max: Math.max,
      random: Math.random,
      
      // Type conversion
      string: (val) => String(val),
      real: (val) => Number(val),
      bool: (val) => Boolean(val),
      
      // Game functions - these are stubs that will be replaced at runtime
      keyboard_check: () => false,
      keyboard_check_pressed: () => false,
      draw_sprite: () => {},
      play_sound: () => {},
      
      // Utility functions
      typeof: (val) => typeof val,
      is_string: (val) => typeof val === 'string',
      is_real: (val) => typeof val === 'number' && !isNaN(val),
      is_array: (val) => Array.isArray(val),
      is_object: (val) => val !== null && typeof val === 'object' && !Array.isArray(val),
      is_function: (val) => typeof val === 'function',
      
      // Console functions
      print: console.log,
      console: {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info
      },
      
      // Coroutine functions
      startCoroutine: this.startCoroutine.bind(this),
      stopCoroutine: this.stopCoroutine.bind(this),
      waitForSeconds: this.waitForSeconds.bind(this),
      waitForFrames: this.waitForFrames.bind(this),
      waitUntil: this.waitUntil.bind(this)
    };
  }
  
  /**
   * Compile SAAAM script source
   * @param {string} source - SAAAM script source code
   * @returns {Promise<Object>} Compilation result
   */
  async compile(source) {
    this.source = source;
    
    // Create a fresh namespace for script execution
    this._namespace = {
      // Include constants
      ...this.constants,
      
      // Include global functions
      ...this.globalFunctions,
      
      // Create a module exports object for script
      exports: {},
      
      // Debug info for script
      __scriptInfo: {
        compiled: new Date(),
        source: source.substring(0, 100) + (source.length > 100 ? '...' : '')
      }
    };
    
    try {
      // Wrap the script in a module-style function for proper scoping
      const wrappedCode = this._wrapScript(source);
      
      // Compile the script
      this.compiled = new Function('namespace', wrappedCode);
      
      // Execute the compiled code to populate the namespace
      this.compiled(this._namespace);
      
      // Extract lifecycle functions and other exports
      this._extractExports();
      
      return {
        success: true
      };
    } catch (error) {
      console.error('[SaaamInterpreter] Compilation error:', error);
      
      return {
        success: false,
        error: this._formatCompileError(error)
      };
    }
  }
  
  /**
   * Execute a specific function in the script
   * @param {string} functionName - Function to execute
   * @param {Array} args - Arguments to pass
   * @param {Object} context - Execution context (this value)
   * @returns {*} Function result
   */
  execute(functionName, args = [], context = null) {
    // Check if compiled
    if (!this.compiled) {
      throw new Error('Script not compiled');
    }
    
    // Check if function exists
    if (typeof this._namespace[functionName] !== 'function') {
      throw new Error(`Function "${functionName}" not found in script`);
    }
    
    // Execute the function
    try {
      this._executionContext = context || this._namespace;
      
      // Call the function with proper this binding
      return this._namespace[functionName].apply(this._executionContext, args);
    } catch (error) {
      console.error(`[SaaamInterpreter] Error executing ${functionName}:`, error);
      throw error;
    } finally {
      this._executionContext = null;
    }
  }
  
  /**
   * Get the script namespace containing all defined variables and functions
   * @returns {Object} Script namespace
   */
  getScriptNamespace() {
    return this._namespace;
  }
  
  /**
   * Set a global constant or function that will be available to all scripts
   * @param {string} name - Constant or function name
   * @param {*} value - Value to set
   */
  setGlobal(name, value) {
    // Do not allow overwriting special properties
    if (name === 'exports' || name === '__scriptInfo') {
      console.warn(`[SaaamInterpreter] Cannot set reserved global "${name}"`);
      return;
    }
    
    // Store in namespace
    this._namespace[name] = value;
    
    // Also store in appropriate collection for future scripts
    if (typeof value === 'function') {
      this.globalFunctions[name] = value;
    } else {
      this.constants[name] = value;
    }
  }
  
  /**
   * Get a value from the script namespace
   * @param {string} name - Name of the value to get
   * @returns {*} Value
   */
  getValue(name) {
    return this._namespace[name];
  }
  
  /**
   * Set a value in the script namespace
   * @param {string} name - Name of the value to set
   * @param {*} value - Value to set
   */
  setValue(name, value) {
    this._namespace[name] = value;
  }
  
  /**
   * Check if a function exists in the script
   * @param {string} name - Function name
   * @returns {boolean} True if function exists
   */
  hasFunction(name) {
    return typeof this._namespace[name] === 'function';
  }
  
  /**
   * Get all function names defined in the script
   * @returns {Array<string>} Function names
   */
  getFunctionNames() {
    return Object.keys(this._namespace).filter(
      name => typeof this._namespace[name] === 'function' && 
              name !== 'exports' && 
              !Object.keys(this.globalFunctions).includes(name)
    );
  }
  
  /**
   * Start a coroutine
   * @param {Generator} generator - Generator function to run as coroutine
   * @returns {number} Coroutine ID
   */
  startCoroutine(generator) {
    // Ensure we have a generator
    if (!generator || typeof generator.next !== 'function') {
      console.error('[SaaamInterpreter] startCoroutine requires a generator function');
      return -1;
    }
    
    // Generate coroutine ID
    const id = this._nextCoroutineId++;
    
    // Store coroutine state
    this._activeCoroutines.set(id, {
      generator: generator,
      isRunning: true,
      waitCondition: null
    });
    
    // Return ID for later reference
    return id;
  }
  
  /**
   * Stop a coroutine
   * @param {number} id - Coroutine ID
   * @returns {boolean} True if coroutine was stopped
   */
  stopCoroutine(id) {
    return this._activeCoroutines.delete(id);
  }
  
  /**
   * Update all active coroutines
   * @param {number} deltaTime - Time since last frame in seconds
   */
  updateCoroutines(deltaTime) {
    // Process each active coroutine
    for (const [id, coroutine] of this._activeCoroutines.entries()) {
      // Skip if not running
      if (!coroutine.isRunning) continue;
      
      // Check wait condition if any
      if (coroutine.waitCondition) {
        const conditionMet = coroutine.waitCondition.update(deltaTime);
        
        // Continue waiting if condition not met
        if (!conditionMet) continue;
        
        // Clear wait condition
        coroutine.waitCondition = null;
      }
      
      // Advance coroutine
      try {
        const result = coroutine.generator.next();
        
        // If coroutine is done, remove it
        if (result.done) {
          this._activeCoroutines.delete(id);
          continue;
        }
        
        // Handle yielded wait condition
        if (result.value && typeof result.value.isWaitCondition === 'function') {
          coroutine.waitCondition = result.value;
        }
      } catch (error) {
        console.error(`[SaaamInterpreter] Error in coroutine ${id}:`, error);
        this._activeCoroutines.delete(id);
      }
    }
  }
  
  /**
   * Create a wait condition for seconds
   * @param {number} seconds - Seconds to wait
   * @returns {Object} Wait condition
   */
  waitForSeconds(seconds) {
    let timeRemaining = seconds;
    
    return {
      isWaitCondition: () => true,
      update: (deltaTime) => {
        timeRemaining -= deltaTime;
        return timeRemaining <= 0;
      }
    };
  }
  
  /**
   * Create a wait condition for frames
   * @param {number} frames - Frames to wait
   * @returns {Object} Wait condition
   */
  waitForFrames(frames) {
    let framesRemaining = frames;
    
    return {
      isWaitCondition: () => true,
      update: () => {
        framesRemaining--;
        return framesRemaining <= 0;
      }
    };
  }
  
  /**
   * Create a wait condition for a predicate function
   * @param {Function} predicate - Function that returns true when waiting should end
   * @returns {Object} Wait condition
   */
  waitUntil(predicate) {
    return {
      isWaitCondition: () => true,
      update: () => {
        try {
          return predicate();
        } catch (error) {
          console.error('[SaaamInterpreter] Error in waitUntil predicate:', error);
          return true; // Stop waiting on error
        }
      }
    };
  }
  
  /**
   * Wrap script code in a module-style function
   * @param {string} source - SAAAM script source
   * @returns {string} Wrapped code
   * @private
   */
  _wrapScript(source) {
    return `
      // SAAAM script execution environment
      (function(namespace) {
        // Import all namespace properties into this scope
        for (const key in namespace) {
          if (key !== 'exports' && key !== '__scriptInfo') {
            eval('const ' + key + ' = namespace[key];');
          }
        }
        
        // Execute script code
        ${source}
        
        // Export declared functions to namespace
        for (const key in this) {
          if (typeof this[key] === 'function' && 
              key !== 'exports' && 
              !Object.keys(namespace).includes(key)) {
            namespace[key] = this[key];
          }
        }
        
        return namespace;
      })(namespace);
    `;
  }
  
  /**
   * Extract exported functions and variables
   * @private
   */
  _extractExports() {
    // Extract exports from the exports object
    for (const [key, value] of Object.entries(this._namespace.exports)) {
      this._namespace[key] = value;
    }
  }
  
  /**
   * Format a compile error into a user-friendly message
   * @param {Error} error - Compilation error
   * @returns {string} Formatted error message
   * @private
   */
  _formatCompileError(error) {
    // Get error message
    let message = error.message;
    
    // Try to extract line number from error
    const lineMatch = message.match(/line\s+(\d+)/i);
    
    if (lineMatch) {
      const lineNumber = parseInt(lineMatch[1], 10);
      
      // Try to extract the line from source
      const lines = this.source.split('\n');
      
      if (lines.length >= lineNumber) {
        const line = lines[lineNumber - 1].trim();
        message += `\n\nLine ${lineNumber}: ${line}`;
      }
    }
    
    return message;
  }
}

/**
 * Factory function to create a new interpreter
 * @returns {SaaamInterpreter} New interpreter instance
 */
export function createInterpreter() {
  return new SaaamInterpreter();
}

  
  /**
   * Compile SAAAM script source
   * @param {string} source - SAAAM script source code
   * @returns {Promise<Object>} Compilation result
   */
  async compile(source) {
    this.source = source;
    
    // Create a fresh namespace for script execution
    this._namespace = {
      // Include constants
      ...this.constants,
      
      // Include global functions
      ...this.globalFunctions,
      
      // Create a module exports object for script
      exports: {},
      
      // Debug info for script
      __scriptInfo: {
        compiled: new Date(),
        source: source.substring(0, 100) + (source.length > 100 ? '...' : '')
      }
    };
    
    try {
      // Wrap the script in a module-style function for proper scoping
      const wrappedCode = this._wrapScript(source);
      
      // Compile the script
      this.compiled = new Function('namespace', wrappedCode);
      
      // Execute the compiled code to populate the namespace
      this.compiled(this._namespace);
      
      // Extract lifecycle functions and other exports
      this._extractExports();
      
      return {
        success: true
      };
    } catch (error) {
      console.error('[SaaamInterpreter] Compilation error:', error);
      
      return {
        success: false,
        error: this._formatCompileError(error)
      };
    }
  }
  
  /**
   * Execute a specific function in the script
   * @param {string} functionName - Function to execute
   * @param {Array} args - Arguments to pass
   * @param {Object} context - Execution context (this value)
   * @returns {*} Function result
   */
  execute(functionName, args = [], context = null) {
    // Check if compiled
    if (!this.compiled) {
      throw new Error('Script not compiled');
    }
    
    // Check if function exists
    if (typeof this._namespace[functionName] !== 'function') {
      throw new Error(`Function "${functionName}" not found in script`);
    }
    
    // Execute the function
    try {
      this._executionContext = context || this._namespace;
      
      // Call the function with proper this binding
      return this._namespace[functionName].apply(this._executionContext, args);
    } catch (error) {
      console.error(`[SaaamInterpreter] Error executing ${functionName}:`, error);
      throw error;
    } finally {
      this._executionContext = null;
    }
  }
  
  /**
   * Get the script namespace containing all defined variables and functions
   * @returns {Object} Script namespace
   */
  getScriptNamespace() {
    return this._namespace;
  }
  
  /**
   * Set a global constant or function that will be available to all scripts
   * @param {string} name - Constant or function name
   * @param {*} value - Value to set
   */
  setGlobal(name, value) {
    // Do not allow overwriting special properties
    if (name === 'exports' || name === '__scriptInfo') {
      console.warn(`[SaaamInterpreter] Cannot set reserved global "${name}"`);
      return;
    }
    
    // Store in namespace
    this._namespace[name] = value;
    
    // Also store in appropriate collection for future scripts
    if (typeof value === 'function') {
      this.globalFunctions[name] = value;
    } else {
      this.constants[name] = value;
    }
  }
  
  /**
   * Get a value from the script namespace
   * @param {string} name - Name of the value to get
   * @returns {*} Value
   */
  getValue(name) {
    return this._namespace[name];
  }
  
  /**
   * Set a value in the script namespace
   * @param {string} name - Name of the value to set
   * @param {*} value - Value to set
   */
  setValue(name, value) {
    this._namespace[name] = value;
  }
  
  /**
   * Check if a function exists in the script
   * @param {string} name - Function name
   * @returns {boolean} True if function exists
   */
  hasFunction(name) {
    return typeof this._namespace[name] === 'function';
  }
  
  /**
   * Get all function names defined in the script
   * @returns {Array<string>} Function names
   */
  getFunctionNames() {
    return Object.keys(this._namespace).filter(
      name => typeof this._namespace[name] === 'function' && 
              name !== 'exports' && 
              !Object.keys(this.globalFunctions).includes(name)
    );
  }
  
  /**
   * Wrap script code in a module-style function
   * @param {string} source - SAAAM script source
   * @returns {string} Wrapped code
   * @private
   */
  _wrapScript(source) {
    return `
      // SAAAM script execution environment
      (function(namespace) {
        // Import all namespace properties into this scope
        for (const key in namespace) {
          if (key !== 'exports' && key !== '__scriptInfo') {
            eval('const ' + key + ' = namespace[key];');
          }
        }
        
        // Execute script code
        ${source}
        
        // Export declared functions to namespace
        for (const key in this) {
          if (typeof this[key] === 'function' && 
              key !== 'exports' && 
              !Object.keys(namespace).includes(key)) {
            namespace[key] = this[key];
          }
        }
        
        return namespace;
      })(namespace);
    `;
  }
  
  /**
   * Extract exported functions and variables
   * @private
   */
  _extractExports() {
    // Extract exports from the exports object
    for (const [key, value] of Object.entries(this._namespace.exports)) {
      this._namespace[key] = value;
    }
  }
  
  /**
   * Format a compile error into a user-friendly message
   * @param {Error} error - Compilation error
   * @returns {string} Formatted error message
   * @private
   */
  _formatCompileError(error) {
    // Get error message
    let message = error.message;
    
    // Try to extract line number from error
    const lineMatch = message.match(/line\s+(\d+)/i);
    
    if (lineMatch) {
      const lineNumber = parseInt(lineMatch[1], 10);
      
      // Try to extract the line from source
      const lines = this.source.split('\n');
      
      if (lines.length >= lineNumber) {
        const line = lines[lineNumber - 1].trim();
        message += `\n\nLine ${lineNumber}: ${line}`;
      }
    }
    
    return message;
  }
}

/**
 * Factory function to create a new interpreter
 * @returns {SaaamInterpreter} New interpreter instance
 */
export function createInterpreter() {
  return new SaaamInterpreter();
}