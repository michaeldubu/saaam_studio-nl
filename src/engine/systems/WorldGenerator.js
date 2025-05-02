// /src/engine/systems/WorldGenerator.js

/**
 * Vector3 - Simple 3D vector for world coordinates
 */
class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  /**
   * Calculate distance to another vector
   * @param {Vector3} other - Vector to calculate distance to
   * @returns {number} - Distance
   */
  distanceTo(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dz = this.z - other.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}

/**
 * WorldChunk - Contains terrain and entities for a section of the world
 */
class WorldChunk {
  constructor(position) {
    this.position = position;
    this.terrain = null;
    this.entities = [];
    this.structures = [];
    this.loaded = false;
    this.active = false;
    this.lastAccess = Date.now();
  }
}

/**
 * TerrainData - Contains terrain information for a chunk
 */
class TerrainData {
  constructor() {
    this.heightmap = [];
    this.materials = [];
    this.foliage = [];
    this.water = [];
  }
}

/**
 * TerrainGenerator - Creates terrain based on noise and parameters
 */
class TerrainGenerator {
  constructor() {
    this.noiseScale = 0.01;
    this.amplitude = 100;
    this.octaves = 4;
    this.persistence = 0.5;
    this.lacunarity = 2.0;
    this.seed = 0;
  }
  
  /**
   * Set generation parameters
   * @param {Object} params - Terrain parameters
   */
  setParameters(params) {
    this.noiseScale = params.noiseScale || this.noiseScale;
    this.amplitude = params.amplitude || this.amplitude;
    this.octaves = params.octaves || this.octaves;
    this.persistence = params.persistence || this.persistence;
    this.lacunarity = params.lacunarity || this.lacunarity;
    this.seed = params.seed || this.seed;
  }
  
  /**
   * Generate terrain for a chunk
   * @param {Object} params - Generation parameters
   * @returns {TerrainData} - Generated terrain data
   */
  generate(params) {
    // Apply parameters
    this.setParameters(params);
    
    // Create new terrain data
    const terrain = new TerrainData();
    
    // In a real implementation, this would use Perlin/Simplex noise
    // For this example, we'll use a simple sine wave pattern
    
    // Create a simple heightmap (16x16 grid)
    const size = 16;
    for (let x = 0; x < size; x++) {
      terrain.heightmap[x] = [];
      terrain.materials[x] = [];
      
      for (let z = 0; z < size; z++) {
        // Calculate normalized coordinates
        const nx = x / size;
        const nz = z / size;
        
        // Simple combined sine waves for height
        const h1 = Math.sin(nx * 5 + this.seed) * 0.5 + 0.5;
        const h2 = Math.sin(nz * 3 + this.seed * 0.7) * 0.5 + 0.5;
        const height = (h1 + h2) * 0.5 * this.amplitude;
        
        terrain.heightmap[x][z] = height;
        
        // Determine material based on height
        if (height < 30) {
          terrain.materials[x][z] = 'water';
        } else if (height < 40) {
          terrain.materials[x][z] = 'sand';
        } else if (height < 70) {
          terrain.materials[x][z] = 'grass';
        } else if (height < 90) {
          terrain.materials[x][z] = 'rock';
        } else {
          terrain.materials[x][z] = 'snow';
        }
      }
    }
    
    // Add some random foliage (trees, bushes, etc)
    const foliageCount = Math.floor(Math.random() * 10) + 5;
    for (let i = 0; i < foliageCount; i++) {
      const x = Math.floor(Math.random() * size);
      const z = Math.floor(Math.random() * size);
      
      // Only add foliage on grass
      if (terrain.materials[x][z] === 'grass') {
        const foliageType = Math.random() < 0.3 ? 'tree' : 'bush';
        
        terrain.foliage.push({
          type: foliageType,
          position: { x, z },
          height: terrain.heightmap[x][z],
          scale: 0.5 + Math.random() * 1.5
        });
      }
    }
    
    // Add water
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        if (terrain.materials[x][z] === 'water') {
          terrain.water.push({
            position: { x, z },
            height: 30 // Water level
          });
        }
      }
    }
    
    return terrain;
  }
}

/**
 * WorldGenerator - Creates and manages the game world
 */
export class WorldGenerator {
  /**
   * Create a new world generator
   * @param {Object} worldState - World state
   */
  constructor(worldState) {
    this.worldState = worldState;
    
    // Chunk management
    this.chunks = worldState.chunks || new Map();
    this.loadedChunks = new Set();
    this.activeChunks = new Set();
    
    // Create terrain generator
    this.terrainGenerator = new TerrainGenerator();
    
    // Quantum processor reference
    this.quantumProcessor = null;
    
    // World parameters
    this.chunkSize = 16;
    this.viewDistance = 3; // Chunks
    this.seed = worldState.seed || `world-${Date.now()}`;
    this.maxActiveChunks = 9; // 3x3 area
    
    // Player position for loading chunks
    this.lastPlayerChunk = null;
  }
  
  /**
   * Set the quantum processor
   * @param {QuantumCore} processor - Quantum processor
   */
  setQuantumProcessor(processor) {
    this.quantumProcessor = processor;
  }
  
  /**
   * Generate the entire world
   * @param {string} seed - World seed
   */
  async generateWorld(seed) {
    // Set world seed
    this.seed = seed;
    this.worldState.seed = seed;
    
    // Clear existing chunks
    this.chunks.clear();
    this.loadedChunks.clear();
    this.activeChunks.clear();
    
    // Set terrain generator seed
    this.terrainGenerator.seed = this.hashSeed(seed);
    
    console.log(`Generating world with seed: ${seed}`);
    
    // In a real implementation, this would generate the initial chunks
    // around the player starting position
    
    // For this example, we'll just create a small 3x3 world
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        const position = new Vector3(x, 0, z);
        await this.generateChunk(position);
      }
    }
    
    console.log(`World generation complete: ${this.chunks.size} chunks created`);
  }
  
  /**
   * Generate a chunk at the given position
   * @param {Vector3} position - Chunk position
   * @returns {WorldChunk} - Generated chunk
   */
  async generateChunk(position) {
    // Check if chunk already exists
    const key = this.getChunkKey(position);
    if (this.chunks.has(key)) {
      return this.chunks.get(key);
    }
    
    // Create new chunk
    const chunk = new WorldChunk(position);
    
    // Use quantum processor to enhance generation if available
    let chunkSeed = this.seed + `-${position.x}-${position.y}-${position.z}`;
    
    if (this.quantumProcessor) {
      // Generate quantum-enhanced seed
      const coherenceLevel = this.quantumProcessor.quantumState.coherenceLevel;
      const quantumFactor = Math.min(1.0, coherenceLevel / 2.0);
      
      // More complex generation for higher quantum states
      if (coherenceLevel > 1.5) {
        this.terrainGenerator.octaves = 6;
        this.terrainGenerator.persistence = 0.6;
      }
      
      if (window.SAAAM && window.SAAAM.quantum && window.SAAAM.quantum.generateQuantumSeed) {
        chunkSeed = await window.SAAAM.quantum.generateQuantumSeed(chunkSeed);
      }
    }
    
    // Generate terrain
    chunk.terrain = this.terrainGenerator.generate({
      seed: this.hashSeed(chunkSeed)
    });
    
    // Populate entities and structures (placeholder)
    // In a real implementation, this would add NPCs, resources, etc.
    
    // Add chunk to world
    chunk.loaded = true;
    this.chunks.set(key, chunk);
    this.loadedChunks.add(key);
    
    return chunk;
  }
  
  /**
   * Convert a chunk position to a map key
   * @param {Vector3} position - Chunk position
   * @returns {string} - Chunk key
   */
  getChunkKey(position) {
    return `${position.x},${position.y},${position.z}`;
  }
  
  /**
   * Hash a seed string to a numeric value
   * @param {string} seed - Seed string
   * @returns {number} - Numeric seed
   */
  hashSeed(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
  
  /**
   * Update world state
   * @param {number} deltaTime - Time since last frame
   */
  async update(deltaTime) {
    // Update chunk loading based on player position
    await this.updateChunks();
  }
  
  /**
   * Update chunks based on player position
   */
  async updateChunks() {
    // Get player position
    const player = window.GameState ? window.GameState.player : null;
    if (!player || !player.position) return;
    
    // Convert player position to chunk coordinates
    const chunkX = Math.floor(player.position.x / (this.chunkSize * 16));
    const chunkZ = Math.floor(player.position.z / (this.chunkSize * 16));
    const playerChunk = new Vector3(chunkX, 0, chunkZ);
    
    // Check if player has moved to a new chunk
    if (this.lastPlayerChunk && this.lastPlayerChunk.x === playerChunk.x &&
        this.lastPlayerChunk.y === playerChunk.y && this.lastPlayerChunk.z === playerChunk.z) {
      return; // Player hasn't changed chunks
    }
    
    // Update last player chunk
    this.lastPlayerChunk = playerChunk;
    
    // Load chunks in view distance
    for (let x = -this.viewDistance; x <= this.viewDistance; x++) {
      for (let z = -this.viewDistance; z <= this.viewDistance; z++) {
        const chunkPos = new Vector3(playerChunk.x + x, 0, playerChunk.z + z);
        const chunkKey = this.getChunkKey(chunkPos);
        
        // Activate closest chunks
        const isActive = Math.abs(x) <= 1 && Math.abs(z) <= 1;
        
        // If chunk not loaded, generate it
        if (!this.chunks.has(chunkKey)) {
          const chunk = await this.generateChunk(chunkPos);
          chunk.active = isActive;
          
          if (isActive) {
            this.activeChunks.add(chunkKey);
          }
        } else {
          // Update existing chunk
          const chunk = this.chunks.get(chunkKey);
          chunk.lastAccess = Date.now();
          
          if (isActive && !chunk.active) {
            chunk.active = true;
            this.activeChunks.add(chunkKey);
          } else if (!isActive && chunk.active) {
            chunk.active = false;
            this.activeChunks.delete(chunkKey);
          }
        }
      }
    }
    
    // Unload distant chunks (not implemented in this demo)
  }
  
  /**
   * Get chunk at the given position
   * @param {Vector3} position - World position
   * @returns {WorldChunk} - Chunk at position or null
   */
  getChunkAt(position) {
    const chunkX = Math.floor(position.x / (this.chunkSize * 16));
    const chunkZ = Math.floor(position.z / (this.chunkSize * 16));
    const key = this.getChunkKey(new Vector3(chunkX, 0, chunkZ));
    
    return this.chunks.has(key) ? this.chunks.get(key) : null;
  }
  
  /**
   * Get height at the given position
   * @param {number} x - X coordinate
   * @param {number} z - Z coordinate
   * @returns {number} - Height at position or 0
   */
  getHeightAt(x, z) {
    // Find chunk containing position
    const chunk = this.getChunkAt(new Vector3(x, 0, z));
    if (!chunk || !chunk.terrain) return 0;
    
    // Convert world coordinates to chunk-local coordinates
    const localX = Math.floor(x % (this.chunkSize * 16));
    const localZ = Math.floor(z % (this.chunkSize * 16));
    
    // Get height from terrain
    if (localX >= 0 && localX < 16 && localZ >= 0 && localZ < 16) {
      return chunk.terrain.heightmap[localX][localZ];
    }
    
    return 0;
  }
  
  /**
   * Get material at the given position
   * @param {number} x - X coordinate
   * @param {number} z - Z coordinate
   * @returns {string} - Material at position or 'unknown'
   */
  getMaterialAt(x, z) {
    // Find chunk containing position
    const chunk = this.getChunkAt(new Vector3(x, 0, z));
    if (!chunk || !chunk.terrain) return 'unknown';
    
    // Convert world coordinates to chunk-local coordinates
    const localX = Math.floor(x % (this.chunkSize * 16));
    const localZ = Math.floor(z % (this.chunkSize * 16));
    
    // Get material from terrain
    if (localX >= 0 && localX < 16 && localZ >= 0 && localZ < 16) {
      return chunk.terrain.materials[localX][localZ];
    }
    
    return 'unknown';
  }
  
  /**
   * Check if position is walkable
   * @param {number} x - X coordinate
   * @param {number} z - Z coordinate
   * @returns {boolean} - True if walkable
   */
  isWalkable(x, z) {
    const material = this.getMaterialAt(x, z);
    return material !== 'water' && material !== 'unknown';
  }
  
  /**
   * Find spawn position
   * @returns {Object} - Spawn position {x, y, z}
   */
  findSpawnPosition() {
    // In a real implementation, this would find a suitable spawn position
    // For this example, we'll just return a fixed position
    const x = 0;
    const z = 0;
    const y = this.getHeightAt(x, z);
    
    return { x, y, z };
  }
  
  /**
   * Create quantum anomaly at position
   * @param {number} x - X coordinate
   * @param {number} z - Z coordinate
   * @returns {Object} - Created anomaly
   */
  createQuantumAnomaly(x, z) {
    // Find chunk containing position
    const chunk = this.getChunkAt(new Vector3(x, 0, z));
    if (!chunk) return null;
    
    // Create anomaly
    const anomalyHeight = this.getHeightAt(x, z);
    const anomaly = {
      type: 'quantum-anomaly',
      position: { x, y: anomalyHeight, z },
      created: Date.now(),
      lifespan: 5000 + Math.random() * 10000, // 5-15 seconds
      radius: 1 + Math.random() * 3,
      intensity: this.quantumProcessor ? this.quantumProcessor.quantumState.coherenceLevel : 1.0
    };
    
    // Add to chunk
    chunk.entities.push(anomaly);
    
    return anomaly;
  }
}