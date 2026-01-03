import * as THREE from 'three';

// Note: We need renderer for anisotropy, but we'll grab it from window or pass it
// For simplicity, we'll use a default anisotropy or pass it later if needed.

export function createTextures() {
    function createCardTexture(index, name) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        const grd = ctx.createLinearGradient(0, 0, 0, 800);
        grd.addColorStop(0, "#1a0b2e");
        grd.addColorStop(1, "#000000");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 512, 800);
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 15;
        ctx.strokeRect(20, 20, 472, 760);
        ctx.save();
        ctx.beginPath();
        ctx.rect(40, 40, 432, 600);
        ctx.clip();
        ctx.fillStyle = "#0d0418";
        ctx.fillRect(40, 40, 432, 600);
        ctx.strokeStyle = "rgba(155, 89, 182, 0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for(let i=0; i<20; i++) {
            ctx.moveTo(256, 300);
            ctx.arc(256, 340, 50 + i*10, 0, Math.PI * 2);
        }
        ctx.stroke();
        ctx.restore();
        ctx.font = "bold 40px Cinzel";
        ctx.fillStyle = "#d4af37";
        ctx.textAlign = "center";
        ctx.fillText(`${index}. ${name.toUpperCase()}`, 256, 700);
        const texture = new THREE.CanvasTexture(canvas);
        if(window.RENDERER) texture.anisotropy = window.RENDERER.capabilities.getMaxAnisotropy();
        return texture;
    }

    function createBackTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#05010a";
        ctx.fillRect(0, 0, 512, 800);
        ctx.strokeStyle = "#4a3b69";
        ctx.lineWidth = 2;
        const cx = 256, cy = 400;
        for(let r=20; r<300; r+=20) {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.fillStyle = "#1a0b2e";
        ctx.beginPath();
        ctx.arc(cx, cy, 50, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx, cy-30); ctx.lineTo(cx+20, cy+20);
        ctx.moveTo(cx+20, cy+20); ctx.lineTo(cx-20, cy+20);
        ctx.moveTo(cx-20, cy+20); ctx.lineTo(cx, cy-30);
        ctx.stroke();
        return new THREE.CanvasTexture(canvas);
    }

    return { createCardTexture, createBackTexture };
}