// /src/engine/quantum/GameIntegration.js

import { GameObject } from '../core/GameObject.js';
import { GameState } from '../GameState.js';

/**
 * SAAAM Game Integration
 * Connects quantum effects to gameplay elements
 */
export class GameIntegration {
  /**
   * Create a new GameIntegration instance
   * @param {QuantumCore} quantumCore - The quantum core reference
   */
  constructor(quantumCore) {
    this.quantumCore = quantumCore;
    
    // Initialize NPCs collection
    this.npcs = [];
    
    // Initialize environment hazards
    this.environmentHazards = [];
    
    // Initialize player state
    this.playerState = {
      energy: 100,
      quantumAwareness: 0
    };
    
    // Time tracking for updates
    this.accumulatedTime = 0;
    this.updateFrequency = 1.0 / 10; // Update quantum effects 10 times per second
  }
  
  /**
   * Register an NPC for quantum effects
   * @param {GameObject} npc - NPC game object to register
   */
  registerNPC(npc) {
    // Add quantum properties to the NPC
    npc.quantumProperties = {
      awareness: Math.random() * 0.5,
      reactionTime: 0.2 + Math.random() * 0.3,
      adaptability: Math.random() * 0.8
    };
    
    this.npcs.push(npc);
    return npc;
  }
  
  /**
   * Register an environment hazard
   * @param {GameObject} hazard - Hazard game object to register
   */
  registerEnvironmentHazard(hazard) {
    // Add quantum properties to the hazard
    hazard.quantumProperties = {
      instability: Math.random() * 0.3,
      effectStrength: 0.5 + Math.random() * 0.5,
      evolutionFactor: Math.random() * 0.2
    };
    
    this.environmentHazards.push(hazard);
    return hazard;
  }
  
  /**
   * Update quantum integration
   * @param {number} deltaTime - Time since last frame
   */
  update(deltaTime) {
    // Accumulate time and only update at specific intervals
    this.accumulatedTime += deltaTime;
    if (this.accumulatedTime < this.updateFrequency) {
      return;
    }
    
    // Reset accumulated time
    deltaTime = this.accumulatedTime;
    this.accumulatedTime = 0;
    
    // Update NPCs with quantum influence
    this.updateNPCs(deltaTime);
    
    // Update environment
    this.updateEnvironment(deltaTime);
    
    // Update player
    this.updatePlayer(deltaTime);
  }
  
  /**
   * Update NPCs with quantum effects
   * @param {number} deltaTime - Time since last update
   */
  updateNPCs(deltaTime) {
    const quantumInfluence = this.quantumCore.getQuantumInfluence();
    const stabilityFactor = this.quantumCore.getStabilityFactor();
    
    // Filter out any destroyed NPCs
    this.npcs = this.npcs.filter(npc => GameState.gameObjects.includes(npc));
    
    // Apply quantum effects to each NPC
    for (const npc of this.npcs) {
      if (!npc.quantumProperties) continue;
      
      // Update quantum properties
      npc.quantumProperties.awareness *= quantumInfluence;
      npc.quantumProperties.reactionTime *= stabilityFactor;
      
      // Apply awareness to NPC behavior
      if (npc.ai && typeof npc.ai.setAwareness === 'function') {
        npc.ai.setAwareness(npc.quantumProperties.awareness);
      }
      
      // Apply reaction time to NPC behavior
      if (npc.ai && typeof npc.ai.setReactionTime === 'function') {
        npc.ai.setReactionTime(npc.quantumProperties.reactionTime);
      }
      
      // Randomly evolve NPCs at breakthrough threshold
      if (this.quantumCore.quantumState.coherenceLevel > 1.8) {
        if (Math.random() < 0.02 * deltaTime) {
          this.evolveNPC(npc);
        }
      }
    }
  }
  
  /**
   * Evolve an NPC to a more advanced state
   * @param {GameObject} npc - NPC to evolve
   */
  evolveNPC(npc) {
    if (!npc.quantumProperties) return;
    
    // Increase awareness dramatically
    npc.quantumProperties.awareness += 0.2;
    
    // Improve reaction time
    npc.quantumProperties.reactionTime *= 0.8;
    
    // Visual effect - change color if possible
    if (npc.color) {
      // Shift color toward blue (quantum effect visualization)
      const r = parseInt(npc.color.slice(1, 3), 16);
      const g = parseInt(npc.color.slice(3, 5), 16);
      const b = parseInt(npc.color.slice(5, 7), 16);
      
      const newR = Math.max(0, r - 20);
      const newG = Math.min(255, g + 10);
      const newB = Math.min(255, b + 30);
      
      npc.color = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    
    // Log evolution
    console.log(`NPC evolved: ${npc.id} - Awareness: ${npc.quantumProperties.awareness.toFixed(2)}`);
  }
  
  /**
   * Update environment with quantum effects
   * @param {number} deltaTime - Time since last update
   */
  updateEnvironment(deltaTime) {
    const quantumInfluence = this.quantumCore.getQuantumInfluence();
    
    // Filter out any destroyed hazards
    this.environmentHazards = this.environmentHazards.filter(hazard => 
      GameState.gameObjects.includes(hazard));
    
    // Apply quantum effects to each hazard
    for (const hazard of this.environmentHazards) {
      if (!hazard.quantumProperties) continue;
      
      // Scale effect strength based on quantum influence
      hazard.quantumProperties.effectStrength *= (1 + 0.1 * quantumInfluence);
      
      // Increase instability at higher coherence levels
      if (this.quantumCore.quantumState.coherenceLevel > 1.5) {
        hazard.quantumProperties.instability += 0.01 * deltaTime;
      }
      
      // Apply visual or behavior changes based on quantum properties
      if (hazard.quantumProperties.instability > 0.5) {
        // Create occasional secondary hazards or effects
        if (Math.random() < 0.05 * deltaTime) {
          this.createQuantumAnomaly(hazard.position.x, hazard.position.y);
        }
      }
    }
  }
  
  /**
   * Create a quantum anomaly at specified position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  createQuantumAnomaly(x, y) {
    // Check if a factory or creator function exists
    if (!GameState.createQuantumAnomaly) {
      // Fallback - create a basic object
      const anomaly = new GameObject({
        position: { x, y },
        size: { x: 20, y: 20 },
        color: '#5533FF',
        tag: 'quantum-anomaly'
      });
      
      // Add to game objects
      GameState.gameObjects.push(anomaly);
      
      // Make it dissolve after a few seconds
      setTimeout(() => {
        const index = GameState.gameObjects.indexOf(anomaly);
        if (index !== -1) {
          GameState.gameObjects.splice(index, 1);
        }
      }, 3000 + Math.random() * 2000);
      
      return anomaly;
    } else {
      // Use the game's factory method
      return GameState.createQuantumAnomaly(x, y);
    }
  }
  
  /**
   * Update player with quantum effects
   * @param {number} deltaTime - Time since last update
   */
  updatePlayer(deltaTime) {
    // Get player from game state
    const player = GameState.player;
    if (!player) return;
    
    // Initialize quantum properties if not present
    if (!player.quantumProperties) {
      player.quantumProperties = {
        awareness: 0.1,
        shieldStrength: 1.0,
        quantumAffinity: 0.5
      };
    }
    
    // Get quantum influence
    const quantumInfluence = this.quantumCore.getQuantumInfluence();
    
    // Increase player's quantum awareness based on proximity to breakthrough
    const awarenessIncrease = 0.05 * quantumInfluence * deltaTime;
    player.quantumProperties.awareness = Math.min(1.0, 
      player.quantumProperties.awareness + awarenessIncrease);
    
    // Update player state
    this.playerState.quantumAwareness = player.quantumProperties.awareness;
    
    // Apply gameplay effects at high coherence
    if (this.quantumCore.quantumState.coherenceLevel > 1.5) {
      // Increase energy regeneration
      this.playerState.energy = Math.min(100, this.playerState.energy + 2 * deltaTime);
      
      // Special abilities available at high awareness
      if (player.quantumProperties.awareness > 0.7) {
        // Enable quantum abilities if the player has them
        if (player.abilities) {
          player.abilities.quantumSense = true;
          player.abilities.dimensionalShift = 
            this.quantumCore.quantumState.coherenceLevel > 1.8;
        }
      }
    }
    
    // Apply visual effects based on awareness
    if (player.quantumProperties.awareness > 0.5) {
      // Could add a glow effect or particle system here
      // For now, just log it
      if (player.quantumProperties.awareness > 0.9 && !player.quantumProperties.fullyAware) {
        console.log('Player has reached full quantum awareness!');
        player.quantumProperties.fullyAware = true;
      }
    }
  }
}