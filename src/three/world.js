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


}

