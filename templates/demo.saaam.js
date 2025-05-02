/**
 * SAAAM Stability Demo Game
 * 
 * Demonstrates the integration of the Stability System with a simple SAAAM game.
 * Features include stability monitoring, pattern recognition, and performance optimization.
 */

// Register game lifecycle functions
SAAAM.registerCreate(create);
SAAAM.registerStep(step);
SAAAM.registerDraw(draw);

// Game variables
var player = {
  x: 400,
  y: 300,
  width: 40,
  height: 40,
  speed: 200,
  color: "#4488FF",
  particles: []
};

var enemies = [];
var collectibles = [];
var score = 0;
var game_time = 0;
var fps_history = [];
var effects_level = 1.0;
var physics_detail = 1.0;
var draw_distance = 500;

// Stability system integration
var stability_monitor;
var performance_monitor;
var last_stability_check = 0;
var stability_check_interval = 1.0;
var last_evolution = 0;
var evolution_interval = 5.0;

// Create function - called once at start
function create() {
  console.log("Creating SAAAM Stability Demo Game");
  
  // Initialize stability monitor if available
  if (typeof check_stability === "function") {
    console.log("Stability system detected, initializing integration");
    stability_monitor = {
      status: check_stability(),
      last_check: 0,
      check_interval: 1.0
    };
    
    performance_monitor = new PerformancePatternMonitor();
    
    // Verify initial stability
    if (!stability_monitor.status.stable) {
      console.warn("Initial stability check failed, optimizing...");
      optimize_performance("all");
    }
  } else {
    console.log("Stability system not available, running without optimization");
  }
  
  // Spawn initial enemies and collectibles
  for (var i = 0; i < 5; i++) {
    spawn_enemy();
    spawn_collectible();
  }
}

// Step function - called every frame
function step(delta_time) {
  // Update game time
  game_time += delta_time;
  
  // Track FPS
  track_fps(delta_time);
  
  // Check stability if available
  if (stability_monitor) {
    update_stability(delta_time);
  }
  
  // Handle player input
  handle_player_input(delta_time);
  
  // Update enemies
  update_enemies(delta_time);
  
  // Update collectibles
  update_collectibles(delta_time);
  
  // Update particles
  update_particles(delta_time);
  
  // Check collisions
  check_collisions();
  
  // Spawn new enemies periodically
  if (Math.floor(game_time) % 5 === 0 && Math.floor(game_time - delta_time) % 5 !== 0) {
    spawn_enemy();
  }
  
  // Spawn new collectibles periodically
  if (Math.floor(game_time) % 7 === 0 && Math.floor(game_time - delta_time) % 7 !== 0) {
    spawn_collectible();
  }
}

// Draw function - called every frame after step
function draw(ctx) {
  // Clear the screen with a dark background
  draw_rectangle(0, 0, 800, 600, "#222222");
  
  // Draw collectibles
  for (var i = 0; i < collectibles.length; i++) {
    var c = collectibles[i];
    draw_rectangle(c.x, c.y, c.width, c.height, c.color);
  }
  
  // Draw player
  draw_rectangle(player.x, player.y, player.width, player.height, player.color);
  
  // Draw player particles if effects are enabled
  if (effects_level > 0.5) {
    for (var i = 0; i < player.particles.length; i++) {
      var p = player.particles[i];
      draw_circle(p.x, p.y, p.size, p.color, p.alpha);
    }
  }
  
  // Draw enemies
  for (var i = 0; i < enemies.length; i++) {
    var e = enemies[i];
    // Only draw enemies within draw distance (affected by stability)
    if (distance(player.x, player.y, e.x, e.y) < draw_distance) {
      draw_rectangle(e.x, e.y, e.width, e.height, e.color);
    }
  }
  
  // Draw UI
  draw_text("Score: " + score, 20, 30, "#FFFFFF");
  draw_text("FPS: " + Math.round(calculate_fps()), 20, 60, "#FFFFFF");
  
  // Draw stability metrics if available
  if (stability_monitor) {
    draw_stability_metrics();
  }
}

// Update stability system
function update_stability(delta_time) {
  // Update check timer
  stability_monitor.last_check += delta_time;
  last_evolution += delta_time;
  
  // Check stability periodically
  if (stability_monitor.last_check >= stability_monitor.check_interval) {
    stability_monitor.status = check_stability();
    stability_monitor.last_check = 0;
    
    // If stability is low, adapt gameplay
    if (!stability_monitor.status.stable) {
      adapt_to_low_stability();
    } else {
      // If stable, gradually restore effects
      restore_effects();
    }
  }
  
  // Update performance monitor
  if (performance_monitor) {
    performance_monitor.update(delta_time);
  }
  
  // Evolve stability system periodically
  if (last_evolution >= evolution_interval) {
    if (typeof evolve_system === "function") {
      evolve_system();
      console.log("Stability system evolved");
      
      // Record pattern if FPS is stable
      if (calculate_fps() > 55) {
        recognize_pattern({
          type: "stable_performance",
          strength: 0.97,
          signature: [0, 1, 0, 1, 1]
        });
      }
    }
    last_evolution = 0;
  }
}

// Adapt gameplay to low stability
function adapt_to_low_stability() {
  // Reduce visual effects
  effects_level = Math.max(0.1, effects_level - 0.1);
  
  // Reduce draw distance
  draw_distance = Math.max(200, draw_distance - 20);
  
  // Simplify physics
  physics_detail = Math.max(0.2, physics_detail - 0.1);
  
  // Reduce number of particles
  player.particles = player.particles.slice(0, Math.floor(player.particles.length * 0.8));
  
  console.log("Adapting to low stability:", {
    effects: effects_level,
    draw_distance: draw_distance,
    physics: physics_detail
  });
  
  // Try to optimize performance
  if (typeof optimize_performance === "function") {
    optimize_performance("fps");
  }
}

// Gradually restore effects when stable
function restore_effects() {
  // Slowly restore effects
  effects_level = Math.min(1.0, effects_level + 0.02);
  draw_distance = Math.min(500, draw_distance + 5);
  physics_detail = Math.min(1.0, physics_detail + 0.02);
}

// Track FPS for stability monitoring
function track_fps(delta_time) {
  var current_fps = 1 / delta_time;
  fps_history.push(current_fps);
  
  // Keep history at reasonable size
  if (fps_history.length > 60) {
    fps_history.shift();
  }
  
  // Detect performance issues if stability system is available
  if (stability_monitor && fps_history.length > 10) {
    var avg_fps = calculate_fps();
    
    // If performance drops significantly, recognize pattern
    if (avg_fps < 30 && typeof recognize_pattern === "function") {
      recognize_pattern({
        type: "performance_drop",
        strength: 0.96,
        signature: [1, 0, 1, 1, 0], // Critical sequence
        metrics: { fps: avg_fps }
      });
      
      console.log("Performance drop detected, stability pattern recognized");
    }
  }
}

// Calculate average FPS from history
function calculate_fps() {
  if (fps_history.length === 0) return 60;
  return fps_history.reduce((sum, fps) => sum + fps, 0) / fps_history.length;
}

// Draw stability metrics on screen
function draw_stability_metrics() {
  // Draw stability panel background
  draw_rectangle(600, 10, 190, 120, "rgba(0,0,0,0.7)");
  
  // Draw stability values
  draw_text("Stability: " + stability_monitor.status.stable ? "✓" : "✗", 610, 30, "#FFFFFF");
  
  if (stability_monitor.status.dimensions) {
    draw_text("Alpha: " + stability_monitor.status.dimensions.alpha.toFixed(1), 610, 50, "#88FFAA");
    draw_text("Beta: " + stability_monitor.status.dimensions.beta.toFixed(1), 610, 70, "#AAAAFF");
    draw_text("Gamma: " + stability_monitor.status.dimensions.gamma.toFixed(1), 610, 90, "#FFAAAA");
  }
  
  draw_text("Patterns: " + (stability_monitor.status.patterns || 0), 610, 110, "#FFFFFF");
  
  // Draw effect levels
  draw_text("Effects: " + Math.round(effects_level * 100) + "%", 610, 130, "#FFFFFF");
}

// Handle player input
function handle_player_input(delta_time) {
  // Get input direction
  var dx = 0, dy = 0;
  
  if (keyboard_check(vk_left) || keyboard_check(vk_a)) {
    dx -= 1;
  }
  if (keyboard_check(vk_right) || keyboard_check(vk_d)) {
    dx += 1;
  }
  if (keyboard_check(vk_up) || keyboard_check(vk_w)) {
    dy -= 1;
  }
  if (keyboard_check(vk_down) || keyboard_check(vk_s)) {
    dy += 1;
  }
  
  // Normalize diagonal movement
  if (dx !== 0 && dy !== 0) {
    var length = Math.sqrt(dx * dx + dy * dy);
    dx /= length;
    dy /= length;
  }
  
  // Move player
  player.x += dx * player.speed * delta_time;
  player.y += dy * player.speed * delta_time;
  
  // Keep player within screen bounds
  player.x = Math.max(0, Math.min(800 - player.width, player.x));
  player.y = Math.max(0, Math.min(600 - player.height, player.y));
  
  // Create movement particles if effects enabled
  if (effects_level > 0.5 && (dx !== 0 || dy !== 0)) {
    create_movement_particles(dx, dy);
  }
}

// Create player movement particles
function create_movement_particles(dx, dy) {
  // Number of particles is affected by physics detail
  var num_particles = Math.floor(3 * physics_detail);
  
  for (var i = 0; i < num_particles; i++) {
    var particle = {
      x: player.x + player.width / 2,
      y: player.y + player.height / 2,
      vx: -dx * (Math.random() * 30 + 20),
      vy: -dy * (Math.random() * 30 + 20),
      size: Math.random() * 3 + 1,
      color: player.color,
      alpha: 0.7,
      life: 0.5,
      max_life: 0.5
    };
    
    player.particles.push(particle);
    
    // Limit number of particles based on effects level
    var max_particles = Math.floor(50 * effects_level);
    if (player.particles.length > max_particles) {
      player.particles.shift();
    }
  }
}

// Update player particles
function update_particles(delta_time) {
  for (var i = player.particles.length - 1; i >= 0; i--) {
    var p = player.particles[i];
    
    // Update position
    p.x += p.vx * delta_time;
    p.y += p.vy * delta_time;
    
    // Update life
    p.life -= delta_time;
    p.alpha = p.life / p.max_life * 0.7;
    
    // Remove dead particles
    if (p.life <= 0) {
      player.particles.splice(i, 1);
    }
  }
}

// Update enemies
function update_enemies(delta_time) {
  for (var i = 0; i < enemies.length; i++) {
    var e = enemies[i];
    
    // Move towards player with physics detail factor
    var dx = player.x - e.x;
    var dy = player.y - e.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 0) {
      dx /= dist;
      dy /= dist;
    }
    
    e.x += dx * e.speed * delta_time * physics_detail;
    e.y += dy * e.speed * delta_time * physics_detail;
    
    // Animate enemy (bobbing)
    e.animTime += delta_time;
    e.y += Math.sin(e.animTime * 5) * delta_time * 10;
  }
}

// Update collectibles
function update_collectibles(delta_time) {
  for (var i = 0; i < collectibles.length; i++) {
    var c = collectibles[i];
    
    // Animate collectible (bobbing)
    c.animTime += delta_time;
    c.y = c.baseY + Math.sin(c.animTime * 3) * 10;
  }
}

// Check for collisions
function check_collisions() {
  // Check for enemy collisions
  for (var i = enemies.length - 1; i >= 0; i--) {
    var e = enemies[i];
    
    if (rectangles_collide(player, e)) {
      // Player hit enemy, lose score
      score = Math.max(0, score - 50);
      
      // Create explosion effect if effects enabled
      if (effects_level > 0.2) {
        create_explosion(e.x, e.y, e.color);
      }
      
      // Remove enemy
      enemies.splice(i, 1);
      
      // If stability system available, recognize pattern
      if (typeof recognize_pattern === "function") {
        recognize_pattern({
          type: "player_damage",
          strength: 0.92,
          signature: [1, 1, 0, 0, 1]
        });
      }
      
      // Spawn new enemy
      spawn_enemy();
    }
  }
  
  // Check for collectible collisions
  for (var i = collectibles.length - 1; i >= 0; i--) {
    var c = collectibles[i];
    
    if (rectangles_collide(player, c)) {
      // Collect item, gain score
      score += 100;
      
      // Create collection effect if effects enabled
      if (effects_level > 0.3) {
        create_collection_effect(c.x, c.y);
      }
      
      // Remove collectible
      collectibles.splice(i, 1);
      
      // If stability system available, recognize pattern
      if (typeof recognize_pattern === "function") {
        recognize_pattern({
          type: "score_increase",
          strength: 0.9,
          signature: [0, 1, 0, 1, 0]
        });
      }
      
      // Spawn new collectible
      spawn_collectible();
    }
  }
}

// Create explosion effect
function create_explosion(x, y, color) {
  // Number of particles based on effects level
  var num_particles = Math.floor(20 * effects_level);
  
  for (var i = 0; i < num_particles; i++) {
    var angle = Math.random() * Math.PI * 2;
    var speed = Math.random() * 100 + 50;
    
    var particle = {
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 4 + 2,
      color: color,
      alpha: 1.0,
      life: Math.random() * 0.5 + 0.5,
      max_life: Math.random() * 0.5 + 0.5
    };
    
    player.particles.push(particle);
  }
}

// Create collection effect
function create_collection_effect(x, y) {
  // Number of particles based on effects level
  var num_particles = Math.floor(15 * effects_level);
  
  for (var i = 0; i < num_particles; i++) {
    var angle = Math.random() * Math.PI * 2;
    var speed = Math.random() * 60 + 30;
    
    var particle = {
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 3 + 1,
      color: "#FFDD44",
      alpha: 1.0,
      life: Math.random() * 0.3 + 0.3,
      max_life: Math.random() * 0.3 + 0.3
    };
    
    player.particles.push(particle);
  }
}

// Spawn an enemy
function spawn_enemy() {
  var edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
  var x, y;
  
  // Spawn from outside the screen
  switch (edge) {
    case 0: // top
      x = Math.random() * 800;
      y = -30;
      break;
    case 1: // right
      x = 830;
      y = Math.random() * 600;
      break;
    case 2: // bottom
      x = Math.random() * 800;
      y = 630;
      break;
    case 3: // left
      x = -30;
      y = Math.random() * 600;
      break;
  }
  
  var enemy = {
    x: x,
    y: y,
    width: 30,
    height: 30,
    speed: Math.random() * 30 + 50,
    color: "#FF4444",
    animTime: Math.random() * 10
  };
  
  enemies.push(enemy);
}

// Spawn a collectible
function spawn_collectible() {
  var collectible = {
    x: 50 + Math.random() * 700,
    y: 50 + Math.random() * 500,
    baseY: 0,
    width: 20,
    height: 20,
    color: "#FFDD44",
    animTime: Math.random() * 10
  };
  
  collectible.baseY = collectible.y;
  collectibles.push(collectible);
}

// Helper function for collision detection
function rectangles_collide(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

// Helper function to calculate distance
function distance(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

// Performance pattern monitor
class PerformancePatternMonitor {
  constructor() {
    this.fps_history = [];
    this.check_interval = 1.0;
    this.last_check = 0;
  }
  
  update(delta_time) {
    // Update check timer
    this.last_check += delta_time;
    
    // Check performance periodically
    if (this.last_check >= this.check_interval) {
      // Record current FPS
      var current_fps = calculate_fps();
      this.fps_history.push(current_fps);
      
      // Trim history to reasonable size
      if (this.fps_history.length > 30) {
        this.fps_history.shift();
      }
      
      // Check for performance patterns
      this.check_patterns(current_fps);
      
      // Reset timer
      this.last_check = 0;
    }
  }
  
  check_patterns(current_fps) {
    // Only check if we have enough history data
    if (this.fps_history.length < 10) return;
    
    // Check for sustained low FPS
    if (this.detect_sustained_low_fps()) {
      // If stability system available, recognize pattern
      if (typeof recognize_pattern === "function") {
        recognize_pattern({
          type: "sustained_low_fps",
          strength: 0.97,
          signature: [1, 0, 1, 1, 0], // Critical sequence
          metrics: { fps: current_fps }
        });
        
        console.log("Sustained low FPS detected, optimizing...");
        
        // Try to optimize performance
        if (typeof optimize_performance === "function") {
          optimize_performance("fps");
        }
      }
    }
    
    // Check for FPS recovery
    if (this.detect_fps_recovery()) {
      // If stability system available, recognize pattern
      if (typeof recognize_pattern === "function") {
        recognize_pattern({
          type: "fps_recovery",
          strength: 0.93,
          signature: [0, 1, 1, 0, 1]
        });
        
        console.log("FPS recovery detected");
      }
    }
  }
  
  detect_sustained_low_fps() {
    const recent = this.fps_history.slice(-5);
    return recent.every(fps => fps < 30);
  }
  
  detect_fps_recovery() {
    if (this.fps_history.length < 10) return false;
    
    const recent = this.fps_history.slice(-5);
    const previous = this.fps_history.slice(-10, -5);
    
    const recent_avg = recent.reduce((sum, fps) => sum + fps, 0) / recent.length;
    const previous_avg = previous.reduce((sum, fps) => sum + fps, 0) / previous.length;
    
    return previous_avg < 30 && recent_avg > 50;
  }
}
