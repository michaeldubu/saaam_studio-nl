// /src/engine/SceneManager.js

import { GameState } from './GameState.js';
import { GameObject } from './core/GameObject.js';
import { TransformComponent } from './components/TransformComponent.js';

/**
 * Scene management system for the SAAAM game engine.
 * Handles scene loading, object hierarchies, and scene transitions.
 */
export class SceneManager {
  constructor() {
    this.activeScene = null;
    this.scenes = new Map();
    this.rootTransforms = [];
    this.sceneTransition = null;
  }
  
  /**
   * Initialize the scene manager
   */
  initialize() {
    // Create a default scene if none exists
    if (this.scenes.size === 0) {
      this.createScene('default');
      this.loadScene('default');
    }
  }
  
  /**
   * Create a new scene
   * @param {string} name - Scene name
   * @param {Object} options - Scene options
   * @return {Object} Created scene
   */
  createScene(name, options = {}) {
    if (this.scenes.has(name)) {
      console.warn(`Scene "${name}" already exists. Overwriting.`);
    }
    
    const scene = {
      name,
      objects: [],
      rootTransforms: [],
      options,
      active: false
    };
    
    this.scenes.set(name, scene);
    return scene;
  }
  
  /**
   * Load a scene by name
   * @param {string} name - Scene name to load
   * @param {Object} options - Scene loading options
   */
  loadScene(name, options = {}) {
    const scene = this.scenes.get(name);
    
    if (!scene) {
      console.error(`Scene "${name}" not found`);
      return false;
    }
    
    // Handle transition options
    const transition = options.transition || 'none';
    const duration = options.duration || 1.0;
    
    if (transition !== 'none') {
      this.startSceneTransition(this.activeScene, scene, transition, duration);
      return true;
    }
    
    // If no transition, just switch scenes immediately
    this.unloadActiveScene();
    this.activateScene(scene);
    return true;
  }
  
  /**
   * Unload the currently active scene
   */
  unloadActiveScene() {
    if (!this.activeScene) return;
    
    // Clear all game objects
    for (const obj of this.activeScene.objects) {
      this.destroyGameObject(obj);
    }
    
    this.activeScene.objects = [];
    this.activeScene.rootTransforms = [];
    this.activeScene.active = false;
    this.activeScene = null;
    this.rootTransforms = [];
    
    // Clear the game state
    GameState.gameObjects = [];
    GameState.player = null;
  }
  
  /**
   * Activate a scene
   * @param {Object} scene - Scene to activate
   */
  activateScene(scene) {
    this.activeScene = scene;
    scene.active = true;
    this.rootTransforms = scene.rootTransforms;
    
    // Notify that scene is loaded
    if (scene.options.onLoad) {
      scene.options.onLoad();
    }
  }
  
  /**
   * Start a scene transition
   * @param {Object} fromScene - Scene to transition from
   * @param {Object} toScene - Scene to transition to
   * @param {string} type - Transition type
   * @param {number} duration - Transition duration
   */
  startSceneTransition(fromScene, toScene, type, duration) {
    // Create transition object
    this.sceneTransition = {
      fromScene,
      toScene,
      type,
      duration,
      time: 0,
      progress: 0,
      completed: false
    };
    
    // Prepare the to-scene but don't activate it yet
    if (toScene.options.onPrepare) {
      toScene.options.onPrepare();
    }
  }
  
  /**
   * Update scene transition
   * @param {number} deltaTime - Time since last update
   */
  updateTransition(deltaTime) {
    if (!this.sceneTransition) return;
    
    const transition = this.sceneTransition;
    transition.time += deltaTime;
    transition.progress = Math.min(1.0, transition.time / transition.duration);
    
    // Apply transition effect based on type
    switch (transition.type) {
      case 'fade':
        this.applyFadeTransition(transition.progress);
        break;
      case 'slide':
        this.applySlideTransition(transition.progress);
        break;
      case 'zoom':
        this.applyZoomTransition(transition.progress);
        break;
      default:
        // No effect
        break;
    }
    
    // Check if transition completed
    if (transition.progress >= 1.0 && !transition.completed) {
      transition.completed = true;
      this.completeTransition();
    }
  }
  
  /**
   * Apply fade transition effect
   * @param {number} progress - Transition progress (0-1)
   */
  applyFadeTransition(progress) {
    // This would normally set some global alpha or draw an overlay
    // For simplicity, we'll just log the progress
    console.log(`Fade transition: ${Math.round(progress * 100)}%`);
    
    // At 50% progress, switch scenes
    if (progress >= 0.5 && this.activeScene !== this.sceneTransition.toScene) {
      this.unloadActiveScene();
      this.activateScene(this.sceneTransition.toScene);
    }
  }
  
  /**
   * Apply slide transition effect
   * @param {number} progress - Transition progress (0-1)
   */
  applySlideTransition(progress) {
    // This would normally offset scene rendering
    console.log(`Slide transition: ${Math.round(progress * 100)}%`);
    
    // At 100% progress, ensure scene is switched
    if (progress >= 1.0 && this.activeScene !== this.sceneTransition.toScene) {
      this.unloadActiveScene();
      this.activateScene(this.sceneTransition.toScene);
    }
  }
  
  /**
   * Apply zoom transition effect
   * @param {number} progress - Transition progress (0-1)
   */
  applyZoomTransition(progress) {
    // This would normally scale scene rendering
    console.log(`Zoom transition: ${Math.round(progress * 100)}%`);
    
    // At 50% progress, switch scenes
    if (progress >= 0.5 && this.activeScene !== this.sceneTransition.toScene) {
      this.unloadActiveScene();
      this.activateScene(this.sceneTransition.toScene);
    }
  }
  
  /**
   * Complete the current transition
   */
  completeTransition() {
    // Ensure the correct scene is active
    if (this.activeScene !== this.sceneTransition.toScene) {
      this.unloadActiveScene();
      this.activateScene(this.sceneTransition.toScene);
    }
    
    // Clear transition
    this.sceneTransition = null;
  }
  
  /**
   * Create a game object in the active scene
   * @param {Object} options - GameObject options
   * @param {TransformComponent} parentTransform - Optional parent transform
   * @return {GameObject} Created game object
   */
  createGameObject(options = {}, parentTransform = null) {
    if (!this.activeScene) {
      console.error('No active scene to create object in');
      return null;
    }
    
    const gameObject = new GameObject(options);
    
    // Add the object to GameState and active scene
    GameState.gameObjects.push(gameObject);
    this.activeScene.objects.push(gameObject);
    
    // Create transform component and set up hierarchy
    const transform = new TransformComponent({
      position: options.position,
      scale: options.scale,
      rotation: options.rotation
    });
    
    gameObject.addComponent(transform);
    
    if (parentTransform) {
      transform.setParent(parentTransform);
    } else {
      // No parent, so it's a root transform
      this.activeScene.rootTransforms.push(transform);
      this.rootTransforms = this.activeScene.rootTransforms;
    }
    
    return gameObject;
  }
  
  /**
   * Destroy a game object
   * @param {GameObject} gameObject - GameObject to destroy
   */
  destroyGameObject(gameObject) {
    if (!gameObject) return;
    
    // Remove from GameState
    const gameStateIndex = GameState.gameObjects.indexOf(gameObject);
    if (gameStateIndex !== -1) {
      GameState.gameObjects.splice(gameStateIndex, 1);
    }
    
    // Check if it's the player
    if (GameState.player === gameObject) {
      GameState.player = null;
    }
    
    // Remove from active scene
    if (this.activeScene) {
      const sceneIndex = this.activeScene.objects.indexOf(gameObject);
      if (sceneIndex !== -1) {
        this.activeScene.objects.splice(sceneIndex, 1);
      }
      
      // Check if the object has a transform with children
      const transform = gameObject.getComponent(TransformComponent);
      if (transform) {
        // If it's a root transform, remove from root transforms
        const rootIndex = this.activeScene.rootTransforms.indexOf(transform);
        if (rootIndex !== -1) {
          this.activeScene.rootTransforms.splice(rootIndex, 1);
          this.rootTransforms = this.activeScene.rootTransforms;
        }
        
        // Handle children - reparent or destroy
        for (const child of [...transform.children]) {
          // Option 1: Destroy children
          if (child.gameObject) {
            this.destroyGameObject(child.gameObject);
          }
          
          // Option 2: Reparent children to world
          // transform.removeChild(child);
        }
      }
    }
  }
  
  /**
   * Update scene and all game objects
   * @param {number} deltaTime - Time since last update
   */
  update(deltaTime) {
    // Update scene transition if active
    if (this.sceneTransition) {
      this.updateTransition(deltaTime);
    }
    
    // Update all root transform hierarchies
    for (const rootTransform of this.rootTransforms) {
      rootTransform.update(deltaTime);
    }
  }
  
  /**
   * Draw the active scene
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  draw(ctx) {
    // Scene-specific rendering could go here
    // For now, game objects are drawn by the engine's main loop
  }
}

// Create singleton instance
export const sceneManager = new SceneManager();