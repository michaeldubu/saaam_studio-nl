// src/engine/DSLIntegration.js

import { GameState } from './GameState.js';
import { SaaamInterpreter } from './Interpreter.js';

export class DSLIntegration {
  constructor() {
    this.interpreter = new SaaamInterpreter();
    this.objectScriptMap = new Map(); // Tracks object => script text
  }

  /**
   * Attach a script to a GameObject and execute its create() function
   * @param {Object} entity - GameObject or component
   * @param {string} scriptSource - SAAAM DSL source code as string
   */
  attachToObject(entity, scriptSource) {
    if (!entity || typeof scriptSource !== 'string') return;

    try {
      const namespace = this.interpreter.createNamespace(scriptSource);
      this.objectScriptMap.set(entity, namespace);

      if (typeof namespace.create === 'function') {
        namespace.create.call(entity);
      }
    } catch (err) {
      console.error('[DSLIntegration] Failed to attach script:', err);
    }
  }

  /**
   * Call step(deltaTime) on all attached scripts
   * @param {number} deltaTime
   */
  stepAll(deltaTime) {
    for (const [entity, namespace] of this.objectScriptMap) {
      if (typeof namespace.step === 'function') {
        try {
          namespace.step.call(entity, deltaTime);
        } catch (err) {
          console.warn('[DSL step error]', err);
        }
      }
    }
  }

  /**
   * Call draw(ctx) on all attached scripts
   * @param {CanvasRenderingContext2D} ctx
   */
  drawAll(ctx) {
    for (const [entity, namespace] of this.objectScriptMap) {
      if (typeof namespace.draw === 'function') {
        try {
          namespace.draw.call(entity, ctx);
        } catch (err) {
          console.warn('[DSL draw error]', err);
        }
      }
    }
  }
}
