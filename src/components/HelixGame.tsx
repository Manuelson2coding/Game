import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { ActivePowerUp, BallSkin, GameState, GameStats, TowerTheme } from '../types';
import { soundEngine } from '../utils/audio';
import { createSkinTexture, createSplatTexture } from '../utils/textureGenerator';

interface HelixGameProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  level: number;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  combo: number;
  setCombo: React.Dispatch<React.SetStateAction<number>>;
  isFever: boolean;
  setIsFever: React.Dispatch<React.SetStateAction<boolean>>;
  gems: number;
  setGems: React.Dispatch<React.SetStateAction<number>>;
  equippedSkin: BallSkin;
  theme: TowerTheme;
  stats: GameStats;
  setStats: React.Dispatch<React.SetStateAction<GameStats>>;
  activePowerUps: ActivePowerUp[];
  setActivePowerUps: React.Dispatch<React.SetStateAction<ActivePowerUp[]>>;
  sensitivity: number;
  onLevelComplete: (earnedGems: number, levelScore: number) => void;
  onGameOver: (finalScore: number) => void;
}

const SEGMENTS_PER_DISC = 12;
const PLATFORM_GAP = 3.6;
const BALL_RADIUS = 0.25;
const POLE_RADIUS = 0.65;
const DISC_OUTER_RADIUS = 2.4;

export const HelixGame: React.FC<HelixGameProps> = ({
  gameState,
  setGameState,
  level,
  score,
  setScore,
  combo,
  setCombo,
  isFever,
  setIsFever,
  gems,
  setGems,
  equippedSkin,
  theme,
  stats,
  setStats,
  activePowerUps,
  setActivePowerUps,
  sensitivity,
  onLevelComplete,
  onGameOver,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const poleGroupRef = useRef<THREE.Group | null>(null);
  const ballMeshRef = useRef<THREE.Mesh | null>(null);
  const ballLightRef = useRef<THREE.PointLight | null>(null);
  const trailParticlesRef = useRef<THREE.Points | null>(null);

  // Gameplay physics mutable state
  const rotationVelRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const isSmashingRef = useRef<boolean>(false);
  const previousPointerXRef = useRef<number>(0);
  const ballYRef = useRef<number>(0);
  const ballVyRef = useRef<number>(0);
  const passComboRef = useRef<number>(0);
  const slowMoTimerRef = useRef<number>(0);
  const squashYRef = useRef<number>(1.0);
  const cameraShakeRef = useRef<number>(0);
  const feverAuraMeshRef = useRef<THREE.Mesh | null>(null);



  const currentLevelPlatformCount = useRef<number>(12);
  const platformsDataRef = useRef<
    Array<{
      y: number;
      index: number;
      segments: Array<'normal' | 'hazard' | 'gap'>;
      meshGroup: THREE.Group;
      smashed: boolean;
      rotSpeed?: number;
    }>
  >([]);

  const gemsDataRef = useRef<
    Array<{
      mesh: THREE.Mesh;
      platformIdx: number;
      baseY: number;
      angle: number;
      collected: boolean;
    }>
  >([]);

  const debrisRef = useRef<
    Array<{
      mesh: THREE.Mesh;
      vx: number;
      vy: number;
      vz: number;
      rx: number;
      ry: number;
      life: number;
      maxLife: number;
    }>
  >([]);

  const shockwavesRef = useRef<
    Array<{
      mesh: THREE.Mesh;
      scale: number;
      opacity: number;
    }>
  >([]);

  const hazardMeshesRef = useRef<THREE.Mesh[]>([]);
  const backgroundDustRef = useRef<THREE.Points | null>(null);
  const weatherParticlesRef = useRef<{ mesh: THREE.Points; velocities: Float32Array; type: 'rain' | 'snow' } | null>(null);
  const splatsRef = useRef<THREE.Mesh[]>([]);

  // Init and rebuild 3D level whenever level or skin or theme changes
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(theme.bgColor1);
    scene.fog = new THREE.FogExp2(theme.bgColor1, 0.025);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 3, 7.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, theme.bgColor1, 0.7);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(8, 15, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 40;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    dirLight.shadow.bias = -0.0001; // Reduce self-shadowing artifacts
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(theme.platformColor, 0.5);
    backLight.position.set(-10, -5, -10);
    scene.add(backLight);

    // 5. Pole and Platforms Group (Rotates with user touch/drag)
    const poleGroup = new THREE.Group();
    scene.add(poleGroup);
    poleGroupRef.current = poleGroup;

    // Calculate total height
    const platformCount = 12 + Math.min(level * 3, 45);
    currentLevelPlatformCount.current = platformCount;
    const totalHeight = platformCount * PLATFORM_GAP + 6;

    // Central Pole
    const poleGeo = new THREE.CylinderGeometry(POLE_RADIUS, POLE_RADIUS, totalHeight, 32);
    const poleMat = new THREE.MeshPhysicalMaterial({
      color: theme.poleColor,
      roughness: 0.2,
      metalness: 0.6,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
    });
    const poleMesh = new THREE.Mesh(poleGeo, poleMat);
    poleMesh.position.y = -totalHeight / 2 + 2;
    poleMesh.receiveShadow = true;
    poleGroup.add(poleMesh);

    // Decorative Top Crown Cap
    const capGeo = new THREE.CylinderGeometry(POLE_RADIUS + 0.2, POLE_RADIUS, 0.6, 32);
    const capMat = new THREE.MeshPhysicalMaterial({
      color: theme.finishColor,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = 2.3;
    poleGroup.add(capMesh);

    // Build Ball Mesh
    const ballTexture = createSkinTexture(equippedSkin.pattern || 'solid', equippedSkin.color);
    const ballGeo = new THREE.SphereGeometry(BALL_RADIUS, 32, 32);
    const ballMat = new THREE.MeshPhysicalMaterial({
      map: ballTexture,
      color: new THREE.Color(equippedSkin.color),
      emissive: new THREE.Color(equippedSkin.emissive || '#000000'),
      metalness: equippedSkin.metalness || 0.4,
      roughness: equippedSkin.roughness || 0.15,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });
    const ballMesh = new THREE.Mesh(ballGeo, ballMat);
    ballMesh.castShadow = true;
    ballMesh.position.set(0, 2, POLE_RADIUS + (DISC_OUTER_RADIUS - POLE_RADIUS) / 2);
    scene.add(ballMesh);
    ballMeshRef.current = ballMesh;

    // Fever Aura Glowing Sphere
    const feverAuraGeo = new THREE.SphereGeometry(BALL_RADIUS * 1.35, 24, 24);
    const feverAuraMat = new THREE.MeshBasicMaterial({
      color: 0xff3300,
      transparent: true,
      opacity: 0,
      wireframe: true,
      blending: THREE.AdditiveBlending,
    });
    const feverAuraMesh = new THREE.Mesh(feverAuraGeo, feverAuraMat);
    ballMesh.add(feverAuraMesh);
    feverAuraMeshRef.current = feverAuraMesh;

    // Ball Point Light
    const ballLight = new THREE.PointLight(equippedSkin.color, 1.5, 6);
    ballLight.position.copy(ballMesh.position);
    scene.add(ballLight);
    ballLightRef.current = ballLight;

    // Trail Particles
    const trailCount = 35;
    const trailGeo = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(trailCount * 3);
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trailMat = new THREE.PointsMaterial({
      color: new THREE.Color(equippedSkin.trailColor || '#00ffff'),
      size: 0.22,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const trailParticles = new THREE.Points(trailGeo, trailMat);
    scene.add(trailParticles);
    trailParticlesRef.current = trailParticles;

    // Background Dust Floating Particles
    const dustCount = 450;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 18;
      dustPositions[i * 3] = Math.cos(angle) * radius;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * totalHeight;
      dustPositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: new THREE.Color(theme.platformColor),
      size: 0.12,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);
    backgroundDustRef.current = dustParticles;

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


    // Reset physics & visual vars
    ballYRef.current = 2;
    ballVyRef.current = 0;
    passComboRef.current = 0;
    squashYRef.current = 1.0;
    cameraShakeRef.current = 0;
    platformsDataRef.current = [];
    gemsDataRef.current = [];
    debrisRef.current = [];
    shockwavesRef.current = [];
    hazardMeshesRef.current = [];
    splatsRef.current = [];

    // 6. Generate Disc Platforms
    const normalMat = new THREE.MeshPhysicalMaterial({
      color: theme.platformColor,
      roughness: 0.15,
      metalness: 0.2,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
    });
    const hazardMat = new THREE.MeshPhysicalMaterial({
      color: theme.hazardColor,
      roughness: 0.3,
      metalness: 0.3,
      emissive: new THREE.Color(theme.hazardColor).multiplyScalar(0.3),
      clearcoat: 0.2,
    });
    const finishMat = new THREE.MeshPhysicalMaterial({
      color: theme.finishColor,
      roughness: 0.1,
      metalness: 0.9,
      emissive: new THREE.Color(theme.finishColor).multiplyScalar(0.2),
      clearcoat: 0.8,
    });

    let prevGaps: number[] = [];
    for (let p = 0; p < platformCount; p++) {
      const discY = -p * PLATFORM_GAP;
      const platformGroup = new THREE.Group();
      platformGroup.position.y = discY;
      poleGroup.add(platformGroup);

      const isStartPlatform = p === 0;
      const isFinishPlatform = p === platformCount - 1;

      const segmentsState: Array<'normal' | 'hazard' | 'gap'> = [];

      if (isStartPlatform) {
        // Start platform: 11 normal segments, 1 gap
        prevGaps = [];
        for (let s = 0; s < SEGMENTS_PER_DISC; s++) {
          const type = s === 0 ? 'gap' : 'normal';
          segmentsState.push(type);
          if (type === 'gap') prevGaps.push(s);
        }
      } else if (isFinishPlatform) {
        // Finish platform: Complete ring
        for (let s = 0; s < SEGMENTS_PER_DISC; s++) {
          segmentsState.push('normal');
        }
      } else {
        // Middle platforms: Procedural distribution based on level difficulty
        const gapSize = Math.min(1 + Math.floor(Math.random() * (level > 4 ? 1 : 2)), 2);
        const hazardCount = Math.min(2 + Math.floor(Math.random() * (level > 2 ? 5 : 3)), 7);

        // Fill default normal
        for (let s = 0; s < SEGMENTS_PER_DISC; s++) {
          segmentsState.push('normal');
        }

        // Place random gap sequence
        if (gapSize > 0) {
          const gapStart = Math.floor(Math.random() * SEGMENTS_PER_DISC);
          for (let g = 0; g < gapSize; g++) {
            const idx = (gapStart + g) % SEGMENTS_PER_DISC;
            segmentsState[idx] = 'gap';
          }
        }

        // Place hazards in non-gap positions
        let placedHazards = 0;
        let attempts = 0;
        while (placedHazards < hazardCount && attempts < 50) {
          attempts++;
          const hIdx = Math.floor(Math.random() * SEGMENTS_PER_DISC);
          
          // non spawnare su un triangolo rosso al primo livello di drop
          const isSpawnDrop = (p === 1 && hIdx === 3); 

          if (segmentsState[hIdx] === 'normal' && !prevGaps.includes(hIdx) && !isSpawnDrop) {
            segmentsState[hIdx] = 'hazard';
            placedHazards++;
          }
        }
        
        // Update prevGaps for next iteration
        prevGaps = [];
        for (let s = 0; s < SEGMENTS_PER_DISC; s++) {
          if (segmentsState[s] === 'gap') prevGaps.push(s);
        }
      }

      // Build 3D mesh for each segment present
      const arcAngle = (Math.PI * 2) / SEGMENTS_PER_DISC;

      for (let s = 0; s < SEGMENTS_PER_DISC; s++) {
        const segType = segmentsState[s];
        if (segType === 'gap') continue;

        // Create 3D arc geometry shape
        const shape = new THREE.Shape();
        const startAngle = s * arcAngle + 0.02; // tiny margin
        const endAngle = (s + 1) * arcAngle - 0.02;

        shape.absarc(0, 0, DISC_OUTER_RADIUS, startAngle, endAngle, false);
        shape.absarc(0, 0, POLE_RADIUS + 0.05, endAngle, startAngle, true);

        const extrudeSettings = {
          depth: 0.18,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.02,
          bevelThickness: 0.02,
        };

        const segGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        segGeo.rotateX(Math.PI / 2); // Lay flat

        const mat = isFinishPlatform
          ? finishMat
          : segType === 'hazard'
          ? hazardMat.clone()
          : normalMat;
        const segMesh = new THREE.Mesh(segGeo, mat);
        segMesh.castShadow = true;
        segMesh.receiveShadow = true;
        segMesh.userData = { segmentIndex: s, type: segType };
        platformGroup.add(segMesh);

        if (segType === 'hazard') {
          hazardMeshesRef.current.push(segMesh);
        }
      }

      // Add Finish Flag / Podium on bottom platform
      if (isFinishPlatform) {
        const flagPoleGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.5, 12);
        const flagPoleMat = new THREE.MeshPhysicalMaterial({
          color: '#ffffff',
          metalness: 0.9,
          roughness: 0.1,
          clearcoat: 1.0,
        });
        const flagPole = new THREE.Mesh(flagPoleGeo, flagPoleMat);
        flagPole.position.set(0, 0.75, POLE_RADIUS + 0.8);
        platformGroup.add(flagPole);

        const flagGeo = new THREE.ConeGeometry(0.4, 0.6, 3);
        flagGeo.rotateZ(-Math.PI / 2);
        const flagMat = new THREE.MeshPhysicalMaterial({
          color: '#10b981',
          roughness: 0.4,
          metalness: 0.1,
          clearcoat: 0.2,
        });
        const flag = new THREE.Mesh(flagGeo, flagMat);
        flag.position.set(0.3, 1.2, POLE_RADIUS + 0.8);
        platformGroup.add(flag);
      }

      // Spawn Gems in gaps or on platforms (30% chance per platform)
      if (!isStartPlatform && !isFinishPlatform && Math.random() < 0.35) {
        const gapIndices = segmentsState
          .map((type, idx) => (type === 'gap' ? idx : -1))
          .filter((idx) => idx !== -1);

        if (gapIndices.length > 0) {
          const gemAngleIdx = gapIndices[Math.floor(Math.random() * gapIndices.length)];
          const gemAngle = (gemAngleIdx + 0.5) * arcAngle;

          const gemGeo = new THREE.OctahedronGeometry(0.22, 0);
          const gemMat = new THREE.MeshPhysicalMaterial({
            color: '#ffd700',
            emissive: '#554400',
            metalness: 1.0,
            roughness: 0.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.0,
          });
          const gemMesh = new THREE.Mesh(gemGeo, gemMat);

          const gemRadius = POLE_RADIUS + (DISC_OUTER_RADIUS - POLE_RADIUS) / 2;
          gemMesh.position.set(
            Math.cos(gemAngle) * gemRadius,
            discY + 0.8,
            Math.sin(gemAngle) * gemRadius
          );
          poleGroup.add(gemMesh);

          gemsDataRef.current.push({
            mesh: gemMesh,
            platformIdx: p,
            baseY: discY + 0.8,
            angle: gemAngle,
            collected: false,
          });
        }
      }

      platformsDataRef.current.push({
        y: discY,
        index: p,
        segments: segmentsState,
        meshGroup: platformGroup,
        smashed: false,
      });
    }

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
      }
      rendererRef.current?.dispose();
    };
  }, [level, equippedSkin, theme]);

  // Pointer & Touch Controls for Tower Rotation
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (gameState !== 'PLAYING') return;
      isDraggingRef.current = true;
      isSmashingRef.current = true;
      previousPointerXRef.current = e.clientX;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || gameState !== 'PLAYING') return;
      {
        const deltaX = e.clientX - previousPointerXRef.current;
        previousPointerXRef.current = e.clientX;

        // Rotation velocity sensitive to settings
        rotationVelRef.current += deltaX * 0.008 * sensitivity;
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      isSmashingRef.current = false;
    };

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        rotationVelRef.current -= 0.06 * sensitivity;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        rotationVelRef.current += 0.06 * sensitivity;
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, sensitivity]);

  // Main Physics and Animation Render Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      let dt_real = Math.min((currentTime - lastTime) / 1000, 0.05);
      let dt = dt_real;
      if (slowMoTimerRef.current > 0) {
        slowMoTimerRef.current -= dt_real;
        dt *= 0.25; // 25% speed for slow-motion
      }
      lastTime = currentTime;

      if (!poleGroupRef.current || !ballMeshRef.current || !cameraRef.current || !rendererRef.current || !sceneRef.current) {
        return;
      }

      const poleGroup = poleGroupRef.current;
      const ballMesh = ballMeshRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const scene = sceneRef.current;

      // 1. Rotate Helix Pole
      poleGroup.rotation.y += rotationVelRef.current;
      rotationVelRef.current *= 0.90; // Inertia damping

      // Check Shield active
      const hasShield = activePowerUps.some((p) => p.type === 'shield');
      const hasMagnet = activePowerUps.some((p) => p.type === 'magnet');

      if (gameState === 'PLAYING') {
        // 2. Ball Physics Gravity
        const prevY = ballYRef.current;
        ballVyRef.current -= 24 * dt; // Gravity
        ballYRef.current += ballVyRef.current * dt;

        ballMesh.position.y = ballYRef.current;
        if (ballLightRef.current) {
          ballLightRef.current.position.y = ballYRef.current;
        }

        // Ball spin visual effect
        ballMesh.rotation.x += 2 * dt;
        ballMesh.rotation.z += rotationVelRef.current * 2;

        // 3. Collision with Platforms
        const currentPlatformIdx = Math.floor((-ballYRef.current + BALL_RADIUS) / PLATFORM_GAP);
        const platform = platformsDataRef.current.find((p) => p.index === currentPlatformIdx);

        if (platform && !platform.smashed) {
          const discTopY = platform.y;
          const ballBottomPrev = prevY - BALL_RADIUS;
          const ballBottomCurrent = ballYRef.current - BALL_RADIUS;

          // Detect if ball bottom crossed disc surface going downwards
          if (ballBottomPrev >= discTopY && ballBottomCurrent <= discTopY) {
            // Determine ball's current angular offset over the tower
            // The ball is at +Z axis, which corresponds to an angle of PI/2 in the unrotated platform.
            let targetAngle = (Math.PI / 2 + poleGroup.rotation.y) % (Math.PI * 2);
            if (targetAngle < 0) targetAngle += Math.PI * 2;

            const segmentArc = (Math.PI * 2) / SEGMENTS_PER_DISC;
            const currentSegmentIdx = Math.floor(targetAngle / segmentArc) % SEGMENTS_PER_DISC;

            const hitSegmentType = platform.segments[currentSegmentIdx];

            if (hitSegmentType === 'gap') {
              // Ball falls through gap cleanly!
              passComboRef.current += 1;
              const currentPassCount = passComboRef.current;
              
              if (currentPassCount === 2) {
                // Trigger slow-motion for a cinematic feel on a narrow pass!
                slowMoTimerRef.current = 0.8;
              }

              // Sound
              soundEngine.playPass(currentPassCount);

              // Score reward
              const addedScore = 10 * currentPassCount;
              setScore((s) => s + addedScore);
              setCombo(currentPassCount);

              // Update stats
              setStats((prev) => ({
                ...prev,
                platformsPassed: prev.platformsPassed + 1,
              }));

              // Check Fever Mode Trigger (Pass 3+ platforms without bounce)
              if (currentPassCount >= 3) {
                if (!isFever) {
                  setIsFever(true);
                  soundEngine.playFever();
                  setStats((prev) => ({ ...prev, feversTriggered: prev.feversTriggered + 1 }));
                }
              }
            } else if (hitSegmentType === 'normal' || hitSegmentType === 'hazard') {
              // Check if Fever Mode or Shield breaks platform
              const isHazard = hitSegmentType === 'hazard';

              const shouldSmash = isFever || (isHazard && hasShield);

              if (shouldSmash) {
                // SMASH PLATFORM!
                platform.smashed = true;
                platform.meshGroup.visible = false;

                squashYRef.current = 1.4; // Vertical stretch
                cameraShakeRef.current = 0.35; // Intense shake

                // Spawn expanding shockwave ring & 3D debris
                spawnShockwave(scene, platform.y, isFever ? '#ff4400' : theme.platformColor);
                spawnShatterDebris(scene, platform.y, theme.platformColor);
                spawnImpactParticles(scene, 0, platform.y, 1.525, theme.platformColor, 20);

                soundEngine.playSmash();
                
                passComboRef.current += 1;
              const currentPassCount = passComboRef.current;
              
              if (currentPassCount === 2) {
                // Trigger slow-motion for a cinematic feel on a narrow pass!
                slowMoTimerRef.current = 0.8;
              }
                
                setScore((s) => s + 50 * currentPassCount);
                setCombo(currentPassCount);
                
                setStats((prev) => ({
                  ...prev,
                  platformsSmashed: prev.platformsSmashed + 1,
                  platformsPassed: prev.platformsPassed + 1,
                }));
                


                if (currentPassCount >= 3) {
                  if (!isFever) {
                    setIsFever(true);
                    soundEngine.playFever();
                    setStats((prev) => ({ ...prev, feversTriggered: prev.feversTriggered + 1 }));
                  }
                }

                // Consume shield if used on hazard
                if (isHazard && hasShield) {
                  setActivePowerUps((prev) => prev.filter((p) => p.type !== 'shield'));
                }
              } else if (isHazard) {
                // GAME OVER!
                squashYRef.current = 0.2;
                cameraShakeRef.current = 0.55;
                setGameState('GAMEOVER');
                soundEngine.playGameOver();
                onGameOver(score);
              } else {
                // Normal Safe Bounce!
                ballYRef.current = discTopY + BALL_RADIUS;
                ballVyRef.current = 9.4; // Crisp bounce velocity

                squashYRef.current = 0.55; // Squash on impact
                cameraShakeRef.current = 0.1; // Gentle impact feedback

                // Spawn subtle ring shockwave
                spawnShockwave(scene, discTopY, equippedSkin.color);
                spawnImpactParticles(scene, 0, discTopY, 1.525, theme.platformColor, 12);

                // Reset pass combo & fever mode on bounce
                passComboRef.current = 0;
                setCombo(0);
                setIsFever(false);

                soundEngine.playBounce();

                setStats((prev) => ({
                  ...prev,
                  totalBounces: prev.totalBounces + 1,
                }));

                // Leave paint splat decal on platform segment
                spawnSplatDecal(platform.meshGroup, targetAngle, equippedSkin.color);
              }
            }
          }
        }

        // Check Finish Platform Victory Landing
        const lastPlatform = platformsDataRef.current[platformsDataRef.current.length - 1];
        if (lastPlatform && ballYRef.current <= lastPlatform.y + 0.1) {
          setGameState('LEVEL_COMPLETE');
          soundEngine.playWin();

          // Trigger Confetti Celebration!
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });

          const earnedLevelGems = 20 + level * 5;
          setGems((g) => g + earnedLevelGems);
          onLevelComplete(earnedLevelGems, score);
        }

        // 4. Gems Collection & Animation Logic
        gemsDataRef.current.forEach((gem) => {
          if (gem.collected) return;

          // Float bobbing effect
          gem.mesh.position.y = gem.baseY + Math.sin(currentTime * 0.005 + gem.angle) * 0.14;
          gem.mesh.rotation.y += 3 * dt;

          const distY = Math.abs(ballYRef.current - gem.mesh.position.y);
          const pickupDist = hasMagnet ? 2.5 : 0.8;

          if (distY < pickupDist) {
            gem.collected = true;
            gem.mesh.visible = false;
            setGems((g) => g + 5);
            soundEngine.playGem();
            setStats((prev) => ({ ...prev, totalGems: prev.totalGems + 5 }));
          }
        });
      }

      // 5. Ball Squash & Stretch Physics Interpolation
      squashYRef.current += (1.0 - squashYRef.current) * 0.18;
      const squashScaleXZ = 1 / Math.sqrt(Math.max(0.15, squashYRef.current));
      ballMesh.scale.set(squashScaleXZ, squashYRef.current, squashScaleXZ);

      // 6. Fever Aura Visual Effect
      if (feverAuraMeshRef.current) {
        const opacityTarget = isFever ? 0.6 + Math.sin(currentTime * 0.012) * 0.35 : 0;
        (feverAuraMeshRef.current.material as THREE.MeshBasicMaterial).opacity = opacityTarget;
        feverAuraMeshRef.current.rotation.y += 4 * dt;
        feverAuraMeshRef.current.rotation.x += 2 * dt;
      }

      // 7. Hazard Platforms Glow Pulse
      const hazardGlow = 0.15 + Math.sin(currentTime * 0.008) * 0.2;
      hazardMeshesRef.current.forEach((m) => {
        if (m.material && (m.material as THREE.MeshPhysicalMaterial).emissiveIntensity !== undefined) {
          (m.material as THREE.MeshPhysicalMaterial).emissiveIntensity = hazardGlow;
        }
      });

      // 8. Background Dust Particle Rotation
      
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
            positions[i * 3] = (Math.random() - 0.5) * 30; // Randomize x a bit
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30; // Randomize z a bit
          }
        }
        mesh.geometry.attributes.position.needsUpdate = true;
      }

      if (backgroundDustRef.current) {
        backgroundDustRef.current.rotation.y += 0.04 * dt;
      }

      // 9. Camera Follow, Shake & Roll Tilt
      const targetCamY = ballYRef.current + 2.2;
      camera.position.y += (targetCamY - camera.position.y) * 0.12;

      // Apply camera shake if active
      if (cameraShakeRef.current > 0.002) {
        cameraShakeRef.current *= 0.88;
        const shake = cameraShakeRef.current;
        camera.position.x = (Math.random() - 0.5) * shake;
        camera.position.z = 7.5 + (Math.random() - 0.5) * shake;
      } else {
        camera.position.x = 0;
        camera.position.z = 7.5;
      }
      camera.rotation.z = -rotationVelRef.current * 0.35;
      camera.lookAt(0, ballYRef.current - 1.2, 0);

      // 10. Update Shockwave Rings
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.scale += dt * 5.5;
        sw.opacity -= dt * 2.2;
        if (sw.opacity <= 0) {
          scene.remove(sw.mesh);
          shockwavesRef.current.splice(i, 1);
        } else {
          sw.mesh.scale.set(sw.scale, sw.scale, 1);
          (sw.mesh.material as THREE.MeshBasicMaterial).opacity = sw.opacity;
        }
      }

      // 11. Update Debris Particles Physics
      for (let i = debrisRef.current.length - 1; i >= 0; i--) {
        const d = debrisRef.current[i];
        d.life -= dt;
        if (d.life <= 0) {
          scene.remove(d.mesh);
          debrisRef.current.splice(i, 1);
        } else {
          d.mesh.position.x += d.vx * dt;
          d.mesh.position.y += d.vy * dt;
          d.mesh.position.z += d.vz * dt;
          d.vy -= 18 * dt; // gravity
          d.mesh.rotation.x += d.rx * dt;
          d.mesh.rotation.y += d.ry * dt;
        }
      }

      // 12. Update Ball Trail Particles
      if (trailParticlesRef.current) {
        const positions = trailParticlesRef.current.geometry.attributes.position.array as Float32Array;

        // Shift positions down
        for (let i = (35 - 1) * 3; i >= 3; i -= 3) {
          positions[i] = positions[i - 3];
          positions[i + 1] = positions[i - 2];
          positions[i + 2] = positions[i - 1];
        }

        positions[0] = ballMesh.position.x;
        positions[1] = ballMesh.position.y;
        positions[2] = ballMesh.position.z;

        trailParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Render 3D Scene
      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, isFever, activePowerUps, level, score, theme, equippedSkin, setScore, setCombo, setIsFever, setGems, setStats, setGameState, onGameOver, onLevelComplete]);

  // Helper to spawn expanding shockwave ring
  const spawnShockwave = (scene: THREE.Scene, y: number, colorHex: string) => {
    const ringGeo = new THREE.RingGeometry(0.6, 0.85, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorHex),
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(0, y + 0.05, 0);
    scene.add(ringMesh);

    shockwavesRef.current.push({
      mesh: ringMesh,
      scale: 1,
      opacity: 0.9,
    });
  };

  // Helper to spawn 3D exploding platform debris
  
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

  const spawnShatterDebris = (scene: THREE.Scene, y: number, colorHex: string) => {
    const pieceCount = 24;
    const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.3 });

    for (let i = 0; i < pieceCount; i++) {
      const geo = new THREE.BoxGeometry(0.3 + Math.random() * 0.4, 0.15, 0.3 + Math.random() * 0.4);
      const mesh = new THREE.Mesh(geo, mat);

      const angle = (i / pieceCount) * Math.PI * 2;
      const dist = 0.5 + Math.random() * 1.5;

      mesh.position.set(Math.cos(angle) * dist, y, Math.sin(angle) * dist);

      scene.add(mesh);

      debrisRef.current.push({
        mesh,
        vx: Math.cos(angle) * (5 + Math.random() * 6),
        vy: 3 + Math.random() * 6,
        vz: Math.sin(angle) * (5 + Math.random() * 6),
        rx: (Math.random() - 0.5) * 10,
        ry: (Math.random() - 0.5) * 10,
        life: 0.8 + Math.random() * 0.4,
      });
    }
  };

  // Helper to place splat paint stain on platform
  const spawnSplatDecal = (platformGroup: THREE.Group, angle: number, colorHex: string) => {
    const splatTex = createSplatTexture(colorHex);
    const splatGeo = new THREE.PlaneGeometry(0.8, 0.8);
    splatGeo.rotateX(-Math.PI / 2);

    const splatMat = new THREE.MeshBasicMaterial({
      map: splatTex,
      transparent: true,
      opacity: 0.85,
      depthTest: true,
    });

    const splatMesh = new THREE.Mesh(splatGeo, splatMat);

    const r = POLE_RADIUS + (DISC_OUTER_RADIUS - POLE_RADIUS) / 2;

    splatMesh.position.set(Math.cos(angle) * r, 0.11, Math.sin(angle) * r);
    platformGroup.add(splatMesh);
    splatMesh.rotation.y = Math.random() * Math.PI * 2;
    splatsRef.current.push(splatMesh);
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden touch-none">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};
