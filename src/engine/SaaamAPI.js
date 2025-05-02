// src/engine/SaaamAPI.js

import { World } from '../core/World';
import { Entity } from '../core/Entity';
import { ScriptComponent } from '../ecs/components/ScriptComponent';
import { TransformComponent } from '../ecs/components/TransformComponent';
import { RenderableComponent } from '../ecs/components/RenderableComponent';
import { PhysicsComponent } from '../ecs/components/PhysicsComponent';
import { AudioComponent } from '../ecs/components/AudioComponent';
import { Vector2, Vector3 } from '../utils/Vector';
import { SaaamInterpreter, createInterpreter } from './Interpreter';
import { AudioSystem } from '../ecs/systems/AudioSystem';
import { PhysicsSystem } from '../ecs/systems/PhysicsSystem';
import { RenderSystem } from '../ecs/systems/RenderSystem';
import { ScriptSystem } from '../ecs/systems/ScriptSystem';
import { EventEmitter } from '../utils/EventEmitter';

/**
 * SaaamAPI provides the interface between the SAAAM engine and script code
 */
export class SaaamAPI {
  /**
   * Create the SAAAM API
   * @param {World} world - World instance
   */
  constructor(world) {
    this.world = world;
    this.events = new EventEmitter();
    this.interpreters = new Map();
    
    // Function registry for script access
    this.functions = {
      // World functions
      createEntity: this.createEntity.bind(this),
      destroyEntity: this.destroyEntity.bind(this),
      findEntity: this.findEntity.bind(this),
      findEntitiesByTag: this.findEntitiesByTag.bind(this),
      
      // Vector creation
      vec2: (x, y) => new Vector2(x, y),
      vec3: (x, y, z) => new Vector3(x, y, z),
      
      // Input functions
      keyboardCheck: this.keyboardCheck.bind(this),
      keyboardCheckPressed: this.keyboardCheckPressed.bind(this),
      mouseCheck: this.mouseCheck.bind(this),
      mousePosition: this.mousePosition.bind(this),
      
      // Physics functions
      checkCollision: this.checkCollision.bind(this),
      raycast: this.raycast.bind(this),
      
      // Audio functions
      playSound: this.playSound.bind(this),
      stopSound: this.stopSound.bind(this),
      playMusic: this.playMusic.bind(this),
      stopMusic: this.stopMusic.bind(this),
      
      // Render functions
      drawSprite: this.drawSprite.bind(this),
      drawText: this.drawText.bind(this),
      drawRectangle: this.drawRectangle.bind(this),
      drawCircle: this.drawCircle.bind(this),
      drawLine: this.drawLine.bind(this),
      
      // Coroutine functions
      startCoroutine: this.startCoroutine.bind(this),
      stopCoroutine: this.stopCoroutine.bind(this),
      waitForSeconds: this.waitForSeconds.bind(this),
      waitForFrames: this.waitForFrames.bind(this),
      waitUntil: this.waitUntil.bind(this),
      
      // Time functions
      getTime: this.getTime.bind(this),
      getDeltaTime: this.getDeltaTime.bind(this),
      
      // Debug functions
      log: console.log,
      warn: console.warn,
      error: console.error,
      
      // Utility functions
      random: Math.random,
      randomRange: this.randomRange.bind(this),
      randomInt: this.randomInt.bind(this),
      choose: this.choose.bind(this),
      
      // Math constants and functions
      PI: Math.PI,
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      abs: Math.abs,
      floor: Math.floor,
      ceil: Math.ceil,
      round: Math.round,
      min: Math.min,
      max: Math.max,
      
      // Event functions
      on: this.on.bind(this),
      off: this.off.bind(this),
      emit: this.emit.bind(this)
    };
    
    // Register script system listeners
    this._registerSystemListeners();
  }
  
  /**
   * Initialize the API with required systems
   */
  initialize() {
    // Find required systems
    this.scriptSystem = this.world.systems.get('ScriptSystem');
    this.physicsSystem = this.world.systems.get('PhysicsSystem');
    this.audioSystem = this.world.systems.get('AudioSystem');
    this.renderSystem = this.world.systems.get('RenderSystem');
    this.inputSystem = this.world.systems.get('InputSystem');
    
    // Validate required systems
    if (!this.scriptSystem) {
      console.warn('[SaaamAPI] ScriptSystem not found in world');
    }
    
    if (!this.physicsSystem) {
      console.warn('[SaaamAPI] PhysicsSystem not found in world');
    }
    
    if (!this.audioSystem) {
      console.warn('[SaaamAPI] AudioSystem not found in world');
    }
    
    if (!this.renderSystem) {
      console.warn('[SaaamAPI] RenderSystem not found in world');
    }
    
    if (!this.inputSystem) {
      console.warn('[SaaamAPI] InputSystem not found in world');
    }
    
    // Register with world events
    this.world.events.on('entity.created', this._onEntityCreated.bind(this));
    this.world.events.on('entity.destroyed', this._onEntityDestroyed.bind(this));
    this.world.events.on('component.added', this._onComponentAdded.bind(this));
    this.world.events.on('component.removed', this._onComponentRemoved.bind(this));
    
    return this;
  }
  
  /**
   * Create an entity in the world
   * @param {Object} [options] - Entity creation options
   * @param {string} [options.name='Entity'] - Entity name
   * @param {string} [options.tag='default'] - Entity tag
   * @param {Vector2|{x: number, y: number}} [options.position] - Initial position
   * @param {string} [options.sprite] - Initial sprite
   * @param {boolean} [options.physics=false] - Whether to add physics component
   * @returns {Entity} Created entity
   */
  createEntity(options = {}) {
    // Create entity in world
    const entity = this.world.createEntity(options.name || 'Entity', {
      tag: options.tag || 'default'
    });
    
    // Add transform component
    const transform = entity.addComponent(new TransformComponent());
    
    // Set position if provided
    if (options.position) {
      transform.position.x = options.position.x || 0;
      transform.position.y = options.position.y || 0;
    }
    
    // Add renderable component if sprite is provided
    if (options.sprite) {
      const renderable = entity.addComponent(new RenderableComponent());
      renderable.sprite = options.sprite;
    }
    
    // Add physics component if requested
    if (options.physics) {
      entity.addComponent(new PhysicsComponent());
    }
    
    return entity;
  }
  
  /**
   * Destroy an entity in the world
   * @param {Entity|string} entityOrId - Entity or entity ID to destroy
   * @returns {boolean} True if entity was destroyed
   */
  destroyEntity(entityOrId) {
    return this.world.removeEntity(entityOrId);
  }
  
  /**
   * Find an entity by name or ID
   * @param {string} nameOrId - Entity name or ID
   * @returns {Entity|null} Found entity or null
   */
  findEntity(nameOrId) {
    // Check if it's an ID
    if (this.world.entities.has(nameOrId)) {
      return this.world.entities.get(nameOrId);
    }
    
    // Otherwise search by name
    return this.world.findEntityByName(nameOrId);
  }
  
  /**
   * Find all entities with a specific tag
   * @param {string} tag - Entity tag to search for
   * @returns {Array<Entity>} Array of matching entities
   */
  findEntitiesByTag(tag) {
    return this.world._entityCache.filter(entity => entity.tag === tag);
  }
  
  /**
   * Check if a key is currently pressed
   * @param {number|string} key - Key code or name
   * @returns {boolean} True if key is pressed
   */
  keyboardCheck(key) {
    if (!this.inputSystem) return false;
    return this.inputSystem.isKeyDown(key);
  }
  
  /**
   * Check if a key was just pressed this frame
   * @param {number|string} key - Key code or name
   * @returns {boolean} True if key was just pressed
   */
  keyboardCheckPressed(key) {
    if (!this.inputSystem) return false;
    return this.inputSystem.isKeyPressed(key);
  }
  
  /**
   * Check if a mouse button is currently pressed
   * @param {number} button - Button index (0=left, 1=middle, 2=right)
   * @returns {boolean} True if button is pressed
   */
  mouseCheck(button) {
    if (!this.inputSystem) return false;
    return this.inputSystem.isMouseButtonDown(button);
  }
  
  /**
   * Get current mouse position
   * @returns {Vector2} Mouse position
   */
  mousePosition() {
    if (!this.inputSystem) return new Vector2(0, 0);
    return this.inputSystem.getMousePosition();
  }
  
  /**
   * Check for collision at a position
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} [tag] - Optional tag to filter by
   * @returns {Entity|null} Colliding entity or null
   */
  checkCollision(x, y, tag) {
    if (!this.physicsSystem) return null;
    
    // Use physics system to check for collision
    return this.physicsSystem.checkPointCollision(x, y, tag);
  }
  
  /**
   * Perform a raycast
   * @param {number} startX - Start X position
   * @param {number} startY - Start Y position
   * @param {number} endX - End X position
   * @param {number} endY - End Y position
   * @param {string} [tag] - Optional tag to filter by
   * @returns {Object|null} Hit information or null if no hit
   */
  raycast(startX, startY, endX, endY, tag) {
    if (!this.physicsSystem) return null;
    
    // Use physics system to perform raycast
    return this.physicsSystem.raycast(startX, startY, endX, endY, tag);
  }
  
  /**
   * Play a sound effect
   * @param {string} sound - Sound name
   * @param {Object} [options] - Sound options
   * @param {number} [options.volume=1] - Volume (0-1)
   * @param {number} [options.pitch=1] - Pitch multiplier
   * @param {boolean} [options.loop=false] - Whether to loop the sound
   * @returns {string} Sound instance ID
   */
  playSound(sound, options = {}) {
    if (!this.audioSystem) return null;
    
    // Use audio system to play sound
    return this.audioSystem.playSound(sound, options);
  }
  
  /**
   * Stop a sound effect
   * @param {string} soundId - Sound instance ID
   * @returns {boolean} True if sound was stopped
   */
  stopSound(soundId) {
    if (!this.audioSystem) return false;
    
    // Use audio system to stop sound
    return this.audioSystem.stopSound(soundId);
  }
  
  /**
   * Play background music
   * @param {string} music - Music name
   * @param {Object} [options] - Music options
   * @param {number} [options.volume=1] - Volume (0-1)
   * @param {boolean} [options.loop=true] - Whether to loop the music
   * @param {number} [options.fadeIn=0] - Fade-in time in seconds
   * @returns {string} Music instance ID
   */
  playMusic(music, options = {}) {
    if (!this.audioSystem) return null;
    
    // Use audio system to play music
    return this.audioSystem.playMusic(music, options);
  }
  
  /**
   * Stop background music
   * @param {number} [fadeOut=0] - Fade-out time in seconds
   * @returns {boolean} True if music was stopped
   */
  stopMusic(fadeOut = 0) {
    if (!this.audioSystem) return false;
    
    // Use audio system to stop music
    return this.audioSystem.stopMusic(fadeOut);
  }
  
  /**
   * Draw a sprite
   * @param {string} sprite - Sprite name
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Object} [options] - Drawing options
   */
  drawSprite(sprite, x, y, options = {}) {
    if (!this.renderSystem) return;
    
    // Use render system to draw sprite
    this.renderSystem.drawSprite(sprite, x, y, options);
  }
  
  /**
   * Draw text
   * @param {string} text - Text to draw
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Object} [options] - Drawing options
   * @param {string} [options.color='#FFFFFF'] - Text color
   * @param {string} [options.font='16px Arial'] - Font
   * @param {string} [options.align='left'] - Text alignment
   */
  drawText(text, x, y, options = {}) {
    if (!this.renderSystem) return;
    
    // Use render system to draw text
    this.renderSystem.drawText(text, x, y, options);
  }
  
  /**
   * Draw a rectangle
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Width
   * @param {number} height - Height
   * @param {string} [color='#FFFFFF'] - Fill color
   * @param {boolean} [fill=true] - Whether to fill the rectangle
   */
  drawRectangle(x, y, width, height, color = '#FFFFFF', fill = true) {
    if (!this.renderSystem) return;
    
    // Use render system to draw rectangle
    this.renderSystem.drawRectangle(x, y, width, height, color, fill);
  }
  
  /**
   * Draw a circle
   * @param {number} x - Center X position
   * @param {number} y - Center Y position
   * @param {number} radius - Radius
   * @param {string} [color='#FFFFFF'] - Fill color
   * @param {boolean} [fill=true] - Whether to fill the circle
   */
  drawCircle(x, y, radius, color = '#FFFFFF', fill = true) {
    if (!this.renderSystem) return;
    
    // Use render system to draw circle
    this.renderSystem.drawCircle(x, y, radius, color, fill);
  }
  
  /**
   * Draw a line
   * @param {number} x1 - Start X position
   * @param {number} y1 - Start Y position
   * @param {number} x2 - End X position
   * @param {number} y2 - End Y position
   * @param {string} [color='#FFFFFF'] - Line color
   * @param {number} [width=1] - Line width
   */
  drawLine(x1, y1, x2, y2, color = '#FFFFFF', width = 1) {
    if (!this.renderSystem) return;
    
    // Use render system to draw line
    this.renderSystem.drawLine(x1, y1, x2, y2, color, width);
  }
  
  /**
   * Start a coroutine
   * @param {Generator} generator - Generator function to run as coroutine
   * @returns {number} Coroutine ID
   */
  startCoroutine(generator) {
    if (!this.scriptSystem) return -1;
    
    // Use script system to start coroutine
    return this.scriptSystem.startCoroutine(generator);
  }
  
  /**
   * Stop a coroutine
   * @param {number} id - Coroutine ID
   * @returns {boolean} True if coroutine was stopped
   */
  stopCoroutine(id) {
    if (!this.scriptSystem) return false;
    
    // Use script system to stop coroutine
    return this.scriptSystem.stopCoroutine(id);
  }
  
  /**
   * Create a wait condition for seconds
   * @param {number} seconds - Seconds to wait
   * @returns {Object} Wait condition
   */
  waitForSeconds(seconds) {
    if (!this.scriptSystem) return null;
    
    // Use script system to create wait condition
    return this.scriptSystem.waitForSeconds(seconds);
  }
  
  /**
   * Create a wait condition for frames
   * @param {number} frames - Frames to wait
   * @returns {Object} Wait condition
   */
  waitForFrames(frames) {
    if (!this.scriptSystem) return null;
    
    // Use script system to create wait condition
    return this.scriptSystem.waitForFrames(frames);
  }
  
  /**
   * Create a wait condition for a predicate function
   * @param {Function} predicate - Function that returns true when waiting should end
   * @returns {Object} Wait condition
   */
  waitUntil(predicate) {
    if (!this.scriptSystem) return null;
    
    // Use script system to create wait condition
    return this.scriptSystem.waitUntil(predicate);
  }
  
  /**
   * Get current game time in seconds
   * @returns {number} Game time
   */
  getTime() {
    return this.world.time || 0;
  }
  
  /**
   * Get time since last frame in seconds
   * @returns {number} Delta time
   */
  getDeltaTime() {
    return this.world.deltaTime || 0;
  }
  
  /**
   * Get random number in range
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  randomRange(min, max) {
    return min + Math.random() * (max - min);
  }
  
  /**
   * Get random integer in range
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random integer
   */
  randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  /**
   * Choose random element from array
   * @param {Array} array - Array to choose from
   * @returns {*} Random element
   */
  choose(array) {
    if (!array || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
  }
  
  /**
   * Register an event listener
   * @param {string} eventName - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(eventName, callback) {
    return this.events.on(eventName, callback);
  }
  
  /**
   * Remove an event listener
   * @param {string} eventName - Event name
   * @param {Function} callback - Callback function
   * @returns {boolean} True if listener was removed
   */
  off(eventName, callback) {
    return this.events.off(eventName, callback);
  }
  
  /**
   * Emit an event
   * @param {string} eventName - Event name
   * @param {*} data - Event data
   * @returns {boolean} True if event had listeners
   */
  emit(eventName, data) {
    return this.events.emit(eventName, data);
  }
  
  /**
   * Load a script
   * @param {string} scriptPath - Path to script file
   * @returns {Promise<Object>} Loaded script
   */
  async loadScript(scriptPath) {
    try {
      // Fetch script content
      const response = await fetch(scriptPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load script: ${response.statusText}`);
      }
      
      // Get script content
      const content = await response.text();
      
      // Create interpreter
      const interpreter = createInterpreter();
      
      // Compile script
      const result = await interpreter.compile(content);
      
      if (!result.success) {
        throw new Error(`Failed to compile script: ${result.error}`);
      }
      
      // Add API functions to interpreter
      for (const [name, func] of Object.entries(this.functions)) {
        interpreter.setGlobal(name, func);
      }
      
      // Store interpreter
      this.interpreters.set(scriptPath, interpreter);
      
      return {
        path: scriptPath,
        content: content,
        interpreter: interpreter
      };
    } catch (error) {
      console.error('[SaaamAPI] Error loading script:', error);
      throw error;
    }
  }
  
  /**
   * Register system event listeners
   * @private
   */
  _registerSystemListeners() {
    // Listen for collision events from physics system
    this.events.on('physics.collision', data => {
      this.world.events.emit('physics.collision', data);
    });
    
    // Listen for trigger events from physics system
    this.events.on('physics.trigger', data => {
      this.world.events.emit('physics.trigger', data);
    });
    
    // Listen for audio events
    this.events.on('audio.play', data => {
      this.world.events.emit('audio.play', data);
    });
    
    // Listen for script events
    this.events.on('script.error', data => {
      this.world.events.emit('script.error', data);
    });
  }
  
  /**
   * Handle entity created event
   * @param {Object} event - Entity created event
   * @private
   */
  _onEntityCreated(event) {
    // Nothing to do here yet
  }
  
  /**
   * Handle entity destroyed event
   * @param {Object} event - Entity destroyed event
   * @private
   */
  _onEntityDestroyed(event) {
    // Nothing to do here yet
  }
  
  /**
   * Handle component added event
   * @param {Object} event - Component added event
   * @private
   */
  _onComponentAdded(event) {
    // If script component added, initialize it
    if (event.component instanceof ScriptComponent) {
      this._initializeScriptComponent(event.component);
    }
  }
  
  /**
   * Handle component removed event
   * @param {Object} event - Component removed event
   * @private
   */
  _onComponentRemoved(event) {
    // Nothing to do here yet
  }
  
  /**
   * Initialize a script component
   * @param {ScriptComponent} component - Script component
   * @private
   */
  _initializeScriptComponent(component) {
    // Skip if already initialized
    if (component.isCompiled()) return;
    
    // Compile script
    component.compile();
  }
}

/**
 * Create SAAAM API for a world
 * @param {World} world - World instance
 * @returns {SaaamAPI} SAAAM API instance
 */
export function createSaaamAPI(world) {
  return new SaaamAPI(world).initialize();
}

/**
 * Initialize global SAAAM API interface
 * @param {World} world - World instance
 */
export function initializeGlobalSaaamAPI(world) {
  // Create API instance
  const api = createSaaamAPI(world);
  
  // Create global SAAAM object
  window.SAAAM = {
    // API functions
    ...api.functions,
    
    // Additional properties
    api: api,
    world: world,
    version: '1.0.0',
    
    // Constants
    constants: {
      ...api.constants
    }
  };
  
  return window.SAAAM;
}