export class GameWorld {
    constructor(config) {
        this.id = config.name || 'UnnamedWorld';
        this.entities = new Map();
        this.systems = new Map();
        this.quantumField = config.quantumField || {
            update: () => {},
            getStateForEntity: () => ({})
        };
    }

    update(deltaTime) {
        this.quantumField.update(deltaTime);
        this.entities.forEach(entity => {
            const quantumState = this.quantumField.getStateForEntity(entity);
            entity.update(deltaTime, quantumState);
        });
        this.systems.forEach(system => system.update(deltaTime));
    }

    createEntity(config) {
        const entity = {
            id: config.name || `Entity${Date.now()}`,
            components: new Map(),
            update: (dt, qs) => {}
        };
        if (config.quantumAware) {
            entity.components.set('quantum', {
                coherence: true,
                evolution: true,
                resonance: true
            });
        }
        this.entities.set(entity.id, entity);
        return entity;
    }

    addFeature(name, feature) {
        this.systems.set(name, feature);
    }
}