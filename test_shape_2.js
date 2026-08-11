import * as THREE from 'three';
const vec = new THREE.Vector3(0, 10, 0); // Y = 10
vec.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
console.log(vec);
