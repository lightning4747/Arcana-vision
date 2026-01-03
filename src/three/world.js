import * as THREE from 'three';
import { scene } from './scene.js';

let cards = [];
let cursor;

export function createWorld(deckData, { createCardTexture, createBackTexture }) {
    const cardGeo = new THREE.BoxGeometry(1.5, 2.4, 0.05);
    const cardBackMat = new THREE.MeshStandardMaterial({ 
        map: createBackTexture(), 
        roughness: 0.3, 
        metalness: 0.6 
    });

    deckData.forEach((data, i) => {
        const frontMat = new THREE.MeshStandardMaterial({
            map: createCardTexture(data.id, data.name), 
            roughness: 0.2, 
            metalness: 0.1, 
            emissive: 0x220033, 
            emissiveIntensity: 0.2
        });
        const edgeMat = new THREE.MeshStandardMaterial({ 
            color: 0xd4af37, 
            roughness: 0.2, 
            metalness: 0.8 
        });
        const materials = [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, cardBackMat];
        const mesh = new THREE.Mesh(cardGeo, materials);
        mesh.userData = { ...data, originalIndex: i };
        mesh.position.set(0, i * 0.05 - (deckData.length * 0.025), 0);
        mesh.rotation.x = -0.2;
        scene.add(mesh);
        cards.push(mesh);
    });

    // Environment Particles
    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(1000 * 3);
    for(let i=0; i < 3000; i++) posArray[i] = (Math.random() - 0.5) * 30;
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({ 
        size: 0.05, 
        color: 0x9B59B6, 
        transparent: true, 
        opacity: 0.8, 
        blending: THREE.AdditiveBlending 
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // Cursor
    const cursorGeo = new THREE.RingGeometry(0.3, 0.35, 32);
    const cursorMat = new THREE.MeshBasicMaterial({ 
        color: 0xFFD700, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.8 
    });
    cursor = new THREE.Mesh(cursorGeo, cursorMat);
    cursor.position.z = 5;
    scene.add(cursor);
}

export { cards, cursor };