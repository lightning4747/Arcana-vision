import * as THREE from 'three';
import { initScene, composer } from '../three/scene.js';
import { createTextures } from '../three/textures.js';
import { createWorld, cards, cursor } from '../three/world.js';
import { updateAnimation } from '../three/animation.js';
import { initVision } from '../vision/mediapipe.js';
import { majorArcana, shuffleDeck } from '../data/tarotData.js';

// DOM Elements
const canvasContainer = document.getElementById('canvas-container');
const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('start-overlay');
const cardNameEl = document.getElementById('card-name');
const cardMeaningEl = document.getElementById('card-meaning');

// Shared State
const appState = {
    currentState: 'IDLE', // IDLE, WHEEL, SELECTED
    time: 0,
    handData: {
        rawX: 0,
        rawY: 0,
        rawZ: 0,
        isHandPresent: false,
        isFist: false
    },
    ui: {
        feedbackEl: document.getElementById('gesture-feedback'),
        iconEl: document.querySelector('.gesture-icon'),
        textEl: document.getElementById('instruction-label'),
        readingDisplay: document.getElementById('reading-display')
    }
};

// 1. Initialize 3D Scene
initScene(canvasContainer);
const textures = createTextures();

// 2. Prepare Data
const deckData = shuffleDeck([...majorArcana]);

// 3. Create 3D Objects
createWorld(deckData, textures);

// 4. Initialize Vision (MediaPipe)
initVision(appState);

// 5. Event Listeners
window.addEventListener('resize', () => {
    const camera = window.CAMERA; // Attached to window for easy access in resize
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    const renderer = window.RENDERER;
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

startBtn.addEventListener('click', () => {
    const videoElement = document.getElementById('input-video');
    const cameraUtils = new Camera(videoElement, {
        onFrame: async () => {
            // This loop is handled inside mediapipe.js via the `onResults` callback
            // We just need to start the camera
        },
        width: 640,
        height: 480
    });
    
    // We need to pass the camera instance to the MediaPipe wrapper to trigger sends
    // But for simplicity in this structure, we attach the camera logic to the global window or pass it back.
    // Revised approach: initVision will return the camera utility.
    
    const visionCamera = appState.visionCamera;
    visionCamera.start()
        .then(() => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 1000);
        })
        .catch(err => {
            console.error(err);
            alert("Camera access denied.");
        });
});

// 6. Start Animation Loop
function animate() {
    requestAnimationFrame(animate);
    appState.time += 0.01;
    updateAnimation(appState);
    composer.render();
}

animate();