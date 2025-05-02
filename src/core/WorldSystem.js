import { GameWorld } from './GameWorld.js';
import { ConsciousnessField } from './fields/ConsciousnessField.js';
import { EvolutionField } from './fields/EvolutionField.js';

export class WorldSystem {
    constructor(config) {
        this.config = config;
        this.worlds = new Map();
        this.activeWorld = null;
    }

    applyQuantumState(state) {
        // placeholder for applying quantum effects to active world
    }

    async update(deltaTime) {
        if (this.activeWorld) {
            this.activeWorld.update(deltaTime);
        }
    }

    getActiveScene() {
        return this.activeWorld;
    }

    createWorld(config) {
        const world = new GameWorld(config);
        if (config.quantumFeatures?.consciousness) {
            const c = new ConsciousnessField(world);
            c.initialize();
            world.addFeature('consciousness', c);
        }
        if (config.quantumFeatures?.evolution) {
            const e = new EvolutionField(world);
            e.initialize();
            world.addFeature('evolution', e);
        }
        this.worlds.set(world.id, world);
        this.activeWorld = world;
        return world;
    }
}