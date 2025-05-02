// /src/engine/components/TransformComponent.js

import { Component } from '../core/Component.js';
import { vec2 } from '../core/utils.js';

/**
 * TransformComponent handles positioning, rotation, scale and parent-child relationships
 * for game objects in the SAAAM engine.
 */
export class TransformComponent extends Component {
  /**
   * Create a new TransformComponent
   * @param {Object} options - Configuration options
   * @param {vec2} options.position - Local position relative to parent
   * @param {vec2} options.scale - Local scale relative to parent
   * @param {number} options.rotation - Local rotation in degrees
   * @param {TransformComponent} options.parent - Parent transform
   * @param {boolean} options.autoUpdate - Whether to automatically update children
   */
  constructor(options = {}) {
    super();
    
    // Local transform properties (relative to parent)
    this.localPosition = options.position || vec2(0, 0);
    this.localScale = options.scale || vec2(1, 1);
    this.localRotation = options.rotation || 0;
    
    // World transform properties (cached)
    this.worldPosition = vec2(0, 0);
    this.worldScale = vec2(1, 1);
    this.worldRotation = 0;
    
    // Parent-child relationships
    this.parent = options.parent || null;
    this.children = [];
    
    // Transform matrix (for advanced transform operations)
    this.localMatrix = [1, 0, 0, 1, 0, 0]; // 2D transform matrix [a, b, c, d, e, f]
    this.worldMatrix = [1, 0, 0, 1, 0, 0];
    
    // Flags
    this.autoUpdate = options.autoUpdate !== false;
    this.dirty = true;
  }
  
  /**
   * Set the local position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  setPosition(x, y) {
    this.localPosition.x = x;
    this.localPosition.y = y;
    this.setDirty();
  }
  
  /**
   * Set the local rotation
   * @param {number} degrees - Rotation in degrees
   */
  setRotation(degrees) {
    this.localRotation = degrees;
    this.setDirty();
  }
  
  /**
   * Set the local scale
   * @param {number} x - X scale factor
   * @param {number} y - Y scale factor
   */
  setScale(x, y) {
    this.localScale.x = x;
    this.localScale.y = y;
    this.setDirty();
  }
  
  /**
   * Set the parent transform
   * @param {TransformComponent} parent - New parent transform
   */
  setParent(parent) {
    // Remove from old parent
    if (this.parent) {
      const index = this.parent.children.indexOf(this);
      if (index !== -1) {
        this.parent.children.splice(index, 1);
      }
    }
    
    // Set new parent
    this.parent = parent;
    
    // Add to new parent's children
    if (parent) {
      parent.children.push(this);
    }
    
    this.setDirty();
  }
  
  /**
   * Add a child transform
   * @param {TransformComponent} child - Child transform to add
   */
  addChild(child) {
    if (child && child !== this) {
      child.setParent(this);
    }
  }
  
  /**
   * Remove a child transform
   * @param {TransformComponent} child - Child transform to remove
   */
  removeChild(child) {
    if (child && child.parent === this) {
      child.setParent(null);
    }
  }
  
  /**
   * Mark this transform and its children as dirty
   */
  setDirty() {
    this.dirty = true;
    
    // Mark all children as dirty
    for (const child of this.children) {
      child.setDirty();
    }
  }
  
  /**
   * Update the local transform matrix
   */
  updateLocalMatrix() {
    const cos = Math.cos(this.localRotation * Math.PI / 180);
    const sin = Math.sin(this.localRotation * Math.PI / 180);
    
    // Build 2D transform matrix
    this.localMatrix[0] = cos * this.localScale.x;
    this.localMatrix[1] = sin * this.localScale.x;
    this.localMatrix[2] = -sin * this.localScale.y;
    this.localMatrix[3] = cos * this.localScale.y;
    this.localMatrix[4] = this.localPosition.x;
    this.localMatrix[5] = this.localPosition.y;
  }
  
  /**
   * Update the world transform matrix
   */
  updateWorldMatrix() {
    // Update local matrix first
    this.updateLocalMatrix();
    
    if (this.parent) {
      // If we have a parent, multiply by parent's world matrix
      this.worldMatrix = multiplyMatrices(this.parent.worldMatrix, this.localMatrix);
    } else {
      // Otherwise, world matrix equals local matrix
      this.worldMatrix = [...this.localMatrix];
    }
    
    // Extract world position, rotation, and scale from matrix
    this.worldPosition.x = this.worldMatrix[4];
    this.worldPosition.y = this.worldMatrix[5];
    
    // Extract rotation (atan2 of b/a)
    this.worldRotation = Math.atan2(this.worldMatrix[1], this.worldMatrix[0]) * 180 / Math.PI;
    
    // Extract scale (magnitude of vectors)
    this.worldScale.x = Math.sqrt(this.worldMatrix[0] * this.worldMatrix[0] + this.worldMatrix[1] * this.worldMatrix[1]);
    this.worldScale.y = Math.sqrt(this.worldMatrix[2] * this.worldMatrix[2] + this.worldMatrix[3] * this.worldMatrix[3]);
    
    this.dirty = false;
  }
  
  /**
   * Apply this transform to the game object
   */
  applyToGameObject() {
    if (!this.gameObject) return;
    
    // Apply world position to game object
    this.gameObject.position.x = this.worldPosition.x;
    this.gameObject.position.y = this.worldPosition.y;
  }
  
  /**
   * Transform a point from local space to world space
   * @param {vec2} point - Point in local space
   * @return {vec2} Point in world space
   */
  localToWorld(point) {
    if (this.dirty) {
      this.updateWorldMatrix();
    }
    
    // Apply transformation matrix to point
    const x = point.x * this.worldMatrix[0] + point.y * this.worldMatrix[2] + this.worldMatrix[4];
    const y = point.x * this.worldMatrix[1] + point.y * this.worldMatrix[3] + this.worldMatrix[5];
    
    return vec2(x, y);
  }
  
  /**
   * Transform a point from world space to local space
   * @param {vec2} point - Point in world space
   * @return {vec2} Point in local space
   */
  worldToLocal(point) {
    if (this.dirty) {
      this.updateWorldMatrix();
    }
    
    // Compute inverse matrix
    const invMatrix = invertMatrix(this.worldMatrix);
    
    // Apply inverse matrix to point
    const x = point.x * invMatrix[0] + point.y * invMatrix[2] + invMatrix[4];
    const y = point.x * invMatrix[1] + point.y * invMatrix[3] + invMatrix[5];
    
    return vec2(x, y);
  }
  
  /**
   * Update the transform
   * @param {number} deltaTime - Time since last update
   */
  update(deltaTime) {
    // Update world transform if dirty
    if (this.dirty) {
      this.updateWorldMatrix();
    }
    
    // Apply transform to game object
    this.applyToGameObject();
    
    // Update children if auto-update is enabled
    if (this.autoUpdate) {
      for (const child of this.children) {
        child.update(deltaTime);
      }
    }
  }
}

/**
 * Multiply two 2D transformation matrices
 * @param {Array} a - First matrix [a, b, c, d, e, f]
 * @param {Array} b - Second matrix [a, b, c, d, e, f]
 * @return {Array} Result matrix [a, b, c, d, e, f]
 */
function multiplyMatrices(a, b) {
  return [
    a[0] * b[0] + a[2] * b[1],          // a
    a[1] * b[0] + a[3] * b[1],          // b
    a[0] * b[2] + a[2] * b[3],          // c
    a[1] * b[2] + a[3] * b[3],          // d
    a[0] * b[4] + a[2] * b[5] + a[4],   // e
    a[1] * b[4] + a[3] * b[5] + a[5]    // f
  ];
}

/**
 * Invert a 2D transformation matrix
 * @param {Array} m - Matrix to invert [a, b, c, d, e, f]
 * @return {Array} Inverted matrix [a, b, c, d, e, f]
 */
function invertMatrix(m) {
  const det = m[0] * m[3] - m[1] * m[2];
  
  // Cannot invert a matrix with determinant 0
  if (det === 0) {
    return [1, 0, 0, 1, 0, 0];
  }
  
  const invDet = 1 / det;
  
  const a = m[3] * invDet;
  const b = -m[1] * invDet;
  const c = -m[2] * invDet;
  const d = m[0] * invDet;
  const e = (m[2] * m[5] - m[3] * m[4]) * invDet;
  const f = (m[1] * m[4] - m[0] * m[5]) * invDet;
  
  return [a, b, c, d, e, f];
}