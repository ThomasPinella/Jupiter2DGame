var GameObject2D = function(mesh, mass, physics, type) {
  this.mesh = mesh;
  this.position = new Vec3(0, 0, 0);
  this.orientation = 0;
  this.scale = new Vec3(1, 1, 1);
  this.modelMatrix = new Mat4();
  this.updateModelTransformation();

  this.velocity = new Vec2(0, 0);
  this.acceleration = new Vec2(0, 0);
  this.mass = mass;
  this.invMass = 1 / this.mass;
  this.momentum = new Vec2(0, 0);
  this.force = new Vec2(0, 0);

  this.angularAcceleration = 0;
  this.angularVelocity = 0;
  this.torque = 0;

  this.parent = this;
  this.positionOffset = new Vec2(0, 0);
  this.orientationOffset = 0;
  this.scaleOffset = new Vec3(1, 1, 1);

  this.sizeX = this.scale.x * 2;
  this.sizeY = this.scale.y * 2;

  this.physics = physics;

  this.drag = 1;

  this.isVisible = true;

  this.type = type;
  this.interfaceObject = false;
  this.timeCreated = new Date().getTime();
};

GameObject2D.prototype.move = function(dt) {
  if (this.type == "fireball" || this.type == "pokeball") {
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
    if (this.position.x > 40 || this.position.y > 40) {
      this.position.setRandom({x:-30, y:0}, {x:30, y:30});
    }
  } else {
    this.force.x -= this.velocity.x * this.drag;
    this.force.y -= this.velocity.y * this.drag;

    this.acceleration.x = this.force.x * this.invMass;
    this.acceleration.y = this.force.y * this.invMass;


    this.velocity.x += this.acceleration.x * dt;
    this.velocity.y += this.acceleration.y * dt;

    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
  }


  // Angular Stuff
  //this.torque = -Math.sin(Math.PI/4)*this.force.x;
  //this.torque = 2;
  this.torque -= this.angularVelocity * this.drag;
  this.angularAcceleration = this.torque * this.invMass;
  this.angularVelocity += this.angularAcceleration * dt;
  this.orientation += this.angularVelocity * dt;

  if (this.parent != this) {
    //this.position.x = this.parent.position.x + this.positionOffset.x;
    //this.position.y = this.parent.position.y + this.positionOffset.y;

    this.position.x = this.parent.position.x +
      (this.positionOffset.x * Math.cos(-this.parent.orientation) + this.positionOffset.y * Math.sin(-this.parent.orientation));
    this.position.y = this.parent.position.y +
      (-this.positionOffset.x * Math.sin(-this.parent.orientation) + this.positionOffset.y * Math.cos(-this.parent.orientation));

    this.orientation = this.parent.orientation + this.orientationOffset;
    this.scale.x = this.parent.scale.x * this.scaleOffset.x;
    this.scale.y = this.parent.scale.y * this.scaleOffset.y;
  }

};

GameObject2D.prototype.interact = function(gameObjects, x, camera) { 
  for (var i = 0; i < gameObjects.length; i++) {
    if (i != x && gameObjects[i].physics == true) {
      /*if (this.position.x - (this.sizeX / 2) <= gameObjects[i].position.x + (gameObjects[i].sizeX / 2) &&
        this.position.x + (this.sizeX / 2) <= gameObjects[i].position.x - (gameObjects[i].sizeX / 2) &&
        this.position.y + (this.sizeY / 2) >= gameObjects[i].position.y - (gameObjects[i].sizeY / 2)) {
        this.velocity.y = -this.velocity.y;
        gameObjects[i].velocity.y = -gameObjects[i].velocity.y;
        */

        var distance = Math.sqrt(Math.pow(this.position.x - gameObjects[i].position.x, 2) + 
          Math.pow(this.position.y - gameObjects[i].position.y, 2));
        if (distance <= (this.sizeX / 2) + (gameObjects[i].sizeX / 2)) {
          if (this.type == "lander" && (gameObjects[i].type == "platform" || gameObjects[i].type == "platformend")) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y = -this.velocity.y;
          }

          if (this.type == "lander" && gameObjects[i].type == "diamond") {
            //gameObjects[i].isVisible = false;
            gameObjects[i].force.x = 0;
            gameObjects[i].force.y = 0;
            gameObjects[i].interfaceObject = true;
          }
          if (this.type == "lander" && gameObjects[i].type == "fireball") {
            gameObjects[i].isVisible = false;
            gameObjects[i].physics = false;
            for (var j = 0; j < gameObjects.length; j++) {
              if (gameObjects[j].type == "landerlife" && gameObjects[j].isVisible) {
                gameObjects[j].isVisible = false;
                break;
              }
            }
          }
        }
        if (gameObjects[i].type == "blackhole" && distance <= 5) {
          this.force.x += (gameObjects[i].position.x - this.position.x) * (100 / Math.pow(distance,2));
          this.force.y += (gameObjects[i].position.y - this.position.y) * (100 / Math.pow(distance,2));
        }
      //}
    }
  }
};

GameObject2D.prototype.updateModelTransformation = function() {
  this.modelMatrix.set().
    scale(this.scale).
    rotate(this.orientation).
    translate(this.position);
};

GameObject2D.prototype.draw = function(camera){
  Material.shared.modelViewProjMatrix.set().
    mul(this.modelMatrix).
    mul(camera.viewProjMatrix);
  this.mesh.draw();
};

