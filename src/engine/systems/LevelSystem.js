// /src/engine/systems/LevelSystem.js

import { GameState } from '../GameState.js'
import { SpriteRenderer } from '../components/SpriteRenderer.js'
import { PlayerController } from '../components/PlayerController.js'
import { EnemyAI } from '../components/EnemyAI.js'
import { vec2 } from '../core/utils.js'

export const LevelSystem = {
  createPlatform(x, y, w, h, color = '#888') {
    const GameObject = window.SAAAM?.GameObject
    const platform = new GameObject({
      position: vec2(x, y),
      size: vec2(w, h),
      color,
      tag: 'platform',
      gravity: false,
      collidable: true
    })
    GameState.gameObjects.push(platform)
    return platform
  },

  createEnemy(x, y, w, h, color = '#F00', target) {
    const GameObject = window.SAAAM?.GameObject
    const enemy = new GameObject({
      position: vec2(x, y),
      size: vec2(w, h),
      color,
      tag: 'enemy'
    })
    enemy.addComponent(new EnemyAI({ target }))
    GameState.gameObjects.push(enemy)
    return enemy
  },

  createCollectible(x, y, w, h, color = '#FF0') {
    const GameObject = window.SAAAM?.GameObject
    const c = new GameObject({
      position: vec2(x, y),
      size: vec2(w, h),
      color,
      tag: 'collectible',
      gravity: false
    })
    GameState.gameObjects.push(c)
    return c
  },

  createPlayer(x = 50, y = 300) {
    const GameObject = window.SAAAM?.GameObject
    const p = new GameObject({
      position: vec2(x, y),
      size: vec2(32, 48),
      color: '#0FF',
      tag: 'player'
    })
    p.addComponent(new PlayerController())
    p.addComponent(new SpriteRenderer({ width: 32, height: 48 }))
    GameState.player = p
    GameState.gameObjects.push(p)
    return p
  },

  createEmptyLevel() {
    return {
      name: 'New Level',
      player: { x: 50, y: 300 },
      platforms: [{ x: 0, y: 550, width: 800, height: 50, color: '#888888' }],
      enemies: [],
      collectibles: []
    }
  },

  saveLevel(level) {
    return JSON.stringify(level, null, 2)
  },

  loadLevelFromJSON(json) {
    try {
      const level = typeof json === 'string' ? JSON.parse(json) : json
      GameState.reset()
      const player = LevelSystem.createPlayer(level.player.x, level.player.y)

      for (const p of level.platforms || []) {
        LevelSystem.createPlatform(p.x, p.y, p.width, p.height, p.color)
      }

      for (const e of level.enemies || []) {
        LevelSystem.createEnemy(e.x, e.y, e.width, e.height, e.color, player)
      }

      for (const c of level.collectibles || []) {
        LevelSystem.createCollectible(c.x, c.y, c.width, c.height, c.color)
      }

      return level
    } catch (e) {
      console.error('Failed to load level:', e)
      return null
    }
  }
}
