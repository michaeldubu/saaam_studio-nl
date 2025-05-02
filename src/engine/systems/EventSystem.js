// /src/engine/systems/EventSystem.js

/**
 * EventSystem
 * Handles event registration, emission, and subscription throughout the SAAAM engine
 */
export class EventSystem {
  constructor() {
    // Event listeners map
    this.listeners = new Map();
    
    // Event queue for deferred processing
    this.eventQueue = [];
    
    // Debug mode
    this.debugEvents = false;
  }
  
  /**
   * Register a listener for an event
   * @param {string} eventType - Type of event to listen for
   * @param {Function} callback - Callback function to execute
   * @param {Object} options - Additional options
   * @param {boolean} options.once - If true, listener is removed after first execution
   * @param {number} options.priority - Priority level (higher executes first)
   * @returns {Object} - Listener reference for removal
   */
  on(eventType, callback, options = {}) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    
    const listener = {
      callback,
      once: options.once || false,
      priority: options.priority || 0
    };
    
    this.listeners.get(eventType).push(listener);
    
    // Sort by priority (higher first)
    this.listeners.get(eventType).sort((a, b) => b.priority - a.priority);
    
    // Return reference for removal
    return { eventType, listener };
  }
  
  /**
   * Register a one-time listener
   * @param {string} eventType - Type of event to listen for
   * @param {Function} callback - Callback function to execute
   * @param {Object} options - Additional options
   * @returns {Object} - Listener reference for removal
   */
  once(eventType, callback, options = {}) {
    return this.on(eventType, callback, { ...options, once: true });
  }
  
  /**
   * Remove a listener
   * @param {string} eventType - Type of event
   * @param {Function} callback - Callback function to remove
   * @returns {boolean} - True if listener was removed
   */
  off(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      return false;
    }
    
    const listeners = this.listeners.get(eventType);
    const initialLength = listeners.length;
    
    // Filter out matching callbacks
    const filteredListeners = listeners.filter(listener => listener.callback !== callback);
    this.listeners.set(eventType, filteredListeners);
    
    return filteredListeners.length !== initialLength;
  }
  
  /**
   * Remove a listener using reference
   * @param {Object} reference - Reference returned from on() or once()
   * @returns {boolean} - True if listener was removed
   */
  offByReference(reference) {
    if (!reference || !reference.eventType || !reference.listener) {
      return false;
    }
    
    if (!this.listeners.has(reference.eventType)) {
      return false;
    }
    
    const listeners = this.listeners.get(reference.eventType);
    const initialLength = listeners.length;
    
    // Filter out the specific listener
    const filteredListeners = listeners.filter(listener => listener !== reference.listener);
    this.listeners.set(reference.eventType, filteredListeners);
    
    return filteredListeners.length !== initialLength;
  }
  
  /**
   * Emit an event immediately
   * @param {string} eventType - Type of event to emit
   * @param {Object} data - Event data to pass to listeners
   * @returns {boolean} - True if event had listeners
   */
  emit(eventType, data = {}) {
    if (this.debugEvents) {
      console.debug(`[EventSystem] Emitting event: ${eventType}`, data);
    }
    
    if (!this.listeners.has(eventType)) {
      return false;
    }
    
    const timestamp = Date.now();
    const event = {
      type: eventType,
      data,
      timestamp
    };
    
    const listeners = this.listeners.get(eventType);
    const oneTimeListeners = [];
    
    // Execute all listeners
    for (const listener of listeners) {
      try {
        listener.callback(event);
        
        // Track one-time listeners for removal
        if (listener.once) {
          oneTimeListeners.push(listener);
        }
      } catch (err) {
        console.error(`[EventSystem] Error in listener for event ${eventType}:`, err);
      }
    }
    
    // Remove one-time listeners
    if (oneTimeListeners.length > 0) {
      const remainingListeners = listeners.filter(listener => !oneTimeListeners.includes(listener));
      this.listeners.set(eventType, remainingListeners);
    }
    
    return true;
  }
  
  /**
   * Queue an event for deferred processing
   * @param {string} eventType - Type of event to emit
   * @param {Object} data - Event data to pass to listeners
   */
  queueEvent(eventType, data = {}) {
    const timestamp = Date.now();
    const event = {
      type: eventType,
      data,
      timestamp
    };
    
    this.eventQueue.push(event);
    
    if (this.debugEvents) {
      console.debug(`[EventSystem] Queued event: ${eventType}`, data);
    }
  }
  
  /**
   * Process all queued events
   */
  processEvents() {
    if (this.eventQueue.length === 0) {
      return;
    }
    
    // Process a copy of the queue to allow new events to be added during processing
    const eventsToProcess = [...this.eventQueue];
    this.eventQueue = [];
    
    for (const event of eventsToProcess) {
      this.emit(event.type, event.data);
    }
  }
  
  /**
   * Clear all listeners
   */
  clearListeners() {
    this.listeners.clear();
  }
  
  /**
   * Clear event queue
   */
  clearEventQueue() {
    this.eventQueue = [];
  }
  
  /**
   * Enable or disable event debugging
   * @param {boolean} enabled - Whether debug mode is enabled
   */
  setDebugMode(enabled) {
    this.debugEvents = enabled;
  }
  
  /**
   * Get listener count for an event type
   * @param {string} eventType - Event type to check
   * @returns {number} - Number of listeners
   */
  getListenerCount(eventType) {
    if (!this.listeners.has(eventType)) {
      return 0;
    }
    
    return this.listeners.get(eventType).length;
  }
}