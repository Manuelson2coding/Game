import * as THREE from 'three';

const SEGMENTS = 12;
const arcAngle = (Math.PI * 2) / SEGMENTS;
const s = 0; // Segment 0
const startAngle = s * arcAngle + 0.02; 
const endAngle = (s + 1) * arcAngle - 0.02;

const shape = new THREE.Shape();
shape.absarc(0, 0, 10, startAngle, endAngle, false);

const extrudeSettings = { depth: 1, bevelEnabled: false };
const segGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
segGeo.rotateX(Math.PI / 2);

segGeo.computeBoundingBox();
const center = new THREE.Vector3();
segGeo.boundingBox.getCenter(center);
console.log("Segment 0 center:", center);
