import * as THREE from 'three';

export function createSkinTexture(pattern: string, baseColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Base background fill
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  if (pattern === 'basketball') {
    // Basketball dark lines & dimple dots
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 12;

    // Horizontal equator line
    ctx.beginPath();
    ctx.moveTo(0, 256);
    ctx.lineTo(512, 256);
    ctx.stroke();

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(256, 0);
    ctx.lineTo(256, 512);
    ctx.stroke();

    // Side curved seams
    ctx.beginPath();
    ctx.arc(0, 256, 180, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(512, 256, 180, Math.PI / 2, -Math.PI / 2);
    ctx.stroke();

    // Dimple noise dots
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    for (let x = 0; x < 512; x += 16) {
      for (let y = 0; y < 512; y += 16) {
        if ((x + y) % 32 === 0) {
          ctx.beginPath();
          ctx.arc(x + 8, y + 8, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  } else if (pattern === 'cyber') {
    // Matrix code circuit grid
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#00ffcc';
    ctx.shadowBlur = 8;

    // Grid lines
    for (let i = 0; i < 512; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    // Glowing nodes
    ctx.fillStyle = '#ffffff';
    for (let x = 64; x < 512; x += 128) {
      for (let y = 64; y < 512; y += 128) {
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (pattern === 'fire') {
    // Flame gradient swirls
    const grad = ctx.createLinearGradient(0, 512, 0, 0);
    grad.addColorStop(0, '#330000');
    grad.addColorStop(0.3, '#ff2200');
    grad.addColorStop(0.7, '#ffaa00');
    grad.addColorStop(1, '#ffffff');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Flame tongue arcs
    ctx.strokeStyle = '#ffffaa';
    ctx.lineWidth = 16;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(100 + i * 80, 256, 120, 0, Math.PI);
      ctx.stroke();
    }
  } else if (pattern === 'gold') {
    // Metallic sheen pattern
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#ffd700');
    grad.addColorStop(0.3, '#fff2a3');
    grad.addColorStop(0.5, '#b8860b');
    grad.addColorStop(0.8, '#ffe87c');
    grad.addColorStop(1, '#d4af37');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.lineTo(412, 512);
    ctx.stroke();
  } else if (pattern === 'rainbow') {
    // Rainbow stripes
    const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
    const stripeWidth = 512 / colors.length;
    colors.forEach((col, idx) => {
      ctx.fillStyle = col;
      ctx.fillRect(0, idx * stripeWidth, 512, stripeWidth);
    });
  } else if (pattern === 'galaxy') {
    // Deep space background with star dust
    ctx.fillStyle = '#0a001a';
    ctx.fillRect(0, 0, 512, 512);

    // Nebula swirl
    const nebGrad = ctx.createRadialGradient(256, 256, 20, 256, 256, 250);
    nebGrad.addColorStop(0, 'rgba(255, 0, 255, 0.6)');
    nebGrad.addColorStop(0.5, 'rgba(100, 0, 255, 0.3)');
    nebGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebGrad;
    ctx.fillRect(0, 0, 512, 512);

    // White stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 120; i++) {
      const sx = Math.random() * 512;
      const sy = Math.random() * 512;
      const sr = Math.random() * 2.5 + 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === 'emoji') {
    // Smiling face emoji
    ctx.fillStyle = '#ffee00';
    ctx.fillRect(0, 0, 512, 512);

    // Eyes
    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.ellipse(180, 200, 24, 36, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(332, 200, 24, 36, 0, 0, Math.PI * 2);
    ctx.fill();

    // Big Smile
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(256, 270, 110, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Rosy cheeks
    ctx.fillStyle = 'rgba(255, 80, 80, 0.4)';
    ctx.beginPath();
    ctx.arc(130, 280, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(382, 280, 30, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// Generates a splash stain texture for paint marks on platforms when bouncing
export function createSplatTexture(color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);
    ctx.fillStyle = color;

    // Center splash circle
    ctx.beginPath();
    ctx.arc(128, 128, 45, 0, Math.PI * 2);
    ctx.fill();

    // Random splat droplets radiating outwards
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const dist = 50 + Math.random() * 45;
      const r = 5 + Math.random() * 12;

      const dx = 128 + Math.cos(angle) * dist;
      const dy = 128 + Math.sin(angle) * dist;

      ctx.beginPath();
      ctx.arc(dx, dy, r, 0, Math.PI * 2);
      ctx.fill();

      // Connecting stroke
      ctx.lineWidth = r * 0.8;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(128, 128);
      ctx.lineTo(dx, dy);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
