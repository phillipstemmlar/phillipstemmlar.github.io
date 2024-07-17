// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// The "Vehicle" class

class Vehicle {
  constructor(x, y, image) {
    this.acceleration = createVector(0, 0);
    this.velocity = p5.Vector.random2D();
    this.position = createVector(x, y);

    this.maxTrailLength = 15;
    this.trailPoints = [];
    this.r = 6;
    this.maxspeed = 3;
    this.maxforce = 0.15;
    this.d = 25;
    this.target = null;
    this.desiredseparation = this.r * 2;

    if (image != null) {
      image.resize(this.r * 2, this.r * 3);
      this.sprite = createSprite(image.width, image.height);
      this.sprite.addImage(image);
    }
  }

  // Method to update location
  update() {
    this.trailPoints.unshift(createVector(this.position.x, this.position.y));
    if (this.trailPoints.length > this.maxTrailLength) {
      this.trailPoints = this.trailPoints.slice(0, this.maxTrailLength);
    }

    this.applyBehaviors(vehicles);
    this.boundaries();
    // this.Wraparound();

    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  setTarget(target) {
    this.target = target;
  }

  applyBehaviors(vehicles) {
    let separateForce = this.separate(vehicles);
    let seekForce = this.seek(this.target);

    let separateRatio = 0.5;
    let seekRatio = 0.5;

    if (this.target == null) {
      separateRatio = 1.0;
      seekRatio = 0.0;
    }

    separateForce.mult(separateRatio);
    seekForce.mult(seekRatio);

    this.applyForce(separateForce);
    this.applyForce(seekForce);
  }

  boundaries() {
    let desired = null;

    if (this.position.x < this.d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - this.d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < this.d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - this.d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }

  // Separation
  // Method checks for nearby vehicles and steers away
  separate(vehicles) {
    let sum = createVector();
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < vehicles.length; i++) {
      let d = p5.Vector.dist(this.position, vehicles[i].position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if (d > 0 && d < this.desiredseparation) {
        // Calculate vector pointing away from neighbor
        let diff = p5.Vector.sub(this.position, vehicles[i].position);
        diff.normalize();
        diff.div(d); // Weight by distance
        sum.add(diff);
        count++; // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      sum.div(count);
      // Our desired vector is the average scaled to maximum speed
      sum.normalize();
      sum.mult(this.maxspeed);
      // Implement Reynolds: Steering = Desired - Velocity
      sum.sub(this.velocity);
      sum.limit(this.maxforce);
    }
    return sum;
  }

  Wraparound() {
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  }

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {
    if (this.target == null) return createVector(0, 0);

    let d = p5.Vector.dist(this.position, this.target);
    if (d <= this.r) {
      this.setTarget(null);
      return createVector(0, 0);
    }

    let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxspeed);
    // Steering = Desired minus velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force
    return steer;
  }

  display() {
    if (this.sprite != null) {
      // Draw image rotated in the direction of velocity
      let theta = this.velocity.heading() + PI / 2;
      fill(127);
      stroke(200);
      strokeWeight(1);
      push();
      translate(this.position.x, this.position.y);
      rotate(theta);
      push();
      translate(-this.sprite.width, -this.sprite.height);
      drawSprite(this.sprite);
      pop();
      pop();
    } else {
      // Draw a triangle rotated in the direction of velocity
      let theta = this.velocity.heading() + PI / 2;
      fill(127);
      stroke(200);
      strokeWeight(1);
      push();
      translate(this.position.x, this.position.y);
      rotate(theta);
      beginShape();
      vertex(0, -this.r * 2);
      vertex(-this.r, this.r * 2);
      vertex(this.r, this.r * 2);
      endShape(CLOSE);
      pop();
    }

    strokeWeight(3);
    for (let i = 1; i < this.trailPoints.length; ++i) {
      const p = 1 - i / this.trailPoints.length;
      stroke(255, 176, 55, p * 0.5 * 255);
      const pos1 = this.trailPoints[i - 1];
      const pos2 = this.trailPoints[i];
      line(pos1.x, pos1.y, pos2.x, pos2.y);
    }
  }
}
