let canvas;
let ctx;
let canvasWidth = 1400;
let canvasHeight = 1000;
let ship;
let keys = [];
let bullets = [];
let asteroids = [];

class Bullet {
  constructor(angle) {
    this.visible = true;
    this.x = ship.noseX;
    this.y = ship.noseY;
    this.angle = angle;
    this.height = 4;
    this.width = 4;
    this.speed = 1;
    this.velocity = 0;
    this.velX = 0;
    this.velY = 0;
  }

  update() {
    let radians = (this.angle / Math.PI) * 180;
    this.x -= Math.cos(radians) * this.speed;
    this.y -= Math.sin(radians) * this.speed;
  }

  draw() {
    ctx.fillyStyle = 'white';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Asteroid {
  constructor(x, y) {
    this.visible = true;
    this.x = Math.floor(Math.random() * canvasWidth);
    this.y = Math.floor(Math.random() * canvasHeight);
    this.speed = 1;
    this.radius = 50;
    this.angle = Math.floor(Math.random() * 359);
    this.strokeColor = 'white';
  }

  update() {
    let radians = (this.angle / Math.PI) * 180;
    this.x += Math.cos(radians) * this.speed;
    this.y += Math.sin(radians) * this.speed;
    if (this.x < this.radius) {
      this.x = canvas.width;
    }

    if (this.x > canvas.width) {
      this.x = this.radius;
    }

    if (this.y < this.radius) {
      this.y = canvas.height;
    }

    if (this.y > canvas.height) {
      this.y = this.radius;
    }
  }

  draw() {
    ctx.beginPath();
    let vertAngle = (Math.PI * 2) / 6;
    let radians = (this.angle / Math.PI) * 180;
    for (let i = 0; i < 6; i++) {
      ctx.lineTo(
        this.x - this.radius * Math.cos(vertAngle * i + radians),
        this.y - this.radius * Math.sin(vertAngle * i + radians)
      );
    }
    ctx.closePath();
    ctx.stroke();
  }
}

class Ship {
  constructor() {
    this.visible = true;
    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2;
    this.movingForward = false;
    this.speed = 0.1;
    this.velX = 0;
    this.velY = 0;
    this.rotationSpeed = 0.001;
    this.radius = 15;
    this.angle = 0;
    this.strokeColor = 'white';
    this.noseX = canvas.width / 2 + 15;
    this.noseY = canvasHeight;
  }

  rotate(dir) {
    this.angle += this.rotationSpeed * dir;
  }

  update() {
    let radians = (this.angle / Math.PI) * 180;
    // oldX + cos(radians) * distance
    if (this.movingForward) {
      this.velX += Math.cos(radians) * this.speed;
      this.velY += Math.sin(radians) * this.speed;
    }
    if (this.x < this.radius) {
      this.x = canvas.width;
    }

    if (this.x > canvas.width) {
      this.x = this.radius;
    }

    if (this.y < this.radius) {
      this.y = canvas.height;
    }

    if (this.y > canvas.height) {
      this.y = this.radius;
    }

    this.velX *= 0.99;
    this.velY *= 0.99;

    this.x -= this.velX;
    this.y -= this.velY;
  }

  draw() {
    ctx.strokeStyle = this.strokeColor;
    ctx.beginPath();
    let vertAngle = (Math.PI * 2) / 3;
    let radians = (this.angle / Math.PI) * 180;
    this.noseX = this.x - this.radius * Math.cos(radians);
    this.noseY = this.y - this.radius * Math.sin(radians);
    for (let i = 0; i < 3; i++) {
      ctx.lineTo(
        this.x - this.radius * Math.cos(vertAngle * i + radians),
        this.y - this.radius * Math.sin(vertAngle * i + radians)
      );
    }
    ctx.closePath();
    ctx.stroke();
  }
}

const render = () => {
  ship.movingForward = keys[87];
  if (keys[68]) {
    ship.rotate(1);
  }
  if (keys[65]) {
    ship.rotate(-1);
  }
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ship.update();
  ship.draw();

  if (bullets.length !== 0) {
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].update();
      bullets[i].draw();
    }
  }

  if (asteroids.length !== 0) {
    for (let j = 0; j < asteroids.length; j++) {
      asteroids[j].update();
      asteroids[j].draw();
    }
  }

  requestAnimationFrame(render);
};

const setupCanvas = () => {
  canvas = document.getElementById('my-canvas');
  ctx = canvas.getContext('2d');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ship = new Ship();

  for (let i = 0; i < 8; i++) {
    asteroids.push(new Asteroid());
  }

  document.body.addEventListener('keydown', e => {
    keys[e.keyCode] = true;
    console.log(e);
    console.log(keys);
  });
  document.body.addEventListener('keyup', e => {
    keys[e.keyCode] = false;
    // console.log(bullets);
    // if (e.keyCode === 32) {
    //   bullets.push(new Bullet(ship.angle));
    // }
  });
  render();
};

document.addEventListener('DOMContentLoaded', setupCanvas);
