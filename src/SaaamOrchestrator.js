import { GameState } from './GameState.js';
import { SAMEngine } from './ai/nlp/SAMEngine.js';

import { QuantumLocalCore } from './modules/quantum/quantum-local-core.tsx';
import { QuantumWorldGen } from './modules/quantum/quantum-world-gen.tsx';

import { QuantumCivEngine } from './modules/systems/civilization/quantum-civ-engine.tsx';
import { QuantumDiplomacy } from './modules/systems/diplomacy/quantum-diplomacy.tsx';
import { QuantumCongress } from './modules/systems/policy/quantum-congress.tsx';

class SaaamOrchestrator {
	constructor() {
		this.nlp = new SAMEngine({
			synergy: { resonanceEnabled: true, harmonyThreshold: 0.95, adaptationRate: 0.042 },
			evolution: { rate: 0.042, stability: true, consciousness: true }
		});

		this.quantumCore = new QuantumLocalCore();
		this.worldGen = new QuantumWorldGen();
		this.civEngine = new QuantumCivEngine();
		this.diplomacy = new QuantumDiplomacy();
		this.congress = new QuantumCongress();

		this.commandHistory = [];
	}

	async init() {
		await this.quantumCore.init();
		await this.worldGen.init();
		await this.civEngine.init();
		await this.diplomacy.init();
		await this.congress.init();
	}

	async process(input) {
		this.commandHistory.push(input);
		const intent = await this.nlp.processUserInput(input);

		if (!intent || !intent.type) {
			console.warn("Unknown intent:", intent);
			return;
		}

		switch (intent.type) {
			case 'create_world':
				await this.worldGen.generate(intent.parameters);
				break;
			case 'spawn_civilization':
				await this.civEngine.spawn(intent.parameters);
				break;
			case 'propose_law':
				await this.congress.proposeBill(intent.parameters);
				break;
			case 'negotiate':
				await this.diplomacy.negotiate(intent.parameters);
				break;
			case 'evolve':
				await this.quantumCore.evolve(intent.parameters);
				break;
			default:
				console.warn("Unhandled intent type:", intent.type);
		}
	}

	async update(deltaTime) {
		await this.quantumCore.update(deltaTime);
		await this.worldGen.update(deltaTime);
		await this.civEngine.update(deltaTime);
		await this.diplomacy.update(deltaTime);
		await this.congress.update(deltaTime);
	}
}

export const SaaamMind = new SaaamOrchestrator();
