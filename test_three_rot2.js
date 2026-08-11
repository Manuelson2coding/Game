import * as THREE from 'three';
const vec = new THREE.Vector3(0, 0, 1);
vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.1);
console.log(vec);
