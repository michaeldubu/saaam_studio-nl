// SAAAM Game Engine - Simplified version for demo
// Based on the SAAAM language specification

// --- Engine Core ---
class GameObject {
  constructor(options = {}) {
    this.id = options.id || generateId();
    this.position = options.position || vec2(0, 0);
    this.size = options.size || vec2(32, 32);
    this.velocity = options.velocity || vec2(0, 0);
    this.acceleration = options.acceleration || vec2(0, 0);
    this.color = options.color || '#FFFFFF';
    this.tag = options.tag || 'default';
    this.components = [];
    this.active = true;
    this.collidable = options.collidable !== undefined ? options.collidable : true;
    this.gravity = options.gravity !== undefined ? options.gravity : true;
    this.grounded = false;
  }

  addComponent(component) {
    component.gameObject = this;
    this.components.push(component);
    return component;
  }

  getComponent(componentType) {
    return this.components.find(component => component instanceof componentType);
  }

  update(deltaTime) {
    // Apply gravity if enabled
    if (this.gravity) {
      this.acceleration.y = GRAVITY;
    }

    // Update velocity based on acceleration
    this.velocity.x += this.acceleration.x * deltaTime;
    this.velocity.y += this.acceleration.y * deltaTime;

    // Apply friction
    this.velocity.x *= FRICTION;

    // Cap falling speed
    if (this.velocity.y > MAX_FALL_SPEED) {
      this.velocity.y = MAX_FALL_SPEED;
    }

    // Update position
    let newPosition = {
      x: this.position.x + this.velocity.x * deltaTime,
      y: this.position.y + this.velocity.y * deltaTime
    };

    // Handle collisions
    if (this.collidable) {
      this.handleCollisions(newPosition);
    } else {
      this.position = newPosition;
    }

    // Update components
    for (const component of this.components) {
      if (component.update) {
        component.update(deltaTime);
      }
    }
  }

  handleCollisions(newPosition) {
    // Store original position
    const originalPosition = {...this.position};
    const wasGrounded = this.grounded;
    
    // Try horizontal movement first
    this.position.x = newPosition.x;
    let horizontalCollision = false;
    
    // Check for collisions with all game objects
    for (const obj of gameObjects) {
      if (obj !== this && obj.collidable && this.isCollidingWith(obj)) {
        horizontalCollision = true;
        // Resolve horizontal collision
        if (this.velocity.x > 0) {
          this.position.x = obj.position.x - this.size.x;
        } else if (this.velocity.x < 0) {
          this.position.x = obj.position.x + obj.size.x;
        }
        this.velocity.x = 0;
        break;
      }
    }
    
    // Try vertical movement
    this.position.y = newPosition.y;
    this.grounded = false;
    
    for (const obj of gameObjects) {
      if (obj !== this && obj.collidable && this.isCollidingWith(obj)) {
        // Resolve vertical collision
        if (this.velocity.y > 0) {
          this.position.y = obj.position.y - this.size.y;
          this.grounded = true;
        } else if (this.velocity.y < 0) {
          this.position.y = obj.position.y + obj.size.y;
        }
        this.velocity.y = 0;
        break;
      }
    }
    
    // Check world boundaries
    if (this.position.x < 0) {
      this.position.x = 0;
      this.velocity.x = 0;
    } else if (this.position.x + this.size.x > WORLD_WIDTH) {
      this.position.x = WORLD_WIDTH - this.size.x;
      this.velocity.x = 0;
    }
    
    if (this.position.y < 0) {
      this.position.y = 0;
      this.velocity.y = 0;
    } else if (this.position.y + this.size.y > WORLD_HEIGHT) {
      this.position.y = WORLD_HEIGHT - this.size.y;
      this.velocity.y = 0;
      this.grounded = true;
    }
    
    // Trigger events if grounded state changed
    if (!wasGrounded && this.grounded) {
      this.onLand();
    } else if (wasGrounded && !this.grounded) {
      this.onLeaveGround();
    }
  }
  
  onLand() {
    // Override in subclasses
  }
  
  onLeaveGround() {
    // Override in subclasses
  }

  isCollidingWith(other) {
    return (
      this.position.x < other.position.x + other.size.x &&
      this.position.x + this.size.x > other.position.x &&
      this.position.y < other.position.y + other.size.y &&
      this.position.y + this.size.y > other.position.y
    );
  }

  draw(ctx) {
    if (!this.active) return;
    
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );

    // Draw components
    for (const component of this.components) {
      if (component.draw) {
        component.draw(ctx);
      }
    }
  }
}

// --- Component System ---
class Component {
  constructor() {
    this.gameObject = null;
  }
}

class SpriteRenderer extends Component {
  constructor(options = {}) {
    super();
    this.sprite = options.sprite;
    this.width = options.width || 32;
    this.height = options.height || 32;
    this.offsetX = options.offsetX || 0;
    this.offsetY = options.offsetY || 0;
  }

  draw(ctx) {
    // In a real implementation, this would draw the sprite
    // For now, we'll just draw a placeholder
    ctx.strokeStyle = '#FFFF00';
    ctx.strokeRect(
      this.gameObject.position.x + this.offsetX,
      this.gameObject.position.y + this.offsetY,
      this.width,
      this.height
    );
    
    // Draw a simple face as a placeholder for the sprite
    const centerX = this.gameObject.position.x + this.width / 2;
    const centerY = this.gameObject.position.y + this.height / 2;
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(centerX - 10, centerY - 5, 5, 5);
    ctx.fillRect(centerX + 5, centerY - 5, 5, 5);
    
    // Mouth
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.arc(centerX, centerY + 5, 5, 0, Math.PI, false);
    ctx.stroke();
  }
}

class PlayerController extends Component {
  constructor() {
    super();
    this.moveSpeed = 300;
    this.jumpForce = 550;
    this.canJump = true;
    this.jumpCooldown = 0;
  }

  update(deltaTime) {
    // Update jump cooldown
    if (this.jumpCooldown > 0) {
      this.jumpCooldown -= deltaTime;
    }
    
    // Handle horizontal movement
    if (keysPressed['ArrowLeft'] || keysPressed['a']) {
      this.gameObject.velocity.x = -this.moveSpeed * deltaTime * 60;
    } else if (keysPressed['ArrowRight'] || keysPressed['d']) {
      this.gameObject.velocity.x = this.moveSpeed * deltaTime * 60;
    }
    
    // Handle jumping
    if ((keysPressed['ArrowUp'] || keysPressed['w'] || keysPressed[' ']) && 
        this.gameObject.grounded && this.jumpCooldown <= 0) {
      this.gameObject.velocity.y = -this.jumpForce * deltaTime * 60;
      this.jumpCooldown = 0.1; // Short cooldown to prevent double-jumps
      
      // Play jump sound
      playSound('jump');
    }
  }
}

class EnemyAI extends Component {
  constructor(options = {}) {
    super();
    this.moveSpeed = options.moveSpeed || 100;
    this.direction = 1; // 1 for right, -1 for left
    this.changeDirectionCooldown = 0;
    this.detectionRange = options.detectionRange || 200;
    this.target = options.target || null;
  }

  update(deltaTime) {
    // Update direction change cooldown
    if (this.changeDirectionCooldown > 0) {
      this.changeDirectionCooldown -= deltaTime;
    }
    
    // Check if we have a target and it's within range
    if (this.target) {
      const distance = Math.abs(this.target.position.x - this.gameObject.position.x);
      
      if (distance < this.detectionRange) {
        // Move towards target
        this.direction = this.target.position.x > this.gameObject.position.x ? 1 : -1;
      } else if (this.changeDirectionCooldown <= 0) {
        // Randomly change direction
        if (Math.random() < 0.02) {
          this.direction *= -1;
          this.changeDirectionCooldown = 1; // 1 second cooldown
        }
      }
    }
    
    // Apply movement
    this.gameObject.velocity.x = this.direction * this.moveSpeed * deltaTime * 60;
    
    // Handle collision with world boundaries
    if (this.gameObject.position.x <= 0 || 
        this.gameObject.position.x + this.gameObject.size.x >= WORLD_WIDTH) {
      this.direction *= -1;
    }
  }
}

// --- Helper Functions ---
function vec2(x, y) {
  return { x, y };
}

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

// --- Audio System ---
const audioSystem = {
  sounds: {
    jump: new Audio('data:audio/wav;base64,UklGRjQnAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YRAnAAAAAAEBAQICAwMEBAUFBgYHBwgICQkKCgsLDAwNDQ4ODw8QEBERERITExQUFRUWFhcXGBgZGRoaGxscHB0dHh4fHyAgISEiIiMjJCQlJSYmJycoKCkpKiorKywsLS0uLi8vMDAxMTIyMzM0NDU1NjY3Nzg4OTk6Ojs7PDw9PT4+Pz9AQEFBQkJDQ0RERUVGRkdHSEhJSUpKS0tMTE1NTk5PT1BQUVFSUlNTVFRVVVZWV1dYWFlZWlpbW1xcXV1eXl9fYGBhYWJiY2NkZGVlZmZnZ2hoaWlqamtrbGxtbW5ub29wcHFxcnJzc3R0dXV2dnd3eHh5eXp6e3t8fH19fn5/f4CAgYGCgoODhISFhYaGh4eIiImJioqLi4yMjY2Ojo+PkJCRkZKSk5OUlJWVlpaXl5iYmZmampubnJydnZ6en5+goKGhoqKjo6SkpaWmpqenqKipqaqqq6usrK2trq6vr7CwsbGysrOztLS1tba2t7e4uLm5urq7u7y8vb2+vr+/wMDBwcLCw8PExMXFxsbHx8jIycnKysvLzMzNzc7Oz8/Q0NHR0tLT09TU1dXW1tfX2NjZ2dra29vc3N3d3t7f3+Dg4eHi4uPj5OTl5ebm5+fo6Onp6urr6+zs7e3u7u/v8PDx8fLy8/P09PX19vb39/j4+fn6+vv7/Pz9/f7+//8='),
    collect: new Audio('data:audio/wav;base64,UklGRjQnAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YRAnAACAgIGBgoKDg4SEhYWGhoeHiIiJiYqKi4uMjI2Njo6Pj5CQkZGSkpOTlJSVlZaWl5eYmJmZmpqbm5ycnZ2enp+foKChoaKio6OkpKWlpqanp6ioqamqqaurq6uqqqmpp6elpKOioJ+dnJqZl5aUk5GQjo2LioiHhYSCgYB+fXt6eHd1dHJxb25sa2ppZ2ZkY2FgXl1bWlhXVVRSUU9OTEtJSEdFREJBPz49Ozk4NjUzMjAv'),
    hurt: new Audio('data:audio/wav;base64,UklGRjQnAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YRAnAAD//wAAAgAGAAsAEAAVABoAHwAkACkALgAzADgAPQBCAEcATABRAFYAWwBgAGUAagBvAHQAeQB+AIMAiACNAJIAlwCcAKEApgCrALAAtQC6AL8AxADJAM4A0wDYAN0A4gDnAOwA8QD2APsAAAEFAQoBDwEUARkBHgEjASgBLQEyATcBPAFBAUYBSwFQAVUBWgFfAWQBaQFuAXMBeAF9AYIBhwGMAZEBlgGbAaABpQGqAa8BtAG5Ab4BwwHIAc0B0gHXAdwB4QHmAesB8AH1AfoCAAMFAwsDEAMVAxsDIAMlAysDMAM1AzsDQANFA0sDUANVA1sDYANlA2sDcAN1A3sDgAOFA4sDkAOVA5sDnwOkA6oDrwO0A7kDvwPEA8kDzwPUA9kD3wPkA+kD7wP0A/kD/wQEBAkEDwQUBBkEHwQkBCkELwQ0BDkEPwREBEkETwRUBFkEXwRkBGkEbwR0BHkEfwSEBIkEjwSUBJkEnwSkBKkErwS0BLkEvwTEBMkEzwTUBNkE3wTkBOkE7wT0BPkE/wUEBQkFDwUUBRkFHwUkBSkFLwU0BTkFPwVEBUkFTwVUBVkFXwVkBWkFbwV0BXgFfgWDBYgFjgWTBZgFngWjBagFrgWzBbgFvgXDBcgFzgXTBdgF3gXjBegF7gXzBfgF/gYDBggGDgYTBhgGHgYjBigGLgYzBjgGPgZDBkgGTgZTBlgGXgZjBmgGbgZzBngGfgaDBogGjgaTBpgGngajBqgGrgayBrcGvQbCBscGzQbSBtcG3QbiBucG7QbyBvcG/QcCBwcHDQcSBxcHHQciBycHLQcyBzcHPQdCB0cHTQdSB1cHXQdiB2cHbQdyB3cHfQeCB4cHjQeSB5cHnQeiB6cHrQeyB7cHvQfCB8cHzQfSB9cH3QfiB+cH7QfyB/cH/QgCCAcIDQgSCBcIHQgiCCcILQgyCDcIPQhCCEcITQhSCFcIXQhiCGcIbQhyCHcIfQiCCIcIjQiSCJcInQiiCKcIrQiyCLcIvQjCCMcIzQjSCNcI3QjiCOcI7QjyCPcI/QkCCQcJDQkSCRcJHQkiCScJLQkyCTcJPQlCCUcJTQlSCVcJXQliCWcJbQlyCXcJfQmCCYcJjQmSCZcJnQmiCacJrQmyCbcJvQnCCccJzQnSCdcJ3QniCecJ7QnyCfcJ/QoCCgcKDQoSChcKHQoiCicKLQoyAA==')
  },
  
  playSound(name) {
    const sound = this.sounds[name];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }
};

function playSound(name) {
  audioSystem.playSound(name);
}

// --- Constants ---
const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 600;
const GRAVITY = 9.8 * 60;
const FRICTION = 0.9;
const MAX_FALL_SPEED = 20;

// --- Game Logic ---
let gameObjects = [];
let player = null;
let keysPressed = {};
let gameRunning = false;
let levelData = null;

function initGame() {
  gameObjects = [];
  
  // Create player
  player = new GameObject({
    position: vec2(50, 300),
    size: vec2(32, 48),
    color: '#00FFFF',
    tag: 'player'
  });
  player.addComponent(new PlayerController());
  player.addComponent(new SpriteRenderer({
    width: 32,
    height: 48
  }));
  
  gameObjects.push(player);
  
  // Create some platforms
  createPlatform(0, 550, 800, 50, '#888888'); // Ground
  createPlatform(150, 450, 100, 20);
  createPlatform(300, 350, 100, 20);
  createPlatform(500, 400, 150, 20);
  createPlatform(700, 300, 100, 20);
  
  // Create some enemies
  createEnemy(300, 300, 32, 32, '#FF0000', player);
  createEnemy(600, 350, 32, 32, '#FF5500', player);
  
  // Create collectibles
  createCollectible(200, 420, 20, 20, '#FFFF00');
  createCollectible(350, 320, 20, 20, '#FFFF00');
  createCollectible(550, 370, 20, 20, '#FFFF00');
  createCollectible(750, 270, 20, 20, '#FFFF00');
}

function createPlatform(x, y, width, height, color = '#888888') {
  const platform = new GameObject({
    position: vec2(x, y),
    size: vec2(width, height),
    color: color,
    tag: 'platform'
  });
  gameObjects.push(platform);
  return platform;
}

function createEnemy(x, y, width, height, color, target) {
  const enemy = new GameObject({
    position: vec2(x, y),
    size: vec2(width, height),
    color: color,
    tag: 'enemy'
  });
  enemy.addComponent(new EnemyAI({
    target: target,
    moveSpeed: 100 + Math.random() * 50
  }));
  gameObjects.push(enemy);
  return enemy;
}

function createCollectible(x, y, width, height, color) {
  const collectible = new GameObject({
    position: vec2(x, y),
    size: vec2(width, height),
    color: color,
    tag: 'collectible',
    gravity: false
  });
  gameObjects.push(collectible);
  return collectible;
}

function loadLevel(level) {
  gameObjects = [];
  
  // Create player at spawn point
  player = new GameObject({
    position: vec2(level.player.x, level.player.y),
    size: vec2(32, 48),
    color: '#00FFFF',
    tag: 'player'
  });
  player.addComponent(new PlayerController());
  player.addComponent(new SpriteRenderer({
    width: 32,
    height: 48
  }));
  
  gameObjects.push(player);
  
  // Create platforms
  for (const platform of level.platforms) {
    createPlatform(
      platform.x, 
      platform.y, 
      platform.width, 
      platform.height, 
      platform.color || '#888888'
    );
  }
  
  // Create enemies
  if (level.enemies && level.enemies.length > 0) {
    for (const enemy of level.enemies) {
      createEnemy(
        enemy.x,
        enemy.y,
        enemy.width || 32,
        enemy.height || 32,
        enemy.color || '#FF0000',
        player
      );
    }
  }
  
  // Create collectibles
  if (level.collectibles && level.collectibles.length > 0) {
    for (const collectible of level.collectibles) {
      createCollectible(
        collectible.x,
        collectible.y,
        collectible.width || 20,
        collectible.height || 20,
        collectible.color || '#FFFF00'
      );
    }
  }
}

// Handle player-collectible collision
function checkCollectibles() {
  for (let i = gameObjects.length - 1; i >= 0; i--) {
    const obj = gameObjects[i];
    
    if (obj.tag === 'collectible' && player.isCollidingWith(obj)) {
      // Remove collectible
      gameObjects.splice(i, 1);
      
      // Play collect sound
      playSound('collect');
    }
  }
}

// Handle player-enemy collision
function checkEnemyCollisions() {
  for (const obj of gameObjects) {
    if (obj.tag === 'enemy' && player.isCollidingWith(obj)) {
      // Play hurt sound
      playSound('hurt');
      
      // Knock player back
      const direction = player.position.x < obj.position.x ? -1 : 1;
      player.velocity.x = direction * 10;
      player.velocity.y = -5;
      
      break;
    }
  }
}

// --- Game Loop ---
let lastTime = 0;

function gameLoop(timestamp) {
  if (!gameRunning) return;
  
  // Calculate delta time
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  
  // Clear canvas
  ctx.fillStyle = '#222222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Update and draw game objects
  for (const obj of gameObjects) {
    obj.update(deltaTime);
    obj.draw(ctx);
  }
  
  // Check for collectibles
  checkCollectibles();
  
  // Check for enemy collisions
  checkEnemyCollisions();
  
  // Continue game loop
  requestAnimationFrame(gameLoop);
}

// --- Input Handling ---
function setupInput() {
  window.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;
  });
  
  window.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
  });
}

// --- Game Control Functions ---
let canvas;
let ctx;

function startGame(canvasElement) {
  if (!canvasElement) {
    console.error('Canvas element not provided');
    return;
  }
  
  canvas = canvasElement;
  ctx = canvas.getContext('2d');
  
  // Set up the game
  setupInput();
  initGame();
  
  // Start the game loop
  gameRunning = true;
  lastTime = performance.now();
  requestAnimationFrame(gameLoop);
}

function stopGame() {
  gameRunning = false;
}

// --- Level Editor Functions ---
function createEmptyLevel() {
  return {
    name: 'New Level',
    player: { x: 50, y: 300 },
    platforms: [
      { x: 0, y: 550, width: 800, height: 50, color: '#888888' } // Ground
    ],
    enemies: [],
    collectibles: []
  };
}

function saveLevel(level) {
  return JSON.stringify(level);
}

function loadLevelFromJSON(json) {
  try {
    const level = JSON.parse(json);
    loadLevel(level);
    return level;
  } catch (e) {
    console.error('Error loading level:', e);
    return null;
  }
}

// --- Expose API ---
window.SAAAM = {
  GameObject,
  Component,
  SpriteRenderer,
  PlayerController,
  EnemyAI,
  startGame,
  stopGame,
  createPlatform,
  createEnemy,
  createCollectible,
  createEmptyLevel,
  saveLevel,
  loadLevelFromJSON,
  get gameObjects() { return gameObjects; },
  get player() { return player; }
};
