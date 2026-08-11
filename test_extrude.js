import * as THREE from 'three';
const shape = new THREE.Shape();
shape.absarc(0, 0, 10, 0, Math.PI / 2, false);
const ext = new THREE.ExtrudeGeometry(shape, {depth: 1, bevelEnabled: false});
ext.rotateX(Math.PI / 2);
ext.computeBoundingBox();
console.log(ext.boundingBox);
