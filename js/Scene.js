var Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.quadGeometry = new QuadGeometry(gl);

  this.timeAtLastFrame = new Date().getTime();

  this.asteroidMaterial = new Material(gl, this.solidProgram);
  this.asteroidMaterial.colorTexture.set(
    new Texture2D(gl, 'media/asteroid.png'));

  this.landerMaterial = new Material(gl, this.solidProgram);
  this.landerMaterial.colorTexture.set(
    new Texture2D(gl, 'media/lander.png'));  

  this.afterburnerMaterial = new Material(gl, this.solidProgram);
  this.afterburnerMaterial.colorTexture.set(
    new Texture2D(gl, 'media/afterburner.png'));

  this.platformMaterial = new Material(gl, this.solidProgram);
  this.platformMaterial.colorTexture.set(
    new Texture2D(gl, 'media/platform.png'));

  this.platformendMaterial = new Material(gl, this.solidProgram);
  this.platformendMaterial.colorTexture.set(
    new Texture2D(gl, 'media/platformend.png'));

  this.diamondMaterial = new Material(gl, this.solidProgram);
  this.diamondMaterial.colorTexture.set(
    new Texture2D(gl, 'media/diamond.png'));

  this.fireballMaterial = new Material(gl, this.solidProgram);
  this.fireballMaterial.colorTexture.set(
    new Texture2D(gl, 'media/fireball.png'));

  this.plasmaMaterial = new Material(gl, this.solidProgram);
  this.plasmaMaterial.colorTexture.set(
    new Texture2D(gl, 'media/plasma.png'));

  this.pokeballMaterial = new Material(gl, this.solidProgram);
  this.pokeballMaterial.colorTexture.set(
    new Texture2D(gl, 'media/pokeball.png'));

  this.blackholeMaterial = new Material(gl, this.solidProgram);
  this.blackholeMaterial.colorTexture.set(
    new Texture2D(gl, 'media/blackhole.png'));

  this.asteroidMesh = new Mesh(this.quadGeometry, this.asteroidMaterial);
  this.landerMesh = new Mesh(this.quadGeometry, this.landerMaterial);
  this.afterburnerMesh = new Mesh(this.quadGeometry, this.afterburnerMaterial);
  this.platformMesh = new Mesh(this.quadGeometry, this.platformMaterial);
  this.platformendMesh = new Mesh(this.quadGeometry, this.platformendMaterial);
  this.diamondMesh = new Mesh(this.quadGeometry, this.diamondMaterial);
  this.fireballMesh = new Mesh(this.quadGeometry, this.fireballMaterial);
  this.plasmaMesh = new Mesh(this.quadGeometry, this.plasmaMaterial);
  this.pokeballMesh = new Mesh(this.quadGeometry, this.pokeballMaterial);
  this.blackholeMesh = new Mesh(this.quadGeometry, this.blackholeMaterial);

  this.gameObjects = [];
  for (var i = 0; i < 64; i++) {
    var asteroid = new GameObject2D(this.asteroidMesh, 1, false, "asteroid");
    asteroid.position.setRandom({x:-30, y:-30}, {x:30, y:30});
    asteroid.updateModelTransformation();
    this.gameObjects.push(asteroid);
  }

  for (var i = 0; i < 10; i++) {
    var platform = new GameObject2D(this.platformMesh, 1, true, "platform");
    var platformendA = new GameObject2D(this.platformendMesh, 1, true, "platformend");
    var platformendB = new GameObject2D(this.platformendMesh, 1, true, "platformend");
    platformendA.parent = platform;
    platformendB.parent = platform;
    platformendA.positionOffset.x = 2;
    platformendB.positionOffset.x = -2;
    platformendA.orientationOffset = Math.PI;
    //platformendB.orientationOffset = -Math.PI / 2;
    platform.position.setRandom({x:-20, y:-20}, {x:20, y:20});
    //platform.orientation = Math.PI / 2;
    //platform.scale.y = 2;
    //platform.scale.x = 0.94;
    platform.updateModelTransformation();
    platformendA.updateModelTransformation();
    platformendB.updateModelTransformation()
    this.gameObjects.push(platform);
    this.gameObjects.push(platformendA);
    this.gameObjects.push(platformendB);
  }

  for (var i = 0; i < 40; i++) {
    var diamond = new GameObject2D(this.diamondMesh, 1, true, "diamond");
    diamond.position.setRandom({x:-30, y:-30}, {x:30, y:30});
    diamond.scale.set(0.5, 0.5);
    diamond.drag = 10;
    diamond.force.x = Math.random()*50 - 100;
    diamond.force.y = Math.random()*50 - 100;
    this.gameObjects.push(diamond);
  }

  for (var i = 0; i < 10; i++) {
    var fireball = new GameObject2D(this.fireballMesh, 2, true, "fireball");
    fireball.position.setRandom({x:-30, y:0}, {x:30, y:30});
    fireball.drag = 5;
    fireball.velocity.x = 9;
    fireball.velocity.y = -4;
    this.gameObjects.push(fireball);
  }

  for (var i = 0; i < 2; i++) {
    var blackhole = new GameObject2D(this.blackholeMesh, 9999, true, "blackhole");
    blackhole.position.setRandom({x:-20, y:-10}, {x:20, y:10});
    this.gameObjects.push(blackhole);
  }
  this.lander = new GameObject2D(this.landerMesh, 5, true, "lander");
  this.afterburnerL = new GameObject2D(this.afterburnerMesh, 1, false, "afterburner");
  this.afterburnerM = new GameObject2D(this.afterburnerMesh, 1, false, "afterburner");
  this.afterburnerR = new GameObject2D(this.afterburnerMesh, 1, false, "afterburner");

  this.afterburnerL.parent = this.lander;
  this.afterburnerM.parent = this.lander;
  this.afterburnerR.parent = this.lander;

  this.afterburnerL.positionOffset.x = -1.1;
  this.afterburnerM.positionOffset.x = -0.2;
  this.afterburnerR.positionOffset.x = 0.7;

  this.afterburnerL.positionOffset.y = -1.4;
  this.afterburnerR.positionOffset.y = -1.4;
  this.afterburnerM.positionOffset.y = -1.2;

  this.afterburnerL.scaleOffset.set(0.6, 0.6);
  this.afterburnerM.scaleOffset.set(0.6, 0.6);
  this.afterburnerR.scaleOffset.set(0.6, 0.6);


  this.afterburnerL.orientationOffset = -Math.PI / 2;
  this.afterburnerM.orientationOffset = -Math.PI / 2;
  this.afterburnerR.orientationOffset = -Math.PI / 2;

  this.afterburnerL.isVisible = false;
  this.afterburnerM.isVisible = false;
  this.afterburnerR.isVisible = false;

  this.lander.position.set(-1, 1);
  this.lander.updateModelTransformation();

  this.lander.drag = 10;

  this.gameObjects.push(this.lander);
  this.gameObjects.push(this.afterburnerL);
  this.gameObjects.push(this.afterburnerM);
  this.gameObjects.push(this.afterburnerR);

  var numLives = 5;
  for (var i = 0; i < numLives; i++) {
    var lan = new GameObject2D(this.landerMesh, 1, false, "landerlife");
    lan.scale.set(0.6, 0.6);
    lan.interfaceObject = true;
    this.gameObjects.push(lan);
  }

  this.gameOver = false;
  this.lastPokeballTime = 0;
  this.camera = new OrthoCamera();
  this.minimap = new OrthoCamera();
  this.minimap.windowSize.set(40, 40);
  //this.minimap.setAspectRatio(0.4)

  gl.enable(gl.BLEND);
  gl.blendFunc(
    gl.SRC_ALPHA,
    gl.ONE_MINUS_SRC_ALPHA);
};

Scene.prototype.makePlasmas = function(afterburner) {
  var plasma = new GameObject2D(this.plasmaMesh, 1, false, "plasma");
  plasma.position.set(afterburner.position);
  plasma.scale.set(0.2, 0.2);
  this.gameObjects.unshift(plasma);
}

Scene.prototype.throwPokeball = function() {
  var pokeball = new GameObject2D(this.pokeballMesh, 1, true, "pokeball");
  pokeball.position.set(this.lander.position);
  pokeball.scale.set(0.5, 0.5);
  pokeball.velocity.x = 10;
  pokeball.velocity.y = 10;
  this.gameObjects.push(pokeball);
}

Scene.prototype.update = function(gl, keysPressed, mouse, mX, mY) {
  //jshint bitwise:false
  //jshint unused:false
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  // clear the screen
  gl.clearColor(0.6, 0.0, 0.3, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.lander.force.x = 0;
  this.lander.force.y = 0;
  this.lander.torque = 0;

  var hxForce = 20 * Math.cos(this.lander.orientation);
  var hyForce = 20 * Math.sin(this.lander.orientation);

  var vxForce = 30 * Math.sin(-this.lander.orientation);
  var vyForce = 30 * Math.cos(this.lander.orientation);

  this.afterburnerL.isVisible = false;
  this.afterburnerM.isVisible = false;
  this.afterburnerR.isVisible = false;

  if (mouse && timeAtThisFrame - this.lastPokeballTime > 500) {
    //console.log(mX + " " + mY);
    this.lastPokeballTime = new Date().getTime();
    this.throwPokeball();

  }

  if (keysPressed['D'] == true) {
    this.lander.force.x = hxForce + (vxForce / 1.1);
    this.lander.force.y = hyForce + (vyForce / 1.1);
    this.afterburnerL.isVisible = true;
    this.makePlasmas(this.afterburnerL);

    this.lander.torque = -15.5;
  }
  if (keysPressed['A'] == true) {
    this.lander.force.x = -hxForce + (vxForce / 1.1);
    this.lander.force.y = -hyForce + (vyForce / 1.1);
    this.afterburnerR.isVisible = true;
    this.makePlasmas(this.afterburnerR);

    this.lander.torque = 15.5;
  }
  if (keysPressed['W'] == true) {
    this.lander.force.x = vxForce;
    this.lander.force.y = vyForce;
    this.afterburnerM.isVisible = true;
    this.makePlasmas(this.afterburnerM);
  }
  if (keysPressed['S'] == true) {
    this.lander.force.x = -vxForce;
    this.lander.force.y = -vyForce;
  }

  if (keysPressed['W'] && keysPressed['A'] && keysPressed['D']) {
    this.lander.force.x = vxForce * 2.3;
    this.lander.force.y = vyForce * 2.3;
    this.lander.torque = 0;
  }

  if (!keysPressed['W'] && keysPressed['A'] && keysPressed['D']) {
    this.lander.force.x = vxForce * 1.5;
    this.lander.force.y = vyForce * 1.5;
    this.lander.torque = 0;
  }

  //console.log(this.gameObjects[100].velocity.x);

  // Interactions
  for (var i = 0; i < this.gameObjects.length; i++) {
    this.gameObjects[i].interact(this.gameObjects, i, this.camera);
  }

  // Move
  var c = 0;
  var l = 0;
  for (var i = 0; i < this.gameObjects.length; i++) {
    this.gameObjects[i].move(dt);
    if (this.gameObjects[i].interfaceObject) {
      this.gameObjects[i].force.x = 0;
      this.gameObjects[i].force.y = 0;
      this.gameObjects[i].velocity.x = 0;
      this.gameObjects[i].velocity.y = 0;

      if (this.gameObjects[i].type == "diamond") {
        this.gameObjects[i].position.x = this.camera.position.x + 9;
        this.gameObjects[i].position.y = this.camera.position.y + 4 - (c * 1.5);
        c++;
      }

      if (this.gameObjects[i].type == "landerlife" && this.gameObjects[i].isVisible) {
        this.gameObjects[i].position.x = this.camera.position.x - 9 + (l * 1.5);
        this.gameObjects[i].position.y = this.camera.position.y + 4;
        l++;
      }
    }
  }
  if (l == 0 && this.gameOver == false) {
    this.gameOver = true;
    alert("Game Over :( \nPlease refresh to start again :)");
  }

  // Update and Draw
  for (var i = 0; i < this.gameObjects.length; i++) {
    if (this.gameObjects[i].isVisible) {
      this.gameObjects[i].updateModelTransformation();
      this.gameObjects[i].draw(this.camera);
    }

    if (this.gameObjects[i].type == "plasma" && timeAtThisFrame - this.gameObjects[i].timeCreated > 1000) {
      this.gameObjects.splice(i, 1);
    }
    if (this.gameObjects[i].type == "pokeball" && timeAtThisFrame - this.gameObjects[i].timeCreated > 500) {
      this.gameObjects.splice(i, 1);
    }
  }

  this.camera.position = this.lander.position;
  this.camera.updateViewProjMatrix();
  //this.minimap.position.set(this.camera.position.x - 9, this.camera.position.y - 4);
  //this.minimap.updateViewProjMatrix();

};


