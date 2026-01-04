// Force-driven node network with attraction and repulsion
// Exploring self-organization, instability, and continuous collapse

// --------------------
// Configuration
// --------------------
const NODE_COUNT = 100;
const BASE_SIZE = 1000;
const LOOP_DURATION = 10000;

const MIN_CONNECTION_DISTANCE = 5;
const MAX_CONNECTION_DISTANCE = 90;

let nodes = [];

// --------------------
// Setup
// --------------------
function setup() {
  createCanvas(720, 720, WEBGL);

  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      offset: createVector(
        random(1000),
        random(1000),
        random(1000)
      ),
      position: createVector()
    });
  }

  strokeWeight(1.2);
  noFill();
}

// --------------------
// Draw Loop
// --------------------
function draw() {
  background(0);

  // Normalized loop time (0 → 1)
  let t = millis() % LOOP_DURATION;
  let loopT = t / LOOP_DURATION;
  let angle = loopT * TWO_PI;

  // Chaotic rotational motion
  rotateY(angle * 6.5);
  rotateX(angle * 3.0);

  // Distance threshold oscillates, driving attraction and repulsion
  let connectionDistance = lerp(
    MAX_CONNECTION_DISTANCE,
    MIN_CONNECTION_DISTANCE,
    0.5 - 0.5 * cos(angle)
  );

  // Breathing zoom
  let zoom = lerp(1.0, 3.8, 0.5 - 0.5 * cos(angle));
  scale(zoom);

  // Loopable noise offsets
  let loopRadius = 1500;
  let nx = cos(angle) * loopRadius;
  let ny = sin(angle) * loopRadius;

  // Update node positions
  for (let node of nodes) {
    node.position.x =
      noise(node.offset.x + nx, node.offset.x + ny) * BASE_SIZE -
      BASE_SIZE / 2;

    node.position.y =
      noise(node.offset.y + nx, node.offset.y + ny) * BASE_SIZE -
      BASE_SIZE / 2;

    node.position.z =
      noise(node.offset.z + nx, node.offset.z + ny) * BASE_SIZE -
      BASE_SIZE / 2;
  }

  // Draw connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let p1 = nodes[i].position;
      let p2 = nodes[j].position;
      let d = p5.Vector.dist(p1, p2);

      if (d < connectionDistance) {
        stroke(200, map(d, 0, connectionDistance, 200, 10));
        line(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      }
    }
  }

  // Draw nodes
  for (let node of nodes) {
    push();
    translate(
      node.position.x,
      node.position.y,
      node.position.z
    );
    noStroke();
    fill(255);
    sphere(2);
    pop();
  }
}
