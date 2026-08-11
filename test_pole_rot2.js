import * as THREE from 'three';
const vec = new THREE.Vector3(0, 0, 1); // +Z axis
vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
console.log(vec);
