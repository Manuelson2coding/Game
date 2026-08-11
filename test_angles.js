const MathPI = Math.PI;
const rotationY = -MathPI / 6; // -30 degrees
let targetAngle = (MathPI / 2 - rotationY) % (MathPI * 2);
console.log("targetAngle:", targetAngle * 180 / MathPI);
