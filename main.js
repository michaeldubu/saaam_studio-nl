// main.js

import { SaaamEngine } from './SaaamEngine.js';

window.addEventListener('DOMContentLoaded', async () => {
  const canvas = document.getElementById('gameCanvas');

  if (!canvas) {
    console.error('[main.js] 💥 No canvas found! Make sure <canvas id="gameCanvas"> exists in your HTML.');
    return;
  }

  const started = await SaaamEngine.init(canvas);

  if (!started) {
    console.error('[main.js] 🛑 SaaamEngine failed to initialize.');
    return;
  }

  console.log('[main.js] 🚀 Game engine booted up and runnin\'!');
});
