/**
 * SAAAM Stability Integration Hooks
 * Connects the StabilitySystem to the SAAAM Interpreter and Compiler
 */

// Extend SaaamCompiler with Stability & Pattern Analysis
class StabilityEnhancedCompiler extends SaaamCompiler {
  constructor() {
    super();
    
    // Initialize stability system
    this.stabilityCore = new StabilityCore();
    this.patternRecognizer = new PatternRecognition(this.stabilityCore);
    
    // Pattern tracking for optimal code generation
    this.codePatterns = new Map();
    this.optimizationEnabled = true;
  }
  
  /**
   * Override compile method to add stability analysis
   * @param {string} code - The SAAAM code to compile
   * @returns {string} - The compiled JavaScript code
   */
  compile(code) {
    // Analyze code patterns before compilation
    this.analyzeCodePatterns(code);
    
    // Verify stability before proceeding
    if (!this.stabilityCore.verify()) {
      console.warn("Stability system below threshold, potential compilation issues");
    }
    
    // Enhanced tokenization with pattern recognition
    this.tokenize(code);
    
    // Store token patterns for optimization
    this.storeTokenPatterns();
    
    // Parse with stability monitoring
    this.parse();
    
    // Stability-enhanced code generation
    const compiledCode = this.generate();
    
    // Apply post-compilation stability optimizations
    const optimizedCode = this.optimizationEnabled ? 
      this.applyOptimizations(compiledCode) : 
      compiledCode;
      
    // Add stability monitoring wrapper
    return this.wrapWithStabilityMonitoring(optimizedCode);
  }
  
  /**
   * Analyze code patterns for optimization opportunities
   * @param {string} code - SAAAM source code
   */
  analyzeCodePatterns(code) {
    // Identify common patterns in code 
    const patterns = {
      loops: (code.match(/for\s*\(/g) || []).length,
      conditionals: (code.match(/if\s*\(/g) || []).length,
      functionCalls: (code.match(/\w+\s*\(/g) || []).length,
      vectorOperations: (code.match(/vec[2-3]\s*\(/g) || []).length
    };
    
    // Calculate code complexity metrics
    const complexity = this.calculateComplexity(patterns);
    
    // Record pattern for the stability system
    this.patternRecognizer.recognize({
      type: 'code_pattern',
      strength: 0.97,
      signature: [
        patterns.loops > 5 ? 1 : 0,
        patterns.conditionals > 10 ? 1 : 0,
        patterns.functionCalls > 20 ? 1 : 0,
        patterns.vectorOperations > 15 ? 1 : 0,
        complexity > 50 ? 1 : 0
      ],
      metrics: patterns
    });
  }
  
  /**
   * Store token patterns for optimization
   */
  storeTokenPatterns() {
    // Analyze token sequences for common patterns
    const patterns = this.identifyTokenPatterns();
    
    // Store patterns for use in optimization
    this.codePatterns.set('tokens', patterns);
  }
  
  /**
   * Identify patterns in token sequence
   * @returns {Array} - Identified patterns
   */
  identifyTokenPatterns() {
    const patterns = [];
    
    // Look for repeated sequences of tokens
    // (Implementation would identify common code structures)
    
    return patterns;
  }
  
  /**
   * Calculate code complexity metric
   * @param {Object} patterns - Code patterns
   * @returns {number} - Complexity score
   */
  calculateComplexity(patterns) {
    return (
      patterns.loops * 3 + 
      patterns.conditionals * 2 + 
      patterns.functionCalls + 
      patterns.vectorOperations * 2
    );
  }
  
  /**
   * Apply optimizations based on recognized patterns
   * @param {string} code - Compiled code
   * @returns {string} - Optimized code
   */
  applyOptimizations(code) {
    // Apply various optimizations based on recognized patterns
    let optimized = code;
    
    // Check stability before applying optimizations
    if (this.stabilityCore.verify()) {
      // Apply loop optimizations
      optimized = this.optimizeLoops(optimized);
      
      // Apply vector operation optimizations
      optimized = this.optimizeVectorOperations(optimized);
    }
    
    return optimized;
  }
  
  /**
   * Optimize loops in the compiled code
   * @param {string} code - Code to optimize
   * @returns {string} - Optimized code
   */
  optimizeLoops(code) {
    // Implementation would optimize loop structures
    return code;
  }
  
  /**
   * Optimize vector operations
   * @param {string} code - Code to optimize
   * @returns {string} - Optimized code
   */
  optimizeVectorOperations(code) {
    // Implementation would optimize vector operations
    return code;
  }
  
  /**
   * Wrap compiled code with stability monitoring
   * @param {string} code - Compiled code
   * @returns {string} - Code with stability monitoring
   */
  wrapWithStabilityMonitoring(code) {
    return `
// Compiled SAAAM code with stability monitoring
(function(SAAAM) {
  // Initialize stability monitoring for this code
  const stability = SAAAM.getStabilitySystem();
  stability.monitorExecution('${this.generateExecutionId()}');

  try {
${this.indent(code)}
  } catch (error) {
    stability.handleExecutionError(error);
    throw error;
  } finally {
    stability.completeExecution();
  }
})(SAAAM);
`;
  }
  
  /**
   * Generate unique execution ID
   * @returns {string} - Unique ID
   */
  generateExecutionId() {
    return 'exec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }
}

// Extend SaaamInterpreter with Stability System
class StabilityEnhancedInterpreter extends SaaamInterpreter {
  constructor(engine) {
    super(engine);
    
    // Initialize stability system
    this.stabilityCore = new StabilityCore();
    this.patternRecognizer = new PatternRecognition(this.stabilityCore);
    this.stabilityMonitor = new StabilityMonitor(this.stabilityCore);
    
    // Performance tracking
    this.performanceMetrics = {
      executionTimes: new Map(),
      frameRates: [],
      memoryUsage: []
    };
    
    // Add stability-specific environment functions
    this.environment.checkStability = this.checkStability.bind(this);
    this.environment.optimizePerformance = this.optimizePerformance.bind(this);
  }
  
  /**
   * Initialize with stability monitoring
   */
  initialize() {
    // Call original initialize
    const result = super.initialize();
    
    if (result) {
      // Set up performance monitoring
      this.setupPerformanceMonitoring();
      
      // Initialize pattern recognition for runtime patterns
      this.initializePatternRecognition();
    }
    
    return result;
  }
  
  /**
   * Set up performance monitoring
   */
  setupPerformanceMonitoring() {
    // Track frame execution time
    this.originalStep = this.engine.step;
    this.engine.step = (deltaTime) => {
      const startTime = performance.now();
      
      // Run original step
      const result = this.originalStep(deltaTime);
      
      // Track execution time
      const executionTime = performance.now() - startTime;
      this.trackExecutionTime('step', executionTime);
      
      // Monitor stability
      this.monitorStability();
      
      return result;
    };
  }
  
  /**
   * Initialize pattern recognition for runtime behavior
   */
  initializePatternRecognition() {
    // Set up pattern scanning interval
    setInterval(() => {
      this.scanRuntimePatterns();
    }, 1000);
  }
  
  /**
   * Track execution time for a function
   * @param {string} functionName - Function name
   * @param {number} time - Execution time in ms
   */
  trackExecutionTime(functionName, time) {
    if (!this.performanceMetrics.executionTimes.has(functionName)) {
      this.performanceMetrics.executionTimes.set(functionName, []);
    }
    
    const times = this.performanceMetrics.executionTimes.get(functionName);
    times.push(time);
    
    // Keep a reasonable history
    if (times.length > 100) {
      times.shift();
    }
  }
  
  /**
   * Monitor stability during execution
   */
  monitorStability() {
    // Check stability metrics
    const status = this.stabilityMonitor.check();
    
    // If stability is problematic, take action
    if (!status.stable) {
      this.handleStabilityIssue(status);
    }
    
    // Track FPS and memory periodically
    if (Date.now() - this.lastMetricsTime > 1000) {
      this.trackPerformanceMetrics();
      this.lastMetricsTime = Date.now();
    }
  }
  
  /**
   * Track performance metrics
   */
  trackPerformanceMetrics() {
    // Calculate current FPS
    const fps = this.calculateFPS();
    this.performanceMetrics.frameRates.push(fps);
    
    // Track memory usage if available
    if (window.performance && window.performance.memory) {
      const memory = window.performance.memory.usedJSHeapSize / (1024 * 1024);
      this.performanceMetrics.memoryUsage.push(memory);
    }
    
    // Trim arrays to reasonable size
    if (this.performanceMetrics.frameRates.length > 60) {
      this.performanceMetrics.frameRates.shift();
      
      if (this.performanceMetrics.memoryUsage.length > 60) {
        this.performanceMetrics.memoryUsage.shift();
      }
    }
  }
  
  /**
   * Calculate current FPS based on recent execution times
   * @returns {number} - Current FPS estimate
   */
  calculateFPS() {
    const stepTimes = this.performanceMetrics.executionTimes.get('step') || [];
    if (stepTimes.length < 2) {
      return 60; // Default
    }
    
    // Calculate average step time
    const avgStepTime = stepTimes.reduce((sum, time) => sum + time, 0) / stepTimes.length;
    
    // Convert to FPS (capped at 60)
    return Math.min(60, Math.round(1000 / avgStepTime));
  }
  
  /**
   * Handle stability issues
   * @param {Object} status - Stability status
   */
  handleStabilityIssue(status) {
    console.warn("Stability issue detected:", status);
    
    // Adjust dimensions to improve stability
    this.stabilityCore.adjustDimensions({
      alpha: Math.max(95.0, this.stabilityCore.dimensions.alpha - 0.5),
      gamma: Math.min(99.5, this.stabilityCore.dimensions.gamma + 0.2)
    });
    
    // If critical, take more drastic action
    if (this.stabilityCore.stability < 0.8) {
      this.emergencyStabilization();
    }
  }
  
  /**
   * Emergency stabilization procedure
   */
  emergencyStabilization() {
    console.warn("Emergency stabilization initiated");
    
    // Reset position to stable values
    this.stabilityCore.position = { x: 100, y: 0, z: 100 };
    
    // Reset dimensions to known-good values
    this.stabilityCore.dimensions = {
      alpha: 98.7,
      beta: 99.1,
      gamma: 98.9
    };
    
    // Clear pattern history
    this.stabilityCore.patterns = [];
    
    // Reset stability
    this.stabilityCore.stability = 100.0;
    
    console.log("Emergency stabilization complete");
  }
  
  /**
   * Scan for runtime patterns
   */
  scanRuntimePatterns() {
    const patterns = this.identifyRuntimePatterns();
    
    patterns.forEach(pattern => {
      if (pattern.strength > 0.9) {
        this.patternRecognizer.recognize(pattern);
      }
    });
  }
  
  /**
   * Identify runtime patterns based on execution metrics
   * @returns {Array} - Identified patterns
   */
  identifyRuntimePatterns() {
    const patterns = [];
    
    // Check for performance degradation
    const recentFps = this.performanceMetrics.frameRates.slice(-10);
    const avgFps = recentFps.reduce((sum, fps) => sum + fps, 0) / recentFps.length;
    
    if (avgFps < 30) {
      patterns.push({
        type: 'performance_degradation',
        strength: 0.95,
        signature: [1, 0, 1, 1, 0], // Critical sequence
        metrics: { fps: avgFps }
      });
    }
    
    // Check for memory growth
    const memoryGrowth = this.calculateMemoryGrowth();
    if (memoryGrowth > 5) { // More than 5MB/s growth
      patterns.push({
        type: 'memory_growth',
        strength: 0.93,
        signature: [1, 0, 1, 0, 1],
        metrics: { growth: memoryGrowth }
      });
    }
    
    return patterns;
  }
  
  /**
   * Calculate memory growth rate in MB/s
   * @returns {number} - Growth rate
   */
  calculateMemoryGrowth() {
    const memory = this.performanceMetrics.memoryUsage;
    if (memory.length < 10) return 0;
    
    const recent = memory.slice(-10);
    const oldest = recent[0];
    const newest = recent[recent.length - 1];
    
    return newest - oldest; // MB over last 10 seconds = MB/s
  }
  
  /**
   * Check stability (exposed to SAAAM environment)
   * @returns {Object} - Stability status
   */
  checkStability() {
    return this.stabilityMonitor.check();
  }
  
  /**
   * Optimize performance (exposed to SAAAM environment)
   * @param {string} target - Optimization target ('memory', 'fps', 'all')
   * @returns {boolean} - Success
   */
  optimizePerformance(target = 'all') {
    // Implementation would optimize based on target
    return true;
  }
}

// Integration helper to connect stability system to SAAAM
class SAAMStabilityIntegration {
  /**
   * Set up the integration
   * @param {Object} options - Integration options
   */
  static setupIntegration(options = {}) {
    const { 
      enableCompilerOptimizations = true,
      enableRuntimeMonitoring = true,
      stabilityThreshold = 0.95,
      evolutionRate = 0.042
    } = options;
    
    // Create global stability system if not exists
    if (!window.SAAMStability) {
      window.SAAMStability = {
        core: new StabilityCore(),
        patterns: null,
        monitor: null
      };
      
      // Configure based on options
      window.SAAMStability.core.threshold = stabilityThreshold;
      window.SAAMStability.core.evolutionRate = evolutionRate;
      
      // Create pattern and monitoring systems
      window.SAAMStability.patterns = new PatternRecognition(window.SAAMStability.core);
      window.SAAMStability.monitor = new StabilityMonitor(window.SAAMStability.core);
    }
    
    // Enhance SAAAM compiler if available
    if (window.SaaamCompiler && enableCompilerOptimizations) {
      const originalCompiler = window.SaaamCompiler;
      window.SaaamCompiler = StabilityEnhancedCompiler;
      console.log("SAAAM Compiler enhanced with stability system");
    }
    
    // Enhance SAAAM interpreter if available
    if (window.SaaamInterpreter && enableRuntimeMonitoring) {
      const originalInterpreter = window.SaaamInterpreter;
      window.SaaamInterpreter = StabilityEnhancedInterpreter;
      console.log("SAAAM Interpreter enhanced with stability system");
    }
    
    // Add stability API to SAAAM engine
    if (window.SAAAM) {
      window.SAAAM.getStabilitySystem = () => window.SAAMStability;
      window.SAAAM.checkStability = () => window.SAAMStability.monitor.check();
      window.SAAAM.optimizeGame = (target) => SAAMStabilityIntegration.optimizeGame(target);
      
      console.log("SAAAM Engine enhanced with stability API");
    }
    
    return {
      stabilityCore: window.SAAMStability?.core,
      patternRecognition: window.SAAMStability?.patterns,
      stabilityMonitor: window.SAAMStability?.monitor
    };
  }
  
  /**
   * Optimize game performance using the stability system
   * @param {string} target - Optimization target ('memory', 'fps', 'all')
   * @returns {Object} - Optimization results
   */
  static optimizeGame(target = 'all') {
    const stability = window.SAAMStability;
    if (!stability) return { success: false, reason: 'Stability system not initialized' };
    
    const results = {
      success: true,
      optimizations: [],
      metrics: {
        before: {},
        after: {}
      }
    };
    
    // Capture current metrics
    const beforeStatus = stability.monitor.check();
    results.metrics.before = {
      stability: stability.core.stability,
      dimensions: { ...stability.core.dimensions },
      patterns: stability.core.patterns.length
    };
    
    // Perform target-specific optimizations
    switch (target) {
      case 'memory':
        results.optimizations.push(SAAMStabilityIntegration.optimizeMemory());
        break;
      case 'fps':
        results.optimizations.push(SAAMStabilityIntegration.optimizeFPS());
        break;
      case 'all':
      default:
        results.optimizations.push(SAAMStabilityIntegration.optimizeMemory());
        results.optimizations.push(SAAMStabilityIntegration.optimizeFPS());
        results.optimizations.push(SAAMStabilityIntegration.optimizeStability());
        break;
    }
    
    // Capture metrics after optimization
    const afterStatus = stability.monitor.check();
    results.metrics.after = {
      stability: stability.core.stability,
      dimensions: { ...stability.core.dimensions },
      patterns: stability.core.patterns.length
    };
    
    console.log(`SAAAM Game optimized for ${target}:`, results);
    return results;
  }
  
  /**
   * Optimize memory usage
   * @returns {Object} - Optimization result
   */
  static optimizeMemory() {
    const stability = window.SAAMStability;
    
    // Adjust dimensions to favor memory optimization
    stability.core.dimensions.gamma = Math.min(100, stability.core.dimensions.gamma + 0.5);
    
    // Clear non-essential patterns
    const essentialPatterns = stability.core.patterns.filter(
      p => p.type === 'critical' || p.strength > 0.98
    );
    stability.core.patterns = essentialPatterns;
    
    // Trigger garbage collection if available (in some environments)
    if (window.gc) {
      window.gc();
    }
    
    return {
      target: 'memory',
      actions: ['adjusted dimensions', 'cleared non-essential patterns', 'requested GC']
    };
  }
  
  /**
   * Optimize FPS (frames per second)
   * @returns {Object} - Optimization result
   */
  static optimizeFPS() {
    const stability = window.SAAMStability;
    
    // Adjust dimensions to favor performance
    stability.core.dimensions.alpha = Math.min(100, stability.core.dimensions.alpha + 1.0);
    
    // Suggest engine optimizations by triggering a critical pattern
    stability.patterns.recognize({
      type: 'optimization_request',
      strength: 0.99,
      signature: [1, 0, 1, 1, 0], // Critical sequence
      target: 'performance'
    });
    
    return {
      target: 'fps',
      actions: ['adjusted dimensions', 'requested engine optimization']
    };
  }
  
  /**
   * Optimize overall stability
   * @returns {Object} - Optimization result
   */
  static optimizeStability() {
    const stability = window.SAAMStability;
    
    // Reset position to stable values
    stability.core.position = { x: 100, y: 0, z: 100 };
    
    // Balance dimensions for overall stability
    stability.core.dimensions = {
      alpha: 98.7,
      beta: 99.1,
      gamma: 98.9
    };
    
    // Boost stability score
    stability.core.stability = Math.min(100, stability.core.stability + 5);
    
    // Evolve the system
    stability.core.evolve();
    
    return {
      target: 'stability',
      actions: ['reset position', 'balanced dimensions', 'boosted stability', 'evolved system']
    };
  }
}

// Integration with SAAAM Debug Tools
class SAAMStabilityDebugTools {
  constructor(stabilitySystem) {
    this.stability = stabilitySystem || window.SAAMStability;
    this.visualizers = new Map();
    this.debugMode = false;
  }
  
  /**
   * Initialize debugger with stability integration
   * @param {Object} options - Debug options
   * @returns {boolean} - Success status
   */
  initialize(options = {}) {
    if (!this.stability) {
      console.error('Stability system not available for debugging');
      return false;
    }
    
    this.debugMode = options.debugMode || false;
    
    // Add stability metrics to debug panel
    this.setupStabilityMetricsPanel();
    
    // Add pattern visualization
    this.setupPatternVisualizer();
    
    // Add performance tracking
    this.setupPerformanceTracker();
    
    console.log('SAAAM Stability Debug Tools initialized');
    return true;
  }
  
  /**
   * Set up stability metrics panel
   */
  setupStabilityMetricsPanel() {
    // Create UI panel for stability metrics if in debug mode
    if (this.debugMode && typeof document !== 'undefined') {
      const panel = document.createElement('div');
      panel.id = 'saaam-stability-panel';
      panel.style.cssText = 'position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.7);color:#fff;padding:10px;border-radius:5px;font-family:monospace;z-index:1000;';
      
      document.body.appendChild(panel);
      
      // Initialize panel content
      this.updateMetricsPanel();
      
      // Update metrics periodically
      setInterval(() => this.updateMetricsPanel(), 1000);
    }
  }
  
  /**
   * Update the metrics panel with current values
   */
  updateMetricsPanel() {
    if (!this.debugMode) return;
    
    const panel = document.getElementById('saaam-stability-panel');
    if (!panel) return;
    
    const status = this.stability.monitor.check();
    const dimensions = this.stability.core.dimensions;
    
    panel.innerHTML = `
      <h3>SAAAM Stability</h3>
      <div>Stability: ${this.stability.core.stability.toFixed(2)}</div>
      <div>Threshold: ${this.stability.core.threshold.toFixed(2)}</div>
      <div>Evolution: ${this.stability.core.evolutionRate.toFixed(4)}</div>
      <div>Alpha: ${dimensions.alpha.toFixed(2)}</div>
      <div>Beta: ${dimensions.beta.toFixed(2)}</div>
      <div>Gamma: ${dimensions.gamma.toFixed(2)}</div>
      <div>Patterns: ${this.stability.core.patterns.length}</div>
      <div>Status: ${status.stable ? '✓ Stable' : '⚠ Unstable'}</div>
    `;
  }
  
  /**
   * Set up pattern visualization
   */
  setupPatternVisualizer() {
    // Only set up if in debug mode
    if (!this.debugMode) return;
    
    // Create visualizer
    const visualizer = {
      canvas: null,
      context: null,
      patternColors: new Map(),
      initialize: () => {
        // Create canvas if in browser
        if (typeof document !== 'undefined') {
          const canvas = document.createElement('canvas');
          canvas.id = 'saaam-pattern-canvas';
          canvas.width = 300;
          canvas.height = 150;
          canvas.style.cssText = 'position:fixed;bottom:10px;right:10px;background:rgba(0,0,0,0.7);border-radius:5px;z-index:1000;';
          
          document.body.appendChild(canvas);
          visualizer.canvas = canvas;
          visualizer.context = canvas.getContext('2d');
          
          // Start rendering
          requestAnimationFrame(() => visualizer.render());
        }
      },
      render: () => {
        if (!visualizer.context) return;
        
        const ctx = visualizer.context;
        const canvas = visualizer.canvas;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Render background
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw title
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.fillText('Pattern Recognition', 10, 15);
        
        // Draw patterns
        this.renderPatterns(ctx);
        
        // Continue animation
        requestAnimationFrame(() => visualizer.render());
      }
    };
    
    // Initialize and store
    visualizer.initialize();
    this.visualizers.set('patterns', visualizer);
  }
  
  /**
   * Render patterns on the visualization canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  renderPatterns(ctx) {
    const patterns = this.stability.core.patterns;
    if (!patterns || patterns.length === 0) return;
    
    // Only show most recent patterns (up to 5)
    const recentPatterns = patterns.slice(-5);
    
    // Y position starting point
    let y = 30;
    
    // Render each pattern
    recentPatterns.forEach((pattern, index) => {
      // Get or assign color for pattern type
      let color = this.visualizers.get('patterns').patternColors.get(pattern.type);
      if (!color) {
        // Generate color based on pattern type
        const hue = (pattern.type.charCodeAt(0) * 10) % 360;
        color = `hsl(${hue}, 80%, 60%)`;
        this.visualizers.get('patterns').patternColors.set(pattern.type, color);
      }
      
      // Draw pattern type
      ctx.fillStyle = color;
      ctx.fillText(`${pattern.type} (${pattern.strength.toFixed(2)})`, 10, y);
      
      // Draw pattern signature if available
      if (pattern.signature) {
        ctx.fillStyle = '#aaaaaa';
        const signatureText = pattern.signature.join('');
        ctx.fillText(signatureText, 180, y);
        
        // Highlight critical sequence
        if (signatureText === '10110') {
          ctx.fillStyle = '#ff5555';
          ctx.fillText('*', 240, y);
        }
      }
      
      // Move to next line
      y += 20;
    });
  }
  
  /**
   * Set up performance tracker
   */
  setupPerformanceTracker() {
    // Only setup if in debug mode
    if (!this.debugMode) return;
    
    // Set up tracking interval
    setInterval(() => {
      // Get performance metrics
      const metrics = this.getPerformanceMetrics();
      
      // Check for performance issues
      if (metrics.fps < 30) {
        console.warn('Performance issue detected:', metrics);
        
        // Record pattern
        this.stability.patterns.recognize({
          type: 'performance_issue',
          strength: 0.96,
          signature: [1, 0, 1, 1, 0], // Critical sequence
          metrics
        });
        
        // Suggest optimizations
        SAAMStabilityIntegration.optimizeGame('fps');
      }
    }, 5000); // Check every 5 seconds
  }
  
  /**
   * Get current performance metrics
   * @returns {Object} - Performance metrics
   */
  getPerformanceMetrics() {
    // Default metrics
    const metrics = {
      fps: 60,
      memory: 0,
      stability: this.stability.core.stability
    };
    
    // Get FPS if available
    if (window.SAAAM && window.SAAAM.currentFPS) {
      metrics.fps = window.SAAAM.currentFPS;
    }
    
    // Get memory usage if available
    if (window.performance && window.performance.memory) {
      metrics.memory = window.performance.memory.usedJSHeapSize / (1024 * 1024);
    }
    
    return metrics;
  }
}

// Export debug tools
if (typeof module !== 'undefined') {
  module.exports.SAAMStabilityDebugTools = SAAMStabilityDebugTools;
}

// Initialize in browser environment
if (typeof window !== 'undefined' && window.SAAMStability) {
  window.SAAMStabilityDebugTools = new SAAMStabilityDebugTools(window.SAAMStability);
}
