// /src/engine/components/EnemyAI.js
import { Component } from '../core/Component.js'

export class EnemyAI extends Component {
  constructor(options = {}) {
    super()
    this.moveSpeed = options.moveSpeed || 100
    this.direction = 1
    this.changeDirectionCooldown = 0
    this.detectionRange = options.detectionRange || 200
    this.target = options.target || null
  }

  update(deltaTime) {
    const go = this.gameObject

    if (this.changeDirectionCooldown > 0) {
      this.changeDirectionCooldown -= deltaTime
    }

    if (this.target) {
      const distance = Math.abs(this.target.position.x - go.position.x)
      if (distance < this.detectionRange) {
        this.direction = this.target.position.x > go.position.x ? 1 : -1
      } else if (this.changeDirectionCooldown <= 0 && Math.random() < 0.02) {
        this.direction *= -1
        this.changeDirectionCooldown = 1
      }
    }

    go.velocity.x = this.direction * this.moveSpeed * deltaTime * 60

    // Optional: world boundaries check here (hookable in physics)
  }
}
