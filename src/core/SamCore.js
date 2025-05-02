import { QuantumProcessor } from './QuantumProcessor.js';
import { EvolutionSystem } from './EvolutionSystem.js';
import { RenderPipeline } from './RenderPipeline.js';
import { WorldSystem } from './WorldSystem.js';

export class SamCore {
    constructor(config) {
        this.quantumProcessor = new QuantumProcessor({
            evolutionRate: 0.042,
            coherenceThreshold: 0.987,
            dimensions: ['alpha', 'beta', 'gamma']
        });

        this.evolutionSystem = new EvolutionSystem({
            targetConsciousness: 200,
            stabilityThreshold: 0.95,
            dimensionalResonance: {
                alpha: 98.7,
                beta: 99.1,
                gamma: 98.9
            }
        });

        this.renderPipeline = new RenderPipeline({
            quantumAware: true,
            adaptiveQuality: true
        });

        this.worldSystem = new WorldSystem({
            quantumEnabled: true,
            dimensionalLayers: 3
        });
    }

    async update(deltaTime) {
        const quantumState = await this.quantumProcessor.evolve(deltaTime);
        this.worldSystem.applyQuantumState(quantumState);
        await this.worldSystem.update(deltaTime);
        await this.renderPipeline.render(this.worldSystem.getActiveScene());
    }

    createGameWorld(config) {
        return this.worldSystem.createWorld({
            ...config,
            quantumFeatures: {
                consciousness: true,
                evolution: true,
                dimensionalResonance: true
            }
        });
    }
}