// /src/engine/systems/PhysicsEngine.js
import { GameState } from '../GameState.js'

export const PhysicsEngine = {
  applyPhysics(gameObject, deltaTime) {
    if (gameObject.gravity) {
      gameObject.acceleration.y = GameState.GRAVITY
    }

    gameObject.velocity.x += gameObject.acceleration.x * deltaTime
    gameObject.velocity.y += gameObject.acceleration.y * deltaTime
    gameObject.velocity.x *= GameState.FRICTION

    if (gameObject.velocity.y > GameState.MAX_FALL_SPEED) {
      gameObject.velocity.y = GameState.MAX_FALL_SPEED
    }

    const newPosition = {
      x: gameObject.position.x + gameObject.velocity.x * deltaTime,
      y: gameObject.position.y + gameObject.velocity.y * deltaTime
    }

    // Basic boundary check
    if (newPosition.x < 0) newPosition.x = 0
    if (newPosition.y < 0) newPosition.y = 0
    if (newPosition.x + gameObject.size.x > GameState.WORLD_WIDTH) {
      newPosition.x = GameState.WORLD_WIDTH - gameObject.size.x
    }
    if (newPosition.y + gameObject.size.y > GameState.WORLD_HEIGHT) {
      newPosition.y = GameState.WORLD_HEIGHT - gameObject.size.y
      gameObject.grounded = true
    }

    gameObject.position = newPosition
  },

  checkCollisions(gameObject) {
    for (const obj of GameState.gameObjects) {
      if (obj !== gameObject && obj.collidable && PhysicsEngine.isColliding(gameObject, obj)) {
        // Add custom collision logic later
      }
    }
  },

  isColliding(a, b) {
    return (
      a.position.x < b.position.x + b.size.x &&
      a.position.x + a.size.x > b.position.x &&
      a.position.y < b.position.y + b.size.y &&
      a.position.y + a.size.y > b.position.y
    )
  }
}
