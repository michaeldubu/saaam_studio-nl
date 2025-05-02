// src/ecs/systems/ScriptSystem.js

import { System } from '../../core/System';
import { ScriptComponent } from '../components/ScriptComponent';
import { TransformComponent } from '../components/TransformComponent';
import { RenderableComponent } from '../components/RenderableComponent';
import { PhysicsComponent } from '../components/PhysicsComponent';
import { AudioComponent } from '../components/AudioComponent';
import { InputSystem } from '../../systems/Input';
import { Vector2, Vector3 } from '../../utils/Vector';

/**
 * ScriptSystem runs SAAAM scripts attached to entities and provides
 * the bridge between the scripting language and the ECS architecture
 */
export class ScriptSystem extends System {
  constructor() {
    super('ScriptSystem');
    
    // Define required components for entities
    this.requiredComponents = [ScriptComponent];
    
    // Script lifecycle stage tracking
    this._initializedScripts = new Set();
    
    // Input state reference for scripts
    this._inputState = null;
    
    // Script API - bound methods that will be available to scripts
    this._scriptAPI = this._createScriptAPI();
  }
  
  /**
   * Initialize the script system
   */
  initialize() {
    // Get reference to input system
    const inputSystem = this.world.systems.get('InputSystem');
    if (inputSystem) {
      this._inputState = inputSystem.state;
    } else {
      console.warn('[ScriptSystem] InputSystem not found, input functions will not work in scripts');
    }
    
    // Register for entity component changes to detect new scripts
    this.world.events.on('entity.componentsChanged', this._onEntityComponentsChanged.bind(this));
  }
  
  /**
   * Update all scripts
   * @param {number} deltaTime - Time since last frame in seconds
   */
  update(deltaTime) {
    // Initialize any new scripts
    this._initializeNewScripts();
    
    // Run step callbacks for all script components
    for (const entity of this.entities) {
      const scriptComponent = entity.getComponent(ScriptComponent);
      
      // Skip if script is disabled
      if (!scriptComponent.enabled) continue;
      
      // Create context for script execution
      const scriptContext = this._createScriptContext(entity);
      
      try {
        // Call step function if it exists
        if (scriptComponent.hasCallback('step')) {
          scriptComponent.runCallback('step', [deltaTime], scriptContext);
        }
      } catch (error) {
        console.error(`[ScriptSystem] Error in step() of script on entity ${entity.name}:`, error);
      }
    }
  }
  
  /**
   * Render script-based custom drawing
   * @param {CanvasRenderingContext2D} ctx - Rendering context
   */
  render(ctx) {
    // Run draw callbacks for all script components
    for (const entity of this.entities) {
      const scriptComponent = entity.getComponent(ScriptComponent);
      
      // Skip if script is disabled
      if (!scriptComponent.enabled) continue;
      
      // Skip if no draw callback defined
      if (!scriptComponent.hasCallback('draw')) continue;
      
      // Create context for script execution
      const scriptContext = this._createScriptContext(entity);
      
      try {
        // Save context state before script drawing
        ctx.save();
        
        // Call draw function
        scriptComponent.runCallback('draw', [ctx], scriptContext);
        
        // Restore context state after script drawing
        ctx.restore();
      } catch (error) {
        console.error(`[ScriptSystem] Error in draw() of script on entity ${entity.name}:`, error);
      }
    }
  }
  
  /**
   * Clean up the system when it's removed
   */
  cleanup() {
    // Unregister event listeners
    this.world.events.off('entity.componentsChanged', this._onEntityComponentsChanged);
    
    // Clear initialization tracking
    this._initializedScripts.clear();
  }
  
  /**
   * Initialize any newly added scripts
   * @private
   */
  _initializeNewScripts() {
    // Check all entities with scripts
    for (const entity of this.entities) {
      const scriptComponent = entity.getComponent(ScriptComponent);
      
      // Skip if already initialized
      if (this._initializedScripts.has(scriptComponent.id)) continue;
      
      // Mark as initialized
      this._initializedScripts.add(scriptComponent.id);
      
      // Skip if disabled
      if (!scriptComponent.enabled) continue;
      
      // Create context for script execution
      const scriptContext = this._createScriptContext(entity);
      
      try {
        // Call create function if it exists
        if (scriptComponent.hasCallback('create')) {
          scriptComponent.runCallback('create', [], scriptContext);
        }
      } catch (error) {
        console.error(`[ScriptSystem] Error in create() of script on entity ${entity.name}:`, error);
      }
    }
  }
  
  /**
   * Handle entity component changes
   * @param {Object} event - Component change event
   * @private
   */
  _onEntityComponentsChanged(event) {
    const entity = event.entity;
    const scriptComponent = entity.getComponent(ScriptComponent);
    
    // If script component was removed, remove from initialized set
    if (!scriptComponent && this.entities.includes(entity)) {
      // Find and remove any script components for this entity
      for (const id of this._initializedScripts) {
        if (id.startsWith(entity.id)) {
          this._initializedScripts.delete(id);
        }
      }
    }
  }
  
  /**
   * Create the script API object with all available functions
   * @returns {Object} Script API
   * @private
   */
  _createScriptAPI() {
    return {
      // Vector creation
      vec2: (x, y) => new Vector2(x, y),
      vec3: (x, y, z) => new Vector3(x, y, z),
      
      // Input functions
      keyboard_check: (keyCode) => {
        if (!this._inputState) return false;
        return this._inputState.isKeyDown(keyCode);
      },
      keyboard_check_pressed: (keyCode) => {
        if (!this._inputState) return false;
        return this._inputState.isKeyPressed(keyCode);
      },
      keyboard_check_released: (keyCode) => {
        if (!this._inputState) return false;
        return this._inputState.isKeyReleased(keyCode);
      },
      
      // Collision functions
      check_collision: (x, y, tag) => {
        // Implementation will use physics system to check
        return this._checkCollision(x, y, tag);
      },
      
      // Entity functions
      find_nearest: (tag) => {
        return this._findNearest(tag);
      },
      
      // Audio functions
      play_sound: (sound, volume = 1.0) => {
        this.world.events.emit('audio.play', { sound, volume });
      },
      
      // Effect functions
      create_effect: (effectType, x, y) => {
        this.world.events.emit('effect.create', { type: effectType, x, y });
      },
      
      // Game flow functions
      restart_level: () => {
        this.world.events.emit('level.restart');
      },
      
      // Drawing functions - these will be used in draw() callbacks
      draw_rectangle: (x, y, width, height, color) => {
        const ctx = this._renderContext;
        if (!ctx) return;
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
      },
      
      draw_circle: (x, y, radius, color) => {
        const ctx = this._renderContext;
        if (!ctx) return;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      },
      
      draw_text: (text, x, y, color, font = '16px Arial') => {
        const ctx = this._renderContext;
        if (!ctx) return;
        
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.fillText(text, x, y);
      },
      
      draw_sprite: (sprite, x, y) => {
        const ctx = this._renderContext;
        if (!ctx) return;
        
        // Placeholder implementation using ctx.drawImage
        // Will be implemented fully when sprite system is in place
        console.log('Drawing sprite', sprite, 'at', x, y);
      },
      
      // Timer functions
      wait: (seconds, callback) => {
        // Create a promise that resolves after the specified time
        return new Promise(resolve => {
          setTimeout(() => {
            if (callback) callback();
            resolve();
          }, seconds * 1000);
        });
      }
    };
  }
  
  /**
   * Create context object for script execution
   * @param {Entity} entity - Entity the script is attached to
   * @returns {Object} Script context with component properties
   * @private
   */
  _createScriptContext(entity) {
    // Start with the script API
    const context = { ...this._scriptAPI };
    
    // Add entity reference
    context.entity = entity;
    context.gameObject = entity; // Alias for compatibility
    
    // Add transform properties if available
    const transform = entity.getComponent(TransformComponent);
    if (transform) {
      context.position = transform.position;
      context.rotation = transform.rotation;
      context.scale = transform.scale;
    }
    
    // Add renderable properties if available
    const renderable = entity.getComponent(RenderableComponent);
    if (renderable) {
      context.sprite = renderable.sprite;
      context.color = renderable.color;
      context.visible = renderable.visible;
    }
    
    // Add physics properties if available
    const physics = entity.getComponent(PhysicsComponent);
    if (physics) {
      context.velocity = physics.velocity;
      context.acceleration = physics.acceleration;
      context.grounded = physics.grounded;
    }
    
    // Add audio properties if available
    const audio = entity.getComponent(AudioComponent);
    if (audio) {
      context.sounds = audio.sounds;
    }
    
    // Add entity methods
    context.destroy = () => {
      this.world.removeEntity(entity);
    };
    
    // Add standard properties
    context.tag = entity.tag;
    context.name = entity.name;
    context.id = entity.id;
    
    return context;
  }
  
  /**
   * Check for collision at a position
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} tag - Entity tag to check for
   * @returns {Entity|null} Colliding entity or null
   * @private
   */
  _checkCollision(x, y, tag) {
    // This will use the physics system once implemented
    // For now, use a simple AABB check
    
    for (const entity of this.world._entityCache) {
      // Skip if tag doesn't match
      if (tag && entity.tag !== tag) continue;
      
      // Get transform component
      const transform = entity.getComponent(TransformComponent);
      if (!transform) continue;
      
      // Get physics component for collision shape
      const physics = entity.getComponent(PhysicsComponent);
      if (!physics) continue;
      
      // Simple AABB check
      if (x >= transform.position.x &&
          x <= transform.position.x + physics.width &&
          y >= transform.position.y &&
          y <= transform.position.y + physics.height) {
        return entity;
      }
    }
    
    return null;
  }
  
  /**
   * Find nearest entity with tag
   * @param {string} tag - Tag to search for
   * @returns {Entity|null} Nearest entity or null
   * @private
   */
  _findNearest(tag) {
    // Will be optimized with spatial partitioning later
    
    let nearestEntity = null;
    let nearestDistance = Infinity;
    
    // Get calling entity position
    const callingEntity = this._currentEntity;
    if (!callingEntity) return null;
    
    const callingTransform = callingEntity.getComponent(TransformComponent);
    if (!callingTransform) return null;
    
    // Check all entities
    for (const entity of this.world._entityCache) {
      // Skip self
      if (entity === callingEntity) continue;
      
      // Skip if tag doesn't match
      if (tag && entity.tag !== tag) continue;
      
      // Get transform component
      const transform = entity.getComponent(TransformComponent);
      if (!transform) continue;
      
      // Calculate distance
      const dx = transform.position.x - callingTransform.position.x;
      const dy = transform.position.y - callingTransform.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Update nearest if closer
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestEntity = entity;
      }
    }
    
    return nearestEntity;
  }
}