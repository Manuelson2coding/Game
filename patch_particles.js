import fs from 'fs';
let code = fs.readFileSync('src/components/HelixGame.tsx', 'utf-8');

const particlesFunc = `
  // Helper to spawn small colored impact particles
  const spawnImpactParticles = (scene: THREE.Scene, x: number, y: number, z: number, colorHex: string, count: number = 8) => {
    const mat = new THREE.MeshBasicMaterial({ color: colorHex });
    for (let i = 0; i < count; i++) {
      const size = 0.08 + Math.random() * 0.08;
      const geo = new THREE.BoxGeometry(size, size, size);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      debrisRef.current.push({
        mesh,
        vx: Math.cos(angle) * speed,
        vy: 1.5 + Math.random() * 3,
        vz: Math.sin(angle) * speed,
        rx: (Math.random() - 0.5) * 15,
        ry: (Math.random() - 0.5) * 15,
        life: 0.4 + Math.random() * 0.3,
      });
    }
  };
`;

code = code.replace('const spawnShatterDebris =', particlesFunc + '\n  const spawnShatterDebris =');

fs.writeFileSync('src/components/HelixGame.tsx', code);
console.log('patched particles func');
