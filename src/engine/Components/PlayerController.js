// /src/engine/components/PlayerController.js
import { Component } from '../core/Component.js'

export class PlayerController extends Component {
  constructor() {
    super()
    this.moveSpeed = 300
    this.jumpForce = 550
    this.jumpCooldown = 0
  }

  update(deltaTime) {
    const keys = window.keysPressed || {}
    const go = this.gameObject

    if (this.jumpCooldown > 0) this.jumpCooldown -= deltaTime

    if (keys['ArrowLeft'] || keys['a']) {
      go.velocity.x = -this.moveSpeed * deltaTime * 60
    } else if (keys['ArrowRight'] || keys['d']) {
      go.velocity.x = this.moveSpeed * deltaTime * 60
    }

    if ((keys['ArrowUp'] || keys['w'] || keys[' ']) && go.grounded && this.jumpCooldown <= 0) {
      go.velocity.y = -this.jumpForce * deltaTime * 60
      this.jumpCooldown = 0.1
      if (window.playSound) playSound('jump')
    }
  }
}
