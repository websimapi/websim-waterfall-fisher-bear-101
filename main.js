
```javascript
import * as THREE from 'three';
import { scene, camera, renderer, resizeRenderer, createLights, initOrbitControls, getOrbitControls } from './scene.js';
import { createScenery } from './entities/scenery.js';
import { createWaterfall, updateWaterfall } from './entities/waterfall.js';
import { initControls } from './systems/controls.js';
import { initGame, updateGame } from './systems/game.js';
import { initDevTools } from './systems/dev.js';
import * as TWEEN from 'tween';

// --- SCENE SETUP ---
const scenery = createScenery();
scene.add(scenery);
const waterfall = createWaterfall();
scene.add(waterfall);
createLights(scene);

// --- INITIALIZE SYSTEMS ---
initDevTools(scene);
initGame();
initControls(scene, camera);

// --- RENDERER & RESIZE ---
import { mountRenderer } from './scene.js';
mountRenderer(document.getElementById('game-container'));
window.addEventListener('resize', resizeRenderer);

// --- GAME LOOP ---
function animate() {
    requestAnimationFrame(animate); 
    
    const controls = getOrbitControls();
    if (controls?.enabled) {
        controls.update();
    }

    updateWaterfall(waterfall);
    updateGame();
    TWEEN.update(performance.now()); // drive tween-based animations with timestamp

    renderer.render(scene, camera);
}

// Start the animation loop
animate();

const tapOverlay = document.getElementById('tap-overlay');
const tryFullscreen = async () => {
  try {
    const el = document.documentElement;
    if (el.requestFullscreen) await el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen(); 
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  } catch {}
};
tapOverlay?.addEventListener('pointerdown', async () => {
  await tryFullscreen();
  tapOverlay.classList.add('hidden');
}, { once: true });