let idleFrames = [];
let soundtrack = [];
let walls = [];
let runFrames = [];
let reverseRun = [];
let showHelp = false;
let slimeArray = [];
let parrotArray = [];
let shellArray = [];
let knightArray = []

let frameIndex = 0;
let frameTimer = 0;
let frameInterval = 7; // Lower = faster animation

let dashImage, rDashImage;
let npcs = [];
let ready = false;
let opacity = 0;
let fadeAmount = 3;
let opacityN = 0;
let fadeAmountN = 2;

let dingy = false;
let dingy2 = false;
let dingy3 = false;

function preload() {
  scare = loadImage("Hollow Knight Jumpscare.webp")
  sound1 = loadSound('65. Clocktowers Beneath The Sea.mp3');
  soundtrack.push(sound1);
  sound2 = loadSound('14 - Soul Sanctum.mp3');
  soundtrack.push(sound2);
  sound3 = loadSound('09 - City of Tears.mp3');
  soundtrack.push(sound3);
  sound4 = loadSound('116. A Sweet Smile.mp3');
  soundtrack.push(sound4);
  sound5 = loadSound('40 Lavender Town.mp3');
  soundtrack.push(sound5);
  sound6 = loadSound('04. Halland.mp3');
  soundtrack.push(sound6);
  sound7 = loadSound('Stranger Things.mp3');
  soundtrack.push(sound7);
  bgImage = loadImage('Background.png');

  for (let i = 1; i <= 4; i++) {
    idleFrames.push(loadImage(`SquidIdle${i}.png`));
  }
  for (let i = 3; i >= 2; i--) {
    idleFrames.push(loadImage(`SquidIdle${i}.png`));
  }

  runFrames.push(loadImage('SquidRun1.png'));
  runFrames.push(loadImage('SquidRun2.png'));
  reverseRun.push(loadImage('ReverseRun1.png'));
  reverseRun.push(loadImage('ReverseRun2.png'));

  dashImage = loadImage('SquidDash.png');
  speakerImage = loadImage('Speaker.png');
  rDashImage = loadImage('ReverseDash.png');
  puddleImage = loadImage('Puddle.png')
  pizzaImage = loadImage('Pizza.png')

  for (let i = 1; i <= 4; i++) {
    slimeArray.push(loadImage(`Slime${i}.png`));
  }
  for (let i = 3; i >= 2; i--) {
    slimeArray.push(loadImage(`Slime${i}.png`));
  }

  for (let i = 1; i <= 4; i++) {
    parrotArray.push(loadImage(`Parrot${i}.png`));
  }
  for (let i = 3; i >= 2; i--) {
    parrotArray.push(loadImage(`Parrot${i}.png`));
  }

  for (let i = 1; i <= 4; i++) {
    shellArray.push(loadImage(`Shell${i}.png`));
  }
  for (let i = 3; i >= 2; i--) {
    shellArray.push(loadImage(`Shell${i}.png`));
  }

  for (let i = 1; i <= 3; i++) {
    knightArray.push(loadImage(`Knight${i}.png`));
  }
  knightArray.push(loadImage(`Knight2.png`));

  font = loadFont('Minecraft.ttf');
  textFont(font);
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  rectMode(CENTER);

  player = new Player(width / 2, height / 2);

  walls.push(new Wall(width / 16, 15 * height / 16, width / 8, 5 * height / 30));
  walls.push(new Wall(7 * width / 8, 15 * height / 16, width / 8, 5 * height / 30));
  walls.push(new Wall(0, height / 2, width / 8, height));
  walls.push(new Wall(width, height / 2, width / 8, height));
  walls.push(new Wall(width / 2, 0, width, height / 32));
  walls.push(new Wall(width / 2, height, width, height / 32));
  walls.push(new Wall(width / 16, 9*height/16, width/3, height / 20));

  npcs.push(new NPC1(5 * width / 16, 5 * height / 16));
  npcs.push(new NPC2(5 * width / 8, 7 * height / 16));
  npcs.push(new NPC3(3 * width / 8, 3 * height / 4));
  npcs.push(new speaker(3 * width / 8, height / 8));
  npcs.push(new NPC4(3*width / 16, height / 2));
  npcs.push(new NPC5(13*width / 16, height / 8));

  textAlign(LEFT, CENTER);
}
function draw() {
  background('black');

  if (bgImage) {
    imageMode(CENTER);
    let imgAspect = bgImage.width / bgImage.height;
    let canvasAspect = width / height;
    let drawW, drawH;

    if (imgAspect > canvasAspect) {
      drawH = height;
      drawW = imgAspect * drawH;
    } else {
      drawW = width;
      drawH = drawW / imgAspect;
    }

    image(bgImage, width / 2, height / 2, drawW, drawH);
  } else {
    background('teal');
  }

  fill(255, opacity);
  textSize(100);
  textFont(font);
  text("Aron's Lobby", width / 16, 15 * height / 16);

  opacity += fadeAmount;
  if (opacity >= 255) {
    fadeAmount = -fadeAmount;
  }

  if(opacity<0){
    fill(255, opacityN);
    textSize(75);
    textFont(font);
    text("For controls, hold '?'", width / 16, 15 * height / 16);

    opacityN += fadeAmountN;
    if (opacityN >= 255) {
      fadeAmountN = -fadeAmountN;
    }
  }

  player.update();

  for (let wall of walls) {
    wall.collide(player);
  }

  player.display();

  for (let wall of walls) {
    wall.display();
  }

  for (let i = 0; i < npcs.length; i++) {
    npcs[i].display();
    npcs[i].talk();
    npcs[i].npcers();
  }

  if (showHelp) {
    fill(0, 180); // semi-transparent background
    rectMode(CORNER);
    noStroke();
    rect(0, 0, width, height); // darken screen

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(30);
    textFont(font);
    text("Controls:\n\nWASD to move\nL to dash\nE to talk\nK to enter world", width / 2, height / 2);
  }

}
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 4;
    this.moving = false;
    this.dashing = false;
    this.facingRight = true;
  }

  update() {
    let mvmt = createVector(0, 0);
    this.moving = false;
    this.dashing = false;

    // Movement keys
    if (keyIsDown(65)) { // A
      mvmt.x -= 1;
      this.facingRight = true;
    }
    if (keyIsDown(68)) { // D
      mvmt.x += 1;
      this.facingRight = false;
    }
    if (keyIsDown(87)) mvmt.y -= 1; // W
    if (keyIsDown(83)) mvmt.y += 1; // S

    if (mvmt.mag() > 0) {
      this.moving = true;

      if (keyIsDown(76)) {
        mvmt.setMag(10);
        this.dashing = true;
      } else {
        mvmt.setMag(this.speed);
      }

      this.x += mvmt.x;
      this.y += mvmt.y;

      if (!this.dashing) {
        frameTimer++;
        if (frameTimer >= frameInterval) {
          frameTimer = 0;
          frameIndex = (frameIndex + 1) % runFrames.length;
        }
      }
    } else {
      frameTimer++;
      if (frameTimer >= frameInterval) {
        frameTimer = 0;
        frameIndex = (frameIndex + 1) % idleFrames.length;
      }
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    if (!this.facingRight) scale(-1, 1);

    if (this.dashing) {
      image(dashImage, 0, 0, 60, 60);
    } else if (this.moving) {
      image(runFrames[frameIndex % runFrames.length], 0, 0, 60, 60);
    } else {
      image(idleFrames[frameIndex % idleFrames.length], 0, 0, 60, 60);
    }

    pop();
  }
}
class NPC1 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.col = color(random(255), random(255), random(255));
    this.size = int(random(30, 70));
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameInterval = 7;
  }

  talk() {
    if (dist(player.x, player.y, this.x, this.y) < 70 && keyIsDown(69)) {
      fill(0);
      textSize(16);
      textFont(font);
      text("Would You Like to Visit?", this.x - 75, this.y - 50);
      ready = true;
    } else if (dist(player.x, player.y, this.x, this.y) < 70) {
      fill(0);
      textSize(30);
      text("!", this.x, this.y - 50);
      ready = false;
    } else {
      ready = false;
    }
  }

  npcers() {
    if (ready && keyIsDown(75)) {
      window.open("https://editor.p5js.org/al9517/full/LBEfIWUW6");
      dingy = true;
    }
  }

  display() {
    this.frameTimer++;
    if (this.frameTimer >= this.frameInterval) {
      this.frameTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % slimeArray.length;
    }
    image(slimeArray[this.frameIndex], this.x, this.y, 60, 60);
  }
}
class NPC2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.col = color(random(255), random(255), random(255));
    this.size = int(random(30, 70));
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameInterval = 7;
  }

  talk() {
    if (dist(player.x, player.y, this.x, this.y) < 70 && keyIsDown(69)) {
      fill(0);
      textSize(16);
      text("Would You Like to Visit?", this.x - 75, this.y - 50);
      ready = true;
    } else if (dist(player.x, player.y, this.x, this.y) < 70) {
      fill(0);
      textSize(30);
      textFont(font);
      text("!", this.x, this.y - 50);
      ready = false;
    } else {
      ready = false;
    }
  }

  npcers() {
    if (ready && keyIsDown(75)) {
      window.open("https://editor.p5js.org/al9517/full/PP6F3xrBy");
      dingy2 = true;
    }
  }

  display() {
    this.frameTimer++;
    if (this.frameTimer >= this.frameInterval) {
      this.frameTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % parrotArray.length;
    }
    image(parrotArray[this.frameIndex], this.x, this.y, 60, 60);
  }
}
class NPC3 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.col = color(random(255), random(255), random(255));
    this.size = int(random(30, 70));
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameInterval = 7;
  }

  talk() {
    if (dist(player.x, player.y, this.x, this.y) < 70 && keyIsDown(69)) {
      fill(0);
      textSize(16);
      text("Would You Like to Visit?", this.x - 75, this.y - 50);
      ready = true;
    } else if (dist(player.x, player.y, this.x, this.y) < 70) {
      fill(0);
      textSize(30);
      textFont(font);
      text("!", this.x, this.y - 50);
      ready = false;
    } else {
      ready = false;
    }
  }

  npcers() {
    if (ready && keyIsDown(75)) {
      window.open("https://editor.p5js.org/al9517/full/OxoPZ1bLw");
      dingy3 = true;
    }
  }

  display() {
    this.frameTimer++;
    if (this.frameTimer >= this.frameInterval) {
      this.frameTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % shellArray.length;
    }
    image(shellArray[this.frameIndex], this.x, this.y, 60, 60);
  }
}
class NPC4 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.col = color(random(255), random(255), random(255));
    this.size = int(random(30, 70));
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameInterval = 10;
  }

  talk() {
    if (dist(player.x, player.y, this.x, this.y) < 70 && keyIsDown(69)) {
      fill(0);
      textSize(16);
      text("Pizza Pizza", this.x - 40, this.y - 50);
      ready = true;
    } else if (dist(player.x, player.y, this.x, this.y) < 70) {
      fill(0);
      textSize(30);
      textFont(font);
      text("!", this.x, this.y - 50);
      ready = false;
    } else {
      ready = false;
    }
  }

  npcers() {
    if (ready && keyIsDown(75)) {
      window.open("https://www.youtube.com/watch?v=70w81v-3YDo");
      
    }
  }

  display() {
    image(pizzaImage, this.x, this.y, 60, 60);
  }
}
class NPC5 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.col = color(random(255), random(255), random(255));
    this.size = int(random(30, 70));
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameInterval = 15;
  }

  talk() {
    if (dist(player.x, player.y, this.x, this.y) < 70 && keyIsDown(69)) {
      fill(0);
      textSize(30);
      text("...", this.x, this.y - 50);
      ready = true;
    } else if (dist(player.x, player.y, this.x, this.y) < 70) {
      fill(0);
      textSize(30);
      textFont(font);
      text("!", this.x, this.y - 50);
      ready = false;
    } else {
      ready = false;
    }
  }

  npcers() {
    if (ready && keyIsDown(75)) {
      window.open("https://open.spotify.com/")
      //image(scare, 0, 0, wisth, height)
    }
  }

  display() {
    this.frameTimer++;
    if (this.frameTimer >= this.frameInterval) {
      this.frameTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % knightArray.length;
    }
    image(knightArray[this.frameIndex], this.x, this.y, 60, 60);
  }
}
class speaker {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.track = 0;
    this.bool = false;
    this.isPlaying = false;
  }

  npcers() {
    if (!this.isPlaying) {
      soundtrack[this.track].loop();
      this.isPlaying = true;
    }

    if (this.bool && keyIsDown(75)) {
      for (let s of soundtrack) {
        s.stop();
      }
      this.track = (this.track + 1) % soundtrack.length;
      soundtrack[this.track].loop();
      this.isPlaying = true;
    }
  }

  talk() {
    if (dist(player.x, player.y, this.x, this.y) < 70 && keyIsDown(69)) {
      fill(255);
      textSize(16);
      textFont(font);
      text("Change Track?", this.x - 50, this.y - 50);
      this.bool = true;
    } else if (dist(player.x, player.y, this.x, this.y) < 70) {
      fill(255);
      textSize(30);
      text("!", this.x, this.y - 50);
      this.bool = false;
    } else {
      this.bool = false;
    }
  }

  display() {
    image(speakerImage, this.x, this.y, 60, 60);
  }
}
class Wall {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  display() {
    push();
    noFill();
    noStroke();
    rect(this.x, this.y, this.w, this.h);
    pop();
  }

  collide(player) {
    let halfW = this.w / 2;
    let halfH = this.h / 2;

    if (
      player.x + 30 > this.x - halfW &&
      player.x - 30 < this.x + halfW &&
      player.y + 30 > this.y - halfH &&
      player.y - 30 < this.y + halfH
    ) {
      let dx = (player.x - this.x) / halfW;
      let dy = (player.y - this.y) / halfH;

      if (abs(dx) > abs(dy)) {
        if (dx > 0) player.x = this.x + halfW + 30;
        else player.x = this.x - halfW - 30;
      } else {
        if (dy > 0) player.y = this.y + halfH + 30;
        else player.y = this.y - halfH - 30;
      }
    }
  }
}
function keyPressed() {
  if (key === '?' || key === '/') {
    showHelp = true;
  }
}
function keyReleased() {
  if (key === '?' || key === '/') {
    showHelp = false;
  }
}
