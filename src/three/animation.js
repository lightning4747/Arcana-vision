import { camera } from './scene.js';
import { cards, cursor } from './world.js';

export function updateAnimation(appState) {
    const { currentState, time, handData, ui } = appState;
    
    // Hand Smoothing
    let smoothX = appState.smoothX || 0;
    let smoothY = appState.smoothY || 0;
    const LERP_FACTOR = 0.15;
    const ROTATION_SENSITIVITY = 4.0;
    let selectedCardIndex = appState.selectedCardIndex || -1;

    // Smooth Hand Movement
    if (handData.isHandPresent) {
        smoothX += (handData.rawX - smoothX) * LERP_FACTOR;
        smoothY += (handData.rawY - smoothY) * LERP_FACTOR;
        appState.smoothX = smoothX;
        appState.smoothY = smoothY;

        const targetX = (smoothX / window.innerWidth) * 2 - 1;
        const targetY = -(smoothY / window.innerHeight) * 2 + 1;
        
        // Move Cursor
        cursor.position.x += (targetX * 10 - cursor.position.x) * 0.2;
        cursor.position.y += (targetY * 5 - cursor.position.y) * 0.2;
        cursor.position.z = 5 - (handData.rawZ * 10);
        
        // Camera Parallax
        camera.position.x += (targetX * 1.5 - camera.position.x) * 0.05;
        camera.position.y += (targetY * 0.8 - camera.position.y) * 0.05;
        camera.lookAt(0,0,0);
    }

    // State Transitions
    if (handData.isFist) {
        if (currentState === 'WHEEL') {
            appState.currentState = 'SELECTED';
            selectCard(appState);
            updateUI(appState);
        }
    } else {
        if (currentState === 'SELECTED') {
            resetSelection(appState);
            updateUI(appState);
        }
    }

    if (currentState === 'IDLE' && handData.isHandPresent) {
        const distFromCenter = Math.abs((smoothX / window.innerWidth) * 2 - 1);
        if (distFromCenter > 0.2) {
            appState.currentState = 'WHEEL';
            updateUI(appState);
        }
    }

    updateCardPositions(appState);
}

function updateCardPositions(appState) {
    const { currentState, smoothX } = appState;
    const wheelRadius = 5.5;
    
    cards.forEach((card, i) => {
        if (currentState === 'SELECTED') {
            // Handled in selectCard
        } else if (currentState === 'WHEEL') {
            const normX = (smoothX / window.innerWidth) * 2 - 1;
            const baseAngle = normX * (Math.PI * 4.0);
            const offset = (i - cards.length / 2) * 0.25; 
            const angle = baseAngle + offset;
            
            const tx = Math.sin(angle) * wheelRadius;
            const ty = Math.cos(angle) * (wheelRadius * 0.4); 
            const tz = Math.cos(angle) * 2;

            card.position.x += (tx - card.position.x) * 0.1;
            card.position.y += (ty - card.position.y) * 0.1;
            card.position.z += (tz - card.position.z) * 0.1;

            const targetRotX = -Math.sin(angle) * 0.5;
            const targetRotY = -angle;
            const targetRotZ = -Math.cos(angle) * 0.2;

            card.rotation.x += (targetRotX - card.rotation.x) * 0.1;
            card.rotation.y += (targetRotY - card.rotation.y) * 0.1;
            card.rotation.z += (targetRotZ - card.rotation.z) * 0.1;
            card.scale.setScalar(1);
        } else { // IDLE
            const deckHeight = cards.length * 0.05;
            const tx = 0;
            const ty = i * 0.05 - (deckHeight * 0.5);
            const tz = 0;
            card.position.x += (tx - card.position.x) * 0.05;
            card.position.y += (ty - card.position.y) * 0.05;
            card.position.z += (tz - card.position.z) * 0.05;
            card.rotation.x += (-0.2 - card.rotation.x) * 0.05;
            card.rotation.y += ((-appState.time * 0.2) - card.rotation.y) * 0.05;
            card.rotation.z += (0 - card.rotation.z) * 0.05;
            card.scale.setScalar(1);
        }
    });
}

function selectCard(appState) {
    let closestDist = Infinity;
    let closestIndex = -1;

    cards.forEach((card, i) => {
        const dist = Math.abs(card.position.x);
        if (dist < closestDist) {
            closestDist = dist;
            closestIndex = i;
        }
    });

    if (closestIndex !== -1) {
        appState.selectedCardIndex = closestIndex;
        const card = cards[closestIndex];
        card.position.set(0, 0, 2.5);
        card.rotation.set(0, 0, 0);
        card.scale.setScalar(1.5);
        cards.forEach((c, i) => {
            if (i !== closestIndex) {
                c.position.z = -10;
                c.material.forEach(m => m.opacity = 0.3);
            }
        });
        
        // FIX: Access DOM elements via appState.dom
        appState.dom.cardNameEl.innerText = card.userData.name;
        appState.dom.cardMeaningEl.innerText = card.userData.meaning;
        appState.ui.readingDisplay.classList.add('active');
    }
}

function resetSelection(appState) {
    appState.selectedCardIndex = -1;
    appState.ui.readingDisplay.classList.remove('active');
    cards.forEach(c => { c.material.forEach(m => m.opacity = 1); });
    appState.currentState = 'WHEEL';
}

function updateUI(appState) {
    const { handData, currentState, ui } = appState;
    ui.feedbackEl.style.opacity = handData.isHandPresent ? 1 : 0;
    if (currentState === 'IDLE') {
        ui.textEl.innerText = "Show Hand & Move Side to Side";
        ui.iconEl.innerText = "🖐️";
    } else if (currentState === 'WHEEL') {
        ui.textEl.innerText = "Make a Fist to Select";
        ui.iconEl.innerText = "✊";
    } else if (currentState === 'SELECTED') {
        ui.textEl.innerText = "Open Hand to Reset";
        ui.iconEl.innerText = "🖐️";
    }
}