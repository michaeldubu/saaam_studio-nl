// src/core/System.js

import { generateId } from '../utils/UUID';

/**
 * Base System class for the Entity Component System
 * Systems operate on entities with specific component combinations
 */
export class System {
  /**
   * Create a new system
   * @param {string} [name] - System name
   */
  constructor(name) {
    // Core properties
    this.id = generateId();
    this.name = name || this.constructor.name;
    this.active = true;
    this.priority = 0;
    
    // Reference to world (set when added to world)
    this._world = null;
    
    // System entities
    this.entities = [];
    
    // Required component types for entities
    this.requiredComponents = [];
    
    // System statistics for debugging
    this._stats = {
      updateTime: 0,
      entityCount: 0,
      lastUpdateTime: 0
    };
  }
  
  /**
   * Get world reference
   * @returns {World|null} World or null if not added to world
   */
  get world() {
    return this._world;
  }
  
  /**
   * Initialize the system
   * Called when added to a world
   * @virtual
   */
  initialize() {
    // Base implementation does nothing
  }
  
  /**
   * Update the system
   * @param {number} deltaTime - Time since last frame in seconds
   * @virtual
   */
  update(deltaTime) {
    // Measure update time
    const startTime = performance.now();
    
    // Update entities
    this._updateEntities(deltaTime);
    
    // Store statistics
    this._stats.updateTime = performance.now() - startTime;
    this._stats.lastUpdateTime = Date.now();
    this._stats.entityCount = this.entities.length;
  }
  
  /**
   * Render the system
   * @param {CanvasRenderingContext2D} ctx - Rendering context
   * @virtual
   */
  render(ctx) {
    // Base implementation does nothing
  }
  
  /**
   * Clean up the system
   * Called when removed from a world
   * @virtual
   */
  cleanup() {
    // Base implementation does nothing
  }
  
  /**
   * Check if an entity matches this system's requirements
   * @param {Entity} entity - Entity to check
   * @returns {boolean} True if entity matches requirements
   */
  matchesEntity(entity) {
    // If no required components, match all entities
    if (this.requiredComponents.length === 0) {
      return true;
    }
    
    // Check if entity has all required components
    return this.requiredComponents.every(componentType => 
      entity.hasComponent(componentType)
    );
  }
  
  /**
   * Add an entity to this system
   * @param {Entity} entity - Entity to add
   * @returns {boolean} True if entity was added
   */
  addEntity(entity) {
    // Check if entity is already in system
    if (this.entities.includes(entity)) {
      return false;
    }
    
    // Check if entity matches system requirements
    if (!this.matchesEntity(entity)) {
      return false;
    }
    
    // Add to entities
    this.entities.push(entity);
    
    // Call onEntityAdded hook
    this.onEntityAdded(entity);
    
    return true;
  }
  
  /**
   * Remove an entity from this system
   * @param {Entity} entity - Entity to remove
   * @returns {boolean} True if entity was removed
   */
  removeEntity(entity) {
    // Find entity index
    const index = this.entities.indexOf(entity);
    
    // If not found, return false
    if (index === -1) {
      return false;
    }
    
    // Call onEntityRemoved hook
    this.onEntityRemoved(entity);
    
    // Remove from entities
    this.entities.splice(index, 1);
    
    return true;
  }
  
  /**
   * Clear all entities from this system
   */
  clearEntities() {
    // Call onEntityRemoved for each entity
    for (const entity of this.entities) {
      this.onEntityRemoved(entity);
    }
    
    // Clear entities array
    this.entities = [];
  }
  
  /**
   * Called when an entity is added to this system
   * @param {Entity} entity - Added entity
   * @virtual
   */
  onEntityAdded(entity) {
    // Base implementation does nothing
  }
  
  /**
   * Called when an entity is removed from this system
   * @param {Entity} entity - Removed entity
   * @virtual
   */
  onEntityRemoved(entity) {
    // Base implementation does nothing
  }
  
  /**
   * Update all entities in this system
   * @param {number} deltaTime - Time since last frame in seconds
   * @private
   */
  _updateEntities(deltaTime) {
    // Update each entity
    for (const entity of this.entities) {
      // Skip inactive entities
      if (!entity.active) continue;
      
      this.updateEntity(entity, deltaTime);
    }
  }
  
  /**
   * Update a specific entity
   * @param {Entity} entity - Entity to update
   * @param {number} deltaTime - Time since last frame in seconds
   * @virtual
   */
  updateEntity(entity, deltaTime) {
    // Base implementation does nothing
  }
  
  /**
   * Get system statistics
   * @returns {Object} System statistics
   */
  getStats() {
    return { ...this._stats };
  }
}