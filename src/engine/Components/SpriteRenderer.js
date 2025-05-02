// /src/engine/components/SpriteRenderer.js
import { Component } from '../core/Component.js'
import { TransformComponent } from './TransformComponent.js'

export class SpriteRenderer extends Component {
  constructor(options = {}) {
    super()
    this.sprite = options.sprite || null
    this.width = options.width || 32
    this.height = options.height || 32
    this.offsetX = options.offsetX || 0
    this.offsetY = options.offsetY || 0
    this.color = options.color || '#FFFF00'
  }

  draw(ctx) {
    // Get transform component if available
    const transform = this.gameObject.getComponent(TransformComponent);
    
    if (transform) {
      // If we have a transform component, use its world transform
      ctx.save();
      
      // Apply transform
      const worldPos = transform.worldPosition;
      const worldRot = transform.worldRotation;
      const worldScale = transform.worldScale;
      
      // Move to object position
      ctx.translate(worldPos.x, worldPos.y);
      
      // Apply rotation (in degrees)
      ctx.rotate(worldRot * Math.PI / 180);
      
      // Apply scale
      ctx.scale(worldScale.x, worldScale.y);
      
      // Apply offset
      ctx.translate(this.offsetX, this.offsetY);
      
      // Draw rectangle with dimensions at origin (0,0)
      this.drawSprite(ctx, -this.width/2, -this.height/2);
      
      // Restore context
      ctx.restore();
    } else {
      // Fallback to direct position if no transform component
      const x = this.gameObject.position.x + this.offsetX;
      const y = this.gameObject.position.y + this.offsetY;
      
      // Draw normally
      this.drawSprite(ctx, x, y);
    }
  }
  
  drawSprite(ctx, x, y) {
    // If we have a sprite, draw it
    if (this.sprite && typeof window.SAAAM.drawSprite === 'function') {
      window.SAAAM.drawSprite(this.sprite, x, y);
      return;
    }
    
    // Otherwise draw a placeholder
    ctx.strokeStyle = this.color;
    ctx.strokeRect(x, y, this.width, this.height);
    
    const centerX = x + this.width / 2;
    const centerY = y + this.height / 2;
    
    // Draw a simple face as placeholder
    ctx.fillStyle = '#000000';
    ctx.fillRect(centerX - 10, centerY - 5, 5, 5);
    ctx.fillRect(centerX + 5, centerY - 5, 5, 5);
    
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.arc(centerX, centerY + 5, 5, 0, Math.PI, false);
    ctx.stroke();
  }
}