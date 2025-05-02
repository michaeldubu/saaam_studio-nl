// src/utils/EventEmitter.js

/**
 * EventEmitter provides a publish/subscribe pattern for event-based communication
 * between different parts of the engine without creating direct dependencies.
 */
export class EventEmitter {
  constructor() {
    // Map of event names to arrays of listeners
    this._events = new Map();
    
    // Map of listeners to their wrapped versions (for removal)
    this._listenerMap = new WeakMap();
    
    // Count of listeners for debugging
    this._listenerCount = 0;
  }
  
  /**
   * Register an event listener
   * @param {string} eventName - Name of the event to listen for
   * @param {Function} listener - Function to call when event is emitted
   * @param {Object} [options] - Additional options
   * @param {boolean} [options.once=false] - Whether listener should only be called once
   * @param {Object} [options.context=null] - 'this' context for the listener
   * @returns {Function} Listener removal function
   */
  on(eventName, listener, options = {}) {
    // Validate inputs
    if (typeof eventName !== 'string') {
      throw new TypeError('Event name must be a string');
    }
    
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    
    // Get or create listener array for this event
    if (!this._events.has(eventName)) {
      this._events.set(eventName, []);
    }
    
    // Create wrapped listener with options
    const wrappedListener = {
      callback: listener,
      once: !!options.once,
      context: options.context || null
    };
    
    // Store reference for later removal
    this._listenerMap.set(listener, wrappedListener);
    
    // Add to listeners
    const listeners = this._events.get(eventName);
    listeners.push(wrappedListener);
    
    // Update count
    this._listenerCount++;
    
    // Return function to remove this listener
    return () => this.off(eventName, listener);
  }
  
  /**
   * Register a one-time event listener
   * @param {string} eventName - Name of the event to listen for
   * @param {Function} listener - Function to call when event is emitted
   * @param {Object} [options] - Additional options
   * @param {Object} [options.context=null] - 'this' context for the listener
   * @returns {Function} Listener removal function
   */
  once(eventName, listener, options = {}) {
    return this.on(eventName, listener, { ...options, once: true });
  }
  
  /**
   * Remove an event listener
   * @param {string} eventName - Name of the event
   * @param {Function} listener - Listener to remove
   * @returns {boolean} True if listener was removed
   */
  off(eventName, listener) {
    // Validate inputs
    if (typeof eventName !== 'string') {
      throw new TypeError('Event name must be a string');
    }
    
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    
    // Check if event exists
    if (!this._events.has(eventName)) {
      return false;
    }
    
    // Get the wrapped listener
    const wrappedListener = this._listenerMap.get(listener);
    if (!wrappedListener) {
      return false;
    }
    
    // Find and remove listener
    const listeners = this._events.get(eventName);
    const index = listeners.indexOf(wrappedListener);
    
    if (index !== -1) {
      listeners.splice(index, 1);
      this._listenerCount--;
      
      // If this was the last listener, remove the event
      if (listeners.length === 0) {
        this._events.delete(eventName);
      }
      
      return true;
    }
    
    return false;
  }
  
  /**
   * Remove all listeners for an event, or all events
   * @param {string} [eventName] - Name of the event, or undefined for all events
   * @returns {number} Number of listeners removed
   */
  removeAllListeners(eventName) {
    // If eventName is provided, remove all listeners for that event
    if (eventName) {
      if (!this._events.has(eventName)) {
        return 0;
      }
      
      const count = this._events.get(eventName).length;
      this._events.delete(eventName);
      this._listenerCount -= count;
      return count;
    }
    
    // Otherwise, remove all listeners for all events
    const count = this._listenerCount;
    this._events.clear();
    this._listenerCount = 0;
    return count;
  }
  
  /**
   * Emit an event, calling all listeners
   * @param {string} eventName - Name of the event to emit
   * @param {*} [data] - Data to pass to listeners
   * @returns {boolean} True if event had listeners
   */
  emit(eventName, data) {
    // Check if event has listeners
    if (!this._events.has(eventName)) {
      return false;
    }
    
    // Get listeners
    const listeners = this._events.get(eventName);
    
    // Track one-time listeners to remove
    const toRemove = [];
    
    // Call each listener
    for (const listener of listeners) {
      try {
        listener.callback.call(listener.context, data);
        
        // Track if this was a one-time listener
        if (listener.once) {
          toRemove.push(listener);
        }
      } catch (error) {
        console.error(`Error in event listener for "${eventName}":`, error);
      }
    }
    
    // Remove one-time listeners
    if (toRemove.length > 0) {
      const remaining = listeners.filter(l => !toRemove.includes(l));
      
      if (remaining.length > 0) {
        this._events.set(eventName, remaining);
      } else {
        this._events.delete(eventName);
      }
      
      this._listenerCount -= toRemove.length;
    }
    
    return true;
  }
  
  /**
   * Check if an event has listeners
   * @param {string} eventName - Name of the event
   * @returns {boolean} True if event has listeners
   */
  hasListeners(eventName) {
    return this._events.has(eventName) && this._events.get(eventName).length > 0;
  }
  
  /**
   * Get the number of listeners for an event, or all events
   * @param {string} [eventName] - Name of the event, or undefined for all events
   * @returns {number} Number of listeners
   */
  listenerCount(eventName) {
    if (eventName) {
      return this._events.has(eventName) ? this._events.get(eventName).length : 0;
    }
    
    return this._listenerCount;
  }
  
  /**
   * Get the names of all events with listeners
   * @returns {Array<string>} Array of event names
   */
  eventNames() {
    return Array.from(this._events.keys());
  }
  
  /**
   * Create a scoped event emitter that prepends a prefix to all events
   * @param {string} prefix - Prefix to add to events
   * @param {string} [separator='.'] - Separator between prefix and event name
   * @returns {Object} Scoped event emitter
   */
  scope(prefix, separator = '.') {
    if (typeof prefix !== 'string' || prefix.length === 0) {
      throw new TypeError('Prefix must be a non-empty string');
    }
    
    // Create a proxy object with scoped methods
    return {
      on: (eventName, listener, options) => 
        this.on(`${prefix}${separator}${eventName}`, listener, options),
      
      once: (eventName, listener, options) => 
        this.once(`${prefix}${separator}${eventName}`, listener, options),
      
      off: (eventName, listener) => 
        this.off(`${prefix}${separator}${eventName}`, listener),
      
      emit: (eventName, data) => 
        this.emit(`${prefix}${separator}${eventName}`, data),
      
      removeAllListeners: (eventName) => 
        eventName ? 
          this.removeAllListeners(`${prefix}${separator}${eventName}`) : 
          this._removeAllScopedListeners(prefix, separator),
      
      hasListeners: (eventName) => 
        this.hasListeners(`${prefix}${separator}${eventName}`),
      
      listenerCount: (eventName) => 
        eventName ? 
          this.listenerCount(`${prefix}${separator}${eventName}`) : 
          this._countScopedListeners(prefix, separator),
      
      eventNames: () => 
        this._getScopedEventNames(prefix, separator)
    };
  }
  
  /**
   * Remove all listeners for a scope
   * @param {string} prefix - Scope prefix
   * @param {string} separator - Separator
   * @returns {number} Number of listeners removed
   * @private
   */
  _removeAllScopedListeners(prefix, separator) {
    const fullPrefix = `${prefix}${separator}`;
    let count = 0;
    
    // Find all events with matching prefix
    for (const eventName of this._events.keys()) {
      if (eventName.startsWith(fullPrefix)) {
        count += this._events.get(eventName).length;
        this._events.delete(eventName);
      }
    }
    
    this._listenerCount -= count;
    return count;
  }
  
  /**
   * Count listeners for a scope
   * @param {string} prefix - Scope prefix
   * @param {string} separator - Separator
   * @returns {number} Number of listeners
   * @private
   */
  _countScopedListeners(prefix, separator) {
    const fullPrefix = `${prefix}${separator}`;
    let count = 0;
    
    // Find all events with matching prefix
    for (const [eventName, listeners] of this._events.entries()) {
      if (eventName.startsWith(fullPrefix)) {
        count += listeners.length;
      }
    }
    
    return count;
  }
  
  /**
   * Get event names for a scope
   * @param {string} prefix - Scope prefix
   * @param {string} separator - Separator
   * @returns {Array<string>} Array of event names without prefix
   * @private
   */
  _getScopedEventNames(prefix, separator) {
    const fullPrefix = `${prefix}${separator}`;
    const prefixLength = fullPrefix.length;
    const events = [];
    
    // Find all events with matching prefix
    for (const eventName of this._events.keys()) {
      if (eventName.startsWith(fullPrefix)) {
        events.push(eventName.substring(prefixLength));
      }
    }
    
    return events;
  }
}

/**
 * Create a new event emitter
 * @returns {EventEmitter} New event emitter instance
 */
export function createEventEmitter() {
  return new EventEmitter();
}