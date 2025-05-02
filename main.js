import { SaaamEngine } from './SaaamEngine.js';

const canvas = document.getElementById('saaam-canvas');

(async () => {
  const success = await SaaamEngine.init(canvas);
  if (!success) {
    console.error("SAAAM Engine failed to boot.");
  } else {
    console.log("🔥 SAAAM Engine online and purring like a shotgun.");
  }
})();
