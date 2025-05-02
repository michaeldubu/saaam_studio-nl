// src/core/Component.js

import { generateId } from '../utils/UUID';

/**
 * Base Component class for the Entity Component System
 * Components contain logic and data that can be attached to entities
 */
export class Component {
  /**
   * Create a new component
   * @param {string} [type] - Component type name
   */
  constructor(type) {
    // Core properties
    this.id = generateId();
    this.type = type || this.constructor.name;
    this.enabled = true;
    
    // Reference to owning entity (set when added to entity)
    this._entity = null;
    
    // Internal component state
    this._state = {
      initialized: false,
      attached: false
    };
    
    // Component registry registration
    Component._registerType(this.type, this.constructor);
  }
  
  /**
   * Get owning entity
   * @returns {Entity|null} Entity or null if not attached
   */
  get entity() {
    return this._entity;
  }
  
  /**
   * Called when component is attached to an entity
   * @param {Entity} entity - Entity this component is attached to
   * @virtual
   */
  onAttach(entity) {
    this._state.attached = true;
  }
  
  /**
   * Called when component is detached from an entity
   * @virtual
   */
  onDetach() {
    this._state.attached = false;
    this._entity = null;
  }
  
  /**
   * Initialize component
   * Called once before first update
   * @virtual
   */
  initialize() {
    this._state.initialized = true;
  }
  
  /**
   * Update component
   * @param {number} deltaTime - Time since last frame in seconds
   * @virtual
   */
  update(deltaTime) {
    // Base implementation does nothing
  }
  
  /**
   * Render component
   * @param {CanvasRenderingContext2D} ctx - Rendering context
   * @virtual
   */
  render(ctx) {
    // Base implementation does nothing
  }
  
  /**
   * Clean up component resources
   * Called before component is destroyed
   * @virtual
   */
  cleanup() {
    // Base implementation does nothing
  }
  
  /**
   * Clone this component
   * @returns {Component} New component with same properties
   * @virtual
   */
  clone() {
    // Create new instance of same type
    const clone = new this.constructor();
    
    // Copy serializable properties
    const data = this.serialize();
    clone.deserialize(data);
    
    return clone;
  }
  
  /**
   * Create a serialized representation of this component
   * @returns {Object} Serialized component data
   * @virtual
   */
  serialize() {
    return {
      id: this.id,
      type: this.type,
      enabled: this.enabled
    };
  }
  
  /**
   * Restore component state from serialized data
   * @param {Object} data - Serialized component data
   * @virtual
   */
  deserialize(data) {
    this.id = data.id;
    this.type = data.type;
    this.enabled = data.enabled;
  }
  
  // Static Component Registry
  
  /**
   * Map of component types to component classes
   * @type {Map<string, Function>}
   * @private
   */
  static _typeRegistry = new Map();
  
  /**
   * Register a component type
   * @param {string} typeName - Component type name
   * @param {Function} componentClass - Component class
   * @returns {Function} The component class
   */
  static register(typeName, componentClass) {
    return Component._registerType(typeName, componentClass);
  }
  
  /**
   * Get a component class by type name
   * @param {string} typeName - Component type name
   * @returns {Function|null} Component class or null if not found
   */
  static getComponentType(typeName) {
    return Component._typeRegistry.get(typeName) || null;
  }
  
  /**
   * Check if a component type is registered
   * @param {string} typeName - Component type name
   * @returns {boolean} True if type is registered
   */
  static isRegisteredType(typeName) {
    return Component._typeRegistry.has(typeName);
  }
  
  /**
   * Get all registered component types
   * @returns {Array<string>} Array of component type names
   */
  static getRegisteredTypes() {
    return Array.from(Component._typeRegistry.keys());
  }
  
  /**
   * Get all registered component classes
   * @returns {Array<Function>} Array of component classes
   */
  static getRegisteredClasses() {
    return Array.from(Component._typeRegistry.values());
  }
  
  /**
   * Register a component type internally
   * @param {string} typeName - Component type name
   * @param {Function} componentClass - Component class
   * @returns {Function} The component class
   * @private
   */
  static _registerType(typeName, componentClass) {
    // Store in registry
    Component._typeRegistry.set(typeName, componentClass);
    
    // Add convenience property for accessing type name
    if (!componentClass.hasOwnProperty('TYPE')) {
      Object.defineProperty(componentClass, 'TYPE', {
        value: typeName,
        writable: false,
        enumerable: true,
        configurable: false
      });
    }
    
    return componentClass;
  }
}

/**
 * Component Registry manages component types and instantiation
 */
export class ComponentRegistry {
  constructor() {
    // Just proxy to Component static methods
  }
  
  /**
   * Register a component type
   * @param {string} typeName - Component type name
   * @param {Function} componentClass - Component class
   * @returns {Function} The component class
   */
  registerType(typeName, componentClass) {
    return Component.register(typeName, componentClass);
  }
  
  /**
   * Get a component class by type name
   * @param {string} typeName - Component type name
   * @returns {Function|null} Component class or null if not found
   */
  getComponentType(typeName) {
    return Component.getComponentType(typeName);
  }
  
  /**
   * Create a component by type name
   * @param {string} typeName - Component type name
   * @param {Object} [options] - Component initialization options
   * @returns {Component|null} New component or null if type not found
   */
  createComponent(typeName, options = {}) {
    const ComponentClass = this.getComponentType(typeName);
    
    if (!ComponentClass) {
      console.warn(`Unknown component type: ${typeName}`);
      return null;
    }
    
    return new ComponentClass(options);
  }
  
  /**
   * Get all registered component types
   * @returns {Array<string>} Array of component type names
   */
  getRegisteredTypes() {
    return Component.getRegisteredTypes();
  }
  
  /**
   * Get all registered component classes
   * @returns {Array<Function>} Array of component classes
   */
  getRegisteredClasses() {
    return Component.getRegisteredClasses();
  }
}

// Create and export global component registry
export const componentRegistry = new ComponentRegistry();