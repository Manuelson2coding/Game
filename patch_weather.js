import fs from 'fs';
let code = fs.readFileSync('src/components/HelixGame.tsx', 'utf-8');

code = code.replace(
  "const backgroundDustRef = useRef<THREE.Points | null>(null);",
  "const backgroundDustRef = useRef<THREE.Points | null>(null);\n  const weatherParticlesRef = useRef<{ mesh: THREE.Points; velocities: Float32Array; type: 'rain' | 'snow' } | null>(null);"
);

// We need to find where the scene is created and add weather particles
const weatherSetupCode = `
    // Add Weather Particles based on theme
    if (weatherParticlesRef.current) {
      scene.remove(weatherParticlesRef.current.mesh);
      weatherParticlesRef.current = null;
    }
    
    if (theme.weather === 'rain' || theme.weather === 'snow') {
      const particleCount = theme.weather === 'rain' ? 800 : 600;
      const weatherGeo = new THREE.BufferGeometry();
      const weatherPositions = new Float32Array(particleCount * 3);
      const weatherVelocities = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 30;
        const y = (Math.random() - 0.5) * totalHeight;
        const z = (Math.random() - 0.5) * 30;
        
        weatherPositions[i * 3] = x;
        weatherPositions[i * 3 + 1] = y;
        weatherPositions[i * 3 + 2] = z;
        
        if (theme.weather === 'rain') {
          weatherVelocities[i * 3] = (Math.random() - 0.5) * 2;
          weatherVelocities[i * 3 + 1] = -(Math.random() * 15 + 15); // Fall fast
          weatherVelocities[i * 3 + 2] = (Math.random() - 0.5) * 2;
        } else {
          weatherVelocities[i * 3] = (Math.random() - 0.5) * 4;
          weatherVelocities[i * 3 + 1] = -(Math.random() * 3 + 2); // Fall slowly
          weatherVelocities[i * 3 + 2] = (Math.random() - 0.5) * 4;
        }
      }
      weatherGeo.setAttribute('position', new THREE.BufferAttribute(weatherPositions, 3));
      
      const weatherMat = new THREE.PointsMaterial({
        color: theme.weather === 'rain' ? '#88ccff' : '#ffffff',
        size: theme.weather === 'rain' ? 0.08 : 0.15,
        transparent: true,
        opacity: theme.weather === 'rain' ? 0.6 : 0.8,
        blending: THREE.AdditiveBlending,
      });
      
      const weatherParticles = new THREE.Points(weatherGeo, weatherMat);
      scene.add(weatherParticles);
      weatherParticlesRef.current = { mesh: weatherParticles, velocities: weatherVelocities, type: theme.weather };
    }
`;

code = code.replace(
  "backgroundDustRef.current = dustParticles;",
  "backgroundDustRef.current = dustParticles;\n" + weatherSetupCode
);

const weatherUpdateCode = `
      // Update Weather Particles
      if (weatherParticlesRef.current) {
        const { mesh, velocities, type } = weatherParticlesRef.current;
        const positions = mesh.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length / 3; i++) {
          positions[i * 3] += velocities[i * 3] * dt;
          positions[i * 3 + 1] += velocities[i * 3 + 1] * dt;
          positions[i * 3 + 2] += velocities[i * 3 + 2] * dt;
          
          if (type === 'snow') {
             // Add some sway to snow
             positions[i * 3] += Math.sin(currentTime * 0.001 + i) * 2 * dt;
          }
          
          // Wrap around vertical bounds
          if (positions[i * 3 + 1] < ballYRef.current - 15) {
            positions[i * 3 + 1] = ballYRef.current + 15;
            positions[i * 3] = ballYRef.current + (Math.random() - 0.5) * 30; // Randomize x a bit
            positions[i * 3 + 2] = ballYRef.current + (Math.random() - 0.5) * 30; // Randomize z a bit
          }
        }
        mesh.geometry.attributes.position.needsUpdate = true;
      }
`;

code = code.replace(
  "if (backgroundDustRef.current) {",
  weatherUpdateCode + "\n      if (backgroundDustRef.current) {"
);

fs.writeFileSync('src/components/HelixGame.tsx', code);
console.log('patched weather');
