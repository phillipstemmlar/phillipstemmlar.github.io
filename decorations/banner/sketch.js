// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Stay Within Walls
// "Made-up" Steering behavior to stay within walls

// ======= CANVAS =======
let canvas;
let canvasParent;
const canvasParentId = "sketch-holder";

// ======= ASSETS =======
let shipImage;

// ======= VEHICLES =======
const vehicleCount = 10;
let vehicles = [];

function preload() {
  shipImage = loadImage("/decorations/banner/assets/ship.png");
}

function setup() {
  canvasParent = document.getElementById(canvasParentId);
  if (canvasParent == null) {
    console.warn(`No element with canvas parent id '${canvasParentId}' found!`);
    return;
  }

  canvas = createCanvas(canvasParent.clientWidth, canvasParent.clientHeight);
  canvas.parent(canvasParentId);
  for (let i = 0; i < vehicleCount; ++i) {
    vehicles.push(new Vehicle(width / 2, height / 2, shipImage));
  }
}

function draw() {
  clear();
  for (let i = 0; i < vehicles.length; ++i) {
    const v = vehicles[i];
    v.update();
    v.display();
  }
}

function mousePressed() {
  const mousePos = createVector(mouseX, mouseY);
  for (let i = 0; i < vehicles.length; ++i) {
    const v = vehicles[i];
    v.setTarget(mousePos);
  }
}
