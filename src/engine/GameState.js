// /src/engine/GameState.js

export const GameState = {
  gameObjects: [],
  player: null,
  canvas: null,
  ctx: null,

  GRAVITY: 9.8 * 60,
  FRICTION: 0.9,
  MAX_FALL_SPEED: 20,
  WORLD_WIDTH: 800,
  WORLD_HEIGHT: 600,

  reset() {
    GameState.gameObjects = []
    GameState.player = null
  }
}
