// /src/engine/systems/AISystem.js

import { GameState } from '../GameState.js';

/**
 * Emotion state for AI entities
 */
class EmotionState {
  constructor(baseState = {}) {
    this.fear = baseState.fear || 0;
    this.joy = baseState.joy || 0;
    this.anger = baseState.anger || 0;
    this.curiosity = baseState.curiosity || 0;
    this.sadness = baseState.sadness || 0;
    
    // Metadata
    this.dominant = this.calculateDominant();
    this.intensity = this.calculateIntensity();
    this.lastUpdate = Date.now();
  }
  
  /**
   * Update emotion values
   * @param {Object} changes - Changes to apply to emotions
   */
  update(changes) {
    if (changes.fear !== undefined) this.fear = this.clampEmotion(this.fear + changes.fear);
    if (changes.joy !== undefined) this.joy = this.clampEmotion(this.joy + changes.joy);
    if (changes.anger !== undefined) this.anger = this.clampEmotion(this.anger + changes.anger);
    if (changes.curiosity !== undefined) this.curiosity = this.clampEmotion(this.curiosity + changes.curiosity);
    if (changes.sadness !== undefined) this.sadness = this.clampEmotion(this.sadness + changes.sadness);
    
    // Update metadata
    this.dominant = this.calculateDominant();
    this.intensity = this.calculateIntensity();
    this.lastUpdate = Date.now();
  }
  
  /**
   * Clamp emotion value between 0 and 1
   * @param {number} value - Emotion value
   * @returns {number} - Clamped value
   */
  clampEmotion(value) {
    return Math.max(0, Math.min(1, value));
  }
  
  /**
   * Calculate the dominant emotion
   * @returns {string} - Name of dominant emotion
   */
  calculateDominant() {
    const emotions = {
      fear: this.fear,
      joy: this.joy,
      anger: this.anger,
      curiosity: this.curiosity,
      sadness: this.sadness
    };
    
    return Object.entries(emotions).sort((a, b) => b[1] - a[1])[0][0];
  }
  
  /**
   * Calculate overall emotional intensity
   * @returns {number} - Intensity value between 0 and 1
   */
  calculateIntensity() {
    return (this.fear + this.joy + this.anger + this.curiosity + this.sadness) / 5;
  }
  
  /**
   * Get emotion state as an object
   * @returns {Object} - Emotion state object
   */
  toObject() {
    return {
      fear: this.fear,
      joy: this.joy,
      anger: this.anger,
      curiosity: this.curiosity,
      sadness: this.sadness,
      dominant: this.dominant,
      intensity: this.intensity,
      lastUpdate: this.lastUpdate
    };
  }
}

/**
 * Simple behavior tree implementation
 */
class BehaviorTree {
  constructor(rootNode) {
    this.root = rootNode;
    this.blackboard = new Map();
  }
  
  /**
   * Execute the behavior tree
   * @param {Object} context - Execution context
   * @returns {string} - Result status
   */
  execute(context = {}) {
    if (!this.root) return 'FAILURE';
    
    return this.root.execute(context, this.blackboard);
  }
  
  /**
   * Set a value in the blackboard
   * @param {string} key - Key to set
   * @param {any} value - Value to store
   */
  setValue(key, value) {
    this.blackboard.set(key, value);
  }
  
  /**
   * Get a value from the blackboard
   * @param {string} key - Key to retrieve
   * @param {any} defaultValue - Default value if not found
   * @returns {any} - Retrieved value
   */
  getValue(key, defaultValue = null) {
    return this.blackboard.has(key) ? this.blackboard.get(key) : defaultValue;
  }
  
  /**
   * Clear the blackboard
   */
  clearBlackboard() {
    this.blackboard.clear();
  }
}

/**
 * AI System for managing NPC behaviors and emotions
 */
export class AISystem {
  /**
   * Create a new AI system
   * @param {Object} gameState - AI game state
   */
  constructor(gameState) {
    this.gameState = gameState;
    
    // Initialize system collections from game state
    this.entities = gameState.entities || new Map();
    this.behaviors = gameState.behaviors || new Map();
    this.emotions = gameState.emotions || new Map();
    
    // Quantum processor reference
    this.quantumProcessor = null;
    
    // Context cache
    this.contextCache = new Map();
    this.contextCacheTimeout = 500; // ms
    
    // Performance settings
    this.updateFrequency = 1000 / 5; // 5 updates per second
    this.lastUpdateTime = 0;
    
    // Debug mode
    this.debugMode = false;
  }
  
  /**
   * Set the quantum processor
   * @param {QuantumCore} processor - Quantum processor
   */
  setQuantumProcessor(processor) {
    this.quantumProcessor = processor;
  }
  
  /**
   * Register an entity with the AI system
   * @param {string} id - Entity ID
   * @param {Object} entity - Entity object
   * @param {Object} options - Registration options
   * @returns {Object} - Registered entity
   */
  registerEntity(id, entity, options = {}) {
    // Store in entities collection
    this.entities.set(id, entity);
    
    // Create default behavior if not specified
    if (!this.behaviors.has(id) && !options.noBehavior) {
      this.behaviors.set(id, this.createDefaultBehavior(entity));
    }
    
    // Create default emotions if not specified
    if (!this.emotions.has(id) && !options.noEmotions) {
      this.emotions.set(id, new EmotionState({
        fear: Math.random() * 0.2,
        joy: 0.5 + Math.random() * 0.3,
        anger: Math.random() * 0.1,
        curiosity: 0.3 + Math.random() * 0.4,
        sadness: Math.random() * 0.2
      }));
    }
    
    // Return for chaining
    return entity;
  }
  
  /**
   * Create a default behavior tree
   * @param {Object} entity - Entity to create behavior for
   * @returns {BehaviorTree} - Default behavior tree
   */
  createDefaultBehavior(entity) {
    // Create a simple idle/wander behavior
    // In a real implementation, this would create a proper behavior tree
    return new BehaviorTree({
      execute: (context, blackboard) => {
        // Simple wandering behavior
        if (!entity.ai) entity.ai = { state: 'idle', timer: 0 };
        
        if (entity.ai.state === 'idle') {
          entity.ai.timer -= context.deltaTime;
          
          if (entity.ai.timer <= 0) {
            entity.ai.state = 'wander';
            entity.ai.timer = 2 + Math.random() * 3;
            entity.ai.direction = Math.random() * Math.PI * 2;
          }
        } 
        else if (entity.ai.state === 'wander') {
          entity.ai.timer -= context.deltaTime;
          
          // Move in current direction
          if (entity.position && entity.velocity) {
            entity.velocity.x = Math.cos(entity.ai.direction) * 50 * context.deltaTime;
            entity.velocity.y = Math.sin(entity.ai.direction) * 50 * context.deltaTime;
          }
          
          if (entity.ai.timer <= 0) {
            entity.ai.state = 'idle';
            entity.ai.timer = 1 + Math.random() * 2;
            
            // Stop moving
            if (entity.velocity) {
              entity.velocity.x = 0;
              entity.velocity.y = 0;
            }
          }
        }
        
        return 'SUCCESS';
      }
    });
  }
  
  /**
   * Update the AI system
   * @param {number} deltaTime - Time since last frame
   */
  async update(deltaTime) {
    // Check if it's time to update
    const currentTime = Date.now();
    if (currentTime - this.lastUpdateTime < this.updateFrequency) {
      return;
    }
    
    // Update time tracking
    this.lastUpdateTime = currentTime;
    
    // Process each entity
    for (const [id, entity] of this.entities) {
      try {
        await this.updateEntity(id, entity, deltaTime);
      } catch (error) {
        console.error(`Error updating AI entity ${id}:`, error);
      }
    }
    
    // Clean up context cache
    this.cleanupContextCache();
  }
  
  /**
   * Update a single entity
   * @param {string} id - Entity ID
   * @param {Object} entity - Entity object
   * @param {number} deltaTime - Time since last update
   */
  async updateEntity(id, entity, deltaTime) {
    // Skip if entity isn't active
    if (entity.active === false) return;
    
    // Get behavior and emotions
    const behavior = this.behaviors.get(id);
    const emotions = this.emotions.get(id);
    
    if (!behavior || !emotions) return;
    
    // Update emotions with quantum influence
    await this.updateEmotions(id, emotions, deltaTime);
    
    // Get entity context
    const context = this.getEntityContext(id, entity, deltaTime);
    
    // Process behavior
    await this.processBehavior(id, behavior, context);
  }
  
  /**
   * Update entity emotions
   * @param {string} id - Entity ID
   * @param {EmotionState} emotions - Entity emotions
   * @param {number} deltaTime - Time since last update
   */
  async updateEmotions(id, emotions, deltaTime) {
    // Get entity
    const entity = this.entities.get(id);
    if (!entity) return;
    
    // Create context for emotion update
    const context = this.getEntityContext(id, entity, deltaTime);
    
    // Apply quantum influence if available
    let quantumInfluence = { 
      fear: 0, joy: 0, anger: 0, curiosity: 0, sadness: 0 
    };
    
    if (this.quantumProcessor) {
      // Calculate quantum emotions influence
      const coherenceLevel = this.quantumProcessor.quantumState.coherenceLevel;
      
      if (coherenceLevel > 1.0) {
        // Higher coherence increases curiosity and decreases fear
        quantumInfluence.curiosity += (coherenceLevel - 1.0) * 0.1 * deltaTime;
        quantumInfluence.fear -= (coherenceLevel - 1.0) * 0.05 * deltaTime;
      }
      
      if (coherenceLevel > 1.5) {
        // Even higher coherence increases joy
        quantumInfluence.joy += (coherenceLevel - 1.5) * 0.15 * deltaTime;
      }
      
      if (coherenceLevel > 1.8) {
        // Extreme coherence decreases sadness and anger
        quantumInfluence.sadness -= (coherenceLevel - 1.8) * 0.2 * deltaTime;
        quantumInfluence.anger -= (coherenceLevel - 1.8) * 0.1 * deltaTime;
      }
    }
    
    // Update emotions with quantum influence
    emotions.update(quantumInfluence);
    
    // Natural decay of emotions over time
    const decayRate = 0.01 * deltaTime;
    const decay = {
      fear: -emotions.fear * decayRate,
      joy: -emotions.joy * decayRate,
      anger: -emotions.anger * decayRate,
      curiosity: -emotions.curiosity * decayRate,
      sadness: -emotions.sadness * decayRate
    };
    
    emotions.update(decay);
  }
  
  /**
   * Process entity behavior
   * @param {string} id - Entity ID
   * @param {BehaviorTree} behavior - Entity behavior
   * @param {Object} context - Execution context
   */
  async processBehavior(id, behavior, context) {
    // Add emotions to context
    context.emotions = this.emotions.get(id);
    
    // Execute behavior
    const result = behavior.execute(context);
    
    // Handle result if needed
    if (result === 'FAILURE' && this.debugMode) {
      console.warn(`Behavior failure for entity ${id}`);
    }
  }
  
  /**
   * Get context for an entity
   * @param {string} id - Entity ID
   * @param {Object} entity - Entity object
   * @param {number} deltaTime - Time since last update
   * @returns {Object} - Entity context
   */
  getEntityContext(id, entity, deltaTime) {
    // Check cache first
    const cacheKey = `${id}-${this.lastUpdateTime}`;
    if (this.contextCache.has(cacheKey)) {
      return this.contextCache.get(cacheKey);
    }
    
    // Create new context
    const context = {
      entityId: id,
      entity: entity,
      deltaTime: deltaTime,
      time: Date.now(),
      position: entity.position || { x: 0, y: 0 },
      nearbyEntities: this.getNearbyEntities(entity),
      playerDistance: this.getDistanceToPlayer(entity),
      quantumLevel: this.quantumProcessor ? this.quantumProcessor.quantumState.coherenceLevel : 1.0
    };
    
    // Cache context
    this.contextCache.set(cacheKey, context);
    this.contextCache.set(cacheKey + '-timestamp', Date.now());
    
    return context;
  }
  
  /**
   * Get nearby entities
   * @param {Object} entity - Entity to find neighbors for
   * @param {number} radius - Search radius
   * @returns {Array} - Array of nearby entities
   */
  getNearbyEntities(entity, radius = 200) {
    if (!entity.position) return [];
    
    const nearby = [];
    
    for (const [id, other] of this.entities) {
      // Skip self
      if (other === entity) continue;
      
      // Skip entities without position
      if (!other.position) continue;
      
      // Calculate distance
      const dx = other.position.x - entity.position.x;
      const dy = other.position.y - entity.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Add if within radius
      if (distance <= radius) {
        nearby.push({
          entity: other,
          distance: distance,
          direction: Math.atan2(dy, dx)
        });
      }
    }
    
    // Sort by distance
    nearby.sort((a, b) => a.distance - b.distance);
    
    return nearby;
  }
  
  /**
   * Get distance to player
   * @param {Object} entity - Entity to calculate distance for
   * @returns {number} - Distance to player or Infinity if no player
   */
  getDistanceToPlayer(entity) {
    const player = GameState.player;
    
    if (!player || !entity.position || !player.position) {
      return Infinity;
    }
    
    const dx = player.position.x - entity.position.x;
    const dy = player.position.y - entity.position.y;
    
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  /**
   * Clean up expired items from context cache
   */
  cleanupContextCache() {
    const now = Date.now();
    
    for (const [key, timestamp] of this.contextCache) {
      if (key.endsWith('-timestamp') && now - timestamp > this.contextCacheTimeout) {
        // Remove timestamp entry
        this.contextCache.delete(key);
        
        // Remove corresponding context entry
        const contextKey = key.substring(0, key.length - 10);
        this.contextCache.delete(contextKey);
      }
    }
  }
  
  /**
   * Enable or disable debug mode
   * @param {boolean} enabled - Debug mode enabled
   */
  setDebugMode(enabled) {
    this.debugMode = enabled;
  }
}